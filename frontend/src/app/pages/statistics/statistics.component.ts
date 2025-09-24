import { Component, inject, OnInit, OnDestroy } from "@angular/core";
import Chart from 'chart.js/auto';
import { I18nService } from '../../shared/i18n.pipe';
import { StatisticsService } from "../../services/statistics.service";
import { Statistics } from "../../../types";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-statistics',
  imports: [I18nService],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent implements OnInit, OnDestroy {
  statisticsService = inject(StatisticsService);
  i18nService = inject(I18nService);
  authService = inject(AuthService);

  chart: any = [];
  chartBar: any;
  chartPie: any;
  chartLine: any;

  Barlabels: string[] = [];
  Bardata: number[] = [];

  chartLabels: string[] = [];
  chartData: number[] = [];

  cumulativeLabels: string[] = [];
  cumulativeData: number[] = [];

  ngOnInit() {
    if (this.authService.getRole() === 'mentor') {
      this.loadMentorStatistics();
    } else {
      this.loadStudentStatistics();
    }
  }

  private loadStudentStatistics() {
    this.loadHourPerMonth();
    this.loadStatusDistribution();
    this.loadCumulativeHours();
  }

  private loadMentorStatistics() {
    this.loadMentorHourPerMonth();
    this.loadMentorStatusDistribution();
    this.loadMentorCumulativeHours();
  }

  ngOnDestroy() {
    if (this.chartBar) {
      this.chartBar.destroy();
    }
    if (this.chartPie) {
      this.chartPie.destroy();
    }
    if (this.chartLine) {
      this.chartLine.destroy();
    }
  }  

  loadCumulativeHours() {
    this.statisticsService.getCumulativeHours().subscribe((res: Statistics) => {
      // Translate the labels from backend
      this.cumulativeLabels = res.labels.map(label => this.translateTimeLabel(label));
      this.cumulativeData = res.data;

      if (this.chartLine) {
        this.chartLine.destroy();
      }

      this.chartLine = new Chart('lineChart', {
        type: 'line',
        data: {
          labels: this.cumulativeLabels,
          datasets: [
            {
              label: this.i18nService.transform('statistics.charts.line.cumulative_hours'),
              data: this.cumulativeData,
              fill: false,
              borderColor: 'rgba(153, 102, 255, 1)',
              backgroundColor: 'rgba(153, 102, 255, 0.3)',
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: true } },
          scales: { y: { beginAtZero: true } },
        },
      });
    });
  }

  loadStatusDistribution() {
    this.statisticsService.getStatusDistribution().subscribe((res: Statistics) => {
      // Translate the labels from backend
      this.chartLabels = res.labels.map(label => this.translateStatusLabel(label));
      this.chartData = res.data;

      if (this.chartPie) {
        this.chartPie.destroy();
      }

      this.chartPie = new Chart('pieChart', {
        type: 'pie',
        data: {
          labels: this.chartLabels,
          datasets: [
            {
              label: this.i18nService.transform('statistics.pie.hour_status'),
              data: this.chartData,
              backgroundColor: [
                'rgba(75, 192, 192, 0.7)',
                'rgba(255, 205, 86, 0.7)',
                'rgba(255, 99, 132, 0.7)'
              ],
              borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 205, 86, 1)',
                'rgba(255, 99, 132, 1)'
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          aspectRatio: 2,
          plugins: { legend: { position: 'bottom' } },
        },
      });
    });
  }

  private translateStatusLabel(label: string): string {
    switch (label.toLowerCase()) {
      case 'approved':
        return this.i18nService.transform('dashboard.student.approved');
      case 'pending':
        return this.i18nService.transform('dashboard.student.pending');
      case 'rejected':
        return this.i18nService.transform('dashboard.student.rejected');
      default:
        return label; // fallback to original label if no translation found
    }
  }

  private translateTimeLabel(label: string): string {
    // Handle month translations based on current language
    const currentLang = this.i18nService.getLanguage();
    
    if (currentLang === 'hu') {
      // Hungarian month names
      const monthTranslations: { [key: string]: string } = {
        'jan': 'Jan',
        'feb': 'Feb', 
        'mar': 'Már',
        'apr': 'Ápr',
        'may': 'Máj',
        'jun': 'Jún',
        'jul': 'Júl',
        'aug': 'Aug',
        'sep': 'Sze',
        'oct': 'Okt',
        'nov': 'Nov',
        'dec': 'Dec',
        'january': 'Január',
        'february': 'Február',
        'march': 'Március',
        'april': 'Április',
        'june': 'Június',
        'july': 'Július',
        'august': 'Augusztus',
        'september': 'Szeptember',
        'october': 'Október',
        'november': 'November',
        'december': 'December'
      };

      if (label.toLowerCase().startsWith('week ')) {
        const weekNumber = label.substring(5);
        return `${weekNumber}. hét`;
      }

      const lowerLabel = label.toLowerCase();
      if (monthTranslations[lowerLabel]) {
        return monthTranslations[lowerLabel];
      }
    } else {
      const monthTranslations: { [key: string]: string } = {
        'jan': 'Jan',
        'feb': 'Feb', 
        'mar': 'Mar',
        'apr': 'Apr',
        'may': 'May',
        'jun': 'Jun',
        'jul': 'Jul',
        'aug': 'Aug',
        'sep': 'Sep',
        'oct': 'Oct',
        'nov': 'Nov',
        'dec': 'Dec'
      };

      const lowerLabel = label.toLowerCase();
      if (monthTranslations[lowerLabel]) {
        return monthTranslations[lowerLabel];
      }
    }

    return label;
  }
  
  loadHourPerMonth() {
    this.statisticsService.getHoursPerMonth().subscribe((res: Statistics) => {
      this.Barlabels = res.labels.map(label => this.translateTimeLabel(label));
      this.Bardata = res.data;
      
      if (this.chartBar) {
        this.chartBar.destroy();
      }
      
      this.chartBar = new Chart('barChart', {
        type: 'bar',
        data: {
          labels: this.Barlabels,
          datasets: [
            {
              label: this.i18nService.transform('statistics.candle.hours_per_month'),
              data: this.Bardata,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: true } },
          scales: { y: { beginAtZero: true } },
        },
      });
    });
  }

  // Mentor-specific methods
  loadMentorHourPerMonth() {
    this.statisticsService.getMentorHoursPerMonth().subscribe((res: Statistics) => {
      this.Barlabels = res.labels.map(label => this.translateTimeLabel(label));
      this.Bardata = res.data;
      
      if (this.chartBar) {
        this.chartBar.destroy();
      }
      
      this.chartBar = new Chart('barChart', {
        type: 'bar',
        data: {
          labels: this.Barlabels,
          datasets: [
            {
              label: this.i18nService.transform('statistics.candle.hours_per_month'),
              data: this.Bardata,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: true } },
          scales: { y: { beginAtZero: true } },
        },
      });
    });
  }

  loadMentorStatusDistribution() {
    this.statisticsService.getMentorStatusDistribution().subscribe((res: Statistics) => {
      this.chartLabels = res.labels.map(label => this.translateStatusLabel(label));
      this.chartData = res.data;

      if (this.chartPie) {
        this.chartPie.destroy();
      }

      this.chartPie = new Chart('pieChart', {
        type: 'pie',
        data: {
          labels: this.chartLabels,
          datasets: [
            {
              label: this.i18nService.transform('statistics.pie.hour_status'),
              data: this.chartData,
              backgroundColor: [
                'rgba(75, 192, 192, 0.7)',
                'rgba(255, 205, 86, 0.7)',
                'rgba(255, 99, 132, 0.7)'
              ],
              borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 205, 86, 1)',
                'rgba(255, 99, 132, 1)'
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          aspectRatio: 2,
          plugins: { legend: { position: 'bottom' } },
        },
      });
    });
  }

  loadMentorCumulativeHours() {
    this.statisticsService.getMentorCumulativeHours().subscribe((res: Statistics) => {
      this.cumulativeLabels = res.labels.map(label => this.translateTimeLabel(label));
      this.cumulativeData = res.data;

      if (this.chartLine) {
        this.chartLine.destroy();
      }

      this.chartLine = new Chart('lineChart', {
        type: 'line',
        data: {
          labels: this.cumulativeLabels,
          datasets: [
            {
              label: this.i18nService.transform('statistics.charts.line.cumulative_hours'),
              data: this.cumulativeData,
              fill: false,
              borderColor: 'rgba(153, 102, 255, 1)',
              backgroundColor: 'rgba(153, 102, 255, 0.3)',
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: true } },
          scales: { y: { beginAtZero: true } },
        },
      });
    });
  }
}
