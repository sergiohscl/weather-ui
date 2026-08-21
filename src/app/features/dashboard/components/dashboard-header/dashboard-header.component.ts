import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';

import { NavigationStateService } from '../../../../core/services/navigation-state.service';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  templateUrl: './dashboard-header.component.html',
})
export class DashboardHeaderComponent {

  private readonly router = inject(Router);

  private readonly navigationState =
    inject(NavigationStateService);

  @Input()
  weatherId: number | null = null;

  goToAnalysis(): void {

    if (this.weatherId === null) {
      return;
    }

    this.navigationState.allowWeatherAnalysis(
      this.weatherId
    );

    this.router.navigate([
      '/weather-analysis',
      this.weatherId,
    ]);
  }
}