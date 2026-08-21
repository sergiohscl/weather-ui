import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-weather-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './weather-search.component.html',
})
export class WeatherSearchComponent {

  @Input()
  city = '';

  @Input()
  loading = false;

  @Input()
  error = '';

  @Output()
  cityChange = new EventEmitter<string>();

  @Output()
  search = new EventEmitter<void>();

  onCityChange(value: string): void {
    this.cityChange.emit(value);
  }

  onSubmit(): void {
    this.search.emit();
  }

}