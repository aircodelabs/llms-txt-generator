/**
 * Example usage of the LLM class with OpenAI SDK
 * Supports both OpenAI and Azure OpenAI
 */

import { LLM, LLMConfig } from '../src/llm/core';
import * as dotenv from 'dotenv';

import { loadPrompt } from '../src/llm/utils';

dotenv.config({
  path: ['.env.local', '.env'],
});

// Example 1: Using standard OpenAI with custom parameters
async function useOpenAI() {
  const config: LLMConfig = {
    model: process.env.OPENAI_API_MODEL || 'gpt-3.5-turbo',
    apiKey: process.env.OPENAI_API_KEY, // or pass directly
    baseURL: process.env.OPENAI_API_BASE || 'https://api.openai.com/v1',
    maxTokens: 1024 * 16,
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0.1,
    presencePenalty: 0.1,
    // stop: ['\n\n', 'END'],
    seed: 42,
    toolsType: 'function_call',
  };

  if (process.env.AZURE_OPENAI_API_DEVELOPMENT) {
    config.azureOpenAI = {
      apiVersion: process.env.AZURE_OPENAI_API_VERSION || '2024-02-15-preview',
      deployment: process.env.AZURE_OPENAI_API_DEVELOPMENT,
    };
  }

  console.log('config:', config);
  const llm = new LLM(config);

  // Simple chat
  // const response = await llm.chat([
  //   { role: 'user', content: 'Hello, how are you?' }
  // ]);
  // console.log('OpenAI Response:', response);
  // return;

  // Streaming chat
  const emitter = await llm.chatStream([
    { role: 'system', content: await loadPrompt('generate') },
    { role: 'user', content: 'Create llms.txt and llms-full.txt of this project for me' }
    // { role: 'user', content: 'Hello, how are you?' }
  ]);

  emitter.on('data', (chunk) => {
    process.stdout.write(chunk);
  });

  emitter.on('end', () => {
    console.log('\nStreaming completed');
  });

  emitter.on('error', (error) => {
    console.error('Error:', error);
  });

  console.log('start...');
}

async function main() {
  // Uncomment the example you want to run
  await useOpenAI();
}


// Run examples
if (require.main === module || require.main?.filename.endsWith('/jiti.js')) {
  // Uncomment the example you want to run
  main();
  // useAzureOpenAI();
  // useCustomAPI();
  // useConservativeSettings();
}

export { useOpenAI };