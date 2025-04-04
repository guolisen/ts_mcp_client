export interface LLMConfig {
  provider: string;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface MCPServerConfig {
  name: string;
  command?: string;
  args?: string[];
  baseUrl?: string;
  registryUrl?: string;
  env?: Record<string, string>;
  autoApprove?: string[];
  enabled: boolean;
}

export interface AppConfig {
  llm: LLMConfig;
  mcpServers: Record<string, MCPServerConfig>;
  defaultMCPServer?: string;
}

// Default configuration
export const defaultConfig: AppConfig = {
  llm: {
    provider: 'ollama',
    baseUrl: 'http://localhost:11434',
    model: 'llama3',
    temperature: 0.7,
    maxTokens: 1000
  },
  mcpServers: {
    'k8s': {
      name: 'mcp_k8s_server',
      command: 'mcp_k8s_server',
      enabled: true
    }
  },
  defaultMCPServer: 'k8s'
};
