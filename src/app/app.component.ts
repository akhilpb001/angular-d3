import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  chartWidth = 800;
  chartHeight = 260;
  chartData = [];

  ngOnInit() {
    this.generateChartData();

    // setInterval(() => {
    //   this.generateChartData();
    // }, 5000);
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
}
