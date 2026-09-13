import { parseArgs, HELP } from './cli/args.js';
import { getWeatherForCities } from './services/weather.js';
import { printCityReport, printSummary } from './format/console.js';

async function main() {
  let args;
  try {
    args = parseArgs(process.argv);
  } catch (err) {
    console.error('Ошибка аргументов: ${err.message}');
    console.error(HELP);
    process.exit(1);
  }

  if (args.help) {
    console.log(HELP);
    process.exit(0);
  }

  try {
    const results = await getWeatherForCities(args.cities, args.days, {
      noCache: args.noCache,
    });

    results.forEach(printCityReport);
    printSummary(results);

    const allFailed = results.every((r) => !r.ok);
    process.exit(allFailed ? 1 : 0);
  } catch (err) {
    // Страховка от непредвиденных ошибок
    console.error('Непредвиденная ошибка: ${err.message}');
    process.exit(1);
  }
}

process.on('unhandledRejection', (reason) => {
  console.error('Необработанный rejection:', reason?.message ?? reason);
  process.exit(1);
});
process.on('uncaughtException', (err) => {
  console.error('Необработанное исключение:', err.message);
  process.exit(1);
});

main();