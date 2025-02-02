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

export interface CreateMemoryInput {
  agentId: string;
  content: string;
  type: MemoryType;
  metadata?: {
    source?: string;
    [key: string]: unknown;
  };
}