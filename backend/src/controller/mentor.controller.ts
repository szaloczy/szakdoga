import { MentorService } from "../service/mentor.service";
import { InternshipService } from "../service/internship.service";
import { createMentorDTO, GetProfileResponseDTO } from "../types";
import { Controller } from "./base.controller";
import { parse } from "json2csv";
import { mapInternshipToDTO } from "../utils/mappers/internship.mapper";

export class MentorController extends Controller {
  private service = new MentorService();
  private internshipService = new InternshipService();

  getAll = async (req, res) => {
    try {
      const mentors = await this.service.getAllActiveMentors();
      res.json(mentors);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  getById = async (req, res) => {
    try {
      const mentorId = Number(req.params["id"]);

      if (isNaN(mentorId)) {
        return this.handleError(res, null, 400, "Invalid mentor ID");
      }

      const mentor = await this.service.getMentorById(mentorId);

      if (!mentor) {
        return this.handleError(res, null, 404, "Mentor not found");
      }

      const response: GetProfileResponseDTO = {
        id: mentor.user.id,
        email: mentor.user.email,
        firstname: mentor.user.firstname,
        lastname: mentor.user.lastname,
        role: mentor.user.role,
        active: mentor.user.active,
        mentor: {
          id: mentor.id,
          position: mentor.position,
          company: mentor.company
        }
      };

      res.json(response);
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

      const mentor = await this.service.getMentorByUserId(userId);

      if (!mentor) {
        return this.handleError(res, null, 404, "Mentor not found for this user");
      }

      const response: GetProfileResponseDTO = {
        id: mentor.user.id,
        email: mentor.user.email,
        firstname: mentor.user.firstname,
        lastname: mentor.user.lastname,
        role: mentor.user.role,
        active: mentor.user.active,
        mentor: {
          id: mentor.id,
          position: mentor.position,
          company: mentor.company
        }
      };

      res.json(response);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  create = async (req, res) => {
    try {
      const mentorData: createMentorDTO = req.body;

      if (!mentorData.firstname || !mentorData.lastname || !mentorData.email || 
          !mentorData.position || !mentorData.password || !mentorData.companyId) {
        return this.handleError(res, null, 400, "Missing required fields");
      }

      const newMentor = await this.service.createMentor(mentorData);
      res.status(201).json(newMentor);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  updateProfile = async (req, res) => {
    try {
      const mentorId = Number(req.params["id"]);
      const updateData = req.body;

      if (isNaN(mentorId)) {
        return this.handleError(res, null, 400, "Invalid mentor ID");
      }

      await this.service.updateMentorProfile(mentorId, updateData);
      res.json({ message: "Mentor profile updated successfully" });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  getStudents = async (req, res) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return this.handleError(res, null, 401, "User not authenticated");
      }

      const studentsWithHours = await this.service.getStudentsWithHoursByMentor(userId);
      res.json(studentsWithHours);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  getByCompany = async (req, res) => {
    try {
      const companyId = Number(req.params["companyId"]);

      if (isNaN(companyId)) {
        return this.handleError(res, null, 400, "Invalid company ID");
      }

      const mentors = await this.service.getMentorsByCompany(companyId);
      res.json(mentors);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  searchMentors = async (req, res) => {
    try {
      const { name, position, company } = req.query;
      
      const mentors = await this.service.searchMentors({
        name: name as string,
        position: position as string,
        company: company as string,
      });

      res.json(mentors);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  deactivate = async (req, res) => {
    try {
      const mentorId = Number(req.params["id"]);

      if (isNaN(mentorId)) {
        return this.handleError(res, null, 400, "Invalid mentor ID");
      }

      await this.service.deactivateMentor(mentorId);
      res.json({ message: "Mentor deactivated successfully" });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  exportAllStudentsHours = async (req, res) => {
    try {
      const user = (req as any).user;
      
      if (!user?.id) {
        return this.handleError(res, null, 401, "User not authenticated");
      }

      const studentsWithHours = await this.service.getAllStudentsHoursForExport(user.id);

      if (!studentsWithHours || studentsWithHours.length === 0) {
        return res.status(404).json({ error: "No students or hours found" });
      }

      const fields = [
        { label: "Hallgató neve", value: row => `${row.firstname} ${row.lastname}` },
        { label: "Email", value: "email" },
        { label: "Egyetem", value: "university" },
        { label: "Szak", value: "major" },
        { label: "Dátum", value: "date" },
        { label: "Kezdés", value: "startTime" },
        { label: "Végzés", value: "endTime" },
        { label: "Leírás", value: "description" },
        { label: "Órák száma", value: "duration" }
      ];
      const opts = { fields, delimiter: "," };
      const csv = parse(studentsWithHours, opts);
      
      const csvWithBOM = '\uFEFF' + csv;

      const fileName = `osszes_hallgato_orai_${new Date().toISOString().slice(0,10).replace(/-/g,"")}.csv`;
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
      res.status(200).send(csvWithBOM);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  exportStudentHours = async (req, res) => {
    try {
      const user = (req as any).user;
      const studentId = Number(req.params["studentId"]);
      
      if (!user?.id) {
        return this.handleError(res, null, 401, "User not authenticated");
      }

      if (isNaN(studentId)) {
        return this.handleError(res, null, 400, "Invalid student ID");
      }

      const studentHours = await this.service.getStudentHoursForExport(user.id, studentId);

      if (!studentHours || studentHours.length === 0) {
        return res.status(404).json({ error: "No hours found for this student" });
      }

      const fields = [
        { label: "Hallgató neve", value: row => `${row.firstname} ${row.lastname}` },
        { label: "Email", value: "email" },
        { label: "Egyetem", value: "university" },
        { label: "Szak", value: "major" },
        { label: "Dátum", value: "date" },
        { label: "Kezdés", value: "startTime" },
        { label: "Végzés", value: "endTime" },
        { label: "Leírás", value: "description" },
        { label: "Órák száma", value: "duration" }
      ];
      const opts = { fields, delimiter: "," };
      const csv = parse(studentHours, opts);
      
      const csvWithBOM = '\uFEFF' + csv;

      const studentName = studentHours[0] ? `${studentHours[0].firstname}_${studentHours[0].lastname}` : "hallgato";
      const fileName = `${studentName}_orai_${new Date().toISOString().slice(0,10).replace(/-/g,"")}.csv`;
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
      res.status(200).send(csvWithBOM);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  finalizeStudentInternship = async (req, res) => {
    try {
      const mentorUserId = (req as any).user?.id;
      const studentId = Number(req.params["studentId"]);
      const { grade } = req.body;

      if (!mentorUserId) {
        return this.handleError(res, null, 401, "User not authenticated");
      }

      if (isNaN(studentId)) {
        return this.handleError(res, null, 400, "Invalid student ID");
      }

      if (!grade || grade < 1 || grade > 5) {
        return this.handleError(res, null, 400, "Grade must be between 1 and 5");
      }

      const result = await this.internshipService.finalizeInternshipByStudent(
        studentId,
        mentorUserId,
        grade
      );

      res.json({
        message: "Internship finalized successfully",
        internship: mapInternshipToDTO(result)
      });
    } catch (error) {
      this.handleError(res, error);
    }
  };
}