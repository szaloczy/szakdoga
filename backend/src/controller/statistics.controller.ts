import { Request, Response } from "express";
import { StatisticsService } from "../service/statistics.service";

export class StatisticsController {
  private statisticsService = new StatisticsService();

  async getHoursPerMonth(req: Request, res: Response) {
    try {
      const result = await this.statisticsService.getHoursPerMonth();
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch hours per month" });
    }
  }

  async getHourStatusDistribution(req: Request, res: Response) {
    try {
      const result = await this.statisticsService.getHourStatusDistribution();
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch hour status distribution" });
    }
  }

  async getCumulativeHours(req: Request, res: Response) {
    try {
      const result = await this.statisticsService.getCumulativeHours();
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch cumulative hours" });
    }
  }
}
