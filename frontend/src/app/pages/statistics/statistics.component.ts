import { Component } from "@angular/core";
import Chart from 'chart.js/auto';
import { I18nService } from '../../shared/i18n.pipe';

@Component({
  selector: 'app-statistics',
  imports: [I18nService],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent {
  chart: any = [];
  chartBar: any;
  chartPie: any;
  chartLine: any;

  ngOnInit() {
    // Bar chart: Hours per month
    this.chartBar = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Internship hours per month',
            data: [12, 19, 15, 8, 22, 17],
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

    // Pie chart: Approved vs Pending vs Rejected
    this.chartPie = new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: ['Approved', 'Pending', 'Rejected'],
        datasets: [
          {
            label: 'Hour status',
            data: [60, 25, 15],
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
        plugins: { legend: { position: 'bottom' } },
      },
    });

    // Line chart: Cumulative hours
    this.chartLine = new Chart('lineChart', {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
        datasets: [
          {
            label: 'Cumulative hours',
            data: [5, 12, 20, 28, 35, 42],
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
  }
}
