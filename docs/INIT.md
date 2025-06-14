# Configuration Initialization Guide

This guide explains how to use the `init` command to set up your LLMs TXT Generator configuration.

## Quick Start

Run the initialization command:

```bash
npx llms-txt-generator init
# or if installed globally
init
```

## Step-by-Step Configuration

The initialization process will guide you through the following steps:

### 1. Provider Selection

Choose your LLM provider:
- **OpenAI**: Standard OpenAI API
- **Azure OpenAI**: Microsoft Azure OpenAI Service

### 2. API Configuration

#### For OpenAI:
- **API Key**: Your OpenAI API key (required)
- **Base URL**: API endpoint (default: `https://api.openai.com/v1`)
- **Model**: Model name (default: `gpt-4`)

#### For Azure OpenAI:
- **API Key**: Your Azure OpenAI API key (required)
- **Endpoint**: Your Azure OpenAI endpoint (required)
- **Model**: Model name (default: `gpt-4`)
- **Deployment**: Deployment name (required)
- **API Version**: API version (default: `2024-02-15-preview`)

### 3. Generation Parameters

- **Max Tokens**: Maximum tokens for generation (default: `16384`)
- **Tools Type**: Function calling type:
  - `function_call` (default)
  - `tool_call`

### 4. Output Configuration

- **Output Directory**: Where to save generated files (default: `./`)

## Configuration File

The initialization process creates a `llms-txt-generator.yaml` file in your project root with the following structure:

### OpenAI Configuration Example

```yaml
# This file contains configuration for the LLM model and generation parameters

# Model Configuration
model: gpt-4
apiKey: sk-your-api-key-here
baseURL: https://api.openai.com/v1

# Generation Parameters
maxTokens: 16384
toolsType: function_call

# Output Configuration
outputDir: ./
```

### Azure OpenAI Configuration Example

```yaml
# This file contains configuration for the LLM model and generation parameters

# Model Configuration
model: gpt-4
apiKey: your-azure-api-key
baseURL: https://your-resource.openai.azure.com

# Generation Parameters
maxTokens: 16384
toolsType: function_call

# Output Configuration
outputDir: ./

# Azure OpenAI Configuration
azureOpenAI:
  apiVersion: 2024-02-15-preview
  deployment: your-deployment-name
```

## Environment Variables

Alternatively, you can use environment variables instead of storing the API key in the configuration file:

```bash
export OPENAI_API_KEY="your-api-key-here"
```

Then omit the `apiKey` field from the configuration file.

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for sensitive information
3. **Add configuration files** to `.gitignore`:
   ```gitignore
   llms-txt-generator.yaml
   .env
   ```

## Validation

The initialization process includes validation for:
- Required fields (API key, endpoints, deployment names)
- Numeric values (max tokens)
- File overwrite confirmation

## Troubleshooting

### Common Issues

1. **Missing API Key**
   ```
   ❌ Error: API key is required
   ```
   Solution: Provide a valid API key when prompted.

2. **Invalid Max Tokens**
   ```
   ❌ Invalid number. Please enter a positive integer.
   ```
   Solution: Enter a positive integer value.

3. **Missing Azure Configuration**
   ```
   ❌ Error: Deployment name is required for Azure OpenAI
   ```
   Solution: Provide the required Azure-specific configuration.

### File Permissions

Ensure you have write permissions in the directory where you're running the command.

### Dependencies

Make sure all required dependencies are installed:

```bash
pnpm install
```

## Manual Configuration

If you prefer to create the configuration file manually, you can copy one of the examples above and modify it according to your needs.

## Next Steps

After initialization, you can:

1. **Test your configuration**:
   ```bash
   npx llms-txt-generator build
   ```

2. **Customize the configuration** by editing `llms-txt-generator.yaml`

3. **Set up environment variables** for better security

4. **Add the configuration file** to your `.gitignore`