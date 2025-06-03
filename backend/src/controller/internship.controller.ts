import { AppDataSource } from "../data-source";
import { Internship } from "../entity/Internship";
import { mapInternshipToDTO } from "../utils/mappers/internship.mapper";
import { Controller } from "./base.controller";

export class InternshipController extends Controller {
  repository = AppDataSource.getRepository(Internship);

  getAll = async (req, res) => {
    const internships = await this.repository.find({
      relations: [
        "student",
        "student.user",
        "mentor",
        "mentor.user",
        "company",
      ],
    });

    const result = internships.map(mapInternshipToDTO);

    res.json(result);
  };
}
