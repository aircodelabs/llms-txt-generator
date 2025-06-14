# LLM Class Usage Guide

The LLM class has been updated to use the OpenAI SDK, providing better support for both OpenAI and Azure OpenAI services.

## Installation

The required dependencies are already included in the project:
- `openai`: Official OpenAI SDK
- `@types/node`: For TypeScript support

## Configuration

### Environment Variables

Create a `.env` file in your project root:

```env
# For OpenAI
OPENAI_API_KEY=your_openai_api_key_here

# For Azure OpenAI
AZURE_OPENAI_API_KEY=your_azure_api_key_here
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/openai/deployments/your-deployment
```

## Usage Examples

### 1. Standard OpenAI with Custom Parameters

```typescript
import { LLM, LLMConfig } from './src/llm/core';

const config: LLMConfig = {
  model: 'gpt-4',
  apiKey: process.env.OPENAI_API_KEY, // optional if set in env
  maxTokens: 1000,
  temperature: 0.7,
  topP: 0.9,
  frequencyPenalty: 0.1,
  presencePenalty: 0.1,
  stop: ['\n\n', 'END'],
  seed: 42, // For reproducible results
};

const llm = new LLM(config);

// Simple chat
const response = await llm.chat([
  { role: 'user', content: 'Hello, how are you?' }
]);
console.log(response);
```

### 2. Azure OpenAI with Temperature Control

```typescript
const config: LLMConfig = {
  model: 'gpt-4', // Your Azure deployment name
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: process.env.AZURE_OPENAI_ENDPOINT,
  temperature: 0.3, // Lower temperature for more focused responses
  maxTokens: 2000,
  topP: 0.8,
  azureOpenAI: {
    apiVersion: '2024-02-15-preview',
  },
};

const llm = new LLM(config);
const response = await llm.chat([
  { role: 'user', content: 'Hello from Azure!' }
]);
```

### 3. Streaming Chat

```typescript
const emitter = await llm.chatStream([
  { role: 'user', content: 'Tell me a story' }
]);

emitter.on('data', (chunk) => {
  process.stdout.write(chunk);
});

emitter.on('tool_call', (toolNames) => {
  console.log('Calling tools:', toolNames);
});

emitter.on('end', () => {
  console.log('\nCompleted');
});

emitter.on('error', (error) => {
  console.error('Error:', error);
});
```

### 4. Custom API Endpoint with Creative Settings

```typescript
const config: LLMConfig = {
  model: 'gpt-3.5-turbo',
  apiKey: 'your-api-key',
  baseURL: 'https://your-custom-openai-compatible-api.com/v1',
  temperature: 1.0, // High creativity
  topP: 0.95,
  maxTokens: 500,
  frequencyPenalty: 0.5, // Reduce repetition
  presencePenalty: 0.3,
};

const llm = new LLM(config);
```

## Configuration Options

### LLMConfig Interface

```typescript
interface LLMConfig {
  model: string;              // Model name (e.g., 'gpt-4', 'gpt-3.5-turbo')
  apiKey?: string;            // API key (optional if set in environment)
  baseURL?: string;           // Custom base URL (optional)
  
  // Common LLM parameters
  maxTokens?: number;         // Maximum tokens to generate (default: model's max)
  temperature?: number;       // Randomness (0.0-2.0, default: 1.0)
  topP?: number;              // Nucleus sampling (0.0-1.0, default: 1.0)
  topK?: number;              // Top-K sampling (for compatible models)
  frequencyPenalty?: number;  // Frequency penalty (-2.0 to 2.0, default: 0)
  presencePenalty?: number;   // Presence penalty (-2.0 to 2.0, default: 0)
  stop?: string | string[];   // Stop sequences
  seed?: number;              // Seed for reproducible results
  
  azureOpenAI?: {             // Azure-specific configuration
    apiVersion?: string;      // API version (default: '2024-02-15-preview')
    deployment?: string;      // Deployment name (usually same as model)
  };
}
```

## Tool Support

The LLM class automatically integrates with MCP (Model Context Protocol) tools:

- Tools are automatically discovered from the MCP client
- Tool calls are handled transparently in both streaming and non-streaming modes
- Recursive tool calling is supported for complex workflows

## Error Handling

```typescript
try {
  const response = await llm.chat(messages);
  console.log(response);
} catch (error) {
  if (error instanceof Error) {
    console.error('LLM Error:', error.message);
  }
}
```

## Migration from Previous Version

If you were using the previous version with axios:

**Old:**
```typescript
const llm = new LLM('gpt-4', 'https://api.openai.com/v1', 'your-api-key');
```

**New:**
```typescript
const llm = new LLM({
  model: 'gpt-4',
  apiKey: 'your-api-key',
  // baseURL is optional for OpenAI
});
```

## Parameter Guidelines

### Temperature
- **0.0-0.3**: Factual, deterministic responses
- **0.4-0.7**: Balanced creativity and consistency
- **0.8-1.0**: Creative, varied responses
- **1.0+**: Highly creative, potentially unpredictable

### Top-P (Nucleus Sampling)
- **0.1**: Very focused, conservative
- **0.5**: Moderately focused
- **0.9**: Diverse but coherent
- **1.0**: Full vocabulary available

### Penalties
- **Frequency Penalty**: Reduces repetition of tokens based on frequency
- **Presence Penalty**: Reduces repetition of any token that has appeared
- Range: -2.0 to 2.0 (negative values encourage repetition)

### Max Tokens
- Controls the maximum length of the response
- Set based on your use case and model limits
- Consider input + output token limits

### Stop Sequences
- Strings that will stop generation when encountered
- Useful for structured outputs or specific formats
- Can be a single string or array of strings

### Seed
- Integer for reproducible results
- Same seed + same input = same output (mostly)
- Useful for testing and debugging

## Benefits of the New Implementation

1. **Better Type Safety**: Full TypeScript support with OpenAI SDK types
2. **Azure OpenAI Support**: Native support for Azure OpenAI with proper authentication
3. **Improved Error Handling**: Better error messages and handling
4. **Streaming Support**: More robust streaming implementation
5. **Tool Integration**: Seamless integration with MCP tools
6. **Flexibility**: Support for custom OpenAI-compatible APIs