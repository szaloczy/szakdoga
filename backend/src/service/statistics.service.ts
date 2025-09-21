import { AppDataSource } from "../data-source";
import { InternshipHour } from "../entity/InternshipHour";

export class StatisticsService {
  private hourRepo = AppDataSource.getRepository(InternshipHour);

  async getHoursPerMonth() {
    const hours = await this.hourRepo.find({ where: { status: "approved" } });
    const monthMap: Record<string, number> = {};
    for (const hour of hours) {
      const date = new Date(hour.date);
      const month = date.toLocaleString("en-US", { month: "short" });
      monthMap[month] = (monthMap[month] || 0) + this.getHourDuration(hour);
    }
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = labels.map(label => monthMap[label] || 0);
    return { labels, data };
  }

  async getHourStatusDistribution() {
    const statuses = ["approved", "pending", "rejected"] as const;
    const data = [];
    for (const status of statuses) {
      const count = await this.hourRepo.count({ where: { status: status as "approved" | "pending" | "rejected" } });
      data.push(count);
    }
    return { labels: Array.from(statuses), data };
  }

  async getCumulativeHours() {
    const hours = await this.hourRepo.find({ where: { status: "approved" }, order: { date: "ASC" } });
    if (hours.length === 0) return { labels: [], data: [] };
    const minDate = new Date(hours[0].date);
    const maxDate = new Date(hours[hours.length - 1].date);
    const weekLabels: string[] = [];
    const weekData: number[] = [];
    let current = new Date(minDate);
    let weekIndex = 1;
    let cumulative = 0;
    while (current <= maxDate) {
      const weekStart = new Date(current);
      const weekEnd = new Date(current);
      weekEnd.setDate(weekEnd.getDate() + 6);
      const weekHours = hours.filter(h => {
        const d = new Date(h.date);
        return d >= weekStart && d <= weekEnd;
      });
      let weekSum = 0;
      for (const h of weekHours) weekSum += this.getHourDuration(h);
      cumulative += weekSum;
      weekLabels.push(`Week ${weekIndex}`);
      weekData.push(cumulative);
      current.setDate(current.getDate() + 7);
      weekIndex++;
    }
    return { labels: weekLabels, data: weekData };
  }

  private getHourDuration(hour: InternshipHour): number {
    const start = new Date(`2000-01-01T${hour.startTime}`);
    const end = new Date(`2000-01-01T${hour.endTime}`);
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }
}
