import { AppDataSource } from "../data-source";
import { Internship } from "../entity/Internship";
import { Mentor } from "../entity/Mentor";

export class MentorService {
  private mentorRepo = AppDataSource.getRepository(Mentor);
  private internshipRepo = AppDataSource.getRepository(Internship);

  async getStudentsWithHoursByMentor(userId: number) {
    const mentor = await this.mentorRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!mentor) {
      throw new Error("Mentor not found");
    }

    const internships = await this.internshipRepo.find({
      where: { mentor: { id: mentor.id } },
      relations: [
        "student",
        "student.user",
        "hours",
      ],
    });

    const result = internships.map((internship) => ({
      student: internship.student,
      hours: internship.hours,
    }));

    return result;
  }
}
