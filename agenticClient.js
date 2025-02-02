import { WebCrypto } from 'node:crypto';
import { EventEmitter } from 'events';

class AgenticClient extends EventEmitter {
  constructor(config = {}) {
    super();
    this.crypto = new WebCrypto();
    this.encryptionKey = null;
    this.config = {
      chunkSize: 1024 * 1024, // 1MB chunks
      retryAttempts: 3,
      ...config
    };
  }

  async init() {
    // Generate encryption keys for local data
    this.encryptionKey = await this.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  async encryptChunk(data) {
    const iv = this.crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(JSON.stringify(data));
    
    const encrypted = await this.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.encryptionKey,
      encoded
    );

    return {
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(encrypted))
    };
  }

  // Upload data in chunks
  async uploadData(data) {
    const chunks = this.chunkData(data);
    const results = [];

    for (const chunk of chunks) {
      const encrypted = await this.encryptChunk(chunk);
      const result = await this.sendChunk(encrypted);
      results.push(result);
    }

    return results;
  }
} 