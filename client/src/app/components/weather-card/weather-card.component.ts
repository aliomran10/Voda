import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { City, Forecast, TemperatureUnit } from '../../models/city.model';

@Component({
  selector: 'app-weather-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather-card.component.html',
  styleUrl: './weather-card.component.css'
})
export class WeatherCardComponent {
  @Input() city!: City;
  @Input() selectedDate?: string;
  @Input() temperatureUnit: TemperatureUnit = 'celsius';
  @Output() cardClick = new EventEmitter<number>();

  get displayedForecast(): Forecast | undefined {
    if (!this.city || !this.city.forecast || this.city.forecast.length === 0) {
      return undefined;
    }

    if (this.selectedDate) {
      return this.city.forecast.find(f => f.date === this.selectedDate);
    }

    // Return the latest date (last element in the array)
    return this.city.forecast[this.city.forecast.length - 1];
  }

  get temperature(): number {
    if (!this.displayedForecast) return 0;
    return this.temperatureUnit === 'celsius'
      ? this.displayedForecast.temperatureCelsius
      : this.displayedForecast.temperatureFahrenheit;
  }

  get temperatureSymbol(): string {
    return this.temperatureUnit === 'celsius' ? '°C' : '°F';
  }

  onCardClick(): void {
    this.cardClick.emit(this.city.id);
  }
}
