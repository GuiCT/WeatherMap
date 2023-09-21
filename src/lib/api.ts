import axios from 'axios';
import type { GeoCodingResponse } from './dto/geocoding.dto';
import type { OpenMetereologyResponse } from './dto/open-meteorology.dto';

export const geoCodingApi = axios.create({
  baseURL: 'https://geocoding-api.open-meteo.com/v1',
});

export async function getCoordinatesFromName(cityName: string) {
  const result = await geoCodingApi.get(`search?name=${cityName}`).catch((err) => {
    console.error('Geocoding has failed', err);
    return err;
  });
  if (result.status === 200) {
    const response = result.data as GeoCodingResponse;
    const hasResultArray = Array.isArray(response.results);
    if (hasResultArray) {
      return response.results;
    }
  }
}

export class OpenMetereologyApi {
  static readonly axiosInstance = axios.create({
    baseURL: 'https://api.open-meteo.com/v1',
  });
  readonly latitude: number;
  readonly longitude: number;

  public constructor(latitude: number, longitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
  }

  public async getForecast() {
    const result = await OpenMetereologyApi.axiosInstance.get(
      `/forecast?daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1&latitude=${this.latitude}&longitude=${this.longitude}`
    );
    if (result.status === 200) {
      return result.data as OpenMetereologyResponse;
    }
  }
}
