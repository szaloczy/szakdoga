import { AppDataSource } from "../data-source";
import { InternshipHour } from "../entity/InternshipHour";
import { Internship } from "../entity/Internship";
import { Student } from "../entity/Student";
import { mapInternshipHourToDTO } from "../dto/internshipHour.dto";
import { User } from "../entity/User";
import { Mentor } from "../entity/Mentor";
import { In } from "typeorm";

export class InternshipHourService {
  private hourRepo = AppDataSource.getRepository(InternshipHour);
  private internshipRepo = AppDataSource.getRepository(Internship);
  private studentRepo = AppDataSource.getRepository(Student);
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
      throw new Error("be_response.common.student_not_found");
    }

    const internship = await this.internshipRepo.findOne({
      where: { 
        student: { id: student.id },
        isApproved: true
      },
    });

    if (!internship) {
      throw new Error("be_response.create_hour.no_approved_internship");
    }

    const currentDate = new Date();
    const workDate = new Date(data.date);

    if (workDate > currentDate) {
      throw new Error("be_response.create_hour.future_date_not_allowed");
    }

    if (data.startTime >= data.endTime) {
      throw new Error("be_response.create_hour.start_time_must_be_earlier");
    }

    const internshipStart = new Date(internship.startDate);
    const internshipEnd = new Date(internship.endDate);

    if (workDate < internshipStart || workDate > internshipEnd) {
      throw new Error("be_response.create_hour.date_out_of_internship_period");
    }

    const sameDayHours = await this.hourRepo.find({
      where: {
        internship: { id: internship.id },
        date: data.date
      }
    });

    let totalHours = 0;
    for (const hour of sameDayHours) {
      const start = new Date(`2000-01-01T${hour.startTime}`);
      const end = new Date(`2000-01-01T${hour.endTime}`);
      totalHours += (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }

    const newStart = new Date(`2000-01-01T${data.startTime}`);
    const newEnd = new Date(`2000-01-01T${data.endTime}`);
    const newDuration = (newEnd.getTime() - newStart.getTime()) / (1000 * 60 * 60);
    if (totalHours + newDuration > 8) {
      throw new Error("be_response.create_hour.only_8_hours_per_day_allowed");
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
    throw new Error("be_response.common.student_not_found");
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
      throw new Error("be_response.common.hour_entry_not_found");
    }

    if (hour.internship.student.user.id !== userId) {
      throw new Error("be_response.update_hour.only_own_entry_update");
    }

    if (hour.status !== "pending") {
      throw new Error("be_response.update_hour.only_pending_update");
    }

    
    if (data.startTime && data.endTime && data.startTime >= data.endTime) {
      throw new Error("be_response.create_hour.start_time_must_be_earlier");
    }

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
      throw new Error("be_response.common.hour_entry_not_found");
    }

    if (hour.internship.student.user.id !== userId) {
      throw new Error("be_response.delete_hour.only_own_entry_delete");
    }

    if (hour.status !== "pending") {
      throw new Error("be_response.delete_hour.only_pending_delete");
    }

    await this.hourRepo.remove(hour);
  }

   async approveHour(hourId: number, mentorUserId: number): Promise<InternshipHour> {
    const hour = await this.hourRepo.findOne({
      where: { id: hourId },
      relations: ["internship", "internship.mentor", "internship.mentor.user"],
    });

    if (!hour) {
      throw new Error("be_response.common.hour_entry_not_found");
    }

    if (hour.internship.mentor.user.id !== mentorUserId) {
      throw new Error("be_response.approve_hour.only_own_students");
    }

    if (hour.status !== "pending") {
      throw new Error("be_response.approve_hour.only_pending_approve");
    }

    const mentor = await this.mentorRepo.findOne({ 
      where: { user: { id: mentorUserId } },
      relations: ["user"]
    });
    
    if (!mentor) {
      throw new Error("be_response.common.mentor_not_found");
    }

    hour.status = "approved";
    hour.approvedBy = mentor;

    return await this.hourRepo.save(hour);
  }

  async rejectHour(hourId: number, mentorUserId: number): Promise<InternshipHour> {
    const hour = await this.hourRepo.findOne({
      where: { id: hourId },
      relations: ["internship", "internship.mentor", "internship.mentor.user"],
    });

    if (!hour) {
      throw new Error("be_response.common.hour_entry_not_found");
    }

    if (hour.internship.mentor.user.id !== mentorUserId) {
      throw new Error("be_response.reject_hour.only_own_students");
    }

    if (hour.status !== "pending") {
      throw new Error("be_response.reject_hour.only_pending_reject");
    }

    const mentor = await this.mentorRepo.findOne({ 
      where: { user: { id: mentorUserId } },
      relations: ["user"]
    });
    
    if (!mentor) {
      throw new Error("be_response.common.mentor_not_found");
    }

    hour.status = "rejected";
    hour.approvedBy = mentor;

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

  async getTotalHoursForStudent(studentUserId: number): Promise<number> {
    const student = await this.studentRepo.findOne({
      where: { user: { id: studentUserId } },
      relations: ["user"]
    });

    if (!student) {
      throw new Error("Student not found");
    }

    const internship = await this.internshipRepo.findOne({
      where: { 
        student: { id: student.id },
        isApproved: true
      }
    });

    if (!internship) {
      return 0;
    }

    const hours = await this.hourRepo.find({
      where: {
        internship: { id: internship.id },
        status: "approved"
      }
    });

    let totalHours = 0;
    for (const hour of hours) {
      const start = new Date(`2000-01-01 ${hour.startTime}`);
      const end = new Date(`2000-01-01 ${hour.endTime}`);
      const diffMs = end.getTime() - start.getTime();
      totalHours += diffMs / (1000 * 60 * 60);
    }

    return Math.round(totalHours * 100) / 100;
  }

  async bulkApproveHours(hourIds: number[], mentorUserId: number): Promise<InternshipHour[]> {
    const hours = await this.hourRepo.find({
      where: { id: In(hourIds) },
      relations: ["internship", "internship.mentor", "internship.mentor.user"],
    });

    if (hours.length === 0) {
      throw new Error("be_response.bulk_approve.no_hours_found_by_ids");
    }

    const mentor = await this.mentorRepo.findOne({ 
      where: { user: { id: mentorUserId } },
      relations: ["user"]
    });
    
    if (!mentor) {
      throw new Error("be_response.common.mentor_not_found");
    }

    const approvedHours: InternshipHour[] = [];

    for (const hour of hours) {
      if (hour.internship.mentor.user.id !== mentorUserId) {
        throw new Error("be_response.bulk_approve.only_own_students");
      }

      if (hour.status !== "pending") {
        continue; 
      }

      hour.status = "approved";
      hour.approvedBy = mentor;
      approvedHours.push(hour);
    }

    if (approvedHours.length === 0) {
      throw new Error("be_response.bulk_approve.no_pending_hours");
    }

    return await this.hourRepo.save(approvedHours);
  }

  async approveAllStudentPendingHours(studentUserId: number, mentorUserId: number): Promise<InternshipHour[]> {
    
    const student = await this.studentRepo.findOne({
      where: { user: { id: studentUserId } },
      relations: ["user"]
    });

    if (!student) {
      throw new Error("be_response.common.student_not_found");
    }

    
    const internship = await this.internshipRepo.findOne({
      where: { 
        student: { id: student.id },
        mentor: { user: { id: mentorUserId } },
        isApproved: true
      },
      relations: ["mentor", "mentor.user"]
    });

    if (!internship) {
      throw new Error("be_response.approve_all.no_approved_internship_for_student");
    }

    
    const pendingHours = await this.hourRepo.find({
      where: {
        internship: { id: internship.id },
        status: "pending"
      },
      relations: ["internship"]
    });

    if (pendingHours.length === 0) {
      throw new Error("be_response.approve_all.no_pending_hours_for_student");
    }

    const mentor = await this.mentorRepo.findOne({ 
      where: { user: { id: mentorUserId } },
      relations: ["user"]
    });
    
    if (!mentor) {
      throw new Error("be_response.common.mentor_not_found");
    }

    for (const hour of pendingHours) {
      hour.status = "approved";
      hour.approvedBy = mentor;
    }

    return await this.hourRepo.save(pendingHours);
  }
  
  async rejectAllStudentPendingHours(studentUserId: number, mentorUserId: number): Promise<InternshipHour[]> {
    const student = await this.studentRepo.findOne({
      where: { user: { id: studentUserId } },
      relations: ["user"]
    });

    if (!student) {
      throw new Error("be_response.common.student_not_found");
    }

    
    const internship = await this.internshipRepo.findOne({
      where: { 
        student: { id: student.id },
        mentor: { user: { id: mentorUserId } },
        isApproved: true
      },
      relations: ["mentor", "mentor.user"]
    });

    if (!internship) {
      throw new Error("be_response.reject_all.no_approved_internship_for_student");
    }

    
    const pendingHours = await this.hourRepo.find({
      where: {
        internship: { id: internship.id },
        status: "pending"
      },
      relations: ["internship"]
    });

    if (pendingHours.length === 0) {
      throw new Error("be_response.reject_all.no_pending_hours_for_student");
    }

    const mentor = await this.mentorRepo.findOne({ 
      where: { user: { id: mentorUserId } },
      relations: ["user"]
    });
    
    if (!mentor) {
      throw new Error("be_response.common.mentor_not_found");
    }

    for (const hour of pendingHours) {
      hour.status = "rejected";
      hour.approvedBy = mentor;
    }

    return await this.hourRepo.save(pendingHours);
  }

  async getStudentHourDetails(studentUserId: number, mentorUserId: number): Promise<any> {
    const student = await this.studentRepo.findOne({
      where: { user: { id: studentUserId } },
      relations: ["user"]
    });

    if (!student) {
      throw new Error("Student not found");
    }

    const internship = await this.internshipRepo.findOne({
      where: { 
        student: { id: student.id },
        mentor: { user: { id: mentorUserId } },
        isApproved: true
      },
      relations: ["mentor", "mentor.user", "student", "student.user"]
    });

    if (!internship) {
      throw new Error("No approved internship found for this student under your mentorship");
    }

    const hours = await this.hourRepo.find({
      where: { internship: { id: internship.id } },
      relations: ["approvedBy", "approvedBy.user"],
      order: { date: "DESC", startTime: "ASC" }
    });

    let totalHours = 0;
    let approvedHours = 0;
    let pendingHours = 0;
    let rejectedHours = 0;

    for (const hour of hours) {
      const start = new Date(`2000-01-01 ${hour.startTime}`);
      const end = new Date(`2000-01-01 ${hour.endTime}`);
      const diffMs = end.getTime() - start.getTime();
      const duration = diffMs / (1000 * 60 * 60);

      totalHours += duration;
      
      switch (hour.status) {
        case "approved":
          approvedHours += duration;
          break;
        case "pending":
          pendingHours += duration;
          break;
        case "rejected":
          rejectedHours += duration;
          break;
      }
    }

    return {
      student: {
        id: student.user.id,
        firstname: student.user.firstname,
        lastname: student.user.lastname,
        email: student.user.email,
        major: student.major,
        university: student.university
      },
      internship: {
        id: internship.id,
        startDate: internship.startDate,
        endDate: internship.endDate
      },
      summary: {
        totalHours: Math.round(totalHours * 100) / 100,
        approvedHours: Math.round(approvedHours * 100) / 100,
        pendingHours: Math.round(pendingHours * 100) / 100,
        rejectedHours: Math.round(rejectedHours * 100) / 100,
        completionPercentage: Math.round((approvedHours / 180) * 100),
        remainingHours: Math.max(0, 180 - approvedHours)
      },
      hours: hours.map(hour => ({
        id: hour.id,
        date: hour.date,
        startTime: hour.startTime,
        endTime: hour.endTime,
        description: hour.description,
        status: hour.status,
        duration: Math.round(((new Date(`2000-01-01 ${hour.endTime}`).getTime() - 
                              new Date(`2000-01-01 ${hour.startTime}`).getTime()) / (1000 * 60 * 60)) * 100) / 100,
        submittedAt: hour.createdAt.toISOString(),
        reviewedAt: hour.status !== 'pending' && hour.updatedAt ? hour.updatedAt.toISOString() : undefined,
        approvedBy: hour.approvedBy ? {
          id: hour.approvedBy.id,
          firstname: hour.approvedBy.user?.firstname,
          lastname: hour.approvedBy.user?.lastname
        } : null
      }))
    };
  }
}
