import { AppDataSource } from "../data-source";
import { Mentor } from "../entity/Mentor";
import { Controller } from "./base.controller";

export class MentorController extends Controller {
  repository = AppDataSource.getRepository(Mentor);

  getAll = async (req, res) => {
    const mentors = await this.repository.find({
      relations: ["user"],
    });

    res.json(mentors);
  };
}
