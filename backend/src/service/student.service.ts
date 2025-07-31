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

  async updateStudentProfileByUserId(userId: number, updateData: UpdateProfileDTO): Promise<void> {
    let student: Student | null = null;
    
    // Először userId alapján próbáljuk megtalálni
    student = await this.getStudentByUserId(userId);
    
    // Ha nem találjuk userId alapján és van student ID a payload-ban, akkor azt próbáljuk
    if (!student && updateData.student?.id) {
      student = await this.getStudentById(updateData.student.id);
    }
    
    if (!student) {
      throw new Error(`Student not found for user ID ${userId}`);
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