export type OpenMetereologyResponse = {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_hours: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  daily_units?: { time: "iso8601" } & Record<string, string>;
  daily?: { time: Array<string> } & Record<string, Array<unknown>>;
  hourly_units?: { time: "iso8601" } & Record<string, string>;
  hourly?: { time: Array<string> } & Record<string, Array<unknown>>;
}

export function mapMetricName(key: string) {
  switch (key) {
    case 'time': return 'Data';
    case 'temperature_2m_max': return 'Temperatura Máxima';
    case 'temperature_2m_min': return 'Temperatura Mínima';
  }
}

export function transformMetric(key: string, value: unknown) {
  switch (key) {
    case 'time': return (new Date(value as string)).toLocaleDateString();
    case 'temperature_2m_max': return `${Number(value).toFixed(1)} °C`;
    case 'temperature_2m_min': return `${Number(value).toFixed(1)} °C`;
  }
}
