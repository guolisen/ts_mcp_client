import { LLMConfig } from '../config/config.js';
import { ToolCall } from './ToolManager.js';
export interface LLMResponse {
    text: string;
    isToolCall?: boolean;
    toolCall?: ToolCall;
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
     * @param includeTools - Whether to include tool descriptions in the system message
     * @returns The response from the LLM
     */
    chat(messages: Array<{
        role: string;
        content: string;
    }>, includeTools?: boolean): Promise<LLMResponse>;
    /**
     * Prepare messages with tool descriptions if needed
     * @param messages - The original messages
     * @param includeTools - Whether to include tool descriptions
     * @returns The processed messages
     */
    private prepareMessages;
    /**
     * Process the raw LLM response to check for tool calls
     * @param response - The raw LLM response
     * @returns The processed response with tool call information
     */
    private processResponse;
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
