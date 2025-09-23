import { Component, inject, OnInit, OnDestroy } from "@angular/core";
import Chart from 'chart.js/auto';
import { I18nService } from '../../shared/i18n.pipe';
import { StatisticsService } from "../../services/statistics.service";
import { Statistics } from "../../../types";

@Component({
  selector: 'app-statistics',
  imports: [I18nService],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent implements OnInit, OnDestroy {
  statisticsService = inject(StatisticsService);

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
    this.loadHourPerMonth();
    this.loadStatusDistribution();
    this.loadCumulativeHours();
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
      this.cumulativeLabels = res.labels;
      this.cumulativeData = res.data;

      // Destroy existing chart if it exists
      if (this.chartLine) {
        this.chartLine.destroy();
      }

      // Create the line chart after data is loaded
      this.chartLine = new Chart('lineChart', {
        type: 'line',
        data: {
          labels: this.cumulativeLabels,
          datasets: [
            {
              label: 'Cumulative hours',
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
      this.chartLabels = res.labels;
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
              label: 'Hour status',
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
          aspectRatio: 2, // Ez teszi szélesebbé, mint amilyen magas
          plugins: { legend: { position: 'bottom' } },
        },
      });
    });
  }
  
  loadHourPerMonth() {
    this.statisticsService.getHoursPerMonth().subscribe((res: Statistics) => {
      this.Barlabels = res.labels;
      this.Bardata = res.data;
      
      // Destroy existing chart if it exists
      if (this.chartBar) {
        this.chartBar.destroy();
      }
      
      // Create the bar chart after data is loaded
      this.chartBar = new Chart('barChart', {
        type: 'bar',
        data: {
          labels: this.Barlabels,
          datasets: [
            {
              label: 'Internship hours per month',
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
}
