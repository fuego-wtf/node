import { BaseAPI } from './base-api';
import type { Agent, AgentSettings, AgentStats, CreateAgentParams } from '../types';
import { GraphynError } from '../errors/sdk-error';

export class AgentAPI extends BaseAPI {
  async getAgent(agentId: string): Promise<Agent> {
    if (!agentId) {
      throw new GraphynError('Agent ID is required', 'VALIDATION_ERROR', 400);
    }
    return this.request<Agent>('GET', `/agents/${agentId}`);
  }

  async updateAgent(agentId: string, data: Partial<Agent>): Promise<Agent> {
    return this.request<Agent>('PUT', `/agents/${agentId}`, { data });
  }

  async deleteAgent(agentId: string): Promise<void> {
    await this.request('DELETE', `/agents/${agentId}`);
  }

  async getUserAgents(): Promise<Agent[]> {
    return this.request<Agent[]>('GET', '/agents');
  }

  async createAgent(data: CreateAgentParams): Promise<Agent> {
    if (!data.name || !data.systemPrompt) {
      throw new GraphynError('Name and system prompt are required', 'VALIDATION_ERROR', 400);
    }
    return this.request<Agent>('POST', '/agents', { data });
  }

  async updateAgentSettings(agentId: string, settings: Partial<AgentSettings>): Promise<Agent> {
    if (!agentId) {
      throw new GraphynError('Agent ID is required', 'VALIDATION_ERROR', 400);
    }
    return this.request<Agent>('PATCH', `/agents/${agentId}/settings`, { data: settings });
  }

  async getAgentStats(agentId: string): Promise<AgentStats> {
    if (!agentId) {
      throw new GraphynError('Agent ID is required', 'VALIDATION_ERROR', 400);
    }
    return this.request<AgentStats>('GET', `/agents/${agentId}/stats`);
  }
}