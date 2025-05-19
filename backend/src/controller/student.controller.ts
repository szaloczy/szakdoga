import { AppDataSource } from "../data-source";
import { Student } from "../entity/Student";
import { Controller } from "./base.controller";

export class StudentController extends Controller {
  repository = AppDataSource.getRepository(Student);

  getProfile = async (req, res) => {
    try {
      const fullUser = await this.repository.findOne({
        where: { id: req.params["id"] },
        relations: ["user"],
      });

      if (!fullUser) {
        this.handleError(res, null, 404, "User not found");
      }

      res.json(fullUser);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  /*   updateStudentWithUser = async (req, res) => {
    const student = await this.repository.findOne
  } */
}
