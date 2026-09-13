import fs from 'node:fs';
import path from 'node:path';

function loadEnvFile(filePath = '.env') { //парсер для env
    const full = path.resolve(process.cwd(), filePath);
    if (!fs.existsSync(full)) return;
    const content = fs.readFileSync(full, 'utf8');
    for (const rawLine of content.split('\n')) {
        const line = rawLine.trim();
        if (!line || line.startsWith('#')) continue;
        const eq = line.indexOf('=');
        if (eq === -1) continue;
        const key = line.slice(0, eq).trim();
        const value = line.slice(eq + 1).trim();
        if (!(key in process.env)) process.env[key] = value;
    }
}
loadEnvFile();

export const config = {
    geocodingBaseUrl:
    process.env.GEOCODING_BASE_URL ??
    'https://geocoding-api.open-meteo.com/v1/search',
    forecastBaseUrl:
    process.env.FORECAST_BASE_URL ??
    'https://api.open-meteo.com/v1/forecast',
  timeoutMs: Number(process.env.REQUEST_TIMEOUT_MS ?? 5000),
  reportsDir: process.env.REPORTS_DIR ?? 'reports',
  temperatureUnit: process.env.TEMPERATURE_UNIT ?? 'celsius',
  precipitationUnit: process.env.PRECIPITATION_UNIT ?? 'mm',
}