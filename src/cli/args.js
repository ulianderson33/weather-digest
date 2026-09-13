export function parseArgs(argv) {
  const args = argv.slice(2);
  const parsed = { cities: [], days: 3, noCache: false };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--city') {
      const value = args[++i];
      if (!value) throw new Error('Параметр --city требует значения');
      parsed.cities = value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (arg === '--days') {
      const value = args[++i];
      const n = Number(value);
      if (!Number.isInteger(n) || n < 1 || n > 7) {
        throw new Error('Параметр --days должен быть целым числом от 1 до 7');
      }
      parsed.days = n;
    } else if (arg === '--no-cache') {
      parsed.noCache = true;
    } else if (arg === '--help' || arg === '-h') {
      parsed.help = true;
    } else {
      throw new Error('Неизвестный аргумент: ${arg}');
    }
  }

  if (!parsed.help && parsed.cities.length === 0) {
    throw new Error('Параметр --city обязателен');
  }

  return parsed;
}

export const HELP = `
Погодный дайджест

Использование:
  node src/index.js --city "Город1, Город2" [--days N] [--no-cache]

Параметры:
  --city     Список городов через запятую (обязательно)
  --days     Количество дней прогноза, 1–7 (по умолчанию 3)
  --no-cache Игнорировать кэш и запросить данные заново
  --help     Показать эту справку

Пример:
  node src/index.js --city "Нижний Новгород, Москва" --days 5
`;