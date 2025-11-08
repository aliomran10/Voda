import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { WeatherService } from '../../services/weather.service';
import { City, Forecast, TemperatureUnit } from '../../models/city.model';
import { Subject, takeUntil } from 'rxjs';
import { TemperatureStatComponent } from './temperature-stat/temperature-stat.component';
import { HumidityStatComponent } from './humidity-stat/humidity-stat.component';
import { ForecastStatComponent } from './forecast-stat/forecast-stat.component';
import { HeaderComponent } from './header/header.component';
import { ChartComponent } from './chart/chart.component';
import { ForecastTableComponent } from './forecast-table/forecast-table.component';

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
  imports: [
    CommonModule,
    RouterLink,
    HeaderComponent,
    TemperatureStatComponent,
    HumidityStatComponent,
    ForecastStatComponent,
    ChartComponent,
    ForecastTableComponent,
  ],
  templateUrl: './city-history.component.html',
  styleUrl: './city-history.component.css',
})
export class CityHistoryComponent implements OnInit, OnDestroy {
  city?: City;
  isLoading: boolean = true;
  error: string | null = null;
  temperatureUnit: TemperatureUnit = 'celsius';
  stats?: WeatherStats;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private weatherService: WeatherService
  ) {}

  ngOnInit(): void {
    // Get temperature unit from query params if available
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      if (params['unit'] === 'fahrenheit' || params['unit'] === 'celsius') {
        this.temperatureUnit = params['unit'] as TemperatureUnit;
      }
    });

    // Get city ID from route params
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
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

  // Fetch city data by ID
  loadCityData(cityId: number): void {
    this.isLoading = true;
    this.error = null;

    this.weatherService
      .getCityById(cityId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.city = data;
          this.calculateStats(); // Compute stats after loading data
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Failed to load city weather data. Please try again.';
          this.isLoading = false;
          console.error('Error loading city data:', err);
        },
      });
  }

  // Calculate min, max, and average for temperature and humidity
  calculateStats(): void {
    if (!this.city || !this.city.forecast || this.city.forecast.length === 0) {
      return;
    }

    const temps = this.city.forecast.map((f) =>
      this.temperatureUnit === 'celsius' ? f.temperatureCelsius : f.temperatureFahrenheit
    );
    const humidities = this.city.forecast.map((f) => f.humidity);

    this.stats = {
      minTemp: Math.min(...temps),
      maxTemp: Math.max(...temps),
      avgTemp: temps.reduce((a, b) => a + b, 0) / temps.length,
      minHumidity: Math.min(...humidities),
      maxHumidity: Math.max(...humidities),
      avgHumidity: humidities.reduce((a, b) => a + b, 0) / humidities.length,
    };
  }

  // Handle temperature unit change
  onUnitChange(unit: TemperatureUnit): void {
    this.temperatureUnit = unit;
    this.calculateStats();

    // Update query params to persist selection
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { unit },
      queryParamsHandling: 'merge',
    });
  }

  // Helper getter for temperature symbol
  get temperatureSymbol(): string {
    return this.temperatureUnit === 'celsius' ? '°C' : '°F';
  }

  // Helper method to get temperature from a forecast
  getTemperature(forecast: Forecast): number {
    return this.temperatureUnit === 'celsius'
      ? forecast.temperatureCelsius
      : forecast.temperatureFahrenheit;
  }
}
