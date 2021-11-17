import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BinaryLineChartComponent } from './components/binary-line-chart/binary-line-chart.component';

@NgModule({
  declarations: [AppComponent, BinaryLineChartComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
