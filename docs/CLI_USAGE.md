# CLI Usage Guide

## Overview

The LLMs TXT Generator CLI allows you to generate `llms.txt` and `llms-full.txt` files using configuration files and command-line options.

## Installation

```bash
# Install dependencies
pnpm install

# Build the project
pnpm build
```

## Basic Usage

### Using Default Configuration

```bash
# Uses llms-txt-generator.yaml if it exists, otherwise uses environment variables
generate
```

### Using Custom Configuration File

```bash
# Specify a custom YAML configuration file
generate --config my-config.yaml
```

### Specifying Output Directory

```bash
# Generate files in a specific directory
generate --output-dir ./output

# Combine with custom config
generate --config my-config.yaml --output-dir ./docs
```

### Getting Help

```bash
generate --help
```

## Configuration File Format

Create a YAML file (e.g., `llms-txt-generator.yaml`) with the following structure:

```yaml
# Model Configuration
model: gpt-3.5-turbo
apiKey: your-openai-api-key-here  # Optional: can use OPENAI_API_KEY env var
baseURL: https://api.openai.com/v1  # Optional: defaults to OpenAI API

# Generation Parameters
maxTokens: 16384
toolsType: function_call

# Output Configuration
outputDir: ./output

# Azure OpenAI Configuration (optional)
azureOpenAI:
  apiVersion: 2024-02-15-preview
  deployment: your-deployment-name
```

## Environment Variables

The CLI supports the following environment variables:

- `OPENAI_API_KEY`: Your OpenAI API key
- `OPENAI_API_MODEL`: Model to use (default: gpt-3.5-turbo)
- `OPENAI_API_BASE`: Base URL for the API (default: https://api.openai.com/v1)
- `AZURE_OPENAI_API_KEY`: Azure OpenAI API key
- `AZURE_OPENAI_API_ENDPOINT`: Azure OpenAI endpoint
- `AZURE_OPENAI_API_VERSION`: Azure OpenAI API version
- `AZURE_OPENAI_API_DEPLOYMENT`: Azure OpenAI deployment name

## Examples

### Example 1: Basic Usage with Environment Variables

```bash
# Set environment variable
export OPENAI_API_KEY="your-api-key-here"

# Generate files in current directory
generate
```

### Example 2: Using Configuration File

```bash
# Create config file
cat > my-config.yaml << EOF
model: gpt-4
apiKey: your-api-key-here
maxTokens: 8192
outputDir: ./generated
EOF

# Use the config file
generate --config my-config.yaml
```

### Example 3: Azure OpenAI

```bash
# Create Azure config
cat > azure-config.yaml << EOF
model: gpt-35-turbo
apiKey: your-azure-api-key
baseURL: https://your-resource.openai.azure.com
azureOpenAI:
  apiVersion: 2024-02-15-preview
  deployment: gpt-35-turbo
outputDir: ./docs
EOF

# Generate with Azure OpenAI
generate --config azure-config.yaml
```

## Output

The CLI will generate two files:

- `llms.txt`: Concise navigation view of project structure
- `llms-full.txt`: Comprehensive documentation with full project details

The files will be created in the specified output directory (or current directory if not specified).

## Troubleshooting

### Common Issues

1. **Missing API Key**
   ```
   ❌ API key is required. Set OPENAI_API_KEY environment variable or provide it in config file.
   ```
   Solution: Set the `OPENAI_API_KEY` environment variable or add `apiKey` to your config file.

2. **Config File Not Found**
   ```
   ❌ Failed to load config file 'my-config.yaml': ENOENT: no such file or directory
   ```
   Solution: Check the file path and ensure the config file exists.

3. **Invalid YAML Format**
   ```
   ❌ Failed to load config file: Invalid YAML format
   ```
   Solution: Validate your YAML syntax and ensure proper indentation.

### Debug Mode

For debugging, you can run the CLI with verbose output:

```bash
# Enable debug logging
DEBUG=* generate --config my-config.yaml
```