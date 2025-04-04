import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport, getDefaultEnvironment } from '@modelcontextprotocol/sdk/client/stdio.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import { MCPServerConfig } from '../config/config.js';

export class MCPService {
  private clients: Map<string, Client> = new Map();

  constructor() {}

  /**
   * Generate a unique key for a server configuration
   * @param server - The MCP server configuration
   * @returns A unique key for the server
   */
  private getServerKey(server: MCPServerConfig): string {
    return JSON.stringify({
      baseUrl: server.baseUrl,
      command: server.command,
      args: server.args,
      registryUrl: server.registryUrl,
      env: server.env,
      name: server.name
    });
  }

  /**
   * Initialize a client for an MCP server
   * @param server - The MCP server configuration
   * @returns A client for the MCP server
   */
  async initClient(server: MCPServerConfig): Promise<Client> {
    const serverKey = this.getServerKey(server);

    // Check if we already have a client for this server configuration
    const existingClient = this.clients.get(serverKey);
    if (existingClient) {
      // Check if the existing client is still connected
      try {
        const pingResult = await existingClient.ping();
        console.log(`[MCP] Ping result for ${server.name}:`, pingResult);
        // If the ping succeeds, return the existing client
        if (pingResult) {
          return existingClient;
        }
        // If the ping fails, remove the client from the cache
        this.clients.delete(serverKey);
      } catch (error) {
        console.error(`[MCP] Error pinging ${server.name}:`, error);
        this.clients.delete(serverKey);
      }
    }

    // Create new client instance for each connection
    const client = new Client({ name: 'MCP Test Client', version: '1.0.0' }, { capabilities: {} });

    const args = [...(server.args || [])];
    let transport: StdioClientTransport | SSEClientTransport;

    try {
      // Create appropriate transport based on configuration
      if (server.baseUrl) {
        transport = new SSEClientTransport(new URL(server.baseUrl));
      } else if (server.command) {
        const cmd = server.command;
        console.log(`[MCP] Starting server with command: ${cmd} ${args ? args.join(' ') : ''}`);

        transport = new StdioClientTransport({
          command: cmd,
          args,
          env: {
            ...getDefaultEnvironment(),
            PATH: process.env.PATH || '',
            ...server.env
          }
        });
      } else {
        throw new Error('Either baseUrl or command must be provided');
      }

      await client.connect(transport);

      // Store the new client in the cache
      this.clients.set(serverKey, client);

      console.log(`[MCP] Activated server: ${server.name}`);
      return client;
    } catch (error: any) {
      console.error(`[MCP] Error activating server ${server.name}:`, error);
      throw error;
    }
  }

  /**
   * Close a client connection
   * @param serverKey - The server key
   */
  async closeClient(serverKey: string): Promise<void> {
    const client = this.clients.get(serverKey);
    if (client) {
      // Remove the client from the cache
      await client.close();
      console.log(`[MCP] Closed server with key: ${serverKey}`);
      this.clients.delete(serverKey);
    } else {
      console.warn(`[MCP] No client found for server key: ${serverKey}`);
    }
  }

  /**
   * Stop a server
   * @param server - The MCP server configuration
   */
  async stopServer(server: MCPServerConfig): Promise<void> {
    const serverKey = this.getServerKey(server);
    console.log(`[MCP] Stopping server: ${server.name}`);
    await this.closeClient(serverKey);
  }

  /**
   * Restart a server
   * @param server - The MCP server configuration
   */
  async restartServer(server: MCPServerConfig): Promise<void> {
    console.log(`[MCP] Restarting server: ${server.name}`);
    const serverKey = this.getServerKey(server);
    await this.closeClient(serverKey);
    await this.initClient(server);
  }

  /**
   * List tools for a server
   * @param server - The MCP server configuration
   * @returns A list of tools for the server
   */
  async listTools(server: MCPServerConfig): Promise<any[]> {
    console.log(`[MCP] Listing tools for server: ${server.name}`);
    const client = await this.initClient(server);
    const { tools } = await client.listTools();
    return tools.map((tool: any) => ({
      ...tool,
      serverName: server.name
    }));
  }

  /**
   * Call a tool on an MCP server
   * @param server - The MCP server configuration
   * @param name - The name of the tool to call
   * @param args - The arguments to pass to the tool
   * @returns The result of the tool call
   */
  async callTool(server: MCPServerConfig, name: string, args: any): Promise<any> {
    try {
      console.log(`[MCP] Calling: ${server.name} - ${name}`, args);
      const client = await this.initClient(server);
      const result = await client.callTool({ name, arguments: args });
      return result;
    } catch (error) {
      console.error(`[MCP] Error calling tool ${name} on ${server.name}:`, error);
      throw error;
    }
  }
  
  /**
   * List resources for a server
   * @param server - The MCP server configuration
   * @returns A list of resources for the server
   */
  async listResources(server: MCPServerConfig): Promise<any[]> {
    console.log(`[MCP] Listing resources for server: ${server.name}`);
    const client = await this.initClient(server);
    const { resources } = await client.listResources();
    return resources.map((resource: any) => ({
      ...resource,
      serverName: server.name
    }));
  }
  
  /**
   * Read a resource from an MCP server
   * @param server - The MCP server configuration
   * @param uri - The URI of the resource to read
   * @returns The resource content
   */
  async readResource(server: MCPServerConfig, uri: string): Promise<any> {
    try {
      console.log(`[MCP] Reading resource: ${server.name} - ${uri}`);
      const client = await this.initClient(server);
      const result = await client.readResource({ uri });
      return result;
    } catch (error) {
      console.error(`[MCP] Error reading resource ${uri} on ${server.name}:`, error);
      throw error;
    }
  }
}

export default new MCPService();
