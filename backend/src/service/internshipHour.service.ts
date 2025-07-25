// services/internship-hour.service.ts
import { AppDataSource } from "../data-source";
import { InternshipHour } from "../entity/InternshipHour";
import { Internship } from "../entity/Internship";
import { Student } from "../entity/Student";
import { mapInternshipHourToDTO } from "../dto/internshipHour.dto";
import { User } from "../entity/User";
import { stat } from "fs";
import { Mentor } from "../entity/Mentor";

export class InternshipHourService {
  private hourRepo = AppDataSource.getRepository(InternshipHour);
  private internshipRepo = AppDataSource.getRepository(Internship);
  private studentRepo = AppDataSource.getRepository(Student);
  private userRepo = AppDataSource.getRepository(User);
    private mentorRepo = AppDataSource.getRepository(Mentor);


  async createHourForStudent(
    userId: number,
    data: {
      date: string;
      startTime: string;
      endTime: string;
      description: string;
    }
  ): Promise<InternshipHour> {
    const student = await this.studentRepo.findOne({
      where: { user: { id: userId } },
      relations: ["user"],
    });

    if (!student) {
      throw new Error("Student not found");
    }

    const internship = await this.internshipRepo.findOne({
      where: { 
        student: { id: student.id },
        isApproved: true
      },
    });

    if (!internship) {
      throw new Error("This student doesn't have an approved internship")
    }

    const currentDate = new Date();
    const workDate = new Date(data.date);

    if (workDate > currentDate) {
      throw new Error("Cannot create internship hour for a future date");
    }

    if (data.startTime >= data.endTime) {
      throw new Error("Start time must be earlier then end time");
    }

    const internshipStart = new Date(internship.startDate);
    const internshipEnd = new Date(internship.endDate);

    if (workDate < internshipStart || workDate > internshipEnd) {
      throw new Error("Internship hour date must be within the internship period");
    }

    const existingHour = await this.hourRepo.findOne({
      where: {
        internship: { id: internship.id },
        date: data.date
      }
    });

    if (existingHour) {
      throw new Error("Internship hour for this date already exists");
    }

    const hour = this.hourRepo.create({
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      description: data.description,
      internship: internship,
      status: "pending"
    });

    return await this.hourRepo.save(hour);
  }


  async getHoursForStudent(userId: number, status?: string): Promise<any[]> {
    const student = await this.studentRepo.findOne({
      where: { user: { id: userId } },
      relations: ["user"]
  });

  if (!student) {
    throw new Error("Student not found");
  }

  const whereCondition: any = {
    internship: {
      student: {
        id: student.id
      }
    }
  };

  const allowedStatuses = ["pending", "approved", "rejected"];
  if (status && allowedStatuses.includes(status)) {
    whereCondition.status = status;
  }

  const hours = await this.hourRepo.find({
    where: whereCondition,
    relations: ["internship", "approvedBy"],
    order: {
      date: "DESC",
      startTime: "ASC"
    }
  });

  return hours.map(mapInternshipHourToDTO);
}

  async getAllHours(status?: string): Promise<any[]> {
    const whereCondition: any = {};

    const allowedStatuses = ["pending", "approved", "rejected"];
    if (status && allowedStatuses.includes(status)) {
      whereCondition.status = status;
    }

    const hours = await this.hourRepo.find({
      where: whereCondition,
      relations: ["internship", "intership.student","internship.student.user", "approvedBy"],
      order: {
        date: "DESC",
        startTime: "ASC"
      }
    });

    return hours.map(mapInternshipHourToDTO);
  }

  async getHourById(hourId: number): Promise<InternshipHour | null> {
    return await this.hourRepo.findOne({
      where: { id: hourId },
      relations: ["internship", "internship.student", "internship.student.user", "approvedBy"],
    });
  }

  async updateHour(
    hourId: number, 
    userId: number,
    data: {
      date?: string;
      startTime?: string;
      endTime?: string;
      description?: string;
    }
  ): Promise<InternshipHour> {
    const hour = await this.hourRepo.findOne({
      where: { id: hourId },
      relations: ["internship", "internship.student", "internship.student.user"],
    });

    if (!hour) {
      throw new Error("Hour entry not found");
    }

    // Ellenőrizzük, hogy a felhasználó tulajdonosa-e az órának
    if (hour.internship.student.user.id !== userId) {
      throw new Error("You can only update your own hour entries");
    }

    // Csak pending státuszú órákat lehet módosítani
    if (hour.status !== "pending") {
      throw new Error("Can only update pending hour entries");
    }

    // Validációk
    if (data.startTime && data.endTime && data.startTime >= data.endTime) {
      throw new Error("Start time must be earlier than end time");
    }

    // Frissítés
    if (data.date) hour.date = data.date;
    if (data.startTime) hour.startTime = data.startTime;
    if (data.endTime) hour.endTime = data.endTime;
    if (data.description) hour.description = data.description;

    return await this.hourRepo.save(hour);
  }

  async deleteHour(hourId: number, userId: number): Promise<void> {
    const hour = await this.hourRepo.findOne({
      where: { id: hourId },
      relations: ["internship", "internship.student", "internship.student.user"],
    });

    if (!hour) {
      throw new Error("Hour entry not found");
    }

    // Ellenőrizzük, hogy a felhasználó tulajdonosa-e az órának
    if (hour.internship.student.user.id !== userId) {
      throw new Error("You can only delete your own hour entries");
    }

    // Csak pending státuszú órákat lehet törölni
    if (hour.status !== "pending") {
      throw new Error("Can only delete pending hour entries");
    }

    await this.hourRepo.remove(hour);
  }

   async approveHour(hourId: number, mentorUserId: number): Promise<InternshipHour> {
    const hour = await this.hourRepo.findOne({
      where: { id: hourId },
      relations: ["internship", "internship.mentor", "internship.mentor.user"],
    });

    if (!hour) {
      throw new Error("Hour entry not found");
    }

    // Ellenőrizzük, hogy a mentor jogosult-e jóváhagyni
    if (hour.internship.mentor.user.id !== mentorUserId) {
      throw new Error("You can only approve hours for your own students");
    }

    if (hour.status !== "pending") {
      throw new Error("Can only approve pending hour entries");
    }

    // Lekérjük a Mentor entitást a User ID alapján
    const mentor = await this.mentorRepo.findOne({ 
      where: { user: { id: mentorUserId } },
      relations: ["user"]
    });
    
    if (!mentor) {
      throw new Error("Mentor not found");
    }

    hour.status = "approved";
    hour.approvedBy = mentor; // Itt most a Mentor entitást használjuk
    //hour.approvedAt = new Date();

    return await this.hourRepo.save(hour);
  }

  async rejectHour(hourId: number, mentorUserId: number, reason?: string): Promise<InternshipHour> {
    const hour = await this.hourRepo.findOne({
      where: { id: hourId },
      relations: ["internship", "internship.mentor", "internship.mentor.user"],
    });

    if (!hour) {
      throw new Error("Hour entry not found");
    }

    // Ellenőrizzük, hogy a mentor jogosult-e elutasítani
    if (hour.internship.mentor.user.id !== mentorUserId) {
      throw new Error("You can only reject hours for your own students");
    }

    if (hour.status !== "pending") {
      throw new Error("Can only reject pending hour entries");
    }

    // Lekérjük a Mentor entitást a User ID alapján
    const mentor = await this.mentorRepo.findOne({ 
      where: { user: { id: mentorUserId } },
      relations: ["user"]
    });
    
    if (!mentor) {
      throw new Error("Mentor not found");
    }

    hour.status = "rejected";
    hour.approvedBy = mentor; // Itt most a Mentor entitást használjuk
    //hour.approvedAt = new Date();
    //if (reason) hour.rejectionReason = reason;

    return await this.hourRepo.save(hour);
  }

  async getHoursForMentor(mentorId: number, status?: string): Promise<any[]> {
    const whereCondition: any = {
      internship: {
        mentor: {
          user: {
            id: mentorId
          }
        }
      }
    };

    const allowedStatuses = ["pending", "approved", "rejected"];
    if (status && allowedStatuses.includes(status)) {
      whereCondition.status = status;
    }

    const hours = await this.hourRepo.find({
      where: whereCondition,
      relations: ["internship", "internship.student", "internship.student.user", "approvedBy"],
      order: {
        date: "DESC",
        startTime: "ASC",
      },
    });

    return hours.map(mapInternshipHourToDTO);
  }

  async getTotalHoursForStudent(userId: number): Promise<number> {
    const result = await this.hourRepo
      .createQueryBuilder("hour")
      .leftJoin("hour.internship", "internship")
      .leftJoin("internship.student", "student")
      .leftJoin("student.user", "user")
      .select("SUM(EXTRACT(EPOCH FROM (hour.endTime::time - hour.startTime::time))/3600)", "totalHours")
      .where("user.id = :userId", { userId })
      .andWhere("hour.status = :status", { status: "approved" })
      .getRawOne();

    return parseFloat(result.totalHours) || 0;
  }
}
