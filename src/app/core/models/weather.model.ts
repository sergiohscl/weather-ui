export interface Weather {
  id: number;
  timestamp: string;
  city: string;

  temperature: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  condition: string;

  created_at: string;

  raw: WeatherRaw;
}

export interface WeatherRaw {
  coord: {
    lon: number;
    lat: number;
  };

  weather: WeatherCondition[];

  base: string;

  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };

  visibility: number;

  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };

  clouds: {
    all: number;
  };

  dt: number;

  sys: {
    type?: number;
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
  };

  timezone: number;

  id: number;
  name: string;
  cod: number;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}



export interface WeatherTaskResponse {
  message: string;
  task_id: string;
}

export interface WeatherListResponse {
  items: Weather[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}