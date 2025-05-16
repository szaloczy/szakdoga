import { Controller } from "./base.controller";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { secretKey } from "../config";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export class UserController extends Controller {
  repository = AppDataSource.getRepository(User);

  register = async (req, res) => {
    try {
      const userToCreate = this.repository.create(req.body as User);
      delete userToCreate.id;

      const createdUser = await this.repository.save(userToCreate);

      userToCreate.password = await bcrypt.hash(createdUser.password, 12);

      await this.repository.save(createdUser);

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
    } catch (error) {}
  };
}
