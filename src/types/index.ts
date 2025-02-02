export interface SDKConfig {
  apiKey: string;
  baseUrl?: string;
  retryAttempts?: number;
  retryDelay?: number;
}

export type GraphynConfig = SDKConfig;

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

export interface Memory {
  id: string;
  agentId: string;
  content: string;
  type: 'observation' | 'reflection' | 'plan';
  timestamp: string;
  metadata: Record<string, any>;
}

export interface CreateAgentParams {
  name: string;
  systemPrompt: string;
  context?: string;
  settings?: Partial<AgentSettings>;
}

export interface CreateMemoryInput {
  agentId: string;
  content: string;
  type: Memory['type'];
  metadata?: Record<string, any>;
}

export { GraphynError } from '../errors/sdk-error';