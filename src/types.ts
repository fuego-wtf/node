export interface SDKConfig {
  baseUrl: string;
  apiKey: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

export type MemoryType = 'observation' | 'reflection' | 'plan';

export interface Memory {
  id: string;
  agentId: string;
  content: string;
  type: MemoryType;
  timestamp: string;
  metadata?: {
    source: string;
    [key: string]: unknown;
  };
  createdAt: string;
  vectorId?: string;
}

export interface CreateAgentInput {
  name: string;
  systemPrompt: string;
  context?: string;
  settings?: Partial<AgentSettings>;
}

export interface CreateMemoryInput {
  agentId: string;
  content: string;
  type: MemoryType;
  metadata?: Record<string, unknown>;
}

export interface Agent {
  id: string;
  name: string;
  systemPrompt: string;
  context: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  status: 'idle' | 'active' | 'error';
  settings: AgentSettings;
  stats?: AgentStats;
  memories: Memory[];
}

export interface AgentSettings {
  temperature: number;
  maxTokens: number;
  model: string;
  topP: number;
  memoryLimit: number;
}

export interface AgentStats {
  totalMemories: number;
  activeTime: string;
  lastActive: string;
  processingPower: string;
}

export interface SDKConfig {
  baseUrl: string;
  apiKey: string;
  options?: {
    timeout?: number;
    retries?: number;
  };
}

export interface CreateAgentInput {
  name: string;
  systemPrompt: string;
  context?: string;
  settings?: Partial<AgentSettings>;
}