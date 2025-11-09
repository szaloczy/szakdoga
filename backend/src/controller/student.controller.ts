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

  exportInternshipSummary = async (req, res) => {
    try {
      const user = (req as any).user;
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const summary = await this.service.getInternshipSummaryForExport(user.id);

      const data = [
        { field: "Hallgató neve", value: summary.studentName },
        { field: "Email", value: summary.studentEmail },
        { field: "Neptun kód", value: summary.neptun },
        { field: "Szak", value: summary.major },
        { field: "Egyetem", value: summary.university },
        { field: "", value: "" },
        { field: "Cég neve", value: summary.companyName },
        { field: "Mentor neve", value: summary.mentorName },
        { field: "Mentor email", value: summary.mentorEmail },
        { field: "", value: "" },
        { field: "Kezdési dátum", value: summary.startDate },
        { field: "Befejezési dátum", value: summary.endDate },
        { field: "Szükséges hetek", value: summary.requiredWeeks?.toString() ?? "N/A" },
        { field: "Szükséges órák", value: summary.requiredHours?.toString() ?? "N/A" },
        { field: "Teljesített órák", value: summary.completedHours.toString() },
        { field: "", value: "" },
        { field: "Jegy", value: summary.grade?.toString() ?? "N/A" },
        { field: "Véglegesítés dátuma", value: summary.finalizedAt ? new Date(summary.finalizedAt).toISOString().split("T")[0] : "N/A" },
        { field: "Státusz", value: summary.status }
      ];

      const fields = [
        { label: "Mező", value: "field" },
        { label: "Érték", value: "value" }
      ];
      const opts = { fields, delimiter: "," };
      const csv = parse(data, opts);

      const csvWithBOM = '\uFEFF' + csv;

      const fileName = `szakmai_gyakorlat_osszefoglalo_${new Date().toISOString().slice(0,10).replace(/-/g,"")}.csv`;
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

      // Internship adatok feldolgozása ha létezik
      let internshipData = null;
      if (student.internship) {
        const requiredHours = student.internship.requiredWeeks 
          ? student.internship.requiredWeeks * 40 
          : null;
        
        let approvedHours = 0;
        if (student.internship.hours) {
          for (const hour of student.internship.hours) {
            if (hour.status === 'approved') {
              const start = new Date(`2000-01-01T${hour.startTime}`);
              const end = new Date(`2000-01-01T${hour.endTime}`);
              const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
              approvedHours += diff;
            }
          }
        }

        internshipData = {
          id: student.internship.id,
          status: student.internship.status,
          requiredWeeks: student.internship.requiredWeeks,
          requiredHours: requiredHours,
          approvedHours: Math.round(approvedHours * 100) / 100,
          grade: student.internship.grade ?? null,
          finalizedAt: student.internship.finalizedAt 
            ? new Date(student.internship.finalizedAt).toISOString().split("T")[0] 
            : null,
          mentor: student.internship.mentor ? {
            id: student.internship.mentor.id,
            name: `${student.internship.mentor.user.firstname} ${student.internship.mentor.user.lastname}`,
            email: student.internship.mentor.user.email
          } : null,
          company: student.internship.company ? {
            id: student.internship.company.id,
            name: student.internship.company.name
          } : null
        };
      }

      const response = {
        id: student.id,
        phone: student.phone,
        neptun: student.neptun,
        major: student.major,
        university: student.university,
        user: {
          id: student.user.id,
          email: student.user.email,
          firstname: student.user.firstname,
          lastname: student.user.lastname,
          role: student.user.role,
          active: student.user.active,
        },
        internship: internshipData
      };

      res.json(response);
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