import { EventEmitter } from 'events';
import { MCPClient } from '../mcp/client';
import OpenAI, { AzureOpenAI } from 'openai';
import { type ILLMConfig } from '../types';

// 向后兼容的类型别名
export type LLMConfig = ILLMConfig;

export class LLM {
  private mcpClient = new MCPClient();
  private openai: OpenAI;
  private config: LLMConfig;
  private isAzure: boolean;
  private toolsType: 'function_call' | 'tool_call';

  constructor(config: LLMConfig) {
    this.config = config;
    this.isAzure = !!config.azureOpenAI;
    
    if (this.isAzure) {
      // Azure OpenAI configuration
      this.openai = new AzureOpenAI({
        apiKey: config.apiKey || process.env.AZURE_OPENAI_API_KEY,
        endpoint: config.baseURL || process.env.AZURE_OPENAI_API_ENDPOINT,
        apiVersion: config.azureOpenAI?.apiVersion || process.env.AZURE_OPENAI_API_VERSION || '2024-02-15-preview',
        deployment: config.azureOpenAI?.deployment || process.env.AZURE_OPENAI_API_DEPLOYMENT,
      });
    } else {
      // Standard OpenAI configuration
      this.openai = new OpenAI({
        apiKey: config.apiKey || process.env.OPENAI_API_KEY,
        baseURL: config.baseURL,
      });
    }

    this.toolsType = config.toolsType || 'tool_call';
  }

  async chat(messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]): Promise<string> {
    const tools = await this.mcpClient.listTools(this.toolsType);

    const requestParams: any = {
      model: this.config.model,
      messages,
      tools: tools.length > 0 ? tools : undefined,
      stream: false,
    };

    // Only add optional parameters if they are defined in config
    if (this.config.maxTokens !== undefined) {
      requestParams.max_tokens = this.config.maxTokens;
    }
    if (this.config.temperature !== undefined) {
      requestParams.temperature = this.config.temperature;
    }
    if (this.config.topP !== undefined) {
      requestParams.top_p = this.config.topP;
    }
    if (this.config.frequencyPenalty !== undefined) {
      requestParams.frequency_penalty = this.config.frequencyPenalty;
    }
    if (this.config.presencePenalty !== undefined) {
      requestParams.presence_penalty = this.config.presencePenalty;
    }
    if (this.config.stop !== undefined) {
      requestParams.stop = this.config.stop;
    }
    if (this.config.seed !== undefined) {
      requestParams.seed = this.config.seed;
    }

    const completion = await this.openai.chat.completions.create(requestParams);

    const message = completion.choices[0]?.message;
    if (!message) {
      throw new Error('No response from OpenAI');
    }

    // Handle tool calls
    if (message.tool_calls && message.tool_calls.length > 0) {
      const toolResults = await Promise.all(
        message.tool_calls.map(async (toolCall) => {
          const result = await this.mcpClient.callTool(
            toolCall.function.name,
            JSON.parse(toolCall.function.arguments)
          );
          return {
            role: 'tool' as const,
            tool_call_id: toolCall.id,
            content: result.content,
          };
        })
      );

      // Recursively call with tool results
      return await this.chat([
        ...messages,
        message,
        ...toolResults,
      ]);
    }

    return message.content || '';
  }

  async chatStream(
    messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    emitter: EventEmitter = new EventEmitter()
  ): Promise<EventEmitter> {
    try {
      const tools = await this.mcpClient.listTools(this.toolsType);

      // console.log(tools);
      
      const requestParams: any = {
        model: this.config.model,
        messages,
        tools: tools.length > 0 ? tools : undefined,
        stream: true,
      };

      // Only add optional parameters if they are defined in config
      if (this.config.maxTokens !== undefined) {
        requestParams.max_tokens = this.config.maxTokens;
      }
      if (this.config.temperature !== undefined) {
        requestParams.temperature = this.config.temperature;
      }
      if (this.config.topP !== undefined) {
        requestParams.top_p = this.config.topP;
      }
      if (this.config.frequencyPenalty !== undefined) {
        requestParams.frequency_penalty = this.config.frequencyPenalty;
      }
      if (this.config.presencePenalty !== undefined) {
        requestParams.presence_penalty = this.config.presencePenalty;
      }
      if (this.config.stop !== undefined) {
        requestParams.stop = this.config.stop;
      }
      if (this.config.seed !== undefined) {
        requestParams.seed = this.config.seed;
      }

      const stream: any = await this.openai.chat.completions.create(requestParams);

      // console.log(JSON.stringify(messages, null, 2));

      (async() => {
        let currentMessage = '';
        let toolCalls: OpenAI.Chat.Completions.ChatCompletionMessageToolCall[] = [];
        let hasToolCall = false;
  
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta;
          // console.log(JSON.stringify(delta), chunk.choices[1]);
          
          if (delta?.content) {
            currentMessage += delta.content;
            emitter.emit('data', delta.content);
          }

          // console.log(delta);
          
          if (delta?.tool_calls) {
            hasToolCall = true;
            for (const toolCall of delta.tool_calls) {
              if (toolCall.index !== undefined) {
                if (!toolCalls[toolCall.index]) {
                  toolCalls[toolCall.index] = {
                    id: toolCall.id || '',
                    type: 'function',
                    function: { name: '', arguments: '' }
                  };
                }
                
                if (toolCall.function?.name) {
                  // join function name
                  toolCalls[toolCall.index].function.name += toolCall.function.name;
                }
                if (toolCall.function?.arguments) {
                  // join arguments
                  toolCalls[toolCall.index].function.arguments += toolCall.function.arguments;
                }
              }
            }
          }
        }
        
        // console.log(toolCalls.length);

        // Handle tool calls if any
        if (hasToolCall && toolCalls.length > 0) {
          const systemRules: any = [];
          const toolResults = await Promise.all(
            toolCalls.map(async (toolCall) => {
              emitter.emit('data', `⚒️ (do task) -> ${toolCall.function.name} | ${toolCall.function.arguments.replace(/\n/g, ' ')}\n\n`);
              const result = await this.mcpClient.callTool(
                toolCall.function.name,
                JSON.parse(toolCall.function.arguments)
              );
              return {
                role: 'tool' as const,
                tool_call_id: toolCall.id,
                content: result.content,
              };
            })
          );
  
          // Continue with tool results
          const assistantMessage: OpenAI.Chat.Completions.ChatCompletionAssistantMessageParam = {
            role: 'assistant',
            content: currentMessage || null,
            tool_calls: toolCalls,
          };
  
          return await this.chatStream([
            ...systemRules,
            ...messages,
            assistantMessage,
            ...toolResults
          ], emitter);
        }
  
        emitter.emit('end');
      })();

      return emitter;
    } catch (error) {
      emitter.emit('error', error);
      return emitter;
    }
  }
}