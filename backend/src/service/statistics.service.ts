import { AppDataSource } from "../data-source";
import { InternshipHour } from "../entity/InternshipHour";

export class StatisticsService {
  private hourRepo = AppDataSource.getRepository(InternshipHour);

  async getHoursPerMonth(userId: number) {
    const hours = await this.hourRepo.find({ 
      where: { 
        status: "approved",
        internship: { student: { user: { id: userId } } }
      },
      relations: ["internship", "internship.student", "internship.student.user"]
    });
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

  async getHourStatusDistribution(userId: number) {
    const statuses = ["approved", "pending", "rejected"] as const;
    const data = [];
    for (const status of statuses) {
      const hours = await this.hourRepo.find({ 
        where: { 
          status: status as "approved" | "pending" | "rejected",
          internship: { student: { user: { id: userId } } }
        },
        relations: ["internship", "internship.student", "internship.student.user"]
      });
      const totalHours = hours.reduce((sum, hour) => sum + this.getHourDuration(hour), 0);
      data.push(Math.round(totalHours * 100) / 100);
    }
    return { labels: Array.from(statuses), data };
  }

  async getCumulativeHours(userId: number) {
    const hours = await this.hourRepo.find({ 
      where: { 
        status: "approved",
        internship: { student: { user: { id: userId } } }
      },
      relations: ["internship", "internship.student", "internship.student.user"],
      order: { date: "ASC" } 
    });
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
      weekData.push(Math.round(cumulative * 100) / 100);
      current.setDate(current.getDate() + 7);
      weekIndex++;
    }
    return { labels: weekLabels, data: weekData };
  }

  // Mentor statisztikák - összes mentorált diák órái havonta
  async getMentorHoursPerMonth(mentorUserId: number) {
    const hours = await this.hourRepo.find({ 
      where: { 
        status: "approved",
        internship: { mentor: { user: { id: mentorUserId } } }
      },
      relations: ["internship", "internship.mentor", "internship.mentor.user"]
    });
    
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

  // Mentor diákjainak státusz eloszlása
  async getMentorHourStatusDistribution(mentorUserId: number) {
    const statuses = ["approved", "pending", "rejected"] as const;
    const data = [];
    
    for (const status of statuses) {
      const hours = await this.hourRepo.find({ 
        where: { 
          status: status as "approved" | "pending" | "rejected",
          internship: { mentor: { user: { id: mentorUserId } } }
        },
        relations: ["internship", "internship.mentor", "internship.mentor.user"]
      });
      const totalHours = hours.reduce((sum, hour) => sum + this.getHourDuration(hour), 0);
      data.push(Math.round(totalHours * 100) / 100);
    }
    
    return { labels: Array.from(statuses), data };
  }

  // Mentor diákjainak kumulált órái
  async getMentorCumulativeHours(mentorUserId: number) {
    const hours = await this.hourRepo.find({ 
      where: { 
        status: "approved",
        internship: { mentor: { user: { id: mentorUserId } } }
      },
      relations: ["internship", "internship.mentor", "internship.mentor.user"],
      order: { date: "ASC" } 
    });
    
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
      weekData.push(Math.round(cumulative * 100) / 100);
      
      current.setDate(current.getDate() + 7);
      weekIndex++;
    }
    
    return { labels: weekLabels, data: weekData };
  }

  // Hallgató előrehaladás statisztikája
  async getProgressStatistics(userId: number) {
    const hours = await this.hourRepo.find({ 
      where: { 
        status: "approved",
        internship: { student: { user: { id: userId } } }
      },
      relations: ["internship", "internship.student", "internship.student.user"]
    });
    
    if (hours.length === 0) {
      return {
        completedHours: 0,
        requiredHours: 180, // Default 180 óra
        requiredWeeks: 0,
        progressPercentage: 0,
        remainingHours: 180,
        weeksCompleted: 0
      };
    }

    const internship = hours[0].internship;
    const requiredWeeks = internship.requiredWeeks || 0;
    
    const requiredHours = requiredWeeks > 0 ? requiredWeeks * 40 : 180;
    
    const completedHours = hours.reduce((sum, hour) => sum + this.getHourDuration(hour), 0);
    const weeksCompleted = Math.floor(completedHours / 40);
    const progressPercentage = requiredHours > 0 ? Math.round((completedHours / requiredHours) * 100) : 0;
    const remainingHours = Math.max(0, requiredHours - completedHours);

    return {
      completedHours: Math.round(completedHours * 100) / 100,
      requiredHours,
      requiredWeeks,
      progressPercentage,
      remainingHours: Math.round(remainingHours * 100) / 100,
      weeksCompleted
    };
  }

  // Dashboard kördiagram adatok
  async getDashboardProgress(userId: number) {
    const progressData = await this.getProgressStatistics(userId);
    
    return {
      labels: ["Teljesített órák", "Hátralévő órák"],
      data: [progressData.completedHours, progressData.remainingHours],
      total: progressData.requiredHours,
      percentage: progressData.progressPercentage,
      completed: progressData.completedHours,
      remaining: progressData.remainingHours
    };
  }

  private getHourDuration(hour: InternshipHour): number {
    const start = new Date(`2000-01-01T${hour.startTime}`);
    const end = new Date(`2000-01-01T${hour.endTime}`);
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }
}
