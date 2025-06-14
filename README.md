# llms-txt-generator

A Node.js tool for generating `llms.txt` and `llms-full.txt` files, providing standardized documentation formats for AI models to better understand project structures.

## Features

- 📄 **Generate standard format `llms.txt` files** for quick project navigation
- 📚 **Generate detailed `llms-full.txt` files** for comprehensive project understanding
- 🎯 **Support for custom output directory and filenames**
- 🤖 **MCP (Model Context Protocol) server implementation** for AI integration
- 🛠️ **File operation utilities** (list, read, write, create directories)
- 💪 **Developed with TypeScript** providing complete type definitions
- 📦 **ES Module support** with modern JavaScript standards
- 🔒 **Ignores hidden files and directories** (starting with ".") by default
- 🌍 **Generates content in English** by default
- ⚡ **Enhanced Build Process** automatically includes prompt templates in distribution
- 🧪 **Comprehensive Testing** separate unit tests with mocks and integration tests with real file system
- 🚀 **CLI and programmatic API** for flexible usage
- 🔧 **Configurable generation options** with TypeScript interfaces

## Installation

```bash
# Using pnpm (recommended)
pnpm add llms-txt-generator

# Using npm
npm install llms-txt-generator

# Using yarn
yarn add llms-txt-generator
```

## Quick Start

### Programmatic Usage

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

### CLI Usage

```bash
# Generate both llms.txt and llms-full.txt
npx llms-txt-generator generate

# Or if installed globally
generate

# Generate with custom output directory
generate --output ./docs

# Generate only standard file
generate --no-full
```

## API Reference

### `generateLLMsFile(options)`

Generates llms.txt and optionally llms-full.txt files.

#### Options

```typescript
interface GenerateOptions {
  outputDir?: string;        // Output directory (default: current directory)
  generateFull?: boolean;    // Generate llms-full.txt (default: true)
  fileName?: string;         // Custom filename for llms.txt (default: 'llms.txt')
  fullFileName?: string;     // Custom filename for llms-full.txt (default: 'llms-full.txt')
  projectRoot?: string;      // Project root directory (default: current directory)
}
```

#### Returns

```typescript
interface GenerateResult {
  success: boolean;          // Whether generation was successful
  filePath?: string;         // Path to generated llms.txt
  fullFilePath?: string;     // Path to generated llms-full.txt
  error?: string;            // Error message if generation failed
}
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

The llms-txt-generator includes a Model Context Protocol (MCP) server that allows AI assistants to generate documentation files directly.

### Using with Cursor

Configure llms-txt-generator as an MCP tool in Cursor:

1. **Add MCP Configuration**: Add the following to your Cursor settings (`cursor-settings.json`):

```json
{
  "mcpServers": {
    "llms-generator": {
      "command": "npx",
      "args": ["-y", "llms-txt-generator/mcp"]
    }
  }
}
```

2. **Restart Cursor** to load the new MCP configuration.

3. **Use the Tool** by asking your AI assistant:

```
Use the llms-generator MCP tool to create llms.txt and llms-full.txt for this project
```

### Using with Claude Desktop

For Claude Desktop, add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "llms-generator": {
      "command": "npx",
      "args": ["-y", "llms-txt-generator/mcp"]
    }
  }
}
```

### Available MCP Tools

The MCP server provides these tools:

- **`generate_llms_files`**: Generate both llms.txt and llms-full.txt
- **`list_files`**: List files in a directory
- **`read_file`**: Read file contents
- **`write_file`**: Write content to a file
- **`create_directory`**: Create directories

### Example Prompts

```
# Basic generation
Generate llms.txt and llms-full.txt files for this project

# With specific requirements
Generate documentation files with these requirements:
1. Output to ./docs directory
2. Include comprehensive project details
3. Focus on TypeScript implementation

# Custom configuration
Create llms files with custom names: project-nav.txt and project-full.txt
```

## Project Structure

```
llms-txt-generator/
├── src/
│   ├── index.ts              # Main API exports
│   ├── cli/
│   │   └── index.ts          # Command-line interface
│   ├── llm/
│   │   ├── agent.ts          # LLM agent implementation
│   │   ├── core.ts           # Core generation logic
│   │   ├── utils.ts          # Utility functions
│   │   └── prompts/          # Template files
│   │       └── generate.md   # Generation prompt template
│   ├── mcp/
│   │   ├── server.ts         # MCP server implementation
│   │   ├── client.ts         # MCP client utilities
│   │   └── config/           # MCP configuration
│   ├── types/
│   │   └── index.ts          # TypeScript type definitions
│   └── utils/                # General utilities
├── tests/
│   ├── index.test.ts         # Main API tests
│   └── llm-utils.test.ts     # LLM utility tests
├── .trae/
│   ├── project_rules.md      # Project development rules
│   └── memory_bank/          # Project context and status
└── dist/                     # Built output (generated)
```

## Development

### Requirements

- **Node.js v18+**
- **pnpm** (package manager)
- **TypeScript** knowledge

### Getting Started

1. **Clone and Install**:
```bash
git clone <repository-url>
cd llms-txt-generator
pnpm install
```

2. **Build the Project**:
```bash
pnpm build
```

3. **Run Tests**:
```bash
pnpm test
```

### Available Scripts

```bash
# Build the project
pnpm build

# Clean build artifacts
pnpm clean

# Run tests
pnpm test
pnpm test:watch     # Watch mode
pnpm test:coverage  # With coverage report

# Code quality
pnpm lint           # ESLint
pnpm format         # Prettier

# Development
pnpm prepare        # Prepare for publishing
```

### Build Process

The build process includes:
- ✅ **TypeScript Compilation**: `src/` → `dist/`
- ✅ **Type Definitions**: Generate `.d.ts` files
- ✅ **Prompt Templates**: Copy `src/llm/prompts/*.md` → `dist/llm/prompts/`
- ✅ **Executable Binaries**: CLI and MCP server
- ✅ **ES Module Output**: Modern JavaScript standards

### Testing Strategy

- **Unit Tests**: Mock file system for isolated logic testing
- **Integration Tests**: Real file system for end-to-end functionality
- **Coverage**: Comprehensive test coverage with Jest
- **CI/CD Ready**: All tests must pass before deployment

### Code Quality

- **ESLint**: Strict TypeScript linting rules
- **Prettier**: Consistent code formatting
- **Type Safety**: Strict TypeScript configuration
- **Documentation**: JSDoc comments for all public APIs

## Advanced Usage Examples

### Custom Configuration

```typescript
import { generateLLMsFile } from 'llms-txt-generator';

// Advanced configuration
const result = await generateLLMsFile({
  outputDir: './documentation',
  generateFull: true,
  fileName: 'project-overview.txt',
  fullFileName: 'project-complete.txt',
  projectRoot: './src'
});

if (result.success) {
  console.log('✅ Documentation generated successfully!');
  console.log(`📄 Overview: ${result.filePath}`);
  console.log(`📚 Complete: ${result.fullFilePath}`);
} else {
  console.error('❌ Generation failed:', result.error);
}
```

### Integration with Build Process

```json
// package.json
{
  "scripts": {
    "docs": "npx llms-txt-generator generate --output ./docs",
    "build": "npm run compile && npm run docs",
    "prebuild": "npm run clean"
  }
}
```

### GitHub Actions Integration

```yaml
# .github/workflows/docs.yml
name: Generate Documentation

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npx llms-txt-generator generate
      - name: Commit documentation
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add llms*.txt
          git diff --staged --quiet || git commit -m "docs: update llms documentation"
```

## Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Follow** the project rules in `.trae/project_rules.md`
4. **Write** tests for new functionality
5. **Ensure** all tests pass: `pnpm test`
6. **Lint** your code: `pnpm lint`
7. **Format** your code: `pnpm format`
8. **Commit** with conventional commits: `feat: add amazing feature`
9. **Push** to your branch: `git push origin feature/amazing-feature`
10. **Create** a Pull Request

### Code Standards

- ✅ **TypeScript**: All code must be written in TypeScript
- ✅ **Tests**: New features require test coverage
- ✅ **Documentation**: Update README and JSDoc comments
- ✅ **Linting**: Code must pass ESLint checks
- ✅ **Formatting**: Use Prettier for consistent formatting
- ✅ **Commits**: Follow Conventional Commits specification

## Troubleshooting

### Common Issues

**Q: "Module not found" error when using MCP**
```bash
# Solution: Install globally or use full path
npm install -g llms-txt-generator
# Or use npx with -y flag
npx -y llms-txt-generator/mcp
```

**Q: "Permission denied" when running CLI**
```bash
# Solution: Make sure the binary is executable
chmod +x node_modules/.bin/generate
# Or reinstall the package
pnpm install llms-txt-generator
```

**Q: "TypeScript compilation errors"**
```bash
# Solution: Check Node.js version and dependencies
node --version  # Should be >= 18
pnpm install    # Reinstall dependencies
```

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Made with ❤️ for the AI development community**
