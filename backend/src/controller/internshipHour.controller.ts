import { Controller } from "./base.controller";
import { InternshipHourService } from "../service/internshipHour.service";

export class InternshipHourController extends Controller {
  private service = new InternshipHourService();

  // Összes óra lekérdezése (admin/mentor számára)
  getAll = async (req, res) => {
    try {
      const status = req.query.status as string;
      const hours = await this.service.getAllHours(status);
      res.json(hours);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  // Egy óra lekérdezése ID alapján
  getOne = async (req, res) => {
    try {
      const hourId = Number(req.params["id"]);
      
      if (isNaN(hourId)) {
        return this.handleError(res, null, 400, "Invalid hour ID");
      }

      const hour = await this.service.getHourById(hourId);
      
      if (!hour) {
        return this.handleError(res, null, 404, "Hour entry not found");
      }

      res.json(hour);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  // Saját órák lekérdezése (hallgató számára)
  getMyHours = async (req, res) => {
    try {
      const user = (req as any).user;
      const status = req.query.status as string;

      if (!user?.id) {
        return this.handleError(res, null, 401, "User not authenticated");
      }

      const hours = await this.service.getHoursForStudent(user.id, status);
      res.json(hours);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  // Mentor órái (mentor számára)
  getMentorHours = async (req, res) => {
    try {
      const user = (req as any).user;
      const status = req.query.status as string;

      if (!user?.id) {
        return this.handleError(res, null, 401, "User not authenticated");
      }

      const hours = await this.service.getHoursForMentor(user.id, status);
      res.json(hours);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  // Új óra létrehozása
  create = async (req, res) => {
    try {
      const user = (req as any).user;
      const data = req.body;

      if (!user?.id) {
        return this.handleError(res, null, 401, "User not authenticated");
      }

      // Validáció
      if (!data.date || !data.startTime || !data.endTime || !data.description) {
        return this.handleError(res, null, 400, "All fields are required");
      }

      const hour = await this.service.createHourForStudent(user.id, data);
      res.status(201).json(hour);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  // Óra módosítása
  update = async (req, res) => {
    try {
      const user = (req as any).user;
      const hourId = Number(req.params["id"]);
      const data = req.body;

      if (!user?.id) {
        return this.handleError(res, null, 401, "User not authenticated");
      }

      if (isNaN(hourId)) {
        return this.handleError(res, null, 400, "Invalid hour ID");
      }

      const updatedHour = await this.service.updateHour(hourId, user.id, data);
      res.json(updatedHour);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  // Óra törlése
  delete = async (req, res) => {
    try {
      const user = (req as any).user;
      const hourId = Number(req.params["id"]);

      if (!user?.id) {
        return this.handleError(res, null, 401, "User not authenticated");
      }

      if (isNaN(hourId)) {
        return this.handleError(res, null, 400, "Invalid hour ID");
      }

      await this.service.deleteHour(hourId, user.id);
      res.json({ message: "Hour entry deleted successfully" });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  // Óra jóváhagyása (mentor számára)
  approve = async (req, res) => {
    try {
      const user = (req as any).user;
      const hourId = Number(req.params["id"]);

      if (!user?.id) {
        return this.handleError(res, null, 401, "User not authenticated");
      }

      if (isNaN(hourId)) {
        return this.handleError(res, null, 400, "Invalid hour ID");
      }

      const approvedHour = await this.service.approveHour(hourId, user.id);
      res.json(approvedHour);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  // Óra elutasítása (mentor számára)
  reject = async (req, res) => {
    try {
      const user = (req as any).user;
      const hourId = Number(req.params["id"]);
      const { reason } = req.body;

      if (!user?.id) {
        return this.handleError(res, null, 401, "User not authenticated");
      }

      if (isNaN(hourId)) {
        return this.handleError(res, null, 400, "Invalid hour ID");
      }

      const rejectedHour = await this.service.rejectHour(hourId, user.id, reason);
      res.json(rejectedHour);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  // Hallgató összes órája
  getTotalHours = async (req, res) => {
    try {
      const user = (req as any).user;

      if (!user?.id) {
        return this.handleError(res, null, 401, "User not authenticated");
      }

      const totalHours = await this.service.getTotalHoursForStudent(user.id);
      res.json({ totalHours });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  // Deprecated metódus - használd getMyHours-t helyette
  getById = async (req, res) => {
    console.warn("getById method is deprecated, use getMyHours instead");
    return this.getMyHours(req, res);
  };
}