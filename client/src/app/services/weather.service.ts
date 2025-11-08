import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { City } from '../models/city.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = 'http://localhost:4454';

  constructor(private http: HttpClient) { }

  getAllCities(): Observable<City[]> {
    return this.http.get<City[]>(`${this.apiUrl}/forecast`);
  }

  getCityById(cityId: number): Observable<City> {
    return this.http.get<City>(`${this.apiUrl}/cityForecast/${cityId}`);
  }

  searchCityByName(cityName: string): Observable<City[]> {
    if (!cityName || cityName.trim() === '') {
      return this.getAllCities();
    }

    const searchTerm = cityName.toLowerCase().trim();

    // The /forecast endpoint already returns full city data, so we can filter client-side
    // This is more efficient than making multiple API calls to /cityForecast/:cityId
    return this.getAllCities().pipe(
      map(cities => cities.filter(city =>
        city.city.toLowerCase().includes(searchTerm)
      ))
    );
  }
}
