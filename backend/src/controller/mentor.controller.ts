import { AppDataSource } from "../data-source";
import { Mentor } from "../entity/Mentor";
import { MentorService } from "../service/mentor.service";
import { Controller } from "./base.controller";

export class MentorController extends Controller {
  repository = AppDataSource.getRepository(Mentor);
  service = new MentorService();

  getAll = async (req, res) => {
    const mentors = await this.repository.find({
      relations: ["user"],
    });

    res.json(mentors);
  };

  getStudents = async (req, res) => {
    try {
      const userId = req.user.id; // biztosítsd, hogy req.user működjön
      const studentsWithHours = await this.service.getStudentsWithHoursByMentor(userId);

      

      res.json(studentsWithHours);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error while fetching students data." });
    }
  };
}
