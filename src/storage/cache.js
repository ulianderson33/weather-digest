import fs from 'node:fs/promises';
import path from 'node:path';
import { config } from '../config.js';

/** Транслитерация для безопасных имён файлов. */
function slugify(str) {
  const map = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh',
    з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o',
    п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts',
    ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu',
    я: 'ya',
  };
  return str
    .toLowerCase()
    .split('')
    .map((ch) => map[ch] ?? ch)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function reportPath(city) {
  const fileName = `${slugify(city)}-${todayISO()}.json`;
  return path.join(config.reportsDir, fileName);
}

export async function loadFromCache(city) {
  const file = reportPath(city);
  try {
    const raw = await fs.readFile(file, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    return null;
  }
}

export async function saveToCache(city, data) {
  const file = reportPath(city);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8');
}

export { slugify, reportPath };