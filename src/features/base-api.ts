import { SDKConfig } from '../types';
import { GraphynError } from '../errors/sdk-error';

export class BaseAPI {
  protected config: SDKConfig;
  protected baseUrl: string;

  constructor(config: SDKConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://api.graphyn.ai';
  }

  protected async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    path: string,
    options: { data?: unknown; params?: Record<string, string> } = {}
  ): Promise<T> {
    const url = new URL(path, this.baseUrl);
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Accept': 'application/json'
    });

    try {
      const response = await fetch(url.toString(), {
        method,
        headers,
        body: options.data ? JSON.stringify(options.data) : undefined
      });

      if (!response.ok) {
        throw GraphynError.fromResponse(response);
      }

      if (response.status === 204) {
        return undefined as T;
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      if (error instanceof GraphynError) {
        throw error;
      }
      throw new GraphynError(
        'Network error or invalid JSON response',
        'NETWORK_ERROR',
        500,
        error
      );
    }
  }
}