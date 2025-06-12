# LLMs TXT Generator

A Node.js tool for generating `llms.txt` and `llms-full.txt` files.

## Features

- Generate standard format `llms.txt` files
- Generate `llms-full.txt` files with more detailed information
- Support for custom output directory and filenames
- Developed with TypeScript, providing complete type definitions
- Support for CommonJS module format

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
