#!/usr/bin/env node
import MCPClient from './client.js';
// Get config file path from command line arguments
const configPath = process.argv[2];
// Create a new MCP client instance
const client = new MCPClient(configPath);
// Start the client
client.start().catch((error) => {
    console.error('Error starting MCP client:', error);
    process.exit(1);
});
