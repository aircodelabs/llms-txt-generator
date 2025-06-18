#!/usr/bin/env node

import * as readline from 'readline';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { type IInitConfig } from '../types/index.js';

// CLI 初始化配置类型
type LLMConfig = IInitConfig;

class ConfigInitializer {
  private rl: readline.Interface;
  private config: Partial<LLMConfig> = {};

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  private question(prompt: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(prompt, resolve);
    });
  }

  private async selectProvider(): Promise<'openai' | 'azure'> {
    console.log('\n🚀 Welcome to LLMs TXT Generator Configuration!');
    console.log('\nPlease select your LLM provider:');
    console.log('1. OpenAI (default)');
    console.log('2. Azure OpenAI');
    
    while (true) {
      const choice = await this.question('\nEnter your choice (1 or 2, press Enter for default: 1): ');
      
      if (!choice.trim() || choice === '1') {
        return 'openai';
      } else if (choice === '2') {
        return 'azure';
      } else {
        console.log('❌ Invalid choice. Please enter 1 or 2.');
      }
    }
  }

  private async configureOpenAI(): Promise<void> {
    console.log('\n📝 Configuring OpenAI...');
    
    // API Key
    const apiKey = await this.question('Enter your OpenAI API key (press Enter for default: your-api-key-here): ');
    this.config.apiKey = apiKey.trim() || 'your-api-key-here';
    
    // Base URL
    const baseURL = await this.question('Enter base URL (press Enter for default: https://api.openai.com/v1): ');
    this.config.baseURL = baseURL.trim() || 'https://api.openai.com/v1';
    
    // Model
    const model = await this.question('Enter model name (press Enter for default: gpt-4o): ');
    this.config.model = model.trim() || 'gpt-4o';
  }

  private async configureAzureOpenAI(): Promise<void> {
    console.log('\n📝 Configuring Azure OpenAI...');
    
    // API Key
    const apiKey = await this.question('Enter your Azure OpenAI API key (press Enter for default: your-azure-api-key-here): ');
    this.config.apiKey = apiKey.trim() || 'your-azure-api-key-here';
    
    // Base URL
    const baseURL = await this.question('Enter your Azure OpenAI endpoint (press Enter for default: https://your-resource.openai.azure.com): ');
    this.config.baseURL = baseURL.trim() || 'https://your-resource.openai.azure.com';
    
    // Model
    const model = await this.question('Enter model name (press Enter for default: gpt-4): ');
    this.config.model = model.trim() || 'gpt-4';
    
    // Deployment
    const deployment = await this.question('Enter deployment name (press Enter for default: gpt-4): ');
    const deploymentName = deployment.trim() || 'gpt-4';
    
    // API Version
    const apiVersion = await this.question('Enter API version (press Enter for default: 2024-02-15-preview): ');
    
    this.config.azureOpenAI = {
      deployment: deploymentName,
      apiVersion: apiVersion.trim() || '2024-02-15-preview'
    };
  }

  private async configureCommonSettings(): Promise<void> {
    console.log('\n⚙️ Configuring common settings...');
    
    // Max Tokens
    while (true) {
      const maxTokensInput = await this.question('Enter max tokens (press Enter for default: 16384): ');
      const maxTokens = maxTokensInput.trim();
      
      if (!maxTokens) {
        this.config.maxTokens = 16384;
        break;
      }
      
      const parsed = parseInt(maxTokens, 10);
      if (isNaN(parsed) || parsed <= 0) {
        console.log('❌ Invalid number. Please enter a positive integer.');
        continue;
      }
      
      this.config.maxTokens = parsed;
      break;
    }
    
    // Tools Type
    console.log('\nSelect tools type:');
    console.log('1. function_call');
    console.log('2. tool_call');
    
    while (true) {
      const choice = await this.question('Enter your choice (1 or 2, press Enter for default: function_call): ');
      
      if (!choice.trim() || choice === '1') {
        this.config.toolsType = 'function_call';
        break;
      } else if (choice === '2') {
        this.config.toolsType = 'tool_call';
        break;
      } else {
        console.log('❌ Invalid choice. Please enter 1 or 2.');
      }
    }
    
    // Output Directory
    const outputDir = await this.question('Enter output directory (press Enter for default: ./): ');
    this.config.outputDir = outputDir.trim() || './';
  }

  private generateYamlContent(): string {
    const yamlContent: any = {
      model: this.config.model,
      apiKey: this.config.apiKey,
      baseURL: this.config.baseURL,
      maxTokens: this.config.maxTokens,
      toolsType: this.config.toolsType,
      outputDir: this.config.outputDir
    };

    if (this.config.azureOpenAI) {
      yamlContent.azureOpenAI = this.config.azureOpenAI;
    }

    // Convert to YAML string
    let yamlString = yaml.dump(yamlContent, {
      lineWidth: -1,
      noRefs: true,
      quotingType: '"',
      forceQuotes: false
    });

    // Add comments manually
    let result = '# This file contains configuration for the LLM model and generation parameters\n\n';
    result += '# Model Configuration\n';
    result += `model: ${this.config.model}\n`;
    result += `apiKey: ${this.config.apiKey}\n`;
    result += `baseURL: ${this.config.baseURL}\n\n`;
    result += '# Generation Parameters\n';
    result += `maxTokens: ${this.config.maxTokens}\n`;
    result += `toolsType: ${this.config.toolsType}\n\n`;
    result += '# Output Configuration\n';
    result += `outputDir: ${this.config.outputDir}\n`;
    
    if (this.config.azureOpenAI) {
      result += '\n# Azure OpenAI Configuration\n';
      result += 'azureOpenAI:\n';
      result += `  deployment: ${this.config.azureOpenAI.deployment}\n`;
      result += `  apiVersion: ${this.config.azureOpenAI.apiVersion}\n`;
    }

    return result;
  }

  private async saveConfig(): Promise<void> {
    const configPath = path.join(process.cwd(), 'llms-txt-generator.yaml');
    
    // Check if file already exists
    try {
      await fs.access(configPath);
      const overwrite = await this.question(`\n⚠️  Configuration file already exists at ${configPath}. Overwrite? (press Enter for default: N, or y to overwrite): `);
      if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
        console.log('❌ Configuration cancelled.');
        return;
      }
    } catch {
      // File doesn't exist, continue
    }
    
    const yamlContent = this.generateYamlContent();
    await fs.writeFile(configPath, yamlContent, 'utf-8');
    
    console.log(`\n✅ Configuration saved to: ${configPath}`);
    console.log('\n🎉 Setup complete! You can now use the LLMs TXT Generator.');
  }

  public async run(): Promise<void> {
    try {
      const provider = await this.selectProvider();
      
      if (provider === 'openai') {
        await this.configureOpenAI();
      } else {
        await this.configureAzureOpenAI();
      }
      
      await this.configureCommonSettings();
      
      console.log('\n📋 Configuration Summary:');
      console.log(`Provider: ${provider === 'openai' ? 'OpenAI' : 'Azure OpenAI'}`);
      console.log(`Model: ${this.config.model}`);
      console.log(`Base URL: ${this.config.baseURL}`);
      console.log(`Max Tokens: ${this.config.maxTokens}`);
      console.log(`Tools Type: ${this.config.toolsType}`);
      console.log(`Output Directory: ${this.config.outputDir}`);
      
      if (this.config.azureOpenAI) {
        console.log(`Deployment: ${this.config.azureOpenAI.deployment}`);
        console.log(`API Version: ${this.config.azureOpenAI.apiVersion}`);
      }
      
      const confirm = await this.question('\nSave this configuration? (press Enter for default: Y, or n to cancel): ');
      if (confirm.toLowerCase() === 'n' || confirm.toLowerCase() === 'no') {
        console.log('❌ Configuration cancelled.');
        return;
      }
      
      await this.saveConfig();
      
    } catch (error) {
      console.error('❌ Error during configuration:', error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }
}

/**
 * 初始化配置文件的主函数
 */
async function init(): Promise<void> {
  const initializer = new ConfigInitializer();
  await initializer.run();
}

export { init, ConfigInitializer };