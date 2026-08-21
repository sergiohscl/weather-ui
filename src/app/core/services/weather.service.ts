import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Weather, WeatherListResponse, WeatherTaskResponse } from '../models/weather.model';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private readonly http = inject(HttpClient);

  private readonly baseUrl =
    `${API_CONFIG.baseUrl}/weather-city/`;
 
  fetchCity(city: string): Observable<WeatherTaskResponse> {
    console.log(
      '🌐 fetchCity() chamado:',
      new Date().toISOString(),
      'cidade:',
      city
    );
    return this.http.post<WeatherTaskResponse>(
      this.baseUrl,
      {
        city
      }
    );
  }
  
  getWeatherList(
    city?: string,
    page = 1,
    pageSize = 10
  ): Observable<WeatherListResponse> {

    let params = new HttpParams()
      .set('sort_by', 'created_at')
      .set('sort_order', 'desc')
      .set('page', page)
      .set('page_size', pageSize);

    if (city?.trim()) {
      params = params.set('city', city.trim());
    }

    return this.http.get<WeatherListResponse>(
      this.baseUrl,
      { params }
    );
  }
  
  getLatestWeatherByCity(
    city: string
  ): Observable<WeatherListResponse> {

    const params = new HttpParams()
      .set('city', city.trim())
      .set('sort_by', 'created_at')
      .set('sort_order', 'desc')
      .set('page', 1)
      .set('page_size', 1);

    return this.http.get<WeatherListResponse>(
      this.baseUrl,
      { params }
    );
  }
  
  getWeatherById(id: number): Observable<Weather> {
    return this.http.get<Weather>(
      `${this.baseUrl}${id}`
    );
  }
}
