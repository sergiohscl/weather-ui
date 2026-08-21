import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { WeatherService } from '../../core/services/weather.service';
import { Weather } from '../../core/models/weather.model';

import { NavigationStateService } from '../../core/services/navigation-state.service';

import { WeatherSearchComponent } from './components/weather-search/weather-search.component';
import { CurrentWeatherComponent } from './components/current-weather/current-weather.component';
import { WeatherInsightComponent } from './components/weather-insight/weather-insight.component';
import { WeatherMetricsComponent } from './components/weather-metrics/weather-metrics.component';
import { DashboardHeaderComponent } from './components/dashboard-header/dashboard-header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    WeatherSearchComponent,
    CurrentWeatherComponent,
    WeatherInsightComponent,
    WeatherMetricsComponent,
    DashboardHeaderComponent,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {

  private readonly weatherService = inject(WeatherService);

  private readonly router = inject(Router);

  private readonly navigationState = inject(NavigationStateService);

  city = '';

  weather: Weather | null = null;

  weatherId: number | null = null;

  loading = false;

  error = '';

  goToWeatherAnalysis(id: number): void {

    this.navigationState.allowWeatherAnalysis(id);

    this.router.navigate([
      '/weather-analysis',
      id,
    ]);
  }

  searchCity(): void {

  console.log(
    '🔎 searchCity() chamado:',
    new Date().toISOString(),
    'cidade:',
    this.city
  );

    const city = this.normalizeCity(this.city);

    if (!city) {
      this.error = 'Digite uma cidade.';
      return;
    }

    this.loading = true;

    this.error = '';

    this.weather = null;

    this.weatherService.fetchCity(city).subscribe({

      next: (taskResponse) => {

        this.getLatestWeather(city);
      },

      error: (error) => {

        console.error(
          'Erro ao solicitar coleta:',
          error
        );

        this.error =
          error?.error?.detail ??
          'Não foi possível solicitar a coleta do clima.';

        this.loading = false;
      },

    });
  }

  private getLatestWeather(city: string): void {

    this.weatherService
      .getLatestWeatherByCity(city)
      .subscribe({

        next: (response) => {

          const latestWeather = response.items[0];

          if (!latestWeather) {

            this.error =
              'A coleta foi solicitada, mas ainda não existe um registro para essa cidade. Busque a cidade novamente em alguns instantes.';

            this.loading = false;

            return;
          }

          const weatherId = latestWeather.id;

          this.getWeatherById(weatherId);
        },

        error: (error) => {

          console.error(
            'Erro ao buscar última coleta:',
            error
          );

          this.error =
            error?.error?.detail ??
            'Não foi possível encontrar a última coleta da cidade.';

          this.loading = false;
        },

      });
  }

  private getWeatherById(id: number): void {

    this.weatherService
      .getWeatherById(id)
      .subscribe({

        next: (weather) => {

          this.weather = weather;

          this.weatherId = weather.id;

          this.loading = false;
        },

        error: (error) => {

          console.error(
            'Erro ao buscar clima pelo ID:',
            error
          );

          this.error =
            error?.error?.detail ??
            'Não foi possível carregar os dados do clima.';

          this.loading = false;
        },

      });
  }

  private normalizeCity(city: string): string {

    return city
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }
}