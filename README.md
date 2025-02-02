# coregraph-sdk

typescript sdk for coregraph service

## features

- 🔒 **auth** - jwt authentication handling
- 🧠 **graph** - node and edge operations
- 🔄 **retry** - automatic request retries
- 📊 **rate limit** - backoff handling
- 🌐 **real-time** - event subscriptions
- 📝 **types** - full typescript support

## installation

```bash
npm install coregraph-sdk
```

## usage

### basic example
```typescript
import { CoreGraphClient } from 'coregraph-sdk';

// initialize client
const client = new CoreGraphClient({
  baseURL: 'http://localhost:3000',
  token: 'your-jwt-token'
});

// authenticate
const auth = await client.auth.login({
  email: 'user@example.com',
  password: 'password'
});

// create a node
const node = await client.graph.createNode({
  labels: ['person'],
  props: {
    name: 'john',
    age: 30
  }
});

// create an edge
const edge = await client.graph.createEdge({
  source: node.id,
  target: 'another-node-id',
  label: 'knows',
  props: {
    since: '2024'
  }
});

// query nodes
const nodes = await client.graph.queryNodes({
  label: 'person',
  props: {
    age: 30
  }
});
```

### error handling
```typescript
try {
  await client.graph.createNode({...});
} catch (error) {
  if (error.code === 'RATE_LIMIT') {
    // handle rate limit
    await delay(error.retryAfter);
  } else if (error.code === 'AUTH_ERROR') {
    // handle auth error
    await client.auth.refresh();
  }
}
```

### real-time updates
```typescript
// subscribe to node events
client.events.subscribe('node.created', (node) => {
  console.log('new node:', node);
});

// subscribe to edge events
client.events.subscribe('edge.created', (edge) => {
  console.log('new edge:', edge);
});

// handle connection issues
client.events.on('disconnect', () => {
  console.log('connection lost');
});

client.events.on('reconnect', () => {
  console.log('reconnected');
});
```

## development

### setup
```bash
npm install
npm run build
```

### testing
```bash
npm test
npm run test:watch
```

### documentation
```bash
npm run docs
```

### linting
```bash
npm run lint
npm run format
```

## api reference

### coregraphclient

```typescript
new CoreGraphClient(config: CoreGraphConfig)
```

#### configuration

- `baseURL`: api endpoint
- `token`: jwt token
- `timeout`: request timeout in ms (default: 30000)
- `retryAttempts`: number of retry attempts (default: 3)
- `retryDelay`: delay between retries in ms (default: 1000)
- `autoRetry`: auto retry on rate limit (default: true)
- `autoRefresh`: auto refresh token (default: true)

#### methods

##### auth
- `login(credentials: LoginCredentials): Promise<AuthResponse>`
- `getSession(): Promise<SessionResponse>`
- `logout(): Promise<void>`
- `refresh(): Promise<AuthResponse>`

##### graph
- `createNode(node: NodeInput): Promise<Node>`
- `queryNodes(filter: NodeFilter): Promise<Node[]>`
- `createEdge(edge: EdgeInput): Promise<Edge>`
- `queryEdges(filter: EdgeFilter): Promise<Edge[]>`
- `deleteNode(id: string): Promise<void>`
- `deleteEdge(id: string): Promise<void>`
- `updateNode(id: string, update: Partial<NodeInput>): Promise<Node>`
- `updateEdge(id: string, update: Partial<EdgeInput>): Promise<Edge>`

##### events
- `subscribe(event: string, handler: EventHandler): () => void`
- `unsubscribe(event: string): void`
- `on(event: string, handler: EventHandler): void`
- `off(event: string, handler: EventHandler): void`

## types

```typescript
interface Node {
  id: string;
  labels: string[];
  props: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface Edge {
  id: string;
  source: string;
  target: string;
  label: string;
  props: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface SessionResponse {
  user: {
    id: string;
    email: string;
    roles: string[];
  };
  authenticated: boolean;
}

interface CoreGraphError extends Error {
  code: string;
  retryAfter?: number;
  details?: any;
}
```

## license

mit