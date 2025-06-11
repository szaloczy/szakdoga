import { Controller } from "./base.controller";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { secretKey } from "../config";
import { Student } from "../entity/Student";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { profileDTO, UserRole } from "../types";
import { Mentor } from "../entity/Mentor";

export class UserController extends Controller {
  repository = AppDataSource.getRepository(User);

  getAll = async (req, res) => {
    const users = await this.repository.find({
      relations: ["student", "mentor", "mentor.company"],
    });

    res.json(users);
  };

  register = async (req, res) => {
    try {
      const userToCreate = this.repository.create(req.body as User);
      delete userToCreate.id;

      const createdUser = await this.repository.save(userToCreate);

      userToCreate.password = await bcrypt.hash(createdUser.password, 12);

      await this.repository.save(createdUser);

      if (userToCreate.role === "student") {
        const student = AppDataSource.getRepository(Student).create({
          user: createdUser,
        });

        await AppDataSource.getRepository(Student).save(student);
      } else if (userToCreate.role === "mentor") {
        const mentor = AppDataSource.getRepository(Mentor).create({
          user: createdUser,
          position: req.body.position,
          company: req.body.company,
        });

        await AppDataSource.getRepository(Mentor).save(mentor);
      }

      res.json(createdUser);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  login = async (req, res) => {
    try {
      const user = await this.repository.findOne({
        where: { email: req.body.email },
        select: ["id", "password", "role", "firstname", "lastname"],
      });

      if (!user) {
        return this.handleError(res, null, 401, "Incorrect email or password");
      }

      const passwordMatches = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!passwordMatches) {
        return this.handleError(res, null, 401, "Incorrect email or password");
      }

      const token = jwt.sign(
        {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          role: user.role,
        },
        secretKey,
        { expiresIn: "1d" }
      );

      res.json({ accessToken: token });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  getProfile = async (req, res) => {
    try {
      const userId = Number(req.params["id"]);

      const fullUser = await this.repository.findOne({
        where: { id: userId },
        relations: ["student"],
      });

      if (!fullUser) {
        this.handleError(res, null, 404, "User not found");
      }

      res.json(fullUser);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  updateProfile = async (req, res) => {
    const userId = req.params["id"];
    const profile = req.body as Partial<profileDTO>;

    try {
      const user = await this.repository.findOne({
        where: { id: userId },
        relations: ["student"],
      });

      if (!user) {
        this.handleError(res, null, 404, "User not found");
      }

      user.email = profile.email;
      user.firstname = profile.firstname;
      user.lastname = profile.lastname;

      if (user.student) {
        user.student.phone = String(profile.student.phone);
        user.student.major = profile.student.major;
        user.student.university = profile.student.university;
        user.student.neptun = profile.student.neptun;

        await AppDataSource.getRepository(Student).save(user.student);
      }

      await this.repository.save(user);

      res.json({ message: "Profile updated successfully" });
    } catch (error) {
      this.handleError(res, error);
    }
  };
}
