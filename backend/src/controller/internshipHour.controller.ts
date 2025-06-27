
import { Controller } from "./base.controller";
import { InternshipHourService } from "../service/internshipHour.service";


export class InternshipHourController extends Controller {
 private service = new InternshipHourService();

  create = async (req, res) => {
    const user = (req as any).user;
    const data = req.body;

    try {
      const hour = await this.service.createHourForStudent(user.id, data);
      res.status(201).json(hour);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message });
    }
  };
};