import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { AppConfig, defaultConfig } from './config.js';

// Load environment variables from .env file
dotenv.config();

/**
 * Load configuration from a config file and environment variables
 * @param configFilePath - Path to the configuration file
 * @returns The loaded configuration
 */
export function loadConfig(configFilePath?: string): AppConfig {
  let config = { ...defaultConfig };

  // Load from config file if provided and exists
  if (configFilePath) {
    try {
      const configFile = path.resolve(configFilePath);
      if (fs.existsSync(configFile)) {
        const fileContent = fs.readFileSync(configFile, 'utf-8');
        const fileConfig = JSON.parse(fileContent);
        config = { ...config, ...fileConfig };
      }
    } catch (error) {
      console.error(`Error loading config file: ${error}`);
    }
  }

  // Override with environment variables if provided
  if (process.env.LLM_PROVIDER) {
    config.llm.provider = process.env.LLM_PROVIDER;
  }
  
  if (process.env.LLM_API_KEY) {
    config.llm.apiKey = process.env.LLM_API_KEY;
  }
  
  if (process.env.LLM_BASE_URL) {
    config.llm.baseUrl = process.env.LLM_BASE_URL;
  }
  
  if (process.env.LLM_MODEL) {
    config.llm.model = process.env.LLM_MODEL;
  }
  
  if (process.env.LLM_TEMPERATURE) {
    config.llm.temperature = parseFloat(process.env.LLM_TEMPERATURE);
  }
  
  if (process.env.LLM_MAX_TOKENS) {
    config.llm.maxTokens = parseInt(process.env.LLM_MAX_TOKENS, 10);
  }

  if (process.env.DEFAULT_MCP_SERVER) {
    config.defaultMCPServer = process.env.DEFAULT_MCP_SERVER;
  }

  return config;
}

export default loadConfig;
