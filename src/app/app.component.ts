import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  intervalTimer = null;
  chartData = [];
  chartOptions = {
    width: 800,
    height: 260,
  };

  ngOnInit() {
    this.generateChartData();
  }

  generateChartData(): void {
    let timeInMs = Date.now();
    const data: any[] = [];

    data.push({
      time: timeInMs,
      value: 1,
    });

    for (let index = 1; index < 30; index++) {
      timeInMs = timeInMs - 120000;
      data.unshift({
        time: timeInMs,
        value: Math.random() > 0.5 ? 1 : 0,
      });
    }

    this.chartData = data;
  }

  startAutoRefresh() {
    this.intervalTimer = setInterval(() => {
      this.generateChartData();
    }, 5000);
  }

  stopAutoRefresh() {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
      this.intervalTimer = null;
    }
  }
}
