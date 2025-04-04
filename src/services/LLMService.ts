import axios from 'axios';
import { LLMConfig } from '../config/config.js';

// Response interface for different LLM providers
export interface LLMResponse {
  text: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

export class LLMService {
  private config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
  }

  /**
   * Send a chat request to an LLM provider
   * @param messages - The messages to send
   * @returns The response from the LLM
   */
  async chat(messages: Array<{ role: string; content: string }>): Promise<LLMResponse> {
    switch (this.config.provider.toLowerCase()) {
      case 'ollama':
        return this.ollamaChat(messages);
      case 'openai':
        return this.openAIChat(messages);
      case 'openrouter':
        return this.openRouterChat(messages);
      case 'deepseek':
        return this.deepseekChat(messages);
      default:
        throw new Error(`Unsupported LLM provider: ${this.config.provider}`);
    }
  }

  /**
   * Send a chat request to Ollama
   * @param messages - The messages to send
   * @returns The response from Ollama
   */
  private async ollamaChat(messages: Array<{ role: string; content: string }>): Promise<LLMResponse> {
    try {
      const response = await axios.post(
        `${this.config.baseUrl}/api/chat`,
        {
          model: this.config.model || 'llama3',
          messages,
          temperature: this.config.temperature || 0.7,
          max_tokens: this.config.maxTokens || 1000,
          stream: false
        }
      );

      return {
        text: response.data.message.content,
        usage: {
          totalTokens: response.data.total_tokens || 0
        }
      };
    } catch (error) {
      console.error('Error calling Ollama API:', error);
      throw error;
    }
  }

  /**
   * Send a chat request to OpenAI
   * @param messages - The messages to send
   * @returns The response from OpenAI
   */
  private async openAIChat(messages: Array<{ role: string; content: string }>): Promise<LLMResponse> {
    try {
      const baseUrl = this.config.baseUrl || 'https://api.openai.com/v1';
      const response = await axios.post(
        `${baseUrl}/chat/completions`,
        {
          model: this.config.model || 'gpt-3.5-turbo',
          messages,
          temperature: this.config.temperature || 0.7,
          max_tokens: this.config.maxTokens || 1000
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`
          }
        }
      );

      return {
        text: response.data.choices[0].message.content,
        usage: {
          promptTokens: response.data.usage.prompt_tokens,
          completionTokens: response.data.usage.completion_tokens,
          totalTokens: response.data.usage.total_tokens
        }
      };
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw error;
    }
  }

  /**
   * Send a chat request to OpenRouter
   * @param messages - The messages to send
   * @returns The response from OpenRouter
   */
  private async openRouterChat(messages: Array<{ role: string; content: string }>): Promise<LLMResponse> {
    try {
      const baseUrl = this.config.baseUrl || 'https://openrouter.ai/api/v1';
      const response = await axios.post(
        `${baseUrl}/chat/completions`,
        {
          model: this.config.model || 'gpt-3.5-turbo',
          messages,
          temperature: this.config.temperature || 0.7,
          max_tokens: this.config.maxTokens || 1000
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`
          }
        }
      );

      return {
        text: response.data.choices[0].message.content,
        usage: {
          promptTokens: response.data.usage?.prompt_tokens,
          completionTokens: response.data.usage?.completion_tokens,
          totalTokens: response.data.usage?.total_tokens
        }
      };
    } catch (error) {
      console.error('Error calling OpenRouter API:', error);
      throw error;
    }
  }

  /**
   * Send a chat request to Deepseek
   * @param messages - The messages to send
   * @returns The response from Deepseek
   */
  private async deepseekChat(messages: Array<{ role: string; content: string }>): Promise<LLMResponse> {
    try {
      const baseUrl = this.config.baseUrl || 'https://api.deepseek.com/v1';
      const response = await axios.post(
        `${baseUrl}/chat/completions`,
        {
          model: this.config.model || 'deepseek-chat',
          messages,
          temperature: this.config.temperature || 0.7,
          max_tokens: this.config.maxTokens || 1000
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`
          }
        }
      );

      return {
        text: response.data.choices[0].message.content,
        usage: {
          promptTokens: response.data.usage?.prompt_tokens,
          completionTokens: response.data.usage?.completion_tokens,
          totalTokens: response.data.usage?.total_tokens
        }
      };
    } catch (error) {
      console.error('Error calling Deepseek API:', error);
      throw error;
    }
  }
}

export default LLMService;
