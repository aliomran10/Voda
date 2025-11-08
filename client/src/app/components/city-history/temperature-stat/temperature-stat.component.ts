import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TemperatureStats {
  minTemp: number;
  maxTemp: number;
  avgTemp: number;
}

@Component({
  selector: 'app-temperature-stat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './temperature-stat.component.html',
  styleUrls: ['./temperature-stat.component.css'],
})
export class TemperatureStatComponent {
  @Input() stats!: TemperatureStats;
  @Input() temperatureSymbol!: string;
}
