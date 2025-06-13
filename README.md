# LLMs TXT Generator

A Node.js tool for generating `llms.txt` and `llms-full.txt` files, providing standardized documentation formats for AI models to better understand project structures.

## Features

- Generate standard format `llms.txt` files for quick project navigation
- Generate detailed `llms-full.txt` files for comprehensive project understanding
- Support for custom output directory and filenames
- MCP (Model Context Protocol) server implementation for AI integration
- File operation utilities (list, read, write, create directories)
- Developed with TypeScript, providing complete type definitions
- Support for CommonJS module format
- Ignores hidden files and directories (starting with ".") by default
- Generates content in English by default

## Installation

```bash
pnpm add llms-txt-generator
```

## Usage

```typescript
import { generateLLMsFile } from 'llms-txt-generator';

// Basic usage
async function main() {
  const result = await generateLLMsFile({
    outputDir: './output',
    generateFull: true
  });
  
  console.log(`Files generated successfully: ${result.success}`);
  console.log(`Standard file: ${result.filePath}`);
  console.log(`Full file: ${result.fullFilePath}`);
}

main().catch(console.error);
```

## Generated Files

### llms.txt Structure

The generated `llms.txt` file provides a concise navigation view of your project:

```markdown
# Project Name

> Project introduction, briefly describing the purpose and functionality of the project.

## Core Documentation
- [Document Title](URL): Brief description
- [Document Title](URL): Brief description

## Optional Content
- [Resource Name](URL): Brief description
```

### llms-full.txt Content

The `llms-full.txt` file contains comprehensive documentation including:

- Detailed project overview
- Core features explanation
- Installation and usage instructions
- Complete project structure description
- Code examples and explanations
- Development requirements and commands

This file is designed to give AI models a thorough understanding of your project.

## MCP Integration

### Using with Cursor

You can configure llms-generator as a Model Context Protocol (MCP) tool in Cursor to generate documentation files directly from your AI assistant:

1. Configure the MCP tool in Cursor by adding the following JSON configuration to your Cursor settings:

```json
{
  "mcpServers": {
    "llms-generator": {
      "command": "npx",
      "args": ["-y", "llms-txt-generator"]
    }
  }
}
```

2. Restart Cursor to load the new MCP configuration.

3. Use the tool in Cursor by asking your AI assistant to generate documentation files:

```
Use the llms-generator MCP tool to create llms.txt and llms-full.txt for this project
```

### Example Prompt

When using the MCP tool, you can provide specific instructions:

```
Generate llms.txt and llms-full.txt files with the following requirements:
1. Ignore hidden files and directories
2. Generate content in English
3. Focus on the core functionality of the project
```

## Development

### Requirements

- Node.js v18+
- pnpm

### Installing Dependencies

```bash
pnpm install
```

### Build

```bash
pnpm build
```

### Test

```bash
pnpm test
```

### Lint

```bash
pnpm lint
```

### Format Code

```bash
pnpm format
```

## License

MIT
