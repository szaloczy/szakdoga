// services/internship-hour.service.ts
import { AppDataSource } from "../data-source";
import { InternshipHour } from "../entity/InternshipHour";
import { Internship } from "../entity/Internship";
import { Student } from "../entity/Student";
import { mapInternshipHourToDTO } from "../dto/internshipHour.dto";

export class InternshipHourService {
  private hourRepo = AppDataSource.getRepository(InternshipHour);
  private internshipRepo = AppDataSource.getRepository(Internship);
  private studentRepo = AppDataSource.getRepository(Student);

  async createHourForStudent(
    userId: number,
    data: {
      date: string;
      startTime: string;
      endTime: string;
      description: string;
    }
  ): Promise<InternshipHour> {
    // 1. Lekérjük a hallgatót a userId alapján
    const student = await this.studentRepo.findOne({
      where: { user: { id: userId } },
      relations: ["user", "internship"],
    });

    if (!student) {
      throw new Error("Student not found");
    }

    // 2. Lekérjük a gyakornokságot
    const internship = await this.internshipRepo.findOne({
      where: { student: { id: student.id } },
    });

    if (!internship) {
      throw new Error("This student don't have aproved iternship");
    }

    // 3. Opcionális validáció
    if (data.startTime >= data.endTime) {
      throw new Error("The start time must be earlier than the end time.");
    }

    // 4. Létrehozás
    const hour = this.hourRepo.create({
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      description: data.description,
      internship: internship,
      status: "pending",
    });

    return await this.hourRepo.save(hour);
  }


  async getHoursForStudent(userId: number): Promise<any[]> {
    const student = await this.studentRepo.findOne({
      where: { user: { id: userId } },
      relations: ["user", "internship"],
    });

    if (!student) {
      throw new Error("Student not found.");
    }

    const hours = await this.hourRepo.find({
      where: {
        internship: {
          student: {
            id: student.id,
          },
        },
      },
      relations: ["internship", "approvedBy"], // approvedBy == mentor
      order: {
        date: "ASC",
        startTime: "ASC",
      },
    });

    return hours.map(mapInternshipHourToDTO);
  }
}
