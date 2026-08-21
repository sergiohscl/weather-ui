import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Weather } from '../../../../core/models/weather.model';


@Component({
  selector: 'app-current-weather',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './current-weather.component.html',
  styleUrl: './current-weather.component.scss'
})
export class CurrentWeatherComponent {
  
  @Input({ required: true })
  weather!: Weather;

  @Output()
  analysis = new EventEmitter<number>();

  goToAnalysis(): void {
    this.analysis.emit(this.weather.id);
  }
 
}
