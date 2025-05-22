import express from "express";
import { UserController } from "./controller/user.controller";
/* import { PracticeController } from "./controller/practice.controller";
import { DocumentController } from "./controller/document.controller";
import { FeedbackController } from "./controller/feedback.controller"; */
import { StudentController } from "./controller/student.controller";
import { CompanyController } from "./controller/company.controller";

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

/* const practiceController = new PracticeController();

router.get("/practice", practiceController.getAll);
router.get("/pracice/:id", practiceController.getOne);
router.post("/practice", practiceController.create);
router.put("/practice/:id", practiceController.update);
router.delete("/practice/:id", practiceController.delete);

const documentController = new DocumentController();

router.get("/document", documentController.getAll);
router.get("/document/:id", documentController.getOne);
router.post("/document", documentController.create);
router.put("/document/:id", documentController.update);
router.delete("/document/:id", documentController.delete);

const feedbackController = new FeedbackController();

router.get("/feedback", feedbackController.getAll);
router.get("/feedback/:id", feedbackController.getOne);
router.post("/feedback", feedbackController.create);
router.put("/feedback/:id", feedbackController.update);
router.delete("/feedback/:id", feedbackController.delete); */
