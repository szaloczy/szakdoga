import express from "express";
import { UserController } from "./controller/UserController";

export const router = express.Router();

const userController = new UserController();

router.get("/user", userController.getAll);
router.post("/user/register", userController.register);
router.post("/user/login", userController.login);
