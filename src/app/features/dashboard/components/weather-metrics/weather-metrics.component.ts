import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Weather } from '../../../../core/models/weather.model';

@Component({
  selector: 'app-weather-metrics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather-metrics.component.html',
})
export class WeatherMetricsComponent {

  @Input({ required: true })
  weather!: Weather;

}