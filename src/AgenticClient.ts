import { EventEmitter } from 'events';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface AgenticClientConfig {
  baseURL: string;
  apiKey: string;
  timeout?: number;
  retryAttempts?: number;
}

export interface AgenticClientEvents {
  'request:start': (config: AxiosRequestConfig) => void;
  'request:end': (response: any) => void;
  'request:error': (error: Error) => void;
}

export declare interface AgenticClient {
  on<E extends keyof AgenticClientEvents>(
    event: E,
    listener: AgenticClientEvents[E]
  ): this;
  emit<E extends keyof AgenticClientEvents>(
    event: E,
    ...args: Parameters<AgenticClientEvents[E]>
  ): boolean;
}

import { Agent } from './types/agent';

export class AgenticClient extends EventEmitter {
  private readonly client: AxiosInstance;
  private readonly config: Required<AgenticClientConfig>;

  constructor(config: AgenticClientConfig) {
    super();
    this.config = {
      ...config,
      timeout: config.timeout || 30000,
      retryAttempts: config.retryAttempts || 3
    };

    this.client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        this.emit('request:start', config);
        return config;
      },
      (error) => {
        this.emit('request:error', error);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        this.emit('request:end', response.data);
        return response;
      },
      (error) => {
        this.emit('request:error', error);
        return Promise.reject(error);
      }
    );
  }

  async request<T>(config: AxiosRequestConfig): Promise<T> {
    let attempts = 0;

    while (attempts < this.config.retryAttempts) {
      try {
        const response = await this.client.request<T>(config);
        return response.data;
      } catch (error) {
        attempts++;
        if (attempts === this.config.retryAttempts) {
          if (error instanceof Error) {
            throw error;
          }
          throw new Error('Unknown error occurred');
        }
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
      }
    }

    throw new Error('Maximum retry attempts reached');
  }

  async createAgent(agent: Omit<Agent, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'isActive' | 'status' | 'memories'>): Promise<Agent> {
    return this.request<Agent>({
      method: 'POST',
      url: '/agents',
      data: agent
    });
  }

  async getAgent(agentId: string): Promise<Agent> {
    return this.request<Agent>({
      method: 'GET',
      url: `/agents/${agentId}`
    });
  }

  async updateAgent(agentId: string, update: Partial<Agent>): Promise<Agent> {
    return this.request<Agent>({
      method: 'PUT',
      url: `/agents/${agentId}`,
      data: update
    });
  }

  async deleteAgent(agentId: string): Promise<void> {
    await this.request({
      method: 'DELETE',
      url: `/agents/${agentId}`
    });
  }

  async listAgents(): Promise<Agent[]> {
    return this.request<Agent[]>({
      method: 'GET',
      url: '/agents'
    });
  }
}