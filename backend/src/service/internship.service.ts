import { AppDataSource } from "../data-source";
import { Company } from "../entity/Company";
import { Internship } from "../entity/Internship";
import { Mentor } from "../entity/Mentor";
import { Student } from "../entity/Student";

export class InternshipService {
  private internshipRepo = AppDataSource.getRepository(Internship);
  private studentRepo = AppDataSource.getRepository(Student);
  private mentorRepo = AppDataSource.getRepository(Mentor);
  private companyRepo = AppDataSource.getRepository(Company);

  async createInternship(data: any, user: any): Promise<Internship> {
    const student = await this.getStudent(data.studentId);
    const mentor = await this.getMentor(data.mentorId);
    const company = await this.getCompany(data.companyId);

    const internship = this.buildInternship(data, student, mentor, company);

    return await this.internshipRepo.save(internship);
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
      startDate,
      endDate,
      description,
      ...rest,
    });
  }

  async getAllInternships(): Promise<Internship[]> {
    return this.internshipRepo.find({
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
}
