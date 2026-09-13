function formatDaysTable(days) {
  const header = ['Дата', 'Мин °C', 'Макс °C', 'Осадки мм'];
  const rows = days.map((d) => [
    d.date,
    d.tMin?.toFixed(1) ?? '—',
    d.tMax?.toFixed(1) ?? '—',
    d.precipitation?.toFixed(1) ?? '—',
  ]);

  const widths = header.map((h, i) =>
    Math.max(h.length, ...rows.map((r) => String(r[i]).length)),
  );

  const line = (cells) =>
    cells.map((c, i) => String(c).padEnd(widths[i])).join(' | ');

  const sep = widths.map((w) => '-'.repeat(w)).join('-+-');

  return [line(header), sep, ...rows.map(line)].join('\n');
}

export function printCityReport(entry) {
  if (!entry.ok) {
    console.error(
      `✖ ${entry.city}: ${entry.error?.message ?? 'неизвестная ошибка'}`,
    );
    return;
  }
  const { city, country, coords, days, cached } = entry.data;
  console.log('');
  console.log(`📍 ${city}, ${country}${cached ? ' (из кэша)' : ''}`);
  console.log(`   Координаты: ${coords.latitude}, ${coords.longitude}`);
  console.log(formatDaysTable(days));
}

export function printSummary(results) {
  const ok = results.filter((r) => r.ok).length;
  const fail = results.length - ok;
  console.log('');
  console.log(`Итого: ${ok} успешно, ${fail} с ошибкой.`);
}