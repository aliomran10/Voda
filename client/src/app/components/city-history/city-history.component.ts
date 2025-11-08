import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { WeatherService } from '../../services/weather.service';
import { City, Forecast, TemperatureUnit } from '../../models/city.model';
import { TemperatureToggleComponent } from '../temperature-toggle/temperature-toggle.component';
import { Subject, takeUntil } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';
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
  Filler
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

interface WeatherStats {
  minTemp: number;
  maxTemp: number;
  avgTemp: number;
  minHumidity: number;
  maxHumidity: number;
  avgHumidity: number;
}

@Component({
  selector: 'app-city-history',
  standalone: true,
  imports: [CommonModule, RouterLink, TemperatureToggleComponent, BaseChartDirective],
  templateUrl: './city-history.component.html',
  styleUrl: './city-history.component.css'
})
export class CityHistoryComponent implements OnInit, OnDestroy {
  city?: City;
  isLoading: boolean = true;
  error: string | null = null;
  temperatureUnit: TemperatureUnit = 'celsius';
  stats?: WeatherStats;

  // Chart.js configuration
  lineChartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: []
  };

  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Temperature'
        }
      }
    },
    elements: {
      line: {
        tension: 0.4 // Smooth curves
      }
    }
  };

  lineChartType: ChartType = 'line';

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private weatherService: WeatherService
  ) {}

  ngOnInit(): void {
    // Get temperature unit from query params if available
    this.route.queryParams.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      if (params['unit'] === 'fahrenheit' || params['unit'] === 'celsius') {
        this.temperatureUnit = params['unit'] as TemperatureUnit;
      }
    });

    // Get city ID from route params
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const cityId = parseInt(params['id'], 10);
      if (!isNaN(cityId)) {
        this.loadCityData(cityId);
      } else {
        this.error = 'Invalid city ID';
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCityData(cityId: number): void {
    this.isLoading = true;
    this.error = null;

    this.weatherService.getCityById(cityId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.city = data;
        this.calculateStats();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load city weather data. Please try again.';
        this.isLoading = false;
        console.error('Error loading city data:', err);
      }
    });
  }

  calculateStats(): void {
    if (!this.city || !this.city.forecast || this.city.forecast.length === 0) {
      return;
    }

    const temps = this.city.forecast.map(f =>
      this.temperatureUnit === 'celsius' ? f.temperatureCelsius : f.temperatureFahrenheit
    );
    const humidities = this.city.forecast.map(f => f.humidity);

    this.stats = {
      minTemp: Math.min(...temps),
      maxTemp: Math.max(...temps),
      avgTemp: temps.reduce((a, b) => a + b, 0) / temps.length,
      minHumidity: Math.min(...humidities),
      maxHumidity: Math.max(...humidities),
      avgHumidity: humidities.reduce((a, b) => a + b, 0) / humidities.length
    };

    // Update chart data
    this.updateChartData();
  }

  updateChartData(): void {
    if (!this.city || !this.city.forecast) {
      return;
    }

    const labels = this.city.forecast.map(f => f.date);
    const temperatures = this.city.forecast.map(f => this.getTemperature(f));

    this.lineChartData = {
      labels: labels,
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
          pointHoverRadius: 7
        }
      ]
    };

    // Update y-axis label with proper typing
    if (this.lineChartOptions?.scales?.['y']) {
      const yScale = this.lineChartOptions.scales['y'] as any;
      if (yScale.title) {
        yScale.title.text = `Temperature (${this.temperatureSymbol})`;
      }
    }
  }

  onUnitChange(unit: TemperatureUnit): void {
    this.temperatureUnit = unit;
    this.calculateStats();

    // Update query params to persist unit selection
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { unit },
      queryParamsHandling: 'merge'
    });
  }

  get temperatureSymbol(): string {
    return this.temperatureUnit === 'celsius' ? '°C' : '°F';
  }

  getTemperature(forecast: Forecast): number {
    return this.temperatureUnit === 'celsius'
      ? forecast.temperatureCelsius
      : forecast.temperatureFahrenheit;
  }

  // Creative weather emoji based on temperature and humidity
  getWeatherEmoji(forecast: Forecast): string {
    const temp = this.getTemperature(forecast);
    const humidity = forecast.humidity;

    // Define thresholds based on current unit
    const hotThreshold = this.temperatureUnit === 'celsius' ? 30 : 86;  // 30°C = 86°F
    const coldThreshold = this.temperatureUnit === 'celsius' ? 10 : 50; // 10°C = 50°F

    // Hot weather
    if (temp > hotThreshold) {
      if (humidity > 70) return '🌡️💦'; // Hot & humid
      return '☀️'; // Hot & dry
    }

    // Cold weather
    if (temp < coldThreshold) {
      if (humidity > 70) return '❄️💧'; // Cold & wet
      return '❄️'; // Cold & dry
    }

    // Moderate temperature
    if (humidity > 80) return '🌧️'; // Rainy
    if (humidity > 60) return '☁️'; // Cloudy
    if (humidity < 30) return '🌵'; // Dry
    return '🌤️'; // Partly cloudy
  }
}
