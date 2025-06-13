import { AppDataSource } from "../data-source";
import { Controller } from "./base.controller";
import { InternshipSession } from "../entity/InternshipSession";
import { Internship } from "../entity/Internship";

export class InternshipSessionController extends Controller {
  repository = AppDataSource.getRepository(InternshipSession);

  create = async (req, res) => {
    try {
      const userId = req.user.id;

      const internship = await AppDataSource.getRepository(Internship).findOne({
        where: { student: { user: { id: userId } } },
      });

      if (!internship) {
        return res
          .status(403)
          .json({ message: "You are not assigned to an internship." });
      }

      const newSession = this.repository.create({
        ...req.body,
        internship,
        isApproved: false,
      });

      const saved = await this.repository.save(newSession);
      res.json(saved);
    } catch (err) {
      this.handleError(res, err);
    }
  };

  getAll = async (req, res) => {
    try {
      const userId = req.user.id;

      if (req.user.role === "STUDENT") {
        const internship = await AppDataSource.getRepository(
          Internship
        ).findOne({
          where: { student: { user: { id: userId } } },
        });

        if (!internship) {
          return res.json([]);
        }

        const sessions = await this.repository.find({
          where: { internship: { id: internship.id } },
        });

        return res.json(sessions);
      }

      // Admin vagy mentor esetén teljes lista
      const all = await this.repository.find();
      res.json(all);
    } catch (err) {
      this.handleError(res, err);
    }
  };
}
