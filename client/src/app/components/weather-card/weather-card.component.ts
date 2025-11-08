import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { City, Forecast, TemperatureUnit } from '../../models/city.model';

@Component({
  selector: 'app-weather-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather-card.component.html',
  styleUrls: ['./weather-card.component.css'],
})
export class WeatherCardComponent {
  // Inputs
  @Input() city!: City;
  @Input() selectedDate?: string;
  @Input() temperatureUnit: TemperatureUnit = 'celsius';

  // Output
  @Output() cardClick = new EventEmitter<number>();

  // Get the displayed forecast based on selected date or default to latest
  get displayedForecast(): Forecast | undefined {
    if (!this.city || !this.city.forecast || this.city.forecast.length === 0) {
      return undefined;
    }

    if (this.selectedDate) {
      return this.city.forecast.find((f) => f.date === this.selectedDate);
    }

    // Default: latest forecast
    return this.city.forecast[this.city.forecast.length - 1];
  }

  // Get temperature based on selected unit
  get temperature(): number {
    const forecast = this.displayedForecast;
    if (!forecast) return 0;

    return this.temperatureUnit === 'celsius'
      ? forecast.temperatureCelsius
      : forecast.temperatureFahrenheit;
  }

  // Get temperature symbol for display
  get temperatureSymbol(): string {
    return this.temperatureUnit === 'celsius' ? '°C' : '°F';
  }

  // Emit click event
  onCardClick(): void {
    if (this.city) {
      this.cardClick.emit(this.city.id);
    }
  }
}
