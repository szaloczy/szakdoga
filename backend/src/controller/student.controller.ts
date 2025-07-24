import { StudentService } from "../service/student.service";
import { Controller } from "./base.controller";

export class StudentController extends Controller {
  private service = new StudentService();

  getAll = async (req, res) => {
    try {
      const students = await this.service.getAllActiveStudents();
      res.json(students);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  getById = async (req, res) => {
    try {
      const studentId = Number(req.params["id"]);
      
      if (isNaN(studentId)) {
        return this.handleError(res, null, 400, "Invalid student ID");
      }

      const student = await this.service.getStudentById(studentId);
      
      if (!student) {
        return this.handleError(res, null, 404, "Student not found");
      }

      res.json(student);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  updateProfile = async (req, res) => {
    try {
      const studentId = Number(req.params["id"]);
      const updateData = req.body;

      if (isNaN(studentId)) {
        return this.handleError(res, null, 400, "Invalid student ID");
      }

      await this.service.updateStudentProfile(studentId, updateData);
      res.json({ message: "Student profile updated successfully" });
    } catch (error) {
      this.handleError(res, error);
    }
  };
}