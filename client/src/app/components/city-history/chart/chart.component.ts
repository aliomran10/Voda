import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { City, Forecast, TemperatureUnit } from '../../../models/city.model';
import {
  Chart,
  ChartConfiguration,
  ChartType,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler
);

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css',
})
export class ChartComponent implements OnChanges {
  @Input() city?: City; // City data to display
  @Input() temperatureUnit: TemperatureUnit = 'celsius';

  lineChartData: ChartConfiguration['data'] = { datasets: [], labels: [] };

  // Chart.js options configuration
  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: { enabled: true, mode: 'index', intersect: false },
    },
    scales: {
      x: { display: true, title: { display: true, text: 'Date' } },
      y: { display: true, title: { display: true, text: 'Temperature' } },
    },
    elements: { line: { tension: 0.4 } },
  };
  lineChartType: ChartType = 'line';

  // Rebuild chart whenever city or temperature unit changes
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['city'] || changes['temperatureUnit']) {
      this.updateChartData();
    }
  }

  // Helper getter for temperature symbol
  get temperatureSymbol(): string {
    return this.temperatureUnit === 'celsius' ? '°C' : '°F';
  }

  // Get temperature based on selected unit
  getTemperature(forecast: Forecast): number {
    return this.temperatureUnit === 'celsius'
      ? forecast.temperatureCelsius
      : forecast.temperatureFahrenheit;
  }

  // Update chart data and labels
  private updateChartData(): void {
    if (!this.city?.forecast) return;

    const labels = this.city.forecast.map((f) => f.date);
    const temperatures = this.city.forecast.map((f) => this.getTemperature(f));

    this.lineChartData = {
      labels,
      datasets: [
        {
          data: temperatures,
          label: `Temperature (${this.temperatureSymbol})`,
          borderColor: 'rgb(52, 152, 219)',
          backgroundColor: 'rgba(52, 152, 219, 0.1)',
          fill: true,
          pointBackgroundColor: 'rgb(52, 152, 219)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(52, 152, 219)',
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    };

    // Update y-axis label dynamically
    const yScale = this.lineChartOptions?.scales?.['y'] as any;
    if (yScale?.title) yScale.title.text = `Temperature (${this.temperatureSymbol})`;
  }
}
