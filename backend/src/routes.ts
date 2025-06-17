import express from "express";
import { UserController } from "./controller/user.controller";
import { StudentController } from "./controller/student.controller";
import { CompanyController } from "./controller/company.controller";
import { InternshipController } from "./controller/internship.controller";
import { MentorController } from "./controller/mentor.controller";

export const router = express.Router();

const userController = new UserController();

router.get("/user", userController.getAll);
router.get("/user/:id", userController.getOne);
router.post("/user/register", userController.register);
router.post("/user/login", userController.login);
router.put("/user/:id", userController.update);
router.delete("/user/:id", userController.delete);

router.get("/profile/:id", userController.getProfile);
router.put("/profile/:id", userController.updateProfile);

const studentController = new StudentController();

router.get("/student", studentController.getAll);
router.get("/student/:id", studentController.getProfile);
router.post("/student", studentController.create);
router.put("/student/:id", studentController.update);
router.delete("/student/:id", studentController.delete);

const companyController = new CompanyController();

router.get("/company", companyController.getAll);
router.get("/company/:id", companyController.getOne);
router.post("/company", companyController.create);
router.put("/company/:id", companyController.update);
router.delete("/company/:id", companyController.delete);

const internshipController = new InternshipController();

router.get("/internship", internshipController.getAll);
router.get("/internship/:id", internshipController.getOne);
router.post("/internship", internshipController.create);
router.put("/internship/:id", internshipController.update);
router.delete("/internship/:id", internshipController.delete);

router.get("/profile/internship/:id", internshipController.getByUserId);

const mentorController = new MentorController();

router.get("/mentor", mentorController.getAll);
router.get("/mentor/:id", mentorController.getOne);
router.post("/mentor", mentorController.create);
router.put("/mentor/:id", mentorController.update);
router.delete("/mentor/:id", mentorController.delete);
