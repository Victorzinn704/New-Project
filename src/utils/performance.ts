import { trace } from 'firebase/performance';
import { performance } from '../firebase';
import { logger } from './logger';

const now = () => globalThis.performance?.now?.() ?? Date.now();

export async function instrumentOperation<T>(
  operationName: string,
  operation: () => Promise<T>,
  metadata?: Record<string, string>
): Promise<T> {
  const startTime = now();
  let perfTrace: ReturnType<typeof trace> | null = null;

  try {
    // Start Firebase Performance trace
    if (performance) {
      perfTrace = trace(performance, operationName);
      if (metadata) {
        Object.entries(metadata).forEach(([key, value]) => {
          perfTrace?.putAttribute(key, value);
        });
      }
      perfTrace.start();
    }

    logger.debug(`Starting operation: ${operationName}`, { operation: operationName, ...metadata });

    const result = await operation();

    const duration = now() - startTime;
    logger.info(`Operation completed: ${operationName}`, {
      operation: operationName,
      duration: `${duration.toFixed(2)}ms`,
      ...metadata,
    });

    return result;
  } catch (error) {
    const duration = now() - startTime;
    logger.error(`Operation failed: ${operationName}`, error as Error, {
      operation: operationName,
      duration: `${duration.toFixed(2)}ms`,
      ...metadata,
    });
    throw error;
  } finally {
    if (perfTrace) {
      perfTrace.stop();
    }
  }
}

export function measureSync<T>(operationName: string, operation: () => T, metadata?: Record<string, string>): T {
  const startTime = now();

  try {
    logger.debug(`Starting sync operation: ${operationName}`, { operation: operationName, ...metadata });
    const result = operation();
    const duration = now() - startTime;
    logger.debug(`Sync operation completed: ${operationName}`, {
      operation: operationName,
      duration: `${duration.toFixed(2)}ms`,
      ...metadata,
    });
    return result;
  } catch (error) {
    const duration = now() - startTime;
    logger.error(`Sync operation failed: ${operationName}`, error as Error, {
      operation: operationName,
      duration: `${duration.toFixed(2)}ms`,
      ...metadata,
    });
    throw error;
  }
}
