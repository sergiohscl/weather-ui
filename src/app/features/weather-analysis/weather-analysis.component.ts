import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import {
  ChartConfiguration,
  ChartOptions,
  ChartType
} from 'chart.js';

import { BaseChartDirective } from 'ng2-charts';

import { WeatherService } from '../../core/services/weather.service';
import { ExportService } from '../../core/services/export.service';

import {
  Weather,
  WeatherListResponse
} from '../../core/models/weather.model';

@Component({
  selector: 'app-weather-analysis',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    BaseChartDirective
  ],
  templateUrl: './weather-analysis.component.html'
})
export class WeatherAnalysisComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);

  private readonly weatherService = inject(WeatherService);

  private readonly exportService = inject(ExportService);

  weather: Weather | null = null;

  history: Weather[] = [];

  currentPage = 1;

  pageSize = 5;

  loading = false;

  exportingCsv = false;

  exportingXlsx = false;

  error = '';

  /**
   * Tipo dos gráficos.
   */
  readonly chartType: 'line' = 'line';

  /**
   * Configuração visual comum dos gráficos.
   */
  readonly chartOptions: ChartOptions<'line'> = {

    responsive: true,

    maintainAspectRatio: false,

    interaction: {
      mode: 'index',
      intersect: false
    },

    animation: {
      duration: 700,
      easing: 'easeOutQuart'
    },

    plugins: {

      legend: {
        display: true,

        position: 'top',

        align: 'start',

        labels: {
          boxWidth: 12,
          boxHeight: 12,
          padding: 16,

          font: {
            size: 12
          }
        }
      },

      tooltip: {

        enabled: true,

        backgroundColor: 'rgba(15, 23, 42, 0.95)',

        titleColor: '#ffffff',

        bodyColor: '#cbd5e1',

        borderColor: 'rgba(255,255,255,0.10)',

        borderWidth: 1,

        padding: 12,

        displayColors: true,

        titleFont: {
          size: 12,
          weight: 'bold'
        },

        bodyFont: {
          size: 12
        },

        callbacks: {
          title: (items) => {

            if (!items.length) {
              return '';
            }

            return String(
              items[0].label ?? ''
            );
          }
        }
      }
    },

    elements: {

      line: {
        tension: 0.35,

        borderWidth: 2
      },

      point: {

        radius: 2,

        hoverRadius: 5,

        borderWidth: 2
      }
    },

    scales: {

      x: {

        grid: {
          display: false
        },

        border: {
          display: false
        },

        ticks: {
          color: '#64748b',

          maxRotation: 0,

          autoSkip: true,

          maxTicksLimit: 8,

          font: {
            size: 10
          }
        }
      },

      y: {

        beginAtZero: false,

        border: {
          display: false
        },

        grid: {
          color: 'rgba(255,255,255,0.06)'
        },

        ticks: {
          color: '#64748b',

          padding: 8,

          font: {
            size: 10
          }
        }
      }
    }
  };

  /**
   * Temperatura.
   */
  temperatureChartData:
    ChartConfiguration<'line'>['data'] = {

      labels: [],

      datasets: [
        {
          label: 'Temperatura (°C)',

          data: [],

          borderColor: '#a78bfa',

          backgroundColor: 'rgba(167, 139, 250, 0.12)',

          pointBackgroundColor: '#a78bfa',

          pointBorderColor: '#1e1b4b',

          pointHoverBackgroundColor: '#ffffff',

          pointHoverBorderColor: '#a78bfa',

          tension: 0.35,

          fill: true
        }
      ]
    };

  /**
   * Umidade.
   */
  humidityChartData:
    ChartConfiguration<'line'>['data'] = {

      labels: [],

      datasets: [
        {
          label: 'Umidade (%)',

          data: [],

          borderColor: '#60a5fa',

          backgroundColor: 'rgba(96, 165, 250, 0.12)',

          pointBackgroundColor: '#60a5fa',

          pointBorderColor: '#172554',

          pointHoverBackgroundColor: '#ffffff',

          pointHoverBorderColor: '#60a5fa',

          tension: 0.35,

          fill: true
        }
      ]
    };

  /**
   * Pressão atmosférica.
   */
  pressureChartData:
    ChartConfiguration<'line'>['data'] = {

      labels: [],

      datasets: [
        {
          label: 'Pressão (hPa)',

          data: [],

          borderColor: '#22d3ee',

          backgroundColor: 'rgba(34, 211, 238, 0.10)',

          pointBackgroundColor: '#22d3ee',

          pointBorderColor: '#083344',

          pointHoverBackgroundColor: '#ffffff',

          pointHoverBorderColor: '#22d3ee',

          tension: 0.35,

          fill: true
        }
      ]
    };

  /**
   * Velocidade do vento.
   */
  windChartData:
    ChartConfiguration<'line'>['data'] = {

      labels: [],

      datasets: [
        {
          label: 'Velocidade do vento (m/s)',

          data: [],

          borderColor: '#34d399',

          backgroundColor: 'rgba(52, 211, 153, 0.10)',

          pointBackgroundColor: '#34d399',

          pointBorderColor: '#064e3b',

          pointHoverBackgroundColor: '#ffffff',

          pointHoverBorderColor: '#34d399',

          tension: 0.35,

          fill: true
        }
      ]
    };

  ngOnInit(): void {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!id || Number.isNaN(id)) {

      this.error =
        'Não foi possível identificar o registro climático.';

      return;
    }

    this.loadWeather(id);
  }

  /**
   * Busca os dados completos da coleta.
   */
  private loadWeather(id: number): void {

    this.loading = true;

    this.error = '';

    this.weather = null;

    this.history = [];

    this.currentPage = 1;

    this.clearCharts();

    this.weatherService
      .getWeatherById(id)
      .subscribe({

        next: (weather) => {

          console.log(
            'Coleta selecionada:',
            weather
          );

          this.weather = weather;

          this.loadHistory(
            weather.city
          );
        },

        error: (error) => {

          console.error(
            'Erro ao buscar coleta:',
            error
          );

          this.error =
            error?.error?.detail ??
            'Não foi possível carregar os dados climáticos.';

          this.loading = false;
        }

      });
  }

  /**
   * Busca o histórico climático.
   */
  private loadHistory(city: string): void {

    this.weatherService
      .getWeatherList(
        city,
        1,
        100
      )
      .subscribe({

        next: (response: WeatherListResponse) => {

          console.log(
            'Histórico climático:',
            response
          );

          this.history =
            [...response.items]
              .sort(
                (a, b) =>
                  new Date(a.created_at).getTime() -
                  new Date(b.created_at).getTime()
              );

          this.currentPage = 1;

          this.updateCharts();

          this.loading = false;
        },

        error: (error) => {

          console.error(
            'Erro ao buscar histórico:',
            error
          );

          this.error =
            error?.error?.detail ??
            'Não foi possível carregar o histórico climático.';

          this.loading = false;
        }

      });
  }

  /**
   * Atualiza os quatro gráficos.
   */
  private updateCharts(): void {

    const labels =
      this.history.map(
        item =>
          this.formatChartDate(
            item.created_at
          )
      );

    this.temperatureChartData = {

      labels,

      datasets: [
        {
          label: 'Temperatura (°C)',

          data:
            this.history.map(
              item => item.temperature
            ),

          borderColor: '#a78bfa',

          backgroundColor:
            'rgba(167, 139, 250, 0.12)',

          pointBackgroundColor: '#a78bfa',

          pointBorderColor: '#1e1b4b',

          pointHoverBackgroundColor: '#ffffff',

          pointHoverBorderColor: '#a78bfa',

          tension: 0.35,

          fill: true
        }
      ]
    };

    this.humidityChartData = {

      labels,

      datasets: [
        {
          label: 'Umidade (%)',

          data:
            this.history.map(
              item => item.humidity
            ),

          borderColor: '#60a5fa',

          backgroundColor:
            'rgba(96, 165, 250, 0.12)',

          pointBackgroundColor: '#60a5fa',

          pointBorderColor: '#172554',

          pointHoverBackgroundColor: '#ffffff',

          pointHoverBorderColor: '#60a5fa',

          tension: 0.35,

          fill: true
        }
      ]
    };

    this.pressureChartData = {

      labels,

      datasets: [
        {
          label: 'Pressão (hPa)',

          data:
            this.history.map(
              item => item.pressure
            ),

          borderColor: '#22d3ee',

          backgroundColor:
            'rgba(34, 211, 238, 0.10)',

          pointBackgroundColor: '#22d3ee',

          pointBorderColor: '#083344',

          pointHoverBackgroundColor: '#ffffff',

          pointHoverBorderColor: '#22d3ee',

          tension: 0.35,

          fill: true
        }
      ]
    };

    this.windChartData = {

      labels,

      datasets: [
        {
          label:
            'Velocidade do vento (m/s)',

          data:
            this.history.map(
              item => item.wind_speed
            ),

          borderColor: '#34d399',

          backgroundColor:
            'rgba(52, 211, 153, 0.10)',

          pointBackgroundColor: '#34d399',

          pointBorderColor: '#064e3b',

          pointHoverBackgroundColor: '#ffffff',

          pointHoverBorderColor: '#34d399',

          tension: 0.35,

          fill: true
        }
      ]
    };
  }

  /**
   * Limpa os gráficos.
   */
  private clearCharts(): void {

    this.temperatureChartData = {
      labels: [],
      datasets: [
        {
          label: 'Temperatura (°C)',
          data: []
        }
      ]
    };

    this.humidityChartData = {
      labels: [],
      datasets: [
        {
          label: 'Umidade (%)',
          data: []
        }
      ]
    };

    this.pressureChartData = {
      labels: [],
      datasets: [
        {
          label: 'Pressão (hPa)',
          data: []
        }
      ]
    };

    this.windChartData = {
      labels: [],
      datasets: [
        {
          label:
            'Velocidade do vento (m/s)',
          data: []
        }
      ]
    };
  }

  /**
   * Total de páginas.
   */
  get totalPages(): number {

    return Math.ceil(
      this.history.length /
      this.pageSize
    );
  }

  /**
   * Histórico paginado.
   */
  get paginatedHistory(): Weather[] {

    const start =
      (this.currentPage - 1) *
      this.pageSize;

    const end =
      start + this.pageSize;

    return this.history.slice(
      start,
      end
    );
  }

  /**
   * Próxima página.
   */
  nextPage(): void {

    if (
      this.currentPage <
      this.totalPages
    ) {
      this.currentPage++;
    }
  }

  /**
   * Página anterior.
   */
  previousPage(): void {

    if (
      this.currentPage > 1
    ) {
      this.currentPage--;
    }
  }

  /**
   * Exporta CSV.
   */
  exportCsv(): void {

    const city =
      this.weather?.city;

    if (
      !city ||
      this.exportingCsv ||
      this.exportingXlsx
    ) {
      return;
    }

    this.exportingCsv = true;

    this.exportService
      .exportCsv(
        city,
        'desc'
      )
      .subscribe({

        next: (file) => {

          this.downloadFile(
            file,
            `${this.getSafeFilename(city)}-weather.csv`
          );

          this.exportingCsv = false;
        },

        error: (error) => {

          console.error(
            'Erro ao exportar CSV:',
            error
          );

          this.exportingCsv = false;
        }

      });
  }

  /**
   * Exporta XLSX.
   */
  exportXlsx(): void {

    const city =
      this.weather?.city;

    if (
      !city ||
      this.exportingCsv ||
      this.exportingXlsx
    ) {
      return;
    }

    this.exportingXlsx = true;

    this.exportService
      .exportXlsx(
        city,
        'desc'
      )
      .subscribe({

        next: (file) => {

          this.downloadFile(
            file,
            `${this.getSafeFilename(city)}-weather.xlsx`
          );

          this.exportingXlsx = false;
        },

        error: (error) => {

          console.error(
            'Erro ao exportar XLSX:',
            error
          );

          this.exportingXlsx = false;
        }

      });
  }

  /**
   * Download do arquivo.
   */
  private downloadFile(
    file: Blob,
    filename: string
  ): void {

    const url =
      URL.createObjectURL(file);

    const link =
      document.createElement('a');

    link.href = url;

    link.download = filename;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);
  }

  /**
   * Nome seguro para arquivo.
   */
  private getSafeFilename(
    city: string
  ): string {

    return city
      .normalize('NFKD')
      .replace(
        /[\u0300-\u036f]/g,
        ''
      )
      .replace(
        /[^a-zA-Z0-9-_]/g,
        '-'
      )
      .toLowerCase();
  }

  /**
   * Maior temperatura.
   */
  getMaxTemperature(): number {

    if (!this.history.length) {
      return 0;
    }

    return Math.max(
      ...this.history.map(
        item => item.temperature
      )
    );
  }

  /**
   * Menor temperatura.
   */
  getMinTemperature(): number {

    if (!this.history.length) {
      return 0;
    }

    return Math.min(
      ...this.history.map(
        item => item.temperature
      )
    );
  }

  /**
   * Temperatura média.
   */
  getAverageTemperature(): number {

    if (!this.history.length) {
      return 0;
    }

    const total =
      this.history.reduce(
        (sum, item) =>
          sum + item.temperature,
        0
      );

    return total /
      this.history.length;
  }

  /**
   * Umidade média.
   */
  getAverageHumidity(): number {

    if (!this.history.length) {
      return 0;
    }

    const total =
      this.history.reduce(
        (sum, item) =>
          sum + item.humidity,
        0
      );

    return total /
      this.history.length;
  }

  /**
   * Maior velocidade do vento.
   */
  getMaxWind(): number {

    if (!this.history.length) {
      return 0;
    }

    return Math.max(
      ...this.history.map(
        item => item.wind_speed
      )
    );
  }

  /**
   * Data usada nos gráficos.
   */
  private formatChartDate(
    value: string
  ): string {

    if (!value) {
      return '-';
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return '-';
    }

    return date.toLocaleString(
      'pt-BR',
      {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }
    );
  }

  /**
   * Data completa.
   */
  formatDate(
    value: string
  ): string {

    if (!value) {
      return '-';
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return '-';
    }

    return date.toLocaleString(
      'pt-BR',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    );
  }
}