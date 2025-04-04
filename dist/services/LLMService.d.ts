import { LLMConfig } from '../config/config.js';
export interface LLMResponse {
    text: string;
    usage?: {
        promptTokens?: number;
        completionTokens?: number;
        totalTokens?: number;
    };
}
export declare class LLMService {
    private config;
    constructor(config: LLMConfig);
    /**
     * Send a chat request to an LLM provider
     * @param messages - The messages to send
     * @returns The response from the LLM
     */
    chat(messages: Array<{
        role: string;
        content: string;
    }>): Promise<LLMResponse>;
    /**
     * Send a chat request to Ollama
     * @param messages - The messages to send
     * @returns The response from Ollama
     */
    private ollamaChat;
    /**
     * Send a chat request to OpenAI
     * @param messages - The messages to send
     * @returns The response from OpenAI
     */
    private openAIChat;
    /**
     * Send a chat request to OpenRouter
     * @param messages - The messages to send
     * @returns The response from OpenRouter
     */
    private openRouterChat;
    /**
     * Send a chat request to Deepseek
     * @param messages - The messages to send
     * @returns The response from Deepseek
     */
    private deepseekChat;
}
export default LLMService;
