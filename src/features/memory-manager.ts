import { Memory, CreateMemoryInput } from '../types/memory';
import { SDKConfig } from '../types/config';

export interface MemoryOptions {
  chunkSize?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

export class MemoryManager {
  private config: SDKConfig;
  private options: MemoryOptions;
  private memories: Map<string, Memory>;

  constructor(config: SDKConfig, options?: MemoryOptions) {
    this.config = config;
    this.options = {
      chunkSize: options?.chunkSize || config.chunkSize || 1000,
      retryAttempts: options?.retryAttempts || config.retryAttempts || 3,
      retryDelay: options?.retryDelay || config.retryDelay || 1000
    };
    this.memories = new Map();
  }

  async initialize(): Promise<void> {
    // Initialization logic can be added here
    return Promise.resolve();
  }

  async createMemory(input: CreateMemoryInput): Promise<Memory> {
    const memory: Memory = {
      id: Math.random().toString(36).substring(7),
      agentId: input.agentId,
      content: input.content,
      type: input.type,
      timestamp: new Date().toISOString(),
      metadata: input.metadata ? { source: 'sdk', ...input.metadata } : { source: 'sdk' },
      createdAt: new Date().toISOString()
    };
    this.memories.set(memory.id, memory);
    return memory;
  }

  async getMemory(id: string): Promise<Memory> {
    const memory = this.memories.get(id);
    if (!memory) {
      throw new Error(`Memory with id ${id} not found`);
    }
    return memory;
  }

  async deleteMemory(id: string): Promise<void> {
    if (!this.memories.has(id)) {
      throw new Error(`Memory with id ${id} not found`);
    }
    this.memories.delete(id);
  }

  async listMemories(agentId: string): Promise<Memory[]> {
    return Array.from(this.memories.values())
      .filter(memory => memory.agentId === agentId);
  }
}