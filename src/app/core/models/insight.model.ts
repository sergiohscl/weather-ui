export interface WeatherInsightRequest {
  hours: number;
  city?: string | null;
}

export interface WeatherInsightResponse {
  id: number;
  generated_at: string;
  text: string;
}

export interface WeatherInsightTaskResponse {
  message: string;
  task_id: string;
  hours: number;
  city: string | null;
}

export interface WeatherInsightTaskStatusResponse {
  task_id: string;
  status: 'PENDING' | 'STARTED' | 'SUCCESS' | 'FAILURE';
  result: WeatherInsightResponse | null;
}