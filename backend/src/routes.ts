import express from "express";
import { UserController } from "./controller/user.controller";
import { StudentController } from "./controller/student.controller";
import { CompanyController } from "./controller/company.controller";
import { InternshipController } from "./controller/internship.controller";
import { MentorController } from "./controller/mentor.controller";
import { InternshipHourController } from "./controller/internshipHour.controller";
import { authMiddleware } from "./middleware/auth.middleware";
import { DocumentController } from "./controller/document.controller";
import { documentUpload } from "./middleware/multer.middleware";
import { StatisticsController } from "./controller/statistics.controller";

export const router = express.Router();

const userController = new UserController();


router.get("/user", userController.getAll);
router.get("/user/:id", userController.getOne);
router.post("/user/register", userController.register);
router.post("/user/login", userController.login);
router.post("/user/forgot-password", userController.forgotPassword);
router.post("/user/reset-password", userController.resetPassword); 
router.put("/user/:id", authMiddleware, userController.update); 
router.delete("/user/:id", authMiddleware, userController.delete); 

router.get("/profile/:id", userController.getProfile);


const studentController = new StudentController();

router.get("/student", studentController.getAll);
router.get("/student/:id", authMiddleware, studentController.getById);
router.get("/student/user/:userId", authMiddleware, studentController.getByUserId);
//router.get("/student/neptun/:neptun", studentController.getByNeptun);
//router.get("/student/search", studentController.searchStudents);


router.get("/students/export-csv", authMiddleware, studentController.exportCsv);

router.get("/students/export-csv/mine", authMiddleware, studentController.exportMyCsv);


const companyController = new CompanyController();

router.get("/company", companyController.getAll);
router.get("/company/active", companyController.getActive);
router.get("/company/search", companyController.search);
router.get("/company/:id", companyController.getOne);
router.get("/company/:id/mentors", companyController.getMentors);
router.post("/company", authMiddleware, companyController.create);
router.put("/company/:id", authMiddleware, companyController.update);
router.delete("/company/:id", authMiddleware, companyController.delete);
router.post("/company/:id/deactivate", authMiddleware, companyController.deactivate);


const internshipController = new InternshipController();


router.get("/internship", internshipController.getAll);
router.get("/internship/my", authMiddleware, internshipController.getMyInternship);
router.get("/internship/:id", authMiddleware, internshipController.getOne);
router.post("/internship", authMiddleware, internshipController.create);
router.put("/internship/:id", authMiddleware, internshipController.update);
router.delete("/internship/:id", authMiddleware, internshipController.delete);
router.post("/internship/:id/approve", authMiddleware, internshipController.approve);
router.post("/internship/:id/reject", authMiddleware, internshipController.reject);

router.get("/profile/internship/:id", internshipController.getByUserId);


const mentorController = new MentorController();

router.get("/mentor", mentorController.getAll);

router.get("/mentor/students", authMiddleware, mentorController.getStudents);
router.get("/mentor/company/:companyId", mentorController.getByCompany);
router.get("/mentor/search", mentorController.searchMentors);
router.get("/mentor/user/:userId", authMiddleware, mentorController.getByUserId);

router.get("/mentor/:id", authMiddleware, mentorController.getById);
router.post("/mentor", authMiddleware, mentorController.create);
router.put("/mentor/:id", authMiddleware, mentorController.updateProfile);
router.delete("/mentor/:id", authMiddleware, mentorController.deactivate);

const internshipHourController = new InternshipHourController();

router.get("/internship-hour", internshipHourController.getAll);
router.get("/internship-hour/mine", authMiddleware, internshipHourController.getMyHours);
router.get("/internship-hour/mentor", authMiddleware, internshipHourController.getMentorHours);
router.post("/internship-hour/:id/approve", authMiddleware, internshipHourController.approve);
router.post("/internship-hour/:id/reject", authMiddleware, internshipHourController.reject);
router.post("/internship-hour/bulk-approve", authMiddleware, internshipHourController.bulkApprove);
router.post("/internship-hour/student/:studentId/approve-all", authMiddleware, internshipHourController.approveAllStudentHours);
router.post("/internship-hour/student/:studentId/reject-all", authMiddleware, internshipHourController.rejectAllStudentHours);
router.get("/internship-hour/student/:studentId/details", authMiddleware, internshipHourController.getStudentHourDetails);
router.get("/internship-hour/:id", internshipHourController.getOne);
router.post("/internship-hour", authMiddleware, internshipHourController.create);
router.put("/internship-hour/:id", authMiddleware, internshipHourController.update);
router.delete("/internship-hour/:id", authMiddleware, internshipHourController.delete);


const documentController = new DocumentController();

router.post("/documents/upload", authMiddleware, documentUpload.single("file"), documentController.upload);
router.get("/documents", authMiddleware, documentController.getAll);
router.get("/documents/student", authMiddleware, documentController.getStudentDocuments);
router.post("/documents/:id/review", authMiddleware, documentController.review);
router.get("/documents/:id/download", authMiddleware, documentController.download);
router.delete("/documents/:id", authMiddleware, documentController.delete);

const statisticsController = new StatisticsController();

router.get("/statistics/hours-per-month", authMiddleware, statisticsController.getHoursPerMonth.bind(statisticsController));
router.get("/statistics/hour-status-distribution", authMiddleware, statisticsController.getHourStatusDistribution.bind(statisticsController));
router.get("/statistics/cumulative-hours", authMiddleware, statisticsController.getCumulativeHours.bind(statisticsController));
router.get("/statistics/progress", authMiddleware, statisticsController.getProgressStatistics.bind(statisticsController));
router.get("/statistics/dashboard-progress", authMiddleware, statisticsController.getDashboardProgress.bind(statisticsController));

router.get("/statistics/mentor/hours-per-month", authMiddleware, statisticsController.getMentorHoursPerMonth.bind(statisticsController));
router.get("/statistics/mentor/hour-status-distribution", authMiddleware, statisticsController.getMentorHourStatusDistribution.bind(statisticsController));
router.get("/statistics/mentor/cumulative-hours", authMiddleware, statisticsController.getMentorCumulativeHours.bind(statisticsController));
