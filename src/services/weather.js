import { geocodeCity } from '../api/geocoding.js';
import { fetchForecast } from '../api/forecast.js';
import { loadFromCache, saveToCache } from '../storage/cache.js';
import { config } from '../config.js';

/**
 * @returns {Promise<{city:string,country:string,coords:object,days:Array,cached:boolean}>}
 */
export async function getWeatherForCity(city, days, { noCache = false } = {}) {
  if (!noCache) {
    const cached = await loadFromCache(city);
    if (cached) return { ...cached, cached: true };
  }

  const coords = await geocodeCity(city);
  const forecast = await fetchForecast(coords, days);

  const result = {
    city: coords.name,
    country: coords.country,
    coords: { latitude: coords.latitude, longitude: coords.longitude },
    days: forecast,
    generatedAt: new Date().toISOString(),
  };

  await saveToCache(city, result);
  return { ...result, cached: false };
}

export async function getWeatherForCities(cities, days, options) {
  const settled = await Promise.allSettled(
    cities.map((city) => getWeatherForCity(city, days, options)),
  );

  return cities.map((city, i) => {
    const s = settled[i];
    if (s.status === 'fulfilled') {
      return { ok: true, city, data: s.value };
    }
    return { ok: false, city, error: s.reason };
  });
}