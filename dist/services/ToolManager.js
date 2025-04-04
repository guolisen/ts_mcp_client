import MCPService from './MCPService.js';
export class ToolManager {
    constructor() {
        this.tools = [];
        this.activeServer = null;
    }
    /**
     * Set the active MCP server
     * @param server - The MCP server configuration
     */
    setActiveServer(server) {
        this.activeServer = server;
    }
    /**
     * Load tools from the active MCP server
     */
    async loadTools() {
        if (!this.activeServer) {
            this.tools = [];
            return;
        }
        try {
            const tools = await MCPService.listTools(this.activeServer);
            this.tools = tools.map(tool => ({
                name: tool.name,
                description: tool.description || 'No description available',
                inputSchema: tool.inputSchema || {},
                serverName: tool.serverName || this.activeServer?.name || ''
            }));
        }
        catch (error) {
            console.error('Error loading tools:', error);
            this.tools = [];
        }
    }
    /**
     * Get all loaded tools
     * @returns Array of tools
     */
    getTools() {
        return this.tools;
    }
    /**
     * Format tools for LLM system prompt
     * @returns Formatted tool descriptions
     */
    formatToolsForLLM() {
        if (this.tools.length === 0) {
            return 'No tools available.';
        }
        return this.tools.map(tool => {
            const argsDescription = this.formatArgumentsDescription(tool.inputSchema);
            return `Tool: ${tool.name}
Description: ${tool.description}
Arguments:
${argsDescription}`;
        }).join('\n\n');
    }
    /**
     * Format input schema arguments for LLM
     * @param inputSchema - The tool's input schema
     * @returns Formatted arguments description
     */
    formatArgumentsDescription(inputSchema) {
        if (!inputSchema || !inputSchema.properties) {
            return '- No arguments';
        }
        const required = inputSchema.required || [];
        return Object.entries(inputSchema.properties)
            .map(([paramName, paramInfo]) => {
            const description = paramInfo.description || 'No description';
            const isRequired = required.includes(paramName) ? ' (required)' : '';
            return `- ${paramName}: ${description}${isRequired}`;
        })
            .join('\n');
    }
    /**
     * Parse an LLM response to detect tool calls
     * @param response - The LLM response text
     * @returns A tool call object or null
     */
    parseToolCall(response) {
        try {
            // Try to parse the response as JSON
            const parsed = JSON.parse(response.trim());
            // Check if it has the expected format for a tool call
            if (typeof parsed === 'object' &&
                parsed !== null &&
                'tool' in parsed &&
                'arguments' in parsed &&
                typeof parsed.tool === 'string' &&
                typeof parsed.arguments === 'object') {
                // Check if the tool exists
                const toolExists = this.tools.some(tool => tool.name === parsed.tool);
                if (!toolExists) {
                    console.warn(`Tool "${parsed.tool}" not found in available tools`);
                    return null;
                }
                return {
                    tool: parsed.tool,
                    arguments: parsed.arguments
                };
            }
        }
        catch (e) {
            // Not JSON or invalid format, which is fine for regular responses
        }
        return null;
    }
    /**
     * Execute a tool call
     * @param toolCall - The tool call to execute
     * @returns The result of the tool execution
     */
    async executeTool(toolCall) {
        if (!this.activeServer) {
            throw new Error('No active MCP server');
        }
        try {
            return await MCPService.callTool(this.activeServer, toolCall.tool, toolCall.arguments);
        }
        catch (error) {
            console.error(`Error executing tool ${toolCall.tool}:`, error);
            throw error;
        }
    }
    /**
     * Build the system message with tool descriptions
     * @returns System message for LLM
     */
    buildSystemMessage() {
        const toolsDescription = this.formatToolsForLLM();
        return `You are a helpful assistant with access to these tools:

${toolsDescription}

Choose the appropriate tool based on the user's question. If no tool is needed, reply directly.

IMPORTANT: When you need to use a tool, you must ONLY respond with the exact JSON object format below, nothing else:
{
    "tool": "tool-name",
    "arguments": {
        "argument-name": "value"
    }
}

After receiving a tool's response:
1. Transform the raw data into a natural, conversational response
2. Keep responses concise but informative
3. Focus on the most relevant information
4. Use appropriate context from the user's question
5. Avoid simply repeating the raw data

Please use only the tools that are explicitly defined above.`;
    }
}
export default new ToolManager();
