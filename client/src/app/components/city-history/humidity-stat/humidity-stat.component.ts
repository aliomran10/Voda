import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface HumidityStats {
  minHumidity: number;
  maxHumidity: number;
  avgHumidity: number;
}

@Component({
  selector: 'app-humidity-stat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './humidity-stat.component.html',
  styleUrl: './humidity-stat.component.css',
})
export class HumidityStatComponent {
  @Input() stats!: HumidityStats;
}
