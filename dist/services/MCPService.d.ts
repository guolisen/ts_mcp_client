import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { MCPServerConfig } from '../config/config.js';
export declare class MCPService {
    private clients;
    constructor();
    /**
     * Generate a unique key for a server configuration
     * @param server - The MCP server configuration
     * @returns A unique key for the server
     */
    private getServerKey;
    /**
     * Initialize a client for an MCP server
     * @param server - The MCP server configuration
     * @returns A client for the MCP server
     */
    initClient(server: MCPServerConfig): Promise<Client>;
    /**
     * Close a client connection
     * @param serverKey - The server key
     */
    closeClient(serverKey: string): Promise<void>;
    /**
     * Stop a server
     * @param server - The MCP server configuration
     */
    stopServer(server: MCPServerConfig): Promise<void>;
    /**
     * Restart a server
     * @param server - The MCP server configuration
     */
    restartServer(server: MCPServerConfig): Promise<void>;
    /**
     * List tools for a server
     * @param server - The MCP server configuration
     * @returns A list of tools for the server
     */
    listTools(server: MCPServerConfig): Promise<any[]>;
    /**
     * Call a tool on an MCP server
     * @param server - The MCP server configuration
     * @param name - The name of the tool to call
     * @param args - The arguments to pass to the tool
     * @returns The result of the tool call
     */
    callTool(server: MCPServerConfig, name: string, args: any): Promise<any>;
    /**
     * List resources for a server
     * @param server - The MCP server configuration
     * @returns A list of resources for the server
     */
    listResources(server: MCPServerConfig): Promise<any[]>;
    /**
     * Read a resource from an MCP server
     * @param server - The MCP server configuration
     * @param uri - The URI of the resource to read
     * @returns The resource content
     */
    readResource(server: MCPServerConfig, uri: string): Promise<any>;
}
declare const _default: MCPService;
export default _default;
