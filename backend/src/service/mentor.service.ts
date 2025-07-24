import { AppDataSource } from "../data-source";
import { Mentor } from "../entity/Mentor";
import { User } from "../entity/User";
import { Company } from "../entity/Company";
import { MentorDTO, createMentorDTO, GetProfileResponseDTO, StudentWithHoursDto } from "../types";
import bcrypt from "bcrypt";

export class MentorService {
  private mentorRepository = AppDataSource.getRepository(Mentor);
  private userRepository = AppDataSource.getRepository(User);
  private companyRepository = AppDataSource.getRepository(Company);

  async getAllActiveMentors(): Promise<MentorDTO[]> {
    const mentors = await this.mentorRepository.find({
      relations: ["user", "company"],
      where: { user: { active: true } },
    });

    return mentors.map(mentor => ({
      id: mentor.id,
      position: mentor.position,
      company: {
        id: mentor.company.id,
        name: mentor.company.name,
        city: mentor.company.city,
        email: mentor.company.email,
        phone: mentor.company.phone,
        address: mentor.company.address,
        active: mentor.company.active,
      }
    }));
  }

  async getMentorById(id: number): Promise<Mentor | null> {
    return await this.mentorRepository.findOne({
      where: { id },
      relations: ["user", "company"],
    });
  }

  async createMentor(mentorData: createMentorDTO): Promise<GetProfileResponseDTO> {
    // Ellenőrizzük, hogy létezik-e már ilyen email
    const existingUser = await this.userRepository.findOne({
      where: { email: mentorData.email },
    });

    if (existingUser) {
      throw new Error("Email address is already in use");
    }

    // Ellenőrizzük, hogy létezik-e a cég
    const company = await this.companyRepository.findOne({
      where: { id: mentorData.companyId },
    });

    if (!company) {
      throw new Error("Company not found");
    }

    // Hash-eljük a jelszót
    const hashedPassword = await bcrypt.hash(mentorData.password, 12);

    // User létrehozása
    const user = this.userRepository.create({
      email: mentorData.email,
      firstname: mentorData.firstname,
      lastname: mentorData.lastname,
      password: hashedPassword,
      role: "mentor",
      active: mentorData.active,
    });

    const savedUser = await this.userRepository.save(user);

    // Mentor létrehozása
    const mentor = this.mentorRepository.create({
      user: savedUser,
      position: mentorData.position,
      company: company,
    });

    const savedMentor = await this.mentorRepository.save(mentor);

    return {
      id: savedUser.id,
      email: savedUser.email,
      firstname: savedUser.firstname,
      lastname: savedUser.lastname,
      role: savedUser.role,
      active: savedUser.active,
      mentor: {
        id: savedMentor.id,
        position: savedMentor.position,
        company: company,
      }
    };
  }

  async updateMentorProfile(mentorId: number, updateData: any): Promise<void> {
    const mentor = await this.getMentorById(mentorId);
    
    if (!mentor) {
      throw new Error("Mentor not found");
    }

    // User adatok frissítése
    if (updateData.email) mentor.user.email = updateData.email;
    if (updateData.firstname) mentor.user.firstname = updateData.firstname;
    if (updateData.lastname) mentor.user.lastname = updateData.lastname;

    // Mentor specifikus adatok frissítése
    if (updateData.position) mentor.position = updateData.position;
    if (updateData.companyId) {
      const company = await this.companyRepository.findOne({
        where: { id: updateData.companyId },
      });
      if (company) {
        mentor.company = company;
      }
    }

    await this.userRepository.save(mentor.user);
    await this.mentorRepository.save(mentor);
  }

  async getMentorsByCompany(companyId: number): Promise<Mentor[]> {
    return await this.mentorRepository.find({
      where: {
        company: { id: companyId },
        user: { active: true },
      },
      relations: ["user", "company"],
    });
  }

  async searchMentors(searchParams: {
    name?: string;
    position?: string;
    company?: string;
  }): Promise<Mentor[]> {
    let queryBuilder = this.mentorRepository.createQueryBuilder("mentor")
      .leftJoinAndSelect("mentor.user", "user")
      .leftJoinAndSelect("mentor.company", "company")
      .where("user.active = :active", { active: true });

    if (searchParams.name) {
      queryBuilder = queryBuilder.andWhere(
        "(user.firstname ILIKE :name OR user.lastname ILIKE :name)",
        { name: `%${searchParams.name}%` }
      );
    }

    if (searchParams.position) {
      queryBuilder = queryBuilder.andWhere(
        "mentor.position ILIKE :position",
        { position: `%${searchParams.position}%` }
      );
    }

    if (searchParams.company) {
      queryBuilder = queryBuilder.andWhere(
        "company.name ILIKE :company",
        { company: `%${searchParams.company}%` }
      );
    }

    return await queryBuilder.getMany();
  }

  async deactivateMentor(mentorId: number): Promise<void> {
    const mentor = await this.getMentorById(mentorId);
    
    if (!mentor) {
      throw new Error("Mentor not found");
    }

    mentor.user.active = false;
    await this.userRepository.save(mentor.user);
  }

  async getStudentsWithHoursByMentor(userId: number): Promise<StudentWithHoursDto[]> {
    // Itt implementálhatod a logikát, hogy lekérd a mentorhoz tartozó diákokat és óráikat
    // Ez függ a projekt struktúrájától és az órák tárolásának módjától
    
    const queryBuilder = this.mentorRepository.createQueryBuilder("mentor")
      .leftJoin("mentor.user", "user")
      .leftJoin("mentor.internships", "internship") // Feltételezve, hogy van internships kapcsolat
      .leftJoin("internship.student", "student")
      .leftJoin("student.user", "studentUser")
      .leftJoin("student.workHours", "workHours") // Feltételezve, hogy van workHours kapcsolat
      .select([
        "studentUser.id as id",
        "studentUser.firstname as firstname",
        "studentUser.lastname as lastname",
        "studentUser.email as email",
        "student.major as major",
        "student.university as university",
        "COALESCE(SUM(workHours.hours), 0) as hours"
      ])
      .where("user.id = :userId", { userId })
      .groupBy("studentUser.id, student.id");

    return await queryBuilder.getRawMany();
  }
}