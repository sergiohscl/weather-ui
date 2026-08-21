import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  WeatherInsightRequest,
  WeatherInsightResponse,
  WeatherInsightTaskResponse,
  WeatherInsightTaskStatusResponse,
} from '../models/insight.model';

import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class InsightService {

  private readonly http = inject(HttpClient);

  private readonly baseUrl =
    `${API_CONFIG.baseUrl}/weather-city`;

  generateInsight(
    request: WeatherInsightRequest
  ): Observable<WeatherInsightTaskResponse> {

    return this.http.post<WeatherInsightTaskResponse>(
      `${this.baseUrl}/generate-insight`,
      request
    );
  }

   getInsightTaskStatus(
    taskId: string,
  ): Observable<WeatherInsightTaskStatusResponse> {

    return this.http.get<WeatherInsightTaskStatusResponse>(
      `${this.baseUrl}/insight-task/${taskId}`,
    );
  }
 
  getInsights(
    city?: string
  ): Observable<WeatherInsightResponse[]> {

    let params = new HttpParams();

    if (city?.trim()) {
      params = params.set('city', city.trim());
    }

    return this.http.get<WeatherInsightResponse[]>(
      `${this.baseUrl}/insights`,
      { params }
    );
  }
}