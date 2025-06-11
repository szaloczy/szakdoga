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

  getByStudentId = async (req, res) => {
    const studentId = req.params["id"];

    if (isNaN(studentId)) {
      return res.status(400).json({ message: "Invalid studentId parameter" });
    }

    try {
      const internship = await this.repository.findOne({
        where: {
          student: {
            id: studentId,
          },
        },
        relations: [
          "student",
          "student.user",
          "mentor",
          "mentor.user",
          "company",
        ],
      });

      if (!internship) {
        return res
          .status(404)
          .json({ message: "No internship found for this student" });
      }

      const result = mapInternshipToDTO(internship);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}
