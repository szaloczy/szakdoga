// services/internship-hour.service.ts
import { AppDataSource } from "../data-source";
import { InternshipHour } from "../entity/InternshipHour";
import { Internship } from "../entity/Internship";
import { Repository } from "typeorm";
import { Student } from "../entity/Student";

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
      throw new Error("Hallgató nem található.");
    }

    // 2. Lekérjük a gyakornokságot
    const internship = await this.internshipRepo.findOne({
      where: { student: { id: student.id } },
    });

    if (!internship) {
      throw new Error("Ehhez a hallgatóhoz nem tartozik gyakornokság.");
    }

    // 3. Opcionális validáció
    if (data.startTime >= data.endTime) {
      throw new Error("A kezdési időnek korábbinak kell lennie, mint a befejezési idő.");
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
}
