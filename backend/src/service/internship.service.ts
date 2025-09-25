import { AppDataSource } from "../data-source";
import { Company } from "../entity/Company";
import { Internship } from "../entity/Internship";
import { Mentor } from "../entity/Mentor";
import { Student } from "../entity/Student";
import { User } from "../entity/User";

export class InternshipService {
  private internshipRepo = AppDataSource.getRepository(Internship);
  private studentRepo = AppDataSource.getRepository(Student);
  private mentorRepo = AppDataSource.getRepository(Mentor);
  private companyRepo = AppDataSource.getRepository(Company);
  private userRepo = AppDataSource.getRepository(User);

  async createInternshipForStudent(
    userId: number,
    data: {
      startDate: string;
      endDate: string;
      mentorId: number;
      companyId: number;
      studentId?: number; // Hozzáadom a studentId opcionális mezőt
      isApproved?: boolean; // Hozzáadom az isApproved opcionális mezőt
      requiredWeeks?: number; // Kötelező hetek száma
    }
  ): Promise<Internship> {
    // Ha van studentId, azt használjuk, különben userId alapján keresünk
    let student: Student;
    if (data.studentId) {
      student = await this.getStudent(data.studentId);
    } else {
      student = await this.getStudentByUserId(userId);
    }
    
    // Ellenőrizzük, hogy nincs-e már aktív gyakornokság
    const existingInternship = await this.getActiveInternshipByStudentId(student.id);
    if (existingInternship) {
      throw new Error("Student already has an active internship");
    }

    const mentor = await this.getMentor(data.mentorId);
    const company = await this.getCompany(data.companyId);

    // Dátum validáció
    this.validateDates(data.startDate, data.endDate);

    const internship = this.internshipRepo.create({
      student,
      mentor,
      company,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      isApproved: data.isApproved !== undefined ? data.isApproved : false,
      requiredWeeks: data.requiredWeeks || null,
    });

    return await this.internshipRepo.save(internship);
  }

  private async getStudentByUserId(userId: number): Promise<Student> {
    const student = await this.studentRepo.findOne({
      where: { user: { id: userId } },
      relations: ["user"],
    });
    if (!student) throw new Error("Student not found for this user");
    return student;
  }

  private async getStudent(studentId: number): Promise<Student> {
    const student = await this.studentRepo.findOne({
      where: { id: studentId },
      relations: ["user"],
    });
    if (!student) throw new Error("Student not found");
    return student;
  }

  private async getMentor(mentorId: number): Promise<Mentor> {
    const mentor = await this.mentorRepo.findOne({
      where: { id: mentorId },
      relations: ["user"],
    });
    if (!mentor) throw new Error("Mentor not found");
    return mentor;
  }

  private async getCompany(companyId: number): Promise<Company> {
    const company = await this.companyRepo.findOneBy({ id: companyId });
    if (!company) throw new Error("Company not found");
    return company;
  }

  private validateDates(startDate: string, endDate: string): void {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    
    // Csak a dátum részt hasonlítjuk össze, nem az időt
    const startDateOnly = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    // Engedélyezzük a mai napot és az elmúlt 1 napot is (rugalmasság miatt)
    const oneDayAgo = new Date(todayDateOnly);
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    if (startDateOnly < oneDayAgo) {
      throw new Error("Start date cannot be more than 1 day in the past");
    }

    if (end <= start) {
      throw new Error("End date must be after start date");
    }
  }

  private async getActiveInternshipByUserId(userId: number): Promise<Internship | null> {
    return this.internshipRepo.findOne({
      where: {
        student: { user: { id: userId } },
        isApproved: true,
      },
      relations: ["student", "student.user"],
    });
  }

  private async getActiveInternshipByStudentId(studentId: number): Promise<Internship | null> {
    return this.internshipRepo.findOne({
      where: {
        student: { id: studentId },
        isApproved: true,
      },
      relations: ["student", "student.user"],
    });
  }

  private buildInternship(
    data: any,
    student: Student,
    mentor: Mentor,
    company: Company
  ): any {
    const { startDate, endDate, description, ...rest } = data;

    return this.internshipRepo.create({
      student,
      mentor,
      company,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      description,
      isApproved: false,
      ...rest,
    });
  }

  async getAllInternships(filters?: {
    isApproved?: boolean;
    studentId?: number;
    mentorId?: number;
    companyId?: number;
  }): Promise<Internship[]> {
    let queryBuilder = this.internshipRepo.createQueryBuilder("internship")
      .leftJoinAndSelect("internship.student", "student")
      .leftJoinAndSelect("student.user", "studentUser")
      .leftJoinAndSelect("internship.mentor", "mentor")
      .leftJoinAndSelect("mentor.user", "mentorUser")
      .leftJoinAndSelect("internship.company", "company");

    if (filters) {
      if (filters.isApproved !== undefined) {
        queryBuilder = queryBuilder.where("internship.isApproved = :isApproved", {
          isApproved: filters.isApproved,
        });
      }

      if (filters.studentId) {
        queryBuilder = queryBuilder.andWhere("student.id = :studentId", {
          studentId: filters.studentId,
        });
      }

      if (filters.mentorId) {
        queryBuilder = queryBuilder.andWhere("mentor.id = :mentorId", {
          mentorId: filters.mentorId,
        });
      }

      if (filters.companyId) {
        queryBuilder = queryBuilder.andWhere("company.id = :companyId", {
          companyId: filters.companyId,
        });
      }
    }

    return queryBuilder.orderBy("internship.startDate", "DESC").getMany();
  }

  async getInternshipById(internshipId: number): Promise<Internship | null> {
    return this.internshipRepo.findOne({
      where: { id: internshipId },
      relations: ["student", "student.user", "mentor", "mentor.user", "company"],
    });
  }

  async getInternshipByUserId(userId: number): Promise<Internship | null> {
    return this.internshipRepo.findOne({
      where: {
        student: { user: { id: userId } },
      },
      relations: ["student", "student.user", "mentor", "mentor.user", "company"],
    });
  }

  async updateInternship(
    internshipId: number,
    userId: number,
    data: {
      startDate?: string;
      endDate?: string;
      mentorId?: number;
      companyId?: number;
      isApproved?: boolean;
      requiredWeeks?: number;
    },
    isAdmin: boolean = false
  ): Promise<Internship> {
    const internship = await this.getInternshipById(internshipId);
    if (!internship) {
      throw new Error("Internship not found");
    }

    // Ellenőrizzük a jogosultságot - admin mindent módosíthat
    if (!isAdmin && internship.student.user.id !== userId) {
      throw new Error("You can only update your own internship");
    }

    // Csak nem jóváhagyott gyakornokságot lehet módosítani (admin kivétel)
    if (!isAdmin && internship.isApproved) {
      throw new Error("Cannot update approved internship");
    }

    // Frissítés
    if (data.startDate) internship.startDate = new Date(data.startDate);
    if (data.endDate) internship.endDate = new Date(data.endDate);

    if (data.mentorId) {
      const mentor = await this.getMentor(data.mentorId);
      internship.mentor = mentor;
    }

    if (data.companyId) {
      const company = await this.getCompany(data.companyId);
      internship.company = company;
    }

    // isApproved frissítés (csak admin vagy ha explicit módon van beállítva)
    if (data.isApproved !== undefined) {
      internship.isApproved = data.isApproved;
    }

    // requiredWeeks frissítés
    if (data.requiredWeeks !== undefined) {
      internship.requiredWeeks = data.requiredWeeks;
    }

    // Dátum validáció ha változtak
    if (data.startDate || data.endDate) {
      this.validateDates(
        internship.startDate.toISOString(),
        internship.endDate.toISOString()
      );
    }

    return await this.internshipRepo.save(internship);
  }

  async deleteInternship(internshipId: number, userId: number, isAdmin: boolean = false): Promise<void> {
    const internship = await this.getInternshipById(internshipId);
    if (!internship) {
      throw new Error("Internship not found");
    }

    // Ellenőrizzük a jogosultságot - admin mindent törölhet
    if (!isAdmin && internship.student.user.id !== userId) {
      throw new Error("You can only delete your own internship");
    }

    // Csak nem jóváhagyott gyakornokságot lehet törölni (admin kivétel)
    if (!isAdmin && internship.isApproved) {
      throw new Error("Cannot delete approved internship");
    }

    await this.internshipRepo.remove(internship);
  }

  async approveInternship(internshipId: number, mentorUserId: number): Promise<Internship> {
    const internship = await this.getInternshipById(internshipId);
    if (!internship) {
      throw new Error("Internship not found");
    }

    // Ellenőrizzük, hogy a mentor jogosult-e jóváhagyni
    if (internship.mentor.user.id !== mentorUserId) {
      throw new Error("You can only approve your own students' internships");
    }

    internship.isApproved = true;
    return await this.internshipRepo.save(internship);
  }

  async rejectInternship(internshipId: number, mentorUserId: number): Promise<Internship> {
    const internship = await this.getInternshipById(internshipId);
    if (!internship) {
      throw new Error("Internship not found");
    }

    // Ellenőrizzük, hogy a mentor jogosult-e elutasítani
    if (internship.mentor.user.id !== mentorUserId) {
      throw new Error("You can only reject your own students' internships");
    }

    internship.isApproved = false;
    return await this.internshipRepo.save(internship);
  }
}
