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
      const userId = req.user.id;
      const studentsWithHours = await this.service.getStudentsWithHoursByMentor(userId);

      res.json(studentsWithHours);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error while fetching students data." });
    }
  };

  getOne = async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid mentor ID" });
      }

      const mentor = await this.service.getMentorById(id);
      if (!mentor) {
        return res.status(404).json({ message: "Mentor not found" });
      }

      res.json(mentor);
    } catch (err) {
      console.error("Error fetching mentor:", err);
      res.status(500).json({ message: "Server error while fetching mentor." });
    }
  };
}
