import { Request, Response } from "express";
import { StatisticsService } from "../service/statistics.service";

export class StatisticsController {
  private statisticsService = new StatisticsService();

  async getHoursPerMonth(req: Request, res: Response) {
    try {
      const userId = req.user?.id; // Assumes auth middleware sets req.user
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const result = await this.statisticsService.getHoursPerMonth(userId);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch hours per month" });
    }
  }

  async getHourStatusDistribution(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const result = await this.statisticsService.getHourStatusDistribution(userId);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch hour status distribution" });
    }
  }

  async getCumulativeHours(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const result = await this.statisticsService.getCumulativeHours(userId);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch cumulative hours" });
    }
  }

  // Mentor statisztikák
  async getMentorHoursPerMonth(req: Request, res: Response) {
    try {
      const mentorUserId = req.user?.id;
      if (!mentorUserId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const result = await this.statisticsService.getMentorHoursPerMonth(mentorUserId);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch mentor hours per month" });
    }
  }

  async getMentorHourStatusDistribution(req: Request, res: Response) {
    try {
      const mentorUserId = req.user?.id;
      if (!mentorUserId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const result = await this.statisticsService.getMentorHourStatusDistribution(mentorUserId);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch mentor hour status distribution" });
    }
  }

  async getMentorCumulativeHours(req: Request, res: Response) {
    try {
      const mentorUserId = req.user?.id;
      if (!mentorUserId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const result = await this.statisticsService.getMentorCumulativeHours(mentorUserId);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch mentor cumulative hours" });
    }
  }

  // Hallgató előrehaladás statisztikája
  async getProgressStatistics(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const result = await this.statisticsService.getProgressStatistics(userId);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch progress statistics" });
    }
  }

  // Dashboard kördiagram adatok
  async getDashboardProgress(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const result = await this.statisticsService.getDashboardProgress(userId);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch dashboard progress" });
    }
  }
}
