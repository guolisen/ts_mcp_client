declare class MCPClient {
    private config;
    private llmService;
    private activeServer;
    private history;
    constructor(configPath?: string);
    /**
     * List available MCP servers
     */
    listServers(): void;
    /**
     * List tools for the active MCP server
     */
    listTools(): Promise<void>;
    /**
     * List resources for the active MCP server
     */
    listResources(): Promise<void>;
    /**
     * Set the active MCP server
     * @param serverKey - The key of the server to set as active
     */
    setActiveServer(serverKey: string): void;
    /**
     * Enable or disable an MCP server
     * @param serverKey - The key of the server to enable/disable
     * @param enable - Whether to enable or disable the server
     */
    toggleServerStatus(serverKey: string, enable: boolean): void;
    /**
     * Call a tool on the active MCP server
     * @param toolName - The name of the tool to call
     * @param args - The arguments to pass to the tool
     */
    callTool(toolName: string, args: any): Promise<void>;
    /**
     * Read a resource from the active MCP server
     * @param uri - The URI of the resource to read
     */
    readResource(uri: string): Promise<void>;
    /**
     * Send a message to the LLM
     * @param message - The message to send
     */
    sendMessage(message: string): Promise<void>;
    /**
     * Clear the chat history
     */
    clearHistory(): void;
    /**
     * Process a command from the user
     * @param command - The command to process
     */
    processCommand(command: string): Promise<boolean>;
    /**
     * Show help information
     */
    showHelp(): void;
    /**
     * Start the interactive console
     */
    start(): Promise<void>;
}
export default MCPClient;
