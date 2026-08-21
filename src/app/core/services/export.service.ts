import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class ExportService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${API_CONFIG.baseUrl}/weather-city`;

  exportCsv(
    city: string,
    order: 'asc' | 'desc' = 'desc'
  ) {

    const params = new HttpParams()
      .set('city', city.trim())
      .set('order', order);

    return this.http.get(
      `${this.apiUrl}/export-csv`,
      {
        params,
        responseType: 'blob',
      }
    );
  }

  exportXlsx(
    city: string,
    order: 'asc' | 'desc' = 'desc'
  ) {

    const params = new HttpParams()
      .set('city', city.trim())
      .set('order', order);

    return this.http.get(
      `${this.apiUrl}/export-xlsx`,
      {
        params,
        responseType: 'blob',
      }
    );
  }
}