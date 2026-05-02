import type { LogLevel, LogStack, LogPackage, LogAPIResponse } from '../notification_app_fe/types';

const LOG_API_URL = 'http://20.207.122.201/evaluation-service/logs';

export async function Log(
  stack: LogStack,
  level: LogLevel,
  pkg: LogPackage | string,
  message: string
): Promise<LogAPIResponse | null> {
  try {
    const validStacks: LogStack[] = ['backend', 'frontend'];
    const validLevels: LogLevel[] = ['debug', 'info', 'warn', 'error', 'fatal'];

    if (!validStacks.includes(stack) || !validLevels.includes(level)) {
      return null;
    }

    const payload = {
      stack,
      level,
      package: pkg,
      message,
    };

    const response = await fetch(LOG_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return null;
    }

    const data: LogAPIResponse = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

export function LogFrontend(
  level: LogLevel,
  pkg: LogPackage | string,
  message: string
): Promise<LogAPIResponse | null> {
  return Log('frontend', level, pkg, message);
}

export default Log;
