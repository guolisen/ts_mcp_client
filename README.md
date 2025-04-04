# TypeScript MCP Client

A TypeScript-based Model Context Protocol (MCP) client for testing MCP servers, with support for multiple LLM providers.

## Features

- Support for multiple LLM providers (Ollama, OpenAI, OpenRouter, Deepseek)
- Support for MCP servers (default: mcp_k8s_server)
- Configurable via JSON config file or environment variables
- Interactive console interface for testing

## Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Make the CLI executable
chmod +x ./dist/index.js
```

## Usage

```bash
# Run with default configuration
npm start

# Run with custom configuration file
npm start -- ./config.json
```

## Configuration

You can configure the client using a JSON file or environment variables.

### Config File Examples

#### Basic Configuration

```json
{
  "llm": {
    "provider": "ollama",
    "baseUrl": "http://localhost:11434",
    "model": "llama3",
    "temperature": 0.7,
    "maxTokens": 1000
  },
  "mcpServers": {
    "k8s": {
      "name": "mcp_k8s_server",
      "command": "mcp_k8s_server",
      "enabled": true
    },
    "custom": {
      "name": "custom_mcp_server",
      "command": "custom_mcp_server",
      "enabled": false
    }
  },
  "defaultMCPServer": "k8s"
}
```

#### MCP Server Configuration Examples

##### Local MCP Server
```json
{
  "mcpServers": {
    "local": {
      "name": "local_mcp_server",
      "command": "mcp_server",
      "args": ["--option1", "--option2"],
      "enabled": true
    }
  }
}
```

##### Remote MCP Server
```json
{
  "mcpServers": {
    "remote": {
      "name": "remote_mcp_server",
      "baseUrl": "http://192.168.182.128:8000",
      "enabled": true
    }
  }
}
```

##### Multiple MCP Servers
```json
{
  "mcpServers": {
    "k8s": {
      "name": "mcp_k8s_server",
      "baseUrl": "http://192.168.182.128:8000",
      "enabled": true
    },
    "custom": {
      "name": "custom_mcp_server",
      "baseUrl": "http://192.168.1.100:9000",
      "enabled": false
    }
  },
  "defaultMCPServer": "k8s"
}
```

#### LLM Provider Configuration Examples

##### Ollama (Local)
```json
{
  "llm": {
    "provider": "ollama",
    "baseUrl": "http://localhost:11434",
    "model": "llama3",
    "temperature": 0.7,
    "maxTokens": 1000
  }
}
```
Note: Ollama typically doesn't require an API key when running locally.

##### OpenAI
```json
{
  "llm": {
    "provider": "openai",
    "apiKey": "sk-your-openai-key-here",
    "model": "gpt-3.5-turbo",
    "temperature": 0.7,
    "maxTokens": 1000
  }
}
```

##### OpenRouter
```json
{
  "llm": {
    "provider": "openrouter",
    "apiKey": "your-openrouter-key-here",
    "baseUrl": "https://openrouter.ai/api/v1",
    "model": "anthropic/claude-3-opus",
    "temperature": 0.7,
    "maxTokens": 1000
  }
}
```

##### Deepseek
```json
{
  "llm": {
    "provider": "deepseek",
    "apiKey": "your-deepseek-key-here",
    "baseUrl": "https://api.deepseek.com/v1",
    "model": "deepseek-chat",
    "temperature": 0.7,
    "maxTokens": 1000
  }
}
```

### Environment Variables

- `LLM_PROVIDER`: The LLM provider to use (ollama, openai, openrouter, deepseek)
- `LLM_API_KEY`: API key for the LLM provider
- `LLM_BASE_URL`: Base URL for the LLM provider's API
- `LLM_MODEL`: Model to use for the LLM
- `LLM_TEMPERATURE`: Temperature setting for the LLM
- `LLM_MAX_TOKENS`: Maximum tokens to generate
- `DEFAULT_MCP_SERVER`: Default MCP server to use

## Available Commands

Once the client is running, you can use the following commands:

- `help`: Show available commands
- `servers`: List available MCP servers
- `use <server-key>`: Set the active MCP server
- `enable <server>`: Enable an MCP server
- `disable <server>`: Disable an MCP server
- `tools`: List tools for the active MCP server
- `resources`: List resources for the active MCP server
- `call <tool> <args>`: Call a tool with JSON arguments
- `resource <uri>`: Read a resource from the active MCP server
- `clear`: Clear chat history
- `config`: Show current configuration
- `exit/quit`: Exit the application

## Example Session

```
MCP Client started.
LLM provider: ollama
Active MCP server: mcp_k8s_server

Type "help" for available commands.
> servers

Available MCP Servers:
---------------------
* 1. mcp_k8s_server (Enabled)
  2. custom_mcp_server (Disabled)

> tools

Tools for mcp_k8s_server:
-------------------------
1. get_pods
   Description: Get all pods in the namespace

2. get_pod_logs
   Description: Get logs for a specific pod

> call get_pods {"namespace": "default"}

Tool Result:
------------
{
  "content": [
    {
      "type": "text",
      "text": "[{\"name\":\"nginx-pod\",\"namespace\":\"default\",\"status\":\"Running\"}]"
    }
  ]
}

> exit
```

## License

MIT
