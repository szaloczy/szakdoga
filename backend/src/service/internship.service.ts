import { AppDataSource } from "../data-source";
import { Company } from "../entity/Company";
import { Internship } from "../entity/Internship";
import { InternshipHour } from "../entity/InternshipHour";
import { Mentor } from "../entity/Mentor";
import { Student } from "../entity/Student";
import { User } from "../entity/User";

export class InternshipService {
  private internshipRepo = AppDataSource.getRepository(Internship);
  private studentRepo = AppDataSource.getRepository(Student);
  private mentorRepo = AppDataSource.getRepository(Mentor);
  private companyRepo = AppDataSource.getRepository(Company);
  private userRepo = AppDataSource.getRepository(User);
  private internshipHourRepo = AppDataSource.getRepository(InternshipHour);

  async createInternshipForStudent(
    userId: number,
    data: {
      startDate: string;
      endDate: string;
      mentorId: number;
      companyId: number;
      studentId?: number;
      isApproved?: boolean;
      requiredWeeks?: number;
    }
  ): Promise<Internship> {
    
    let student: Student;
    if (data.studentId) {
      student = await this.getStudent(data.studentId);
    } else {
      student = await this.getStudentByUserId(userId);
    }
    
    const existingInternship = await this.getActiveInternshipByStudentId(student.id);
    if (existingInternship) {
      throw new Error("Student already has an active internship");
    }

    const mentor = await this.getMentor(data.mentorId);
    const company = await this.getCompany(data.companyId);

    this.validateDates(data.startDate, data.endDate);

    const internship = this.internshipRepo.create({
      student,
      mentor,
      company,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      isApproved: data.isApproved !== undefined ? data.isApproved : false,
      requiredWeeks: data.requiredWeeks || 6,
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

  private validateDates(startDate: string, endDate: string, isUpdate: boolean = false): void {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (!isUpdate) {
      const today = new Date();
      const startDateOnly = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      const oneDayAgo = new Date(todayDateOnly);
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      if (startDateOnly < oneDayAgo) {
        throw new Error("Start date cannot be more than 1 day in the past");
      }
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
      status?: "pending" | "active" | "completed" | "cancelled";
    },
    isAdmin: boolean = false
  ): Promise<Internship> {
    const internship = await this.getInternshipById(internshipId);
    if (!internship) {
      throw new Error("Internship not found");
    }

    if (!isAdmin && internship.student.user.id !== userId) {
      throw new Error("You can only update your own internship");
    }

    if (!isAdmin && internship.isApproved) {
      throw new Error("Cannot update approved internship");
    }

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

    if (data.isApproved !== undefined) {
      internship.isApproved = data.isApproved;
    }

    if (data.requiredWeeks !== undefined) {
      internship.requiredWeeks = data.requiredWeeks;
    }

    if (data.status !== undefined) {
      internship.status = data.status;
    }

    if (data.startDate || data.endDate) {
      this.validateDates(
        internship.startDate.toISOString(),
        internship.endDate.toISOString(),
        true // isUpdate = true
      );
    }

    return await this.internshipRepo.save(internship);
  }

  async deleteInternship(internshipId: number, userId: number, isAdmin: boolean = false): Promise<void> {
    const internship = await this.getInternshipById(internshipId);
    if (!internship) {
      throw new Error("Internship not found");
    }

    if (!isAdmin && internship.student.user.id !== userId) {
      throw new Error("You can only delete your own internship");
    }

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

    if (internship.mentor.user.id !== mentorUserId) {
      throw new Error("You can only reject your own students' internships");
    }

    internship.isApproved = false;
    return await this.internshipRepo.save(internship);
  }

  async finalizeInternship(
    internshipId: number,
    mentorUserId: number,
    grade: number
  ): Promise<Internship> {
    const internship = await this.getInternshipById(internshipId);
    if (!internship) {
      throw new Error("Internship not found");
    }

    if (internship.mentor.user.id !== mentorUserId) {
      throw new Error("You can only finalize your own students' internships");
    }

    if (internship.finalizedAt) {
      throw new Error("Internship is already finalized");
    }

    if (grade < 1 || grade > 5) {
      throw new Error("Grade must be between 1 and 5");
    }

    // Szükséges órák kiszámítása: requiredWeeks * 40 óra/hét
    const requiredHours = this.calculateRequiredHours(internship.requiredWeeks || 6);
    
    // Jóváhagyott órák lekérése
    const approvedHours = await this.getApprovedHours(internshipId);

    if (approvedHours < requiredHours) {
      throw new Error(
        `Not enough approved hours. Required: ${requiredHours}, Approved: ${approvedHours.toFixed(1)}`
      );
    }

    internship.grade = grade;
    internship.finalizedAt = new Date();
    return await this.internshipRepo.save(internship);
  }

  async finalizeInternshipByStudent(
    studentId: number,
    mentorUserId: number,
    grade: number
  ): Promise<Internship> {
    // Internship lekérése hallgató alapján
    const internship = await this.internshipRepo.findOne({
      where: { 
        student: { id: studentId }
      },
      relations: ["student", "student.user", "mentor", "mentor.user", "company"],
    });

    if (!internship) {
      throw new Error("Internship not found for this student");
    }

    if (internship.finalizedAt) {
      throw new Error("Internship is already finalized");
    }

    if (grade < 1 || grade > 5) {
      throw new Error("Grade must be between 1 and 5");
    }

    // Jogosultság: csak a gyakorlat mentora véglegesíthet
    if (internship.mentor.user.id !== mentorUserId) {
      throw new Error("You can only finalize your own students' internships");
    }

    // Óraszám ellenőrzése
    const approvedHours = await this.getApprovedHours(internship.id);
    const requiredHours = this.calculateRequiredHours(internship.requiredWeeks || 6);

    if (approvedHours < requiredHours) {
      throw new Error(
        `Not enough approved hours. Required: ${requiredHours}, Approved: ${approvedHours.toFixed(1)}`
      );
    }

    // Véglegesítés
    internship.grade = grade;
    internship.finalizedAt = new Date();
    internship.status = "completed";

    return await this.internshipRepo.save(internship);
  }

  private calculateRequiredHours(weeks: number): number {
    return weeks * 40;
  }

  async getApprovedHours(internshipId: number): Promise<number> {
    const hours = await this.internshipHourRepo.find({
      where: { 
        internship: { id: internshipId },
        status: "approved" 
      }
    });

    // Órák számítása startTime és endTime alapján
    let totalHours = 0;
    for (const hour of hours) {
      const hoursWorked = this.calculateHoursDifference(hour.startTime, hour.endTime);
      totalHours += hoursWorked;
    }

    return totalHours;
  }

  private calculateHoursDifference(startTime: string, endTime: string): number {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const startInHours = startHours + startMinutes / 60;
    const endInHours = endHours + endMinutes / 60;
    
    return endInHours - startInHours;
  }
}
