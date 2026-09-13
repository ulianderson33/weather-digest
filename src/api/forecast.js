import { getJson } from './http.js';
import { config } from '../config.js';

/**
 * @param {{latitude:number,longitude:number}} coords
 * @param {number} days
 */
export async function fetchForecast({ latitude, longitude }, days) {
  const url = new URL(config.forecastBaseUrl);
  url.search = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum',
    forecast_days: String(days),
    timezone: 'auto',
    temperature_unit: config.temperatureUnit,
    precipitation_unit: config.precipitationUnit,
  }).toString();

  const data = await getJson(url.toString());

  if (!data.daily) {
    throw new Error('API вернул ответ без блока daily');
  }

  const { time, temperature_2m_max, temperature_2m_min, precipitation_sum } =
    data.daily;

  return time.map((date, i) => ({
    date,
    tMax: temperature_2m_max[i],
    tMin: temperature_2m_min[i],
    precipitation: precipitation_sum[i],
  }));
}