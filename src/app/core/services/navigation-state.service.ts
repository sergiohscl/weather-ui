import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavigationStateService {

  private readonly weatherAnalysisIdKey = 'weather_analysis_id';

  allowWeatherAnalysis(id: number): void {
    sessionStorage.setItem(
      this.weatherAnalysisIdKey,
      String(id)
    );
  }

  canAccessWeatherAnalysis(id: number): boolean {
    const allowedId = sessionStorage.getItem(
      this.weatherAnalysisIdKey
    );

    return allowedId === String(id);
  }

  clearWeatherAnalysisAccess(): void {
    sessionStorage.removeItem(
      this.weatherAnalysisIdKey
    );
  }
}