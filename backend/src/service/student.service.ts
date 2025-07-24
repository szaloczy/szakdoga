import { AppDataSource } from "../data-source";
import { Student } from "../entity/Student";
import { User } from "../entity/User";
import { StudentDTO, UpdateProfileDTO } from "../types";

export class StudentService {
  private studentRepository = AppDataSource.getRepository(Student);
  private userRepository = AppDataSource.getRepository(User);

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
    }));
  }

  async getStudentById(id: number): Promise<Student | null> {
    return await this.studentRepository.findOne({
      where: { id },
      relations: ["user"],
    });
  }

  async updateStudentProfile(studentId: number, updateData: UpdateProfileDTO): Promise<void> {
    const student = await this.getStudentById(studentId);
    
    if (!student) {
      throw new Error("Student not found");
    }

    // User adatok frissítése
    if (updateData.email) student.user.email = updateData.email;
    if (updateData.firstname) student.user.firstname = updateData.firstname;
    if (updateData.lastname) student.user.lastname = updateData.lastname;

    // Student adatok frissítése
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