import { Agent, AgentSettings, AgentStats, CreateAgentParams, GraphynConfig, Memory, CreateMemoryInput } from '../types';
import { AgentAPI } from './agents';
import { MemoryAPI } from './memory';
import { EventEmitter } from 'events';
import { GraphynError } from '../errors/sdk-error';

export type GraphynClientEvents = {
  'ready': () => void;
  'agent:created': (agent: Agent) => void;
  'agent:updated': (agent: Agent) => void;
  'agent:deleted': (agentId: string) => void;
  'agent:settings:updated': (data: { agentId: string; settings: Partial<AgentSettings> }) => void;
  'memory:created': (memory: Memory) => void;
  'memory:deleted': (memoryId: string) => void;
};

export class GraphynClient extends EventEmitter {
  public static readonly Events = {
    READY: 'ready',
    AGENT_CREATED: 'agent:created',
    AGENT_UPDATED: 'agent:updated',
    AGENT_DELETED: 'agent:deleted',
    AGENT_SETTINGS_UPDATED: 'agent:settings:updated',
    MEMORY_CREATED: 'memory:created',
    MEMORY_DELETED: 'memory:deleted'
  } as const;
  private agentAPI: AgentAPI;
  private memoryAPI: MemoryAPI;

  constructor(config: GraphynConfig) {
    super();
    if (!config.apiKey) {
      throw new Error('API key is required');
    }
    this.agentAPI = new AgentAPI(config);
    this.memoryAPI = new MemoryAPI(config);
  }

  async initialize(): Promise<void> {
    this.emit(GraphynClient.Events.READY);
  }

  // Agent Management Methods
  async createAgent(input: CreateAgentParams): Promise<Agent> {
    const agent = await this.agentAPI.createAgent(input);
    this.emit(GraphynClient.Events.AGENT_CREATED, agent);
    return agent;
  }

  async getAgent(agentId: string): Promise<Agent> {
    return this.agentAPI.getAgent(agentId);
  }

  async updateAgent(agentId: string, updates: Partial<Agent>): Promise<Agent> {
    const agent = await this.agentAPI.updateAgent(agentId, updates);
    this.emit(GraphynClient.Events.AGENT_UPDATED, agent);
    return agent;
  }

  async deleteAgent(agentId: string): Promise<void> {
    await this.agentAPI.deleteAgent(agentId);
    this.emit(GraphynClient.Events.AGENT_DELETED, agentId);
  }

  async listAgents(): Promise<Agent[]> {
    return this.agentAPI.getUserAgents();
  }

  async updateAgentSettings(agentId: string, settings: Partial<AgentSettings>): Promise<Agent> {
    const agent = await this.agentAPI.updateAgentSettings(agentId, settings);
    this.emit(GraphynClient.Events.AGENT_SETTINGS_UPDATED, { agentId, settings });
    return agent;
  }

  async getAgentStats(agentId: string): Promise<AgentStats> {
    return this.agentAPI.getAgentStats(agentId);
  }

  // Memory Management Methods
  async createMemory(input: CreateMemoryInput): Promise<Memory> {
    const memory = await this.memoryAPI.createMemory(input);
    this.emit(GraphynClient.Events.MEMORY_CREATED, memory);
    return memory;
  }

  async getMemory(id: string): Promise<Memory> {
    return this.memoryAPI.getMemory(id);
  }

  async listMemories(agentId: string): Promise<Memory[]> {
    return this.memoryAPI.getMemories(agentId);
  }

  async deleteMemory(id: string): Promise<void> {
    await this.memoryAPI.deleteMemory(id);
    this.emit(GraphynClient.Events.MEMORY_DELETED, id);
  }

  // Event Handling
  on<E extends keyof GraphynClientEvents>(event: E, listener: GraphynClientEvents[E]): this {

    return super.on(event, listener);
  }
}