export interface SDKConfig {
  apiKey: string;
  baseUrl?: string;
  chunkSize?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

export type AgenticConfig = SDKConfig;