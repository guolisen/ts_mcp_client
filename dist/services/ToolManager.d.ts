import { MCPServerConfig } from '../config/config.js';
export interface Tool {
    name: string;
    description: string;
    inputSchema: any;
    serverName: string;
}
export interface ToolCall {
    tool: string;
    arguments: Record<string, any>;
}
export declare class ToolManager {
    private tools;
    private activeServer;
    /**
     * Set the active MCP server
     * @param server - The MCP server configuration
     */
    setActiveServer(server: MCPServerConfig | null): void;
    /**
     * Load tools from the active MCP server
     */
    loadTools(): Promise<void>;
    /**
     * Get all loaded tools
     * @returns Array of tools
     */
    getTools(): Tool[];
    /**
     * Format tools for LLM system prompt
     * @returns Formatted tool descriptions
     */
    formatToolsForLLM(): string;
    /**
     * Format input schema arguments for LLM
     * @param inputSchema - The tool's input schema
     * @returns Formatted arguments description
     */
    private formatArgumentsDescription;
    /**
     * Parse an LLM response to detect tool calls
     * @param response - The LLM response text
     * @returns A tool call object or null
     */
    parseToolCall(response: string): ToolCall | null;
    /**
     * Execute a tool call
     * @param toolCall - The tool call to execute
     * @returns The result of the tool execution
     */
    executeTool(toolCall: ToolCall): Promise<any>;
    /**
     * Build the system message with tool descriptions
     * @returns System message for LLM
     */
    buildSystemMessage(): string;
}
declare const _default: ToolManager;
export default _default;
