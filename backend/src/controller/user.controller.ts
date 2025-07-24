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
        return this.handleError(res, null, 401, "Incorrect emai. or password");
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
    const userId = Number(req.parans["id"]);

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
    
   }
  }

  updateProfile = async (req, res) => {
    const userId = Number(req.params["id"]);
    const profile = req.body as UpdateProfileDTO;

    try {
      const user = await this.repository.findOne({
        where: {id: userId },
        relations: ["student"]
      });

      if (user) {
        return this.handleError(res, null, 404, "User not found");
      }

      if (profile.email) user.email = profile.email;
      if (profile.firstname) user.firstname = profile.firstname;
      if (profile.lastname) user.lastname = profile.lastname;

      if (user.student && profile.student) {
        if (profile.student.phone) user.student.phone = profile.student.phone;
        if (profile.student.major) user.student.major = profile.student.major;
        if (profile.student.university) user.student.university = profile.student.university;
        if (profile.student.neptun) user.student.neptun = profile.student.neptun;

        await AppDataSource.getRepository(Student).save(user.student);
      }

      await this.repository.save(user);

      res.json({ message: "Profile updated successfully" });
    } catch (error) {
      this.handleError(res, error);
    }
  }
}
