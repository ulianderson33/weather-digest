import { getJson } from './http.js';
import { config } from '../config.js';

/**
 * @param {string} city
 * @returns {Promise<{name:string,country:string,latitude:number,longitude:number}>}
 */
export async function geocodeCity(city) {
  const url = new URL(config.geocodingBaseUrl);
  url.search = new URLSearchParams({
    name: city,
    count: '1',
    language: 'ru',
    format: 'json',
  }).toString();

  const data = await getJson(url.toString());

  if (!data.results || data.results.length === 0) {
    const err = new Error('Город «${city}» не найден');
    err.code = 'CITY_NOT_FOUND';
    throw err;
  }

  const { name, country, latitude, longitude } = data.results[0];
  return { name, country, latitude, longitude };
}