import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';

export interface ChartDataItem {
  time: number;
  value: 0 | 1;
}

export interface ChartOptions {
  title?: string;
  width?: number;
  height?: number;
  lineColor?: string;
  lineFillColor?: string;
  strokeWidth?: number;
  pointColor?: string;
  pointRadius?: number;
  tooltipBackgroundColor?: string;
  tooltipBorderColor?: string;
  tooltipBorderRadius?: number;
  tooltipTextColor?: string;
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

const DEFAULT_WIDTH = 500;
const DEFAULT_HEIGHT = 200;
const DEFAULT_MARGINS = { top: 30, right: 30, bottom: 100, left: 80 };

@Component({
  selector: 'app-binary-line-chart',
  templateUrl: './binary-line-chart.component.html',
  styleUrls: ['./binary-line-chart.component.css'],
})
export class BinaryLineChartComponent implements OnInit, AfterViewInit, OnChanges {
  chartContainerId = 'binary_line_chart';
  chartData: ChartDataItem[] = [];

  @Input() data: ChartDataItem[] = [];
  @Input() options: ChartOptions = {};

  constructor() {}

  ngOnInit() {
    this.chartContainerId = `binary_line_chart_${Date.now()}`;
  }

  ngAfterViewInit() {
    if (this.data) {
      this.renderChart(this.data);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data && changes.data.currentValue && changes.data.currentValue.length > 0) {
      this.chartData = changes.data.currentValue;
      this.renderChart(this.chartData);
    }
  }

  renderChart(chartData: ChartDataItem[]) {
    if (!this.chartContainerId) {
      return;
    }

    const width = this.options.width || DEFAULT_WIDTH;
    const height = this.options.height || DEFAULT_HEIGHT;
    const margins = this.options.margins || DEFAULT_MARGINS;

    const chartWidth = width - margins.left - margins.right;
    const chartHeight = height - margins.top - margins.bottom;

    const timeFormatter = d3.timeFormat('%d/%m/%y %I:%M %p');
    const statusFormatter = (d: number) => (d === 1 ? 'ON' : 'OFF');

    const xAccessor = (d: ChartDataItem) => d.time;
    const yAccessor = (d: ChartDataItem) => d.value;

    d3.select(`#${this.chartContainerId} > svg`).remove();

    const svg = d3
      .select(`#${this.chartContainerId}`)
      .append('svg')
      .attr('width', chartWidth + margins.left + margins.right)
      .attr('height', chartHeight + margins.top + margins.bottom)
      .append('g')
      .style('transform', `translate(${margins.left}px,${margins.top}px)`);

    const xScale = d3.scaleTime().domain(d3.extent(chartData, xAccessor)).range([0, chartWidth]);

    const yScale = d3.scaleLinear().domain(d3.extent(chartData, yAccessor)).range([chartHeight, 0]);

    const lineGenerator = d3
      .line<ChartDataItem>()
      .x((d: ChartDataItem) => xScale(xAccessor(d)))
      .y((d: ChartDataItem) => yScale(yAccessor(d)))
      .curve(d3.curveStepAfter);

    svg
      .append('path')
      .attr('class', 'line')
      .attr('d', lineGenerator(chartData))
      .attr('fill', `${this.options.lineFillColor || 'none'}`)
      .attr('stroke', `${this.options.lineColor || 'steelblue'}`)
      .attr('stroke-width', `${this.options.strokeWidth || 2}`);

    const xAxisGenerator = d3.axisBottom(xScale).tickFormat(timeFormatter);
    const yAxisGenerator = d3.axisLeft(yScale).ticks(1).tickFormat(statusFormatter);

    svg
      .append('g')
      .attr('class', 'x axis')
      .style('transform', `translateY(${chartHeight}px)`)
      .call(xAxisGenerator)
      .selectAll('.tick text')
      .attr('text-anchor', 'end')
      .attr('transform', 'translate(-12, 10) rotate(-45)');

    svg.append('g').attr('class', 'y axis').call(yAxisGenerator);

    d3.select('body div.binary-line-chart-tooltip').remove();

    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'binary-line-chart-tooltip')
      .style('width', '160px')
      .style('height', '40px')
      .style('padding', '4px')
      .style('box-sizing', 'border-box')
      .style('position', 'absolute')
      .style('left', '0px')
      .style('top', '0px')
      .style('display', 'none')
      .style('background-color', `${this.options.tooltipBackgroundColor || 'lightsteelblue'}`)
      .style('border', `1px solid ${this.options.tooltipBorderColor || 'steelblue'}`)
      .style('border-radius', `${this.options.tooltipBorderRadius || 2}px`)
      .style('color', `${this.options.tooltipTextColor || '#000'}`);

    svg
      .selectAll('circle')
      .data(chartData)
      .enter()
      .append('circle')
      .attr('cx', (d: ChartDataItem) => xScale(d.time))
      .attr('cy', (d: ChartDataItem) => yScale(d.value))
      .attr('r', `${this.options.pointRadius || 3.5}`)
      .attr('fill', `${this.options.pointColor || '#000'}`)
      .style('cursor', 'pointer')
      .on('mouseover', (event, d) => {
        tooltip.transition().duration(200).style('display', 'block');
        tooltip
          .html(`STATUS: ${statusFormatter(d.value)}<br/>${timeFormatter(new Date(d.time))}`)
          .style('left', event.pageX + 6 + 'px')
          .style('top', `${event.pageY - 50}px`);
      })
      .on('mouseout', () => {
        tooltip.transition().duration(200).style('display', 'none');
      });
  }
}
