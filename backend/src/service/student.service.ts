import { AppDataSource } from "../data-source";
import { Student } from "../entity/Student";
import { User } from "../entity/User";
import { StudentDTO, UpdateProfileDTO } from "../types";

export class StudentService {
  private studentRepository = AppDataSource.getRepository(Student);
  private userRepository = AppDataSource.getRepository(User);

  async getStudentHoursForExport(studentId: number) {
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
      relations: ["internship", "internship.hours"]
    });
    if (!student || !student.internship) return [];
    const hours = student.internship.hours || [];
    
    const approvedHours = hours.filter(hour => hour.status === 'approved');
    
    return approvedHours.map(hour => ({
      date: hour.date,
      startTime: hour.startTime,
      endTime: hour.endTime,
      description: hour.description,
      status: hour.status
    }));
  }

  async getInternshipSummaryForExport(userId: number) {
    const student = await this.studentRepository.findOne({
      where: { user: { id: userId } },
      relations: ["user", "internship", "internship.mentor", "internship.mentor.user", "internship.company", "internship.hours"]
    });

    if (!student || !student.internship) {
      throw new Error("Student or internship not found");
    }

    const internship = student.internship;

    // Ellenőrizzük, hogy véglegesítve van-e
    if (!internship.finalizedAt || internship.grade === null) {
      throw new Error("Internship not finalized yet");
    }

    // Teljesített órák számítása
    let totalApprovedHours = 0;
    if (internship.hours) {
      for (const hour of internship.hours) {
        if (hour.status === 'approved') {
          const start = new Date(`2000-01-01T${hour.startTime}`);
          const end = new Date(`2000-01-01T${hour.endTime}`);
          const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          totalApprovedHours += diff;
        }
      }
    }

    const requiredHours = internship.requiredWeeks ? internship.requiredWeeks * 40 : 0;

    return {
      studentName: `${student.user.firstname} ${student.user.lastname}`,
      studentEmail: student.user.email,
      neptun: student.neptun,
      major: student.major,
      university: student.university,
      companyName: internship.company?.name ?? "N/A",
      mentorName: internship.mentor?.user 
        ? `${internship.mentor.user.firstname} ${internship.mentor.user.lastname}`
        : "N/A",
      mentorEmail: internship.mentor?.user?.email ?? "N/A",
      startDate: internship.startDate,
      endDate: internship.endDate,
      requiredWeeks: internship.requiredWeeks,
      requiredHours: requiredHours,
      completedHours: Math.round(totalApprovedHours * 100) / 100,
      grade: internship.grade,
      finalizedAt: internship.finalizedAt,
      status: internship.status
    };
  }

  async getStudentsForExport(filters: { status?: string, university?: string, name?: string }) {
    const query = this.studentRepository.createQueryBuilder("student")
      .leftJoinAndSelect("student.user", "user")
      .leftJoinAndSelect("student.internship", "internship")
      .leftJoinAndSelect("internship.hours", "hour");

    if (filters.status) {
      query.andWhere("student.status = :status", { status: filters.status });
    }
    if (filters.university) {
      query.andWhere("student.university = :university", { university: filters.university });
    }
    if (filters.name) {
      query.andWhere("(user.firstname ILIKE :name OR user.lastname ILIKE :name)", { name: `%${filters.name}%` });
    }

    const students = await query.getMany();

    return students.map(s => {
      let completedHours = 0;
      let pendingHours = 0;
      if (s.internship && s.internship.hours) {
        for (const hour of s.internship.hours) {
          const start = new Date(`2000-01-01T${hour.startTime}`);
          const end = new Date(`2000-01-01T${hour.endTime}`);
          const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          if (hour.status === "approved") completedHours += diff;
          if (hour.status === "pending") pendingHours += diff;
        }
      }
      return {
        firstname: s.user?.firstname ?? "",
        lastname: s.user?.lastname ?? "",
        email: s.user?.email ?? "",
        university: s.university ?? "",
        completedHours: Math.round(completedHours * 100) / 100,
        pendingHours: Math.round(pendingHours * 100) / 100
      };
    });
  }

  async getAllActiveStudents(): Promise<StudentDTO[]> {
    const students = await this.studentRepository.find({
      relations: ["user"],
      where: { user: { active: true } },
    });

    return students.map(student => ({
      id: student.id,
      phone: student.phone,
      neptun: student.neptun,
      major: student.major,
      university: student.university,
      user: {
        id: student.user.id,
        email: student.user.email,
        firstname: student.user.firstname,
        lastname: student.user.lastname,
        role: student.user.role,
        active: student.user.active,
      }
    }));
  }

  async getStudentById(id: number): Promise<Student | null> {
    return await this.studentRepository.findOne({
      where: { id },
      relations: ["user"],
    });
  }

  async getStudentByUserId(userId: number): Promise<Student | null> {
    return await this.studentRepository.findOne({
      where: { user: { id: userId } },
      relations: ["user", "internship", "internship.mentor", "internship.mentor.user", "internship.company", "internship.hours"],
    });
  }

  async updateStudentProfile(studentId: number, updateData: UpdateProfileDTO): Promise<void> {
    const student = await this.getStudentById(studentId);
    
    if (!student) {
      throw new Error("Student not found");
    }

    if (updateData.email) student.user.email = updateData.email;
    if (updateData.firstname) student.user.firstname = updateData.firstname;
    if (updateData.lastname) student.user.lastname = updateData.lastname;

    if (updateData.student) {
      if (updateData.student.phone !== undefined) student.phone = updateData.student.phone;
      if (updateData.student.major) student.major = updateData.student.major;
      if (updateData.student.university) student.university = updateData.student.university;
      if (updateData.student.neptun) student.neptun = updateData.student.neptun;
    }

    await this.userRepository.save(student.user);
    await this.studentRepository.save(student);
  }

  async updateStudentProfileByUserId(userId: number, updateData: UpdateProfileDTO): Promise<void> {
    let student: Student | null = null;
    
    student = await this.getStudentByUserId(userId);
    

    if (!student && updateData.student?.id) {
      student = await this.getStudentById(updateData.student.id);
    }
    
    if (!student) {
      throw new Error(`Student not found for user ID ${userId}`);
    }

    if (updateData.email) student.user.email = updateData.email;
    if (updateData.firstname) student.user.firstname = updateData.firstname;
    if (updateData.lastname) student.user.lastname = updateData.lastname;


    if (updateData.student) {
      if (updateData.student.phone !== undefined) student.phone = updateData.student.phone;
      if (updateData.student.major) student.major = updateData.student.major;
      if (updateData.student.university) student.university = updateData.student.university;
      if (updateData.student.neptun) student.neptun = updateData.student.neptun;
    }

    await this.userRepository.save(student.user);
    await this.studentRepository.save(student);
  }

  async findByNeptun(neptun: string): Promise<Student | null> {
    return await this.studentRepository.findOne({
      where: { neptun },
      relations: ["user"],
    });
  }
}