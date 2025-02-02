import { AgenticConfig } from './features/types';

export function validateConfig(config: AgenticConfig): AgenticConfig {
  if (!config.apiKey) {
    throw new Error('API key is required');
  }

  return {
    apiKey: config.apiKey,
    baseUrl: config.baseUrl || 'https://api.graphyn.ai',
    chunkSize: config.chunkSize || 1000,
    retryAttempts: config.retryAttempts || 3,
    retryDelay: config.retryDelay || 1000
  };
}

export async function retry<T>(
  fn: () => Promise<T>,
  attempts: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i === attempts - 1) break;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Retries an async operation with exponential backoff
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxAttempts: number,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      if (attempt === maxAttempts - 1) break;
      
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

/**
 * Formats API endpoints with version
 */
export function formatEndpoint(baseUrl: string, path: string, version: string): string {
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${cleanBase}/api/${version}/${cleanPath}`;
}

/**
 * Checks if a value is a plain object
 */
export function isPlainObject(value: unknown): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}