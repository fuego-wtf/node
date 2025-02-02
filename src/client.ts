import { Agent, AgentSettings, AgentStats, CreateAgentInput, SDKConfig, Memory, CreateMemoryInput } from './types';
import { AgentAPI } from './features/agent';
import { MemoryAPI } from './features/memory';
import { EventEmitter } from 'events';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface RequestOptions extends Partial<AxiosRequestConfig> {}

export class AgenticClient extends EventEmitter {
  private agentManager: AgentAPI;
  private memoryManager: MemoryAPI;
  private client: AxiosInstance;
  private config: SDKConfig;

  constructor(config: SDKConfig) {
    super();
    this.config = config;
    this.agentManager = new AgentAPI(config);
    this.memoryManager = new MemoryAPI(config);
    this.client = axios.create({
      baseURL: config.baseUrl || 'http://localhost:3000',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      }
    });
  }

  protected async request<T>(
    method: string,
    path: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const config: AxiosRequestConfig = {
      method,
      url: path,
      ...options
    };

    try {
      const response = await this.client.request(config);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `API request failed: ${error.response?.status} ${error.response?.statusText}`
        );
      }
      throw error;
    }
  }

  public setAuthToken(token: string): void {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  async initialize(): Promise<void> {
    this.emit('ready');
  }

  // Agent Management Methods
  async createAgent(input: CreateAgentInput): Promise<Agent> {
    const agent = await this.agentManager.createAgent(input);
    this.emit('agentCreated', agent);
    return agent;
  }

  async getAgent(agentId: string): Promise<Agent> {
    return this.agentManager.getAgent(agentId);
  }

  async updateAgent(agentId: string, updates: Partial<Agent>): Promise<Agent> {
    const agent = await this.agentManager.updateAgent(agentId, updates);
    this.emit('agentUpdated', agent);
    return agent;
  }

  async deleteAgent(agentId: string): Promise<void> {
    await this.agentManager.deleteAgent(agentId);
    this.emit('agentDeleted', agentId);
  }

  async listAgents(): Promise<Agent[]> {
    return this.agentManager.listAgents();
  }

  async updateAgentSettings(agentId: string, settings: Partial<AgentSettings>): Promise<Agent> {
    const agent = await this.agentManager.updateAgentSettings(agentId, settings);
    this.emit('agentSettingsUpdated', { agentId, settings });
    return agent;
  }

  async getAgentStats(agentId: string): Promise<AgentStats> {
    return this.agentManager.getAgentStats(agentId);
  }

  // Memory Management Methods
  async createMemory(input: CreateMemoryInput): Promise<Memory> {
    return this.memoryManager.createMemory(input);
  }

  async getMemory(id: string): Promise<Memory> {
    return this.memoryManager.getMemory(id);
  }

  async listMemories(agentId: string): Promise<Memory[]> {
    return this.memoryManager.getMemories(agentId);
  }

  async deleteMemory(id: string): Promise<void> {
    return this.memoryManager.deleteMemory(id);
  }

  // Event Handling
  on(event: 'ready', listener: () => void): this;
  on(event: 'agentCreated', listener: (agent: Agent) => void): this;
  on(event: 'agentUpdated', listener: (agent: Agent) => void): this;
  on(event: 'agentDeleted', listener: (agentId: string) => void): this;
  on(event: 'agentSettingsUpdated', listener: (data: { agentId: string; settings: Partial<AgentSettings> }) => void): this;
  on(event: string, listener: (...args: any[]) => void): this {
    return super.on(event, listener);
  }
}