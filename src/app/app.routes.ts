import { Routes } from '@angular/router';
import { weatherAnalysisGuard } from './core/guards/weather-analysis.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component')
        .then((m) => m.DashboardComponent),
  },
  {
    path: 'weather-analysis/:id',
    canActivate: [weatherAnalysisGuard],
    loadComponent: () =>
      import(
        './features/weather-analysis/weather-analysis.component'
      ).then(
        m => m.WeatherAnalysisComponent
      )
  },
  {
    path: '**',
    redirectTo: '',
  },
];