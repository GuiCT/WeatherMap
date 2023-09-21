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
