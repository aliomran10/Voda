import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { City, TemperatureUnit } from '../../../models/city.model';
import { TemperatureToggleComponent } from '../../temperature-toggle/temperature-toggle.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, TemperatureToggleComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @Input() city!: City;
  @Input() temperatureUnit!: TemperatureUnit;
  @Output() unitChange = new EventEmitter<TemperatureUnit>();

  onUnitChange(unit: TemperatureUnit) {
    this.unitChange.emit(unit);
  }
}
