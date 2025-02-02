import { GraphynConfig } from '../types';
import { formatEndpoint } from '../utils';

export class Auth {
  private config: GraphynConfig;

  constructor(config: GraphynConfig) {
    this.config = config;
  }

  /**
   * Get the API key for authentication
   */
  public getApiKey(): string {
    return this.config.apiKey;
  }

  /**
   * Get the base URL for API requests
   */
  public getBaseUrl(): string {
    return this.config.baseUrl || 'https://api.graphyn.ai';
  }
}