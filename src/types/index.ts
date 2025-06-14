/**
 * 项目类型定义文件
 * 命名规范：interface 以 I 开头，type 以 T 开头
 */

// ============= LLM 相关类型 =============

/**
 * Azure OpenAI 配置接口
 */
export interface IAzureOpenAIConfig {
  apiVersion?: string;
  deployment?: string;
  instanceName?: string;
}

/**
 * LLM 核心配置接口
 */
export interface ILLMConfig {
  model: string;
  apiKey?: string;
  baseURL?: string;
  // Common LLM parameters
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stop?: string | string[];
  seed?: number;
  // Azure OpenAI specific config
  azureOpenAI?: IAzureOpenAIConfig;
  toolsType?: 'function_call' | 'tool_call'; // use function call or tools
}



/**
 * CLI 初始化配置接口
 */
export interface IInitConfig {
  model: string;
  apiKey: string;
  baseURL: string;
  maxTokens: number;
  toolsType: string;
  outputDir: string;
  azureOpenAI?: {
    apiVersion: string;
    deployment: string;
  };
}

/**
 * YAML 配置接口
 */
export interface IYamlConfig {
  model?: string;
  apiKey?: string;
  baseURL?: string;
  maxTokens?: number;
  toolsType?: 'function_call' | 'tool_call';
  azureOpenAI?: {
    apiVersion?: string;
    deployment?: string;
  };
  outputDir?: string;
}

// ============= MCP 相关类型 =============

/**
 * MCP 服务器配置接口
 */
export interface IServerConfig {
  command: string;
  args: string[];
}

/**
 * MCP 服务器集合配置接口
 */
export interface IServersConfig {
  [name: string]: IServerConfig;
}

// ============= 工具类型 =============

/**
 * 工具类型枚举
 */
export type TToolsType = 'function_call' | 'tool_call';

/**
 * 提供商类型
 */
export type TProviderType = 'openai' | 'azure';

/**
 * 文件输出目录类型
 */
export type TOutputDir = string;

// ============= 向后兼容的导出 =============

/**
 * @deprecated 使用 ILLMConfig 替代
 */
export type LLMConfig = ILLMConfig;

/**
 * @deprecated 使用 IServerConfig 替代
 */
export type ServerConfig = IServerConfig;

/**
 * @deprecated 使用 IServersConfig 替代
 */
export type ServersConfig = IServersConfig;