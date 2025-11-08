import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WeatherService } from '../../services/weather.service';
import { City, TemperatureUnit } from '../../models/city.model';
import { WeatherCardComponent } from '../weather-card/weather-card.component';
import { CitySearchComponent } from '../city-search/city-search.component';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { TemperatureToggleComponent } from '../temperature-toggle/temperature-toggle.component';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-weather-list',
  standalone: true,
  imports: [
    CommonModule,
    WeatherCardComponent,
    CitySearchComponent,
    DatePickerComponent,
    TemperatureToggleComponent,
  ],
  templateUrl: './weather-list.component.html',
  styleUrl: './weather-list.component.css',
})
export class WeatherListComponent implements OnInit, OnDestroy {
  cities: City[] = [];
  filteredCities: City[] = [];
  searchTerm: string = '';
  selectedDate?: string;
  temperatureUnit: TemperatureUnit = 'celsius';
  availableDates: string[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private weatherService: WeatherService, private router: Router) {
    // Setup debounced search
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((searchTerm) => {
        this.performSearch(searchTerm);
      });
  }

  ngOnInit(): void {
    this.loadWeatherData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Load all cities and extract available dates
  loadWeatherData(): void {
    this.isLoading = true;
    this.error = null;

    this.weatherService
      .getAllCities()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.cities = data;
          this.extractAvailableDates();
          this.applyFilters();
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Failed to load weather data. Please try again.';
          this.isLoading = false;
          console.error('Error loading weather data:', err);
        },
      });
  }

  // Extract all unique dates from city forecasts
  extractAvailableDates(): void {
    const datesSet = new Set<string>();
    this.cities.forEach((city) => {
      city.forecast.forEach((f) => datesSet.add(f.date));
    });
    this.availableDates = Array.from(datesSet).sort();
  }

  // Search handling
  onSearchChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    // Trigger debounced search via Subject
    this.searchSubject.next(searchTerm);
  }

  performSearch(searchTerm: string): void {
    this.error = null;

    this.weatherService
      .searchCityByName(searchTerm)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.cities = data;
          this.applyFilters();
        },
        error: (err) => {
          this.error = 'Failed to search for cities. Please try again.';
          console.error('Error searching cities:', err);
        },
      });
  }

  // Filter by selected date
  onDateChange(date: string | undefined): void {
    this.selectedDate = date;
    this.applyFilters();
  }

  onUnitChange(unit: TemperatureUnit): void {
    this.temperatureUnit = unit;
  }

  // Apply search and date filters
  applyFilters(): void {
    this.filteredCities = this.cities.filter((city) => {
      const matchesDate =
        !this.selectedDate || city.forecast.some((f) => f.date === this.selectedDate);

      return matchesDate;
    });
  }

  onCardClick(cityId: number): void {
    // Navigate to city history page with temperature unit as query param
    this.router.navigate(['/city', cityId], {
      queryParams: { unit: this.temperatureUnit },
    });
  }
}
