import { StudentService } from "../service/student.service";
import { Controller } from "./base.controller";
import { parse } from "json2csv";

export class StudentController extends Controller {
  private service = new StudentService();

    exportMyCsv = async (req, res) => {
      try {
        const user = (req as any).user;
        if (!user) return res.status(401).json({ error: "Unauthorized" });

        const student = await this.service.getStudentByUserId(user.id);
        if (!student) return res.status(404).json({ error: "Student not found" });

        const hours = await this.service.getStudentHoursForExport(student.id);

        if (!hours || hours.length === 0) {
          return res.status(404).json({ error: "No approved hours found" });
        }

        const fields = [
          { label: "Dátum", value: "date" },
          { label: "Kezdés", value: "startTime" },
          { label: "Végzés", value: "endTime" },
          { label: "Leírás", value: "description" },
          { label: "Státusz", value: "status" }
        ];
        const opts = { fields, delimiter: "," };
        const csv = parse(hours, opts);
        
        const csvWithBOM = '\uFEFF' + csv;

        const fileName = `elfogadott_oraim_${new Date().toISOString().slice(0,10).replace(/-/g,"")}.csv`;
        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", `attachment; filename=\"${fileName}\"`);
        res.status(200).send(csvWithBOM);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    };

  getAll = async (req, res) => {
    try {
      const students = await this.service.getAllActiveStudents();
      res.json(students);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  exportCsv = async (req, res) => {
    try {
      const user = (req as any).user;
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { status, university, name } = req.query;
      const students = await this.service.getStudentsForExport({ status, university, name });

      if (!students || students.length === 0) {
        return res.status(404).json({ error: "No students found" });
      }

      const fields = [
        { label: "Név", value: row => `${row.firstname} ${row.lastname}` },
        { label: "Email", value: "email" },
        { label: "Egyetem", value: "university" },
        { label: "Státusz", value: "status" },
        { label: "Teljesített órák", value: "completedHours" },
        { label: "Függő órák", value: "pendingHours" }
      ];
      const opts = { fields, delimiter: "," };
      const csv = parse(students, opts);

      const fileName = `students_export_${new Date().toISOString().slice(0,10).replace(/-/g,"")}.csv`;
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename=\"${fileName}\"`);
      res.status(200).send(csv);
    } catch (err) {
      res.status(500).json({ error: err.message });
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

  getByUserId = async (req, res) => {
    try {
      const userId = Number(req.params["userId"]);
      
      if (isNaN(userId)) {
        return this.handleError(res, null, 400, "Invalid user ID");
      }

      const student = await this.service.getStudentByUserId(userId);
      
      if (!student) {
        return this.handleError(res, null, 404, "Student not found for this user");
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

  updateProfileByUserId = async (req, res) => {
    try {
      const userId = Number(req.params["userId"]);
      const updateData = req.body;

      if (isNaN(userId)) {
        return this.handleError(res, null, 400, "Invalid user ID");
      }

      await this.service.updateStudentProfileByUserId(userId, updateData);
      res.json({ message: "Student profile updated successfully" });
    } catch (error) {
      this.handleError(res, error);
    }
  };
}