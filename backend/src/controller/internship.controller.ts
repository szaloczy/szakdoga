import { AppDataSource } from "../data-source";
import { Internship } from "../entity/Internship";
import { InternshipService } from "../service/internship.service";
import {
  mapInternshipToDTO,
  mapProfileInternshipToDTO,
} from "../utils/mappers/internship.mapper";
import { Controller } from "./base.controller";

export class InternshipController extends Controller {
  private service = new InternshipService();

  getAll = async (req, res) => {
    try {
      const { isApproved, studentId, mentorId, companyId } = req.query;
      
      const filters: any = {};
      if (isApproved !== undefined) filters.isApproved = isApproved === 'true';
      if (studentId) filters.studentId = Number(studentId);
      if (mentorId) filters.mentorId = Number(mentorId);
      if (companyId) filters.companyId = Number(companyId);

      const internships = await this.service.getAllInternships(filters);
      const result = internships.map(mapInternshipToDTO);
      res.json(result);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  getOne = async (req, res) => {
    try {
      const internshipId = Number(req.params["id"]);

      if (isNaN(internshipId)) {
        return this.handleError(res, null, 400, "Invalid internship ID");
      }

      const internship = await this.service.getInternshipById(internshipId);

      if (!internship) {
        return this.handleError(res, null, 404, "Internship not found");
      }

      const result = mapInternshipToDTO(internship);
      res.json(result);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  getByUserId = async (req, res) => {
    try {
      const userId = Number(req.params["id"]);

      if (isNaN(userId)) {
        return this.handleError(res, null, 400, "Invalid user ID");
      }

      const internship = await this.service.getInternshipByUserId(userId);

      if (!internship) {
        return this.handleError(res, null, 404, "No internship found for user");
      }

      const result = mapProfileInternshipToDTO(internship);
      res.json(result);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  // Saját gyakornokság lekérdezése (authentikált felhasználó számára)
  getMyInternship = async (req, res) => {
    try {
      const user = (req as any).user;

      if (!user?.id) {
        return this.handleError(res, null, 401, "User not authenticated");
      }

      const internship = await this.service.getInternshipByUserId(user.id);

      if (!internship) {
        return this.handleError(res, null, 404, "No internship found");
      }

      const result = mapProfileInternshipToDTO(internship);
      res.json(result);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  create = async (req, res) => {
    try {
      const user = (req as any).user;
      const { startDate, endDate, mentor, company, student, mentorId, companyId, studentId, isApproved } = req.body;

      if (!user?.id) {
        return this.handleError(res, null, 401, "User not authenticated");
      }

      // Rugalmas mezőnév kezelés - frontend `mentor`, `company` és `student` mezőket küld
      const finalMentorId = mentorId || mentor;
      const finalCompanyId = companyId || company;
      const finalStudentId = studentId || student;

      // Validáció
      if (!startDate || !endDate || !finalMentorId || !finalCompanyId) {
        return this.handleError(res, null, 400, "startDate, endDate, mentor and company are required");
      }

      const internship = await this.service.createInternshipForStudent(user.id, {
        startDate,
        endDate,
        mentorId: Number(finalMentorId),
        companyId: Number(finalCompanyId),
        studentId: finalStudentId ? Number(finalStudentId) : undefined,
        isApproved: isApproved !== undefined ? Boolean(isApproved) : false,
      });

      // Teljes adatok visszaadása
      const fullInternship = await this.service.getInternshipById(internship.id);
      const result = mapInternshipToDTO(fullInternship);
      res.status(201).json(result);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  update = async (req, res) => {
    try {
      const user = (req as any).user;
      const internshipId = Number(req.params["id"]);
      const { startDate, endDate, mentor, company, mentorId, companyId, isApproved } = req.body;

      if (!user?.id) {
        return this.handleError(res, null, 401, "User not authenticated");
      }

      if (isNaN(internshipId)) {
        return this.handleError(res, null, 400, "Invalid internship ID");
      }

      // Rugalmas mezőnév kezelés
      const finalMentorId = mentorId || mentor;
      const finalCompanyId = companyId || company;

      // Admin státusz ellenőrzése
      const isAdmin = user.role === "admin";

      const updatedInternship = await this.service.updateInternship(
        internshipId,
        user.id,
        { 
          startDate, 
          endDate, 
          mentorId: finalMentorId ? Number(finalMentorId) : undefined,
          companyId: finalCompanyId ? Number(finalCompanyId) : undefined,
          isApproved: isApproved !== undefined ? Boolean(isApproved) : undefined,
        },
        isAdmin
      );

      const result = mapInternshipToDTO(updatedInternship);
      res.json(result);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  delete = async (req, res) => {
    try {
      const user = (req as any).user;
      const internshipId = Number(req.params["id"]);

      if (!user?.id) {
        return this.handleError(res, null, 401, "User not authenticated");
      }

      if (isNaN(internshipId)) {
        return this.handleError(res, null, 400, "Invalid internship ID");
      }

      // Admin státusz ellenőrzése
      const isAdmin = user.role === "admin";

      await this.service.deleteInternship(internshipId, user.id, isAdmin);
      res.json({ message: "Internship deleted successfully" });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  approve = async (req, res) => {
    try {
      const user = (req as any).user;
      const internshipId = Number(req.params["id"]);

      if (!user?.id) {
        return this.handleError(res, null, 401, "User not authenticated");
      }

      if (user.role !== "admin" && user.role !== "mentor") {
        return this.handleError(res, null, 403, "Only admins and mentors can approve internships");
      }

      if (isNaN(internshipId)) {
        return this.handleError(res, null, 400, "Invalid internship ID");
      }

      // Admin mindent jóváhagyhat, mentor csak a sajátját
      if (user.role === "admin") {
        const internship = await this.service.getInternshipById(internshipId);
        if (!internship) {
          return this.handleError(res, null, 404, "Internship not found");
        }
        // Admin esetén közvetlenül frissítjük a service-en keresztül
        await this.service.approveInternship(internshipId, internship.mentor.user.id);
      } else {
        await this.service.approveInternship(internshipId, user.id);
      }

      res.json({ message: "Internship approved successfully" });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  reject = async (req, res) => {
    try {
      const user = (req as any).user;
      const internshipId = Number(req.params["id"]);

      if (!user?.id) {
        return this.handleError(res, null, 401, "User not authenticated");
      }

      if (user.role !== "admin" && user.role !== "mentor") {
        return this.handleError(res, null, 403, "Only admins and mentors can reject internships");
      }

      if (isNaN(internshipId)) {
        return this.handleError(res, null, 400, "Invalid internship ID");
      }

      // Admin mindent elutasíthat, mentor csak a sajátját
      if (user.role === "admin") {
        const internship = await this.service.getInternshipById(internshipId);
        if (!internship) {
          return this.handleError(res, null, 404, "Internship not found");
        }
        // Admin esetén közvetlenül frissítjük a service-en keresztül
        await this.service.rejectInternship(internshipId, internship.mentor.user.id);
      } else {
        await this.service.rejectInternship(internshipId, user.id);
      }

      res.json({ message: "Internship rejected successfully" });
    } catch (error) {
      this.handleError(res, error);
    }
  };
}