import readline from 'readline';
import { loadConfig } from './config/configLoader.js';
import MCPService from './services/MCPService.js';
import LLMService from './services/LLMService.js';
import { AppConfig, MCPServerConfig } from './config/config.js';

// Create readline interface for console input/output
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class MCPClient {
  private config: AppConfig;
  private llmService: LLMService;
  private activeServer: MCPServerConfig | null = null;
  private history: Array<{ role: string; content: string }> = [];

  constructor(configPath?: string) {
    // Load configuration
    this.config = loadConfig(configPath);
    
    // Initialize LLM service
    this.llmService = new LLMService(this.config.llm);
    
    // Set default active server if configured
    if (this.config.defaultMCPServer && this.config.mcpServers[this.config.defaultMCPServer]) {
      this.activeServer = this.config.mcpServers[this.config.defaultMCPServer];
      console.log(`Default MCP server set to: ${this.activeServer.name}`);
    }
  }

  /**
   * List available MCP servers
   */
  listServers(): void {
    console.log('\nAvailable MCP Servers:');
    console.log('---------------------');
    
    Object.entries(this.config.mcpServers).forEach(([key, server], index) => {
      const status = server.enabled ? 'Enabled' : 'Disabled';
      const active = this.activeServer?.name === server.name ? '* ' : '  ';
      console.log(`${active}${index + 1}. ${server.name} (${status})`);
    });
    
    console.log('');
  }

  /**
   * List tools for the active MCP server
   */
  async listTools(): Promise<void> {
    if (!this.activeServer) {
      console.log('No active MCP server. Please set an active server first.');
      return;
    }

    try {
      const tools = await MCPService.listTools(this.activeServer);
      console.log(`\nTools for ${this.activeServer.name}:`);
      console.log('-------------------------');
      
      tools.forEach((tool: any, index: number) => {
        console.log(`${index + 1}. ${tool.name}`);
        if (tool.description) console.log(`   Description: ${tool.description}`);
        console.log('');
      });
    } catch (error) {
      console.error(`Error listing tools: ${error}`);
    }
  }
  
  /**
   * List resources for the active MCP server
   */
  async listResources(): Promise<void> {
    if (!this.activeServer) {
      console.log('No active MCP server. Please set an active server first.');
      return;
    }

    try {
      const resources = await MCPService.listResources(this.activeServer);
      console.log(`\nResources for ${this.activeServer.name}:`);
      console.log('-------------------------');
      
      resources.forEach((resource: any, index: number) => {
        console.log(`${index + 1}. ${resource.uri}`);
        if (resource.name) console.log(`   Name: ${resource.name}`);
        if (resource.description) console.log(`   Description: ${resource.description}`);
        console.log('');
      });
    } catch (error) {
      console.error(`Error listing resources: ${error}`);
    }
  }

  /**
   * Set the active MCP server
   * @param serverKey - The key of the server to set as active
   */
  setActiveServer(serverKey: string): void {
    if (this.config.mcpServers[serverKey]) {
      const server = this.config.mcpServers[serverKey];
      if (!server.enabled) {
        console.log(`Server '${server.name}' is disabled.`);
        return;
      }
      
      this.activeServer = server;
      console.log(`Active MCP server set to: ${server.name}`);
    } else {
      console.log(`Server '${serverKey}' not found.`);
    }
  }

  /**
   * Enable or disable an MCP server
   * @param serverKey - The key of the server to enable/disable
   * @param enable - Whether to enable or disable the server
   */
  toggleServerStatus(serverKey: string, enable: boolean): void {
    if (this.config.mcpServers[serverKey]) {
      this.config.mcpServers[serverKey].enabled = enable;
      const status = enable ? 'enabled' : 'disabled';
      console.log(`Server '${this.config.mcpServers[serverKey].name}' ${status}.`);
      
      // If disabling the active server, clear it
      if (!enable && this.activeServer?.name === this.config.mcpServers[serverKey].name) {
        this.activeServer = null;
        console.log('Active server cleared.');
      }
    } else {
      console.log(`Server '${serverKey}' not found.`);
    }
  }

  /**
   * Call a tool on the active MCP server
   * @param toolName - The name of the tool to call
   * @param args - The arguments to pass to the tool
   */
  async callTool(toolName: string, args: any): Promise<void> {
    if (!this.activeServer) {
      console.log('No active MCP server. Please set an active server first.');
      return;
    }

    try {
      const result = await MCPService.callTool(this.activeServer, toolName, args);
      console.log('\nTool Result:');
      console.log('------------');
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error(`Error calling tool: ${error}`);
    }
  }
  
  /**
   * Read a resource from the active MCP server
   * @param uri - The URI of the resource to read
   */
  async readResource(uri: string): Promise<void> {
    if (!this.activeServer) {
      console.log('No active MCP server. Please set an active server first.');
      return;
    }

    try {
      const result = await MCPService.readResource(this.activeServer, uri);
      console.log('\nResource Content:');
      console.log('-----------------');
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error(`Error reading resource: ${error}`);
    }
  }

  /**
   * Send a message to the LLM
   * @param message - The message to send
   */
  async sendMessage(message: string): Promise<void> {
    // Add user message to history
    this.history.push({ role: 'user', content: message });
    
    try {
      // Send request to LLM
      const response = await this.llmService.chat(this.history);
      
      // Print response
      console.log(`\nLLM: ${response.text}\n`);
      
      // Add assistant message to history
      this.history.push({ role: 'assistant', content: response.text });
      
      // Print token usage if available
      if (response.usage) {
        const { promptTokens, completionTokens, totalTokens } = response.usage;
        console.log('Token Usage:');
        if (promptTokens !== undefined) console.log(`- Prompt tokens: ${promptTokens}`);
        if (completionTokens !== undefined) console.log(`- Completion tokens: ${completionTokens}`);
        if (totalTokens !== undefined) console.log(`- Total tokens: ${totalTokens}`);
        console.log();
      }
    } catch (error) {
      console.error(`Error sending message to LLM: ${error}`);
    }
  }

  /**
   * Clear the chat history
   */
  clearHistory(): void {
    this.history = [];
    console.log('Chat history cleared.');
  }

  /**
   * Process a command from the user
   * @param command - The command to process
   */
  async processCommand(command: string): Promise<boolean> {
    const tokens = command.trim().split(' ');
    const cmd = tokens[0].toLowerCase();
    
    switch (cmd) {
      case 'exit':
      case 'quit':
        return false;
        
      case 'help':
        this.showHelp();
        break;
        
      case 'servers':
        this.listServers();
        break;
        
      case 'use':
        if (tokens.length > 1) {
          this.setActiveServer(tokens[1]);
        } else {
          console.log('Usage: use <server-key>');
        }
        break;
        
      case 'enable':
        if (tokens.length > 1) {
          this.toggleServerStatus(tokens[1], true);
        } else {
          console.log('Usage: enable <server-key>');
        }
        break;
        
      case 'disable':
        if (tokens.length > 1) {
          this.toggleServerStatus(tokens[1], false);
        } else {
          console.log('Usage: disable <server-key>');
        }
        break;
        
      case 'tools':
        await this.listTools();
        break;
        
      case 'resources':
        await this.listResources();
        break;
        
      case 'call':
        if (tokens.length > 2) {
          const toolName = tokens[1];
          try {
            const args = JSON.parse(tokens.slice(2).join(' '));
            await this.callTool(toolName, args);
          } catch (error) {
            console.error('Error parsing arguments. Please provide valid JSON.');
          }
        } else {
          console.log('Usage: call <tool-name> <json-arguments>');
        }
        break;
        
      case 'resource':
        if (tokens.length > 1) {
          const uri = tokens.slice(1).join(' ');
          await this.readResource(uri);
        } else {
          console.log('Usage: resource <uri>');
        }
        break;
        
      case 'clear':
        this.clearHistory();
        break;
        
      case 'config':
        console.log('\nCurrent Configuration:');
        console.log('---------------------');
        console.log(JSON.stringify(this.config, null, 2));
        break;
        
      default:
        // If not a command, treat as a message to the LLM
        await this.sendMessage(command);
        break;
    }
    
    return true;
  }

  /**
   * Show help information
   */
  showHelp(): void {
    console.log('\nAvailable Commands:');
    console.log('-----------------');
    console.log('help             - Show this help message');
    console.log('servers          - List available MCP servers');
    console.log('use <server-key> - Set the active MCP server');
    console.log('enable <server>  - Enable an MCP server');
    console.log('disable <server> - Disable an MCP server');
    console.log('tools            - List tools for the active MCP server');
    console.log('resources        - List resources for the active MCP server');
    console.log('call <tool> <args> - Call a tool with JSON arguments');
    console.log('resource <uri>   - Read a resource from the active MCP server');
    console.log('clear            - Clear chat history');
    console.log('config           - Show current configuration');
    console.log('exit/quit        - Exit the application');
    console.log('\nAnything else will be sent as a message to the LLM.\n');
  }

  /**
   * Start the interactive console
   */
  async start(): Promise<void> {
    console.log('\nMCP Client started.');
    console.log(`LLM provider: ${this.config.llm.provider}`);
    
    if (this.activeServer) {
      console.log(`Active MCP server: ${this.activeServer.name}`);
    } else {
      console.log('No active MCP server.');
    }
    
    console.log('\nType "help" for available commands.');
    
    const promptUser = () => {
      rl.question('> ', async (input) => {
        const shouldContinue = await this.processCommand(input);
        
        if (shouldContinue) {
          promptUser();
        } else {
          rl.close();
        }
      });
    };
    
    promptUser();
  }
}

export default MCPClient;

// The module check is now handled in index.ts
