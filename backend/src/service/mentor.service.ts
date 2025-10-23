import { AppDataSource } from "../data-source";
import { Mentor } from "../entity/Mentor";
import { User } from "../entity/User";
import { Company } from "../entity/Company";
import { MentorDTO, createMentorDTO, GetProfileResponseDTO, StudentWithHoursDto, UserRole } from "../types";
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
    company: mentor.company ? {
      id: mentor.company.id,
      name: mentor.company.name,
      city: mentor.company.city,
      email: mentor.company.email,
      phone: mentor.company.phone,
      address: mentor.company.address,
      active: mentor.company.active,
    } : null, // Ha nincs cég, akkor null
    user: {
      id: mentor.user.id,
      email: mentor.user.email,
      firstname: mentor.user.firstname,
      lastname: mentor.user.lastname,
      role: mentor.user.role,
      active: mentor.user.active,
    }
  }));
  }

  async getMentorById(id: number): Promise<Mentor | null> {
    return await this.mentorRepository.findOne({
      where: { id },
      relations: ["user", "company"],
    });
  }

  async getMentorByUserId(userId: number): Promise<Mentor | null> {
    return await this.mentorRepository.findOne({
      where: { user: { id: userId } },
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
      role: UserRole.MENTOR,
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

    if (updateData.email) mentor.user.email = updateData.email;
    if (updateData.firstname) mentor.user.firstname = updateData.firstname;
    if (updateData.lastname) mentor.user.lastname = updateData.lastname;

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
    
    const mentor = await this.getMentorByUserId(userId);
    
    if (!mentor) {
      throw new Error("Mentor not found for this user");
    }

    const internships = await AppDataSource.getRepository("Internship").find({
      where: { 
        mentor: { id: mentor.id },
        isApproved: true 
      },
      relations: ["student", "student.user", "hours"]
    });

    const studentsWithHours: StudentWithHoursDto[] = [];
    
    for (const internship of internships) {
      const allHours = internship.hours || [];
      
      let approvedHours = 0;
      let pendingHours = 0;
      let rejectedHours = 0;
      let totalSubmittedHours = 0;
      
      for (const hour of allHours) {
        const start = new Date(`2000-01-01 ${hour.startTime}`);
        const end = new Date(`2000-01-01 ${hour.endTime}`);
        const diffMs = end.getTime() - start.getTime();
        const duration = diffMs / (1000 * 60 * 60); // ms to hours
        
        totalSubmittedHours += duration;
        
        switch (hour.status) {
          case 'approved':
            approvedHours += duration;
            break;
          case 'pending':
            pendingHours += duration;
            break;
          case 'rejected':
            rejectedHours += duration;
            break;
        }
      }

      studentsWithHours.push({
        id: internship.student.user.id,
        firstname: internship.student.user.firstname,
        lastname: internship.student.user.lastname,
        email: internship.student.user.email,
        profilePicture: internship.student.user.profilePicture,
        major: internship.student.major,
        university: internship.student.university,
        hours: Math.round(approvedHours * 100) / 100,                    
        pendingHours: Math.round(pendingHours * 100) / 100,              
        rejectedHours: Math.round(rejectedHours * 100) / 100,            
        totalSubmittedHours: Math.round(totalSubmittedHours * 100) / 100
      });
    }

    return studentsWithHours.sort((a, b) => a.lastname.localeCompare(b.lastname));
  }

  async getAllStudentsHoursForExport(mentorUserId: number) {
    const mentor = await this.getMentorByUserId(mentorUserId);
    
    if (!mentor) {
      throw new Error("Mentor not found for this user");
    }

    const internships = await AppDataSource.getRepository("Internship").find({
      where: { 
        mentor: { id: mentor.id },
        isApproved: true 
      },
      relations: ["student", "student.user", "hours"]
    });

    const allStudentsHours = [];
    
    for (const internship of internships) {
      const approvedHours = (internship.hours || []).filter(hour => hour.status === 'approved');
      
      for (const hour of approvedHours) {
        const start = new Date(`2000-01-01 ${hour.startTime}`);
        const end = new Date(`2000-01-01 ${hour.endTime}`);
        const diffMs = end.getTime() - start.getTime();
        const duration = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100; // ms to hours

        allStudentsHours.push({
          firstname: internship.student.user.firstname,
          lastname: internship.student.user.lastname,
          email: internship.student.user.email,
          university: internship.student.university || '',
          major: internship.student.major || '',
          date: hour.date,
          startTime: hour.startTime,
          endTime: hour.endTime,
          description: hour.description,
          duration: duration
        });
      }
    }

    return allStudentsHours.sort((a, b) => {
      const nameCompare = a.lastname.localeCompare(b.lastname);
      if (nameCompare !== 0) return nameCompare;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }

  async getStudentHoursForExport(mentorUserId: number, studentUserId: number) {
    const mentor = await this.getMentorByUserId(mentorUserId);
    
    if (!mentor) {
      throw new Error("Mentor not found for this user");
    }

    const internship = await AppDataSource.getRepository("Internship").findOne({
      where: { 
        mentor: { id: mentor.id },
        student: { user: { id: studentUserId } },
        isApproved: true 
      },
      relations: ["student", "student.user", "hours"]
    });

    if (!internship) {
      throw new Error("Student not found or not assigned to this mentor");
    }

    const approvedHours = (internship.hours || []).filter(hour => hour.status === 'approved');
    const studentHours = [];
    
    for (const hour of approvedHours) {
      const start = new Date(`2000-01-01 ${hour.startTime}`);
      const end = new Date(`2000-01-01 ${hour.endTime}`);
      const diffMs = end.getTime() - start.getTime();
      const duration = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100; // ms to hours

      studentHours.push({
        firstname: internship.student.user.firstname,
        lastname: internship.student.user.lastname,
        email: internship.student.user.email,
        university: internship.student.university || '',
        major: internship.student.major || '',
        date: hour.date,
        startTime: hour.startTime,
        endTime: hour.endTime,
        description: hour.description,
        duration: duration
      });
    }

    return studentHours.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
}