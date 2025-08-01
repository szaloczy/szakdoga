import { MentorService } from "../service/mentor.service";
import { createMentorDTO, GetProfileResponseDTO } from "../types";
import { Controller } from "./base.controller";

export class MentorController extends Controller {
  private service = new MentorService();

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

      console.log(`Getting students for mentor with userId: ${userId}`);
      const studentsWithHours = await this.service.getStudentsWithHoursByMentor(userId);
      res.json(studentsWithHours);
    } catch (error) {
      console.log(`Error in getStudents: ${error.message}`);
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
}