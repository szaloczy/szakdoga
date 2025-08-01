import { Controller } from "./base.controller";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { secretKey } from "../config";
import { Student } from "../entity/Student";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { GetProfileResponseDTO, UpdateProfileDTO } from "../types";
import { Mentor } from "../entity/Mentor";
import { QueryFailedError } from "typeorm";

export class UserController extends Controller {
  repository = AppDataSource.getRepository(User);

  getAll = async (req, res) => {
    const users = await this.repository.find({
      relations: ["student", "mentor", "mentor.company"],
    });

    res.json(users);
  };

  getOne = async (req, res) => {
    try {
      const userId = Number(req.params["id"]);

      if (isNaN(userId)) {
        return this.handleError(res, null, 400, "Invalid user ID");
      }

      const user = await this.repository.findOne({
        where: { id: userId },
        relations: ["student", "mentor", "mentor.company"]
      });

      if (!user) {
        return this.handleError(res, null, 404, "User not found");
      }

      res.json(user);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  update = async (req, res) => {
    try {
      const userId = Number(req.params["id"]);
      const updateData = req.body;

      if (isNaN(userId)) {
        return this.handleError(res, null, 400, "Invalid user ID");
      }

      const user = await this.repository.findOne({
        where: { id: userId },
        relations: ["student", "mentor", "mentor.company"]
      });

      if (!user) {
        return this.handleError(res, null, 404, "User not found");
      }

      // User adatok frissítése
      if (updateData.email) user.email = updateData.email;
      if (updateData.firstname) user.firstname = updateData.firstname;
      if (updateData.lastname) user.lastname = updateData.lastname;
      if (updateData.active !== undefined) user.active = updateData.active;

      // Student adatok frissítése ha van
      if (user.student && updateData.student) {
        if (updateData.student.phone !== undefined) user.student.phone = updateData.student.phone;
        if (updateData.student.major !== undefined) user.student.major = updateData.student.major;
        if (updateData.student.university !== undefined) user.student.university = updateData.student.university;
        if (updateData.student.neptun !== undefined) user.student.neptun = updateData.student.neptun;

        await AppDataSource.getRepository(Student).save(user.student);
      }

      await this.repository.save(user);
      res.json({ message: "User updated successfully" });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  delete = async (req, res) => {
    try {
      const userId = Number(req.params["id"]);

      if (isNaN(userId)) {
        return this.handleError(res, null, 400, "Invalid user ID");
      }

      const user = await this.repository.findOne({
        where: { id: userId }
      });

      if (!user) {
        return this.handleError(res, null, 404, "User not found");
      }

      await this.repository.remove(user);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  register = async (req, res) => {
    try {
      const userToCreate = this.repository.create(req.body as User);
      delete userToCreate.id;

      userToCreate.password = await bcrypt.hash(userToCreate.password, 10);
      const createdUser = await this.repository.save(userToCreate);

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
    if (error instanceof QueryFailedError && (error as any).code === '23505'){
        return res.status(409).json({ message: "this Email address is already used" });
      }
      this.handleError(res, error);
  }
}

  login = async (req, res) => {
    try {
      if (!req.body.email || !req.body.password) {
        return this.handleError(res, null, 400, "Email and password are required");
      }

      const user = await this.repository.findOne({
        where: {email: req.body.email},
        select: ["id", "password", "role", "firstname", "lastname", "active"]
      });

      if (!user) {
        return this.handleError(res, null, 401, "Incorrect email or password");
      }

      if(!user.active) {
        return this.handleError(res, null, 403, "Account is deactivated");
      }

      const passwordMatches = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!passwordMatches) {
        return this.handleError(res, null, 401, "Incorrect email or password");
      }

      const token = jwt.sign({
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role
      },
      secretKey,
      { expiresIn: "1d" }
    );

    res.json({ accessToken: token });

    } catch (error) {
      this.handleError(res, error);
    }
  }

  getProfile = async (req, res) => {
   try {
    const userId = Number(req.params["id"]);

    const fullUser = await this.repository.findOne({
      where: {id: userId},
      relations: ["student", "mentor", "mentor.company"]
    });

    if (!fullUser) {
      return this.handleError(res, null, 404, "User not found");
    }

    const profileResponse: GetProfileResponseDTO = {
      id: fullUser.id,
      email: fullUser.email,
      firstname: fullUser.firstname,
      lastname: fullUser.lastname,
      role: fullUser.role,
      active: fullUser.active,
      ...(fullUser.student && { student: fullUser.student }),
      ...(fullUser.mentor && { mentor: fullUser.mentor })
    };

    res.json(profileResponse);
   } catch (error) {
      this.handleError(res, error);
    }
  }
}
