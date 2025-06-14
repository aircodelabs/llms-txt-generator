import { ChatOpenAI, AzureChatOpenAI } from "@langchain/openai";
import { MCPClient, MCPAgent } from 'mcp-use';
import servers  from "../mcp/config/servers";

export interface LLMConfig {
  model?: string;
  apiKey?: string;
  baseURL?: string;
  streaming?: boolean;
  // Common LLM parameters
  options: {
    maxTokens?: number;
    temperature?: number;
    topP?: number;
    topK?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
    stop?: string[];
    seed?: number;
    n?: number;
    logitBias?: Record<string, number>;
  };
  azureOpenAI?: {
    apiVersion?: string;
    deployment?: string;
    instanceName?: string;
  }
}

export class Agent extends MCPAgent {
  constructor(config: LLMConfig) {
    const baseURL = config.baseURL || process.env.OPENAI_API_BASE || 'https://api.openai.com/v1';
    const isAzure = config.azureOpenAI !== undefined || baseURL.endsWith('openai.azure.com');
    const client: MCPClient = MCPClient.fromDict({ mcpServers: servers });
    let llm: ChatOpenAI | AzureChatOpenAI;

    if(isAzure) {
      llm = new AzureChatOpenAI({
        azureOpenAIApiKey: config.apiKey || process.env.OPENAI_MODEL_NAME,
        azureOpenAIApiVersion: config.azureOpenAI?.apiVersion || process.env.AZURE_OPENAI_API_VERSION,
        azureOpenAIApiDeploymentName: config.azureOpenAI?.deployment || process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
        azureOpenAIApiInstanceName: config.azureOpenAI?.instanceName || process.env.AZURE_OPENAI_API_INSTANCE_NAME,
        modelName: config.model,
        streaming: !!config.streaming,
        ...config.options
      });
    } else {
      llm = new ChatOpenAI({
        modelName: config.model,
        openAIApiKey: config.apiKey,
        configuration: {
          baseURL,
        },
        streaming:!!config.streaming,
        ...config.options,
      });
    }

    super({
      llm: llm as any,
      client,
      maxSteps: 40,
      verbose: true,
    });
  }
}
