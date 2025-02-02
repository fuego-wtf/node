import { Memory } from './memory';

export interface Agent {
  id: string;
  name: string;
  systemPrompt: string;
  context?: string;
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

export interface CreateAgentInput {
  name: string;
  systemPrompt: string;
  context?: string;
  settings: Partial<AgentSettings>;
  userId: string;
}