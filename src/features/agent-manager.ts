import { Agent, CreateAgentInput, SDKConfig, AgentSettings, AgentStats } from './types';

export class AgentManager {
  private config: SDKConfig;
  private agents: Map<string, Agent>;

  constructor(config: SDKConfig) {
    this.config = config;
    this.agents = new Map();
  }

  async createAgent(input: CreateAgentInput): Promise<Agent> {
    const agent: Agent = {
      id: Math.random().toString(36).substring(7),
      name: input.name,
      systemPrompt: input.systemPrompt,
      context: input.context,
      userId: 'default',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      status: 'idle',
      settings: input.settings,
      memories: []
    };
    this.agents.set(agent.id, agent);
    return agent;
  }

  async getAgent(id: string): Promise<Agent> {
    const agent = this.agents.get(id);
    if (!agent) {
      throw new Error(`Agent with id ${id} not found`);
    }
    return agent;
  }

  async updateAgent(id: string, updates: Partial<Agent>): Promise<Agent> {
    const agent = await this.getAgent(id);
    const updatedAgent = { ...agent, ...updates, updatedAt: new Date().toISOString() };
    this.agents.set(id, updatedAgent);
    return updatedAgent;
  }

  async deleteAgent(id: string): Promise<void> {
    if (!this.agents.has(id)) {
      throw new Error(`Agent with id ${id} not found`);
    }
    this.agents.delete(id);
  }

  async listAgents(): Promise<Agent[]> {
    return Array.from(this.agents.values());
  }

  async updateAgentSettings(id: string, settings: Partial<AgentSettings>): Promise<Agent> {
    const agent = await this.getAgent(id);
    return this.updateAgent(id, {
      settings: { ...agent.settings, ...settings }
    });
  }

  async getAgentStats(id: string): Promise<AgentStats> {
    const agent = await this.getAgent(id);
    return {
      totalMemories: agent.memories.length,
      activeTime: '0',
      lastActive: agent.updatedAt,
      processingPower: '0'
    };
  }
}