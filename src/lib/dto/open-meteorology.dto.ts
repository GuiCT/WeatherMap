export type OpenMetereologyResponse = {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_hours: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  daily_units?: Record<string, string>;
  daily?: Record<string, Array<unknown>>;
  hourly_units?: Record<string, string>;
  hourly?: Record<string, Array<unknown>>;
}
