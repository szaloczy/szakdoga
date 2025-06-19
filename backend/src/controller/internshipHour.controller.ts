import { Repository } from "typeorm";
import { Controller } from "./base.controller";
import { AppDataSource } from "../data-source";
import { Internship } from "../entity/Internship";
import { UserRole } from "../types";
import { Mentor } from "../entity/Mentor";
import { Student } from "../entity/Student";

export class InternshipHourController extends Controller {
  repository = AppDataSource.getRepository("InternshipHour");

  create = async (req, res) => {
    try {
      const hour = req.body;

      console.log(hour);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user = (req as any).user;

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      console.log(user);

      const role = user.role;
      const userId = user.id;

      const internshipRepository = AppDataSource.getRepository(Internship);
      const mentorRepository = AppDataSource.getRepository(Mentor);
      const studentRepository = AppDataSource.getRepository(Student);

      let internship: Internship | null = null;

      if (role === UserRole.STUDENT) {
        const student = await studentRepository.findOne({
          where: { user: { id: userId } },
          relations: ["internship"],
        });

        if (!student || !student.internship || !student.internship.isApproved) {
          return res
            .status(403)
            .json({ message: "No approved internship found." });
        }

        console.log("inputDate:", hour.date);
        console.log("today:", new Date().toISOString().split("T")[0]);

        const today = new Date().toISOString().split("T")[0];
        if (hour.date !== today) {
          return res
            .status(400)
            .json({ message: "Students can only add hours for today." });
        }

        internship = student.internship;
      }

      console.log(internship);

      if (role === "MENTOR") {
        const mentor = await mentorRepository.findOne({
          where: { user: { id: userId } },
          relations: ["internship"],
        });

        if (!mentor) {
          return res.status(404).json({ message: "Mentor not found." });
        }

        internship = await internshipRepository.findOne({
          where: { id: hour.intershipId, mentor: { id: mentor.id } },
        });

        if (!internship) {
          return res
            .status(403)
            .json({ message: "You don't have access to this internship." });
        }
      }

      if (!internship) {
        return res.status(400).json({ message: "Internship not found." });
      }

      const newHour = this.repository.create({
        date: hour.date,
        startTime: hour.startTime,
        endTime: hour.endTime,
        description: hour.description,
        internship,
        status: role === "MENTOR" ? "approved" : "pending",
        approvedBy:
          role === "MENTOR"
            ? await mentorRepository.findOne({
                where: { user: { id: userId } },
              })
            : null,
      });

      const saved = await this.repository.save(newHour);
      res.status(201).json(saved);
    } catch (error) {
      console.error("Internship hour creation error:", error);
      return res.status(500).json({ message: "Server error." });
    }
  };
}
