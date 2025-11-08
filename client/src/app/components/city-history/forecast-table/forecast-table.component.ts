import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { City, Forecast, TemperatureUnit } from '../../../models/city.model';

@Component({
  selector: 'app-forecast-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forecast-table.component.html',
  styleUrls: ['./forecast-table.component.css'],
})
export class ForecastTableComponent {
  @Input() city!: City;
  @Input() temperatureUnit!: TemperatureUnit;

  get temperatureSymbol(): string {
    return this.temperatureUnit === 'celsius' ? '°C' : '°F';
  }

  getTemperature(forecast: Forecast): number {
    return this.temperatureUnit === 'celsius'
      ? forecast.temperatureCelsius
      : forecast.temperatureFahrenheit;
  }

  getWeatherEmoji(forecast: Forecast): string {
    const temp = this.getTemperature(forecast);
    const humidity = forecast.humidity;

    const hotThreshold = this.temperatureUnit === 'celsius' ? 30 : 86;
    const coldThreshold = this.temperatureUnit === 'celsius' ? 10 : 50;

    if (temp > hotThreshold) {
      if (humidity > 70) return '🌡️💦';
      return '☀️';
    }

    if (temp < coldThreshold) {
      if (humidity > 70) return '❄️💧';
      return '❄️';
    }

    if (humidity > 80) return '🌧️';
    if (humidity > 60) return '☁️';
    if (humidity < 30) return '🌵';
    return '🌤️';
  }
}
