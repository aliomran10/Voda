export interface Forecast {
  date: string;
  temperatureCelsius: number;
  temperatureFahrenheit: number;
  humidity: number;
}

export interface City {
  id: number;
  city: string;
  forecast: Forecast[];
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';
