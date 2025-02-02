import { BaseAPI } from './base-api';
import type { Memory, CreateMemoryInput } from '../types';
import { GraphynError } from '../errors/sdk-error';

export class MemoryAPI extends BaseAPI {
  async createMemory(input: CreateMemoryInput): Promise<Memory> {
    if (!input.agentId || !input.content || !input.type) {
      throw new GraphynError(
        'Agent ID, content, and type are required',
        'VALIDATION_ERROR',
        400
      );
    }

    return this.request<Memory>('POST', '/memories', { data: input });
  }

  async getMemories(agentId: string): Promise<Memory[]> {
    if (!agentId) {
      throw new GraphynError(
        'Agent ID is required',
        'VALIDATION_ERROR',
        400
      );
    }

    return this.request<Memory[]>('GET', `/agents/${agentId}/memories`);
  }

  async getMemory(memoryId: string): Promise<Memory> {
    if (!memoryId) {
      throw new GraphynError(
        'Memory ID is required',
        'VALIDATION_ERROR',
        400
      );
    }

    return this.request<Memory>('GET', `/memories/${memoryId}`);
  }

  async updateMemory(memoryId: string, data: Partial<CreateMemoryInput>): Promise<Memory> {
    if (!memoryId) {
      throw new GraphynError(
        'Memory ID is required',
        'VALIDATION_ERROR',
        400
      );
    }

    return this.request<Memory>('PUT', `/memories/${memoryId}`, { data });
  }

  async deleteMemory(memoryId: string): Promise<void> {
    if (!memoryId) {
      throw new GraphynError(
        'Memory ID is required',
        'VALIDATION_ERROR',
        400
      );
    }

    await this.request('DELETE', `/memories/${memoryId}`);
  }

  async searchMemories(agentId: string, query: string): Promise<Memory[]> {
    if (!agentId || !query) {
      throw new GraphynError(
        'Agent ID and query are required',
        'VALIDATION_ERROR',
        400
      );
    }

    return this.request<Memory[]>('GET', `/agents/${agentId}/memories/search`, {
      params: { query }
    });
  }

  async batchCreateMemories(inputs: CreateMemoryInput[]): Promise<Memory[]> {
    if (!inputs.length) {
      throw new GraphynError(
        'At least one memory input is required',
        'VALIDATION_ERROR',
        400
      );
    }

    return this.request<Memory[]>('POST', '/memories/batch', { data: inputs });
  }

  async batchDeleteMemories(memoryIds: string[]): Promise<void> {
    if (!memoryIds.length) {
      throw new GraphynError(
        'At least one memory ID is required',
        'VALIDATION_ERROR',
        400
      );
    }

    await this.request('DELETE', '/memories/batch', { data: { memoryIds } });
  }
}