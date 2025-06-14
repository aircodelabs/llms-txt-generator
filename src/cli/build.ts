#!/usr/bin/env node
/**
 * CLI entry point for LLMs TXT Generator
 * Supports configuration via YAML file and environment variables
 */

import { LLM, type LLMConfig } from '../llm/core';
import { loadPrompt } from '../llm/utils';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({
  path: ['.env.local', '.env'],
});

/**
 * YAML configuration interface
 */
import { type IYamlConfig } from '../types';

// YAML 配置类型
type YamlConfig = IYamlConfig & {
  outputDir?: string;
}

/**
 * Parse command line arguments
 */
function parseArgs(): { configPath?: string; outputDir?: string; help?: boolean } {
  const args = process.argv.slice(2);
  const result: { configPath?: string; outputDir?: string; help?: boolean } = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--config' && i + 1 < args.length) {
      result.configPath = args[i + 1];
      i++;
    } else if (arg === '--output-dir' && i + 1 < args.length) {
      result.outputDir = args[i + 1];
      i++;
    } else if (arg === '--help' || arg === '-h') {
      result.help = true;
    }
  }

  return result;
}

/**
 * Simple YAML parser for basic key-value pairs
 * Note: This is a minimal implementation for basic YAML structures
 */
function parseYaml(content: string): YamlConfig {
  const config: YamlConfig = {};
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) continue;
    
    const key = trimmed.substring(0, colonIndex).trim();
    const value = trimmed.substring(colonIndex + 1).trim();
    
    if (!value) continue;
    
    // Parse different value types
    if (value === 'true' || value === 'false') {
      (config as any)[key] = value === 'true';
    } else if (!isNaN(Number(value))) {
      (config as any)[key] = Number(value);
    } else if (value.startsWith('"') && value.endsWith('"')) {
      (config as any)[key] = value.slice(1, -1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      (config as any)[key] = value.slice(1, -1);
    } else {
      (config as any)[key] = value;
    }
  }
  
  return config;
}

/**
 * Load configuration from YAML file
 */
async function loadConfig(configPath: string): Promise<YamlConfig> {
  try {
    const content = await fs.readFile(configPath, 'utf-8');
    return parseYaml(content);
  } catch (error) {
    throw new Error(`Failed to load config file '${configPath}': ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Create LLM configuration from YAML config and environment variables
 */
function createLLMConfig(yamlConfig: YamlConfig): LLMConfig {
  return {
    model: yamlConfig.model || process.env.OPENAI_API_MODEL || 'gpt-3.5-turbo',
    apiKey: yamlConfig.apiKey || process.env.OPENAI_API_KEY,
    baseURL: yamlConfig.baseURL || process.env.OPENAI_API_BASE || 'https://api.openai.com/v1',
    maxTokens: yamlConfig.maxTokens || 1024 * 16,
    toolsType: yamlConfig.toolsType || 'function_call',
    azureOpenAI: yamlConfig.azureOpenAI || (process.env.AZURE_OPENAI_API_DEVELOPMENT ? {
      apiVersion: process.env.AZURE_OPENAI_API_VERSION || '2024-02-15-preview',
      deployment: process.env.AZURE_OPENAI_API_DEVELOPMENT,
    } : undefined),
  };
}

/**
 * Write content to file with proper directory creation
 */
async function writeFile(filePath: string, content: string): Promise<void> {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath, content, 'utf-8');
}

/**
 * Generate llms.txt and llms-full.txt files
 */
async function generateFiles(llm: LLM, outputDir: string): Promise<void> {
  console.log('🚀 Starting LLMs TXT generation...');
  
  try {
    // Load the generation prompt
    const prompt = await loadPrompt('generate');
    
    // Create the chat stream
    const emitter = await llm.chatStream([
      { role: 'system', content: prompt },
      { role: 'user', content: 'Create llms.txt and llms-full.txt of this project for me' }
    ]);

    let fullResponse = '';
    
    // Handle streaming response
    emitter.on('data', (chunk) => {
      process.stdout.write(chunk);
      fullResponse += chunk;
    });

    emitter.on('end', async () => {
      console.log('\n\n✅ Generation completed!');
      
      try {
        // Copy generated files from .llms directory to output directory
        const sourceLlmsTxtPath = path.join(process.cwd(), '.llms', 'llms.txt');
        const sourceLlmsFullTxtPath = path.join(process.cwd(), '.llms', 'llms-full.txt');
        const targetLlmsTxtPath = path.join(outputDir, 'llms.txt');
        const targetLlmsFullTxtPath = path.join(outputDir, 'llms-full.txt');
        
        try {
          // Check if source files exist and copy them
          const fs = await import('fs/promises');
          
          if (await fs.access(sourceLlmsTxtPath).then(() => true).catch(() => false)) {
            const llmsTxtContent = await fs.readFile(sourceLlmsTxtPath, 'utf-8');
            await writeFile(targetLlmsTxtPath, llmsTxtContent);
            console.log(`📄 Created: ${targetLlmsTxtPath}`);
          } else {
            console.warn('⚠️  Could not find llms.txt in .llms directory');
          }
          
          if (await fs.access(sourceLlmsFullTxtPath).then(() => true).catch(() => false)) {
            const llmsFullTxtContent = await fs.readFile(sourceLlmsFullTxtPath, 'utf-8');
            await writeFile(targetLlmsFullTxtPath, llmsFullTxtContent);
            console.log(`📄 Created: ${targetLlmsFullTxtPath}`);
          } else {
            console.warn('⚠️  Could not find llms-full.txt in .llms directory');
          }
        } catch (copyError) {
          console.error('❌ Error copying files from .llms directory:', copyError instanceof Error ? copyError.message : 'Unknown error');
        }
        
        console.log('\n🎉 All files generated successfully!');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error writing files:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
      }
    });

    emitter.on('error', (error) => {
      console.error('❌ Generation error:', error);
      process.exit(1);
    });
    
  } catch (error) {
    console.error('❌ Failed to start generation:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

/**
 * Show help information
 */
function showHelp(): void {
  console.log(`
LLMs TXT Generator CLI

Usage:
  generate [options]

Options:
  --config <path>     Path to YAML configuration file (default: llms-txt-generator.yaml)
  --output-dir <dir>  Output directory for generated files (default: current directory)
  --help, -h          Show this help message

Example:
  generate --config llms-txt-generator.yaml --output-dir ./output

Configuration file format (YAML):
  model: gpt-3.5-turbo
  apiKey: your-api-key
  baseURL: https://api.openai.com/v1
  maxTokens: 16384
  temperature: 0.7
  outputDir: ./output
`);
}

/**
 * Main CLI function
 */
async function build(): Promise<void> {
  const args = parseArgs();
  
  if (args.help) {
    showHelp();
    return;
  }
  
  const configPath = args.configPath || 'llms-txt-generator.yaml';
  const outputDir = args.outputDir || process.cwd();
  
  try {
    // Load configuration
    let yamlConfig: YamlConfig = {};
    
    try {
      yamlConfig = await loadConfig(configPath);
      console.log(`📋 Loaded configuration from: ${configPath}`);
    } catch (error) {
      if (args.configPath) {
        // If config path was explicitly provided, fail
        console.error(`❌ ${error instanceof Error ? error.message : 'Unknown error'}`);
        process.exit(1);
      } else {
        // If using default config path, continue with environment variables
        console.log('📋 No configuration file found, using environment variables');
      }
    }
    
    // Override output directory if specified in args
    if (args.outputDir) {
      yamlConfig.outputDir = args.outputDir;
    }
    
    const finalOutputDir = yamlConfig.outputDir || outputDir;
    
    // Create LLM configuration
    const llmConfig = createLLMConfig(yamlConfig);
    
    // Validate required configuration
    if (!llmConfig.apiKey) {
      console.error('❌ API key is required. Set OPENAI_API_KEY environment variable or provide it in config file.');
      process.exit(1);
    }
    
    console.log(`🤖 Using model: ${llmConfig.model}`);
    console.log(`📁 Output directory: ${finalOutputDir}`);
    
    // Create LLM instance
    const llm = new LLM(llmConfig);
    
    // Generate files
    await generateFiles(llm, finalOutputDir);
    
  } catch (error) {
    console.error('❌ CLI error:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

export { build };