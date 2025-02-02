import { BaseAPI } from './base-api';
import type { Agent, CreateAgentInput, AgentSettings, AgentStats } from '../types';
import { GraphynError } from '../errors/sdk-error';

export class AgentAPI extends BaseAPI {
  async createAgent(input: CreateAgentInput): Promise<Agent> {
    if (!input.name || !input.systemPrompt) {
      throw new GraphynError(
        'Name and system prompt are required',
        'VALIDATION_ERROR',
        400
      );
    }

    return this.request<Agent>('POST', '/agents', { data: input });
  }

  async getAgent(agentId: string): Promise<Agent> {
    if (!agentId) {
      throw new GraphynError(
        'Agent ID is required',
        'VALIDATION_ERROR',
        400
      );
    }

    return this.request<Agent>('GET', `/agents/${agentId}`);
  }

  async updateAgent(agentId: string, updates: Partial<Agent>): Promise<Agent> {
    if (!agentId) {
      throw new GraphynError(
        'Agent ID is required',
        'VALIDATION_ERROR',
        400
      );
    }

    return this.request<Agent>('PUT', `/agents/${agentId}`, { data: updates });
  }

  async deleteAgent(agentId: string): Promise<void> {
    if (!agentId) {
      throw new GraphynError(
        'Agent ID is required',
        'VALIDATION_ERROR',
        400
      );
    }

    await this.request('DELETE', `/agents/${agentId}`);
  }

  async listAgents(): Promise<Agent[]> {
    return this.request<Agent[]>('GET', '/agents');
  }

  async updateAgentSettings(agentId: string, settings: Partial<AgentSettings>): Promise<Agent> {
    if (!agentId) {
      throw new GraphynError(
        'Agent ID is required',
        'VALIDATION_ERROR',
        400
      );
    }

    return this.request<Agent>('PUT', `/agents/${agentId}/settings`, { data: settings });
  }

  async getAgentStats(agentId: string): Promise<AgentStats> {
    if (!agentId) {
      throw new GraphynError(
        'Agent ID is required',
        'VALIDATION_ERROR',
        400
      );
    }

    const stats = await this.request<AgentStats>('GET', `/agents/${agentId}/stats`);
    return stats;
  }
}