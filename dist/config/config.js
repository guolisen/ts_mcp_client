// Default configuration
export const defaultConfig = {
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
