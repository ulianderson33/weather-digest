import { config } from '../config.js';

export class HttpError extends Error {
  constructor(message, { status, url } = {}) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.url = url;
  }
}

/**
 * @param {string} url
 * @returns {Promise<any>} распарсенный JSON
 */
export async function getJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.timeoutMs);

  let response;
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new HttpError(
        'Превышено время ожидания ответа (${config.timeoutMs} мс)',
        { url },
      );
    }
    throw new HttpError('Сеть недоступна: ${err.message}', { url });
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    const kind = response.status >= 500 ? 'ошибка сервера' : 'ошибка запроса';
    throw new HttpError(
      'HTTP ${response.status} (${kind}) для ${url}',
      { status: response.status, url },
    );
  }

  try {
    return await response.json();
  } catch {
    throw new HttpError('Некорректный JSON в ответе API', {
      status: response.status,
      url,
    });
  }
}