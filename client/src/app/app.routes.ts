import { Routes } from '@angular/router';
import { WeatherListComponent } from './components/weather-list/weather-list.component';
import { CityHistoryComponent } from './components/city-history/city-history.component';

export const routes: Routes = [
  {
    path: '',
    component: WeatherListComponent,
    title: 'Weather Forecast'
  },
  {
    path: 'city/:id',
    component: CityHistoryComponent,
    title: 'City Weather History'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
