import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { City } from '../../../models/city.model';

@Component({
  selector: 'app-forecast-stat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forecast-stat.component.html',
  styleUrl: './forecast-stat.component.css',
})
export class ForecastStatComponent {
  @Input() city!: City;
}
