import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemperatureUnit } from '../../models/city.model';

@Component({
  selector: 'app-temperature-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './temperature-toggle.component.html',
  styleUrl: './temperature-toggle.component.css',
})
export class TemperatureToggleComponent {
  @Output() unitChange = new EventEmitter<TemperatureUnit>();

  currentUnit: TemperatureUnit = 'celsius';

  toggleUnit(): void {
    this.currentUnit = this.currentUnit === 'celsius' ? 'fahrenheit' : 'celsius';
    this.unitChange.emit(this.currentUnit);
  }

  get displayText(): string {
    return this.currentUnit === 'celsius' ? '°C' : '°F';
  }

  get alternateText(): string {
    return this.currentUnit === 'celsius' ? '°F' : '°C';
  }
}
