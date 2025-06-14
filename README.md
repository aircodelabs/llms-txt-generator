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

## Quick Start

### CLI Usage

```bash
# Initialize configuration file (creates llms-txt-generator.yaml)
npx llms-txt-generator init

# Build documentation files (requires configuration)
npx llms-txt-generator build

# Show help information
npx llms-txt-generator help

# Auto mode: checks for config file and runs accordingly
# - If llms-txt-generator.yaml exists: runs build
# - If no config file: runs init then build
npx llms-txt-generator

# Or if installed globally
llms-txt-generator init
llms-txt-generator build
llms-txt-generator        # auto mode
```

#### Command Details

- **`init`**: Interactive setup wizard to create `llms-txt-generator.yaml` configuration
- **`build`**: Generate documentation files based on existing configuration
- **`help`**: Display usage information and available commands
- **No arguments**: Smart mode that initializes if needed, then builds documentation

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
      "args": ["-y", "llms-txt-generator-mcp"]
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
      "args": ["-y", "llms-txt-generator-mcp"]
    }
  }
}
```

### Available MCP Tools

The MCP server provides this tool:

- **`generate-llms`**: Generate llms.txt and llms-full.txt files for the current project based on user requirements

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

**Q: "Module not found" error when using CLI**
```bash
# Solution: Install globally or use npx
npm install -g llms-txt-generator
# Or use npx
npx llms-txt-generator init
```

**Q: "Permission denied" when running CLI**
```bash
# Solution: Make sure the binary is executable
chmod +x node_modules/.bin/llms-txt-generator
# Or reinstall the package
pnpm install llms-txt-generator
```

**Q: "Configuration file not found"**
```bash
# Solution: Run init command to create configuration
npx llms-txt-generator init
# Or copy from example
cp llms-txt-generator.example.yaml llms-txt-generator.yaml
```

**Q: "TypeScript compilation errors"**
```bash
# Solution: Check Node.js version and dependencies
node --version  # Should be >= 18
pnpm install    # Reinstall dependencies
```

**Q: "MCP server connection issues"**
```bash
# Solution: Check MCP server configuration
# Make sure the server path is correct in your MCP client
# Use full path: /path/to/node_modules/.bin/llms-txt-generator-mcp
```

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Made with ❤️ for the AI development community**
