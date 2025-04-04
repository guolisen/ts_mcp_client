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
export declare const defaultConfig: AppConfig;
