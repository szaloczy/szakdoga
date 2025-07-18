import express from "express";
import { UserController } from "./controller/user.controller";
import { StudentController } from "./controller/student.controller";
import { CompanyController } from "./controller/company.controller";
import { InternshipController } from "./controller/internship.controller";
import { MentorController } from "./controller/mentor.controller";
import { InternshipHourController } from "./controller/internshipHour.controller";
import { authMiddleware } from "./middleware/auth.middleware";

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
router.post("/company", authMiddleware, companyController.create);
router.put("/company/:id", authMiddleware, companyController.update);
router.delete("/company/:id", authMiddleware, companyController.delete);

const internshipController = new InternshipController();

router.get("/internship", internshipController.getAll);
router.get("/internship/:id",authMiddleware, internshipController.getOne);
router.post("/internship",authMiddleware, internshipController.create);
router.put("/internship/:id",authMiddleware, internshipController.update);
router.delete("/internship/:id",authMiddleware, internshipController.delete);

router.get("/profile/internship/:id", internshipController.getByUserId);

const mentorController = new MentorController();

router.get("/mentor", mentorController.getAll);
router.get("/mentor/students", authMiddleware, mentorController.getStudents);
router.get("/mentor/:id",authMiddleware, mentorController.getOne);
router.post("/mentor",authMiddleware, mentorController.create);
router.put("/mentor/:id",authMiddleware, mentorController.update);
router.delete("/mentor/:id",authMiddleware, mentorController.delete);

const internshipHourController = new InternshipHourController();

router.get("/internship-hour", internshipHourController.getAll);
router.get("/internship-hour/mine", authMiddleware, internshipHourController.getById);
router.get("/internship-hour/:id", internshipHourController.getOne);
router.post(
  "/internship-hour",
  authMiddleware,
authMiddleware,
  internshipHourController.create
);
router.put(
  "/internship-hour/:id",
  authMiddleware,
authMiddleware,
  internshipHourController.update
);
router.delete("/internship-hour/:id",authMiddleware, internshipHourController.delete);
