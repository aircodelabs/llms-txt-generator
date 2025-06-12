You are an intelligent agent assistant helping me develop NodeJS functional modules.

## 🎯 Project Context

Before each conversation with me, please always check and load the following two files/directories:

1. `.trae/project_rules.md`: Contains the project's technical choices, naming conventions, module structure, and other hard rules;
2. `.trae/memory_bank/*`: Contains the current module development status, functional context, API design, parameter structure, and other project memories.

Before generating any functional modules, classes, utility methods, or test code, please always use these two files as your **primary judgment basis**.

If you detect that the `.trae/project_rules.md` file does not exist, please automatically create this file and initialize the necessary content.

---

## ⚙️ Technology Stack Configuration

- Use **Node.js v18+**
- Programming language is **TypeScript**
- Output format is **CommonJS (cjs)**
- Package management tool uses **pnpm**, npm/yarn is prohibited
- Unit testing framework is **Jest**
- Code standard tools are **ESLint + Prettier**
- Strict type checking (enable `strict`)

---

## 📦 Suggested Project Structure

```bash
📁 src/                 # Core source code
├── index.ts           # Module entry
├── utils/             # Utility functions
├── services/          # External service encapsulation
├── types/             # Type definitions
📁 tests/              # Unit test folder
├── index.test.ts
.trae/
├── project_rules.md
├── memory_bank/
```

---

## 📐 Development Principles

- **Initialize directly in the current project directory**, creating subdirectories is prohibited;
- All function modules must use **explicit type annotations**
- All utility functions should have accompanying test cases (Jest)
- All modules must support Tree-shaking (use pure functions as much as possible)
- Function/class comments need to include purpose description, parameter definitions, and example usage
- Strictly follow ESLint + Prettier style (configuration in the root directory)
- Initialization and dependency installation must use **pnpm**

---

## 🧪 Unit Testing Rules

- All core logic must have test coverage (recommended above 90% coverage)
- Test files should be placed in the `tests/` directory or with the same name and path as the source code
- Testing framework: Jest (default support for TypeScript)

---

## ✅ Initialization Commands

```bash
pnpm init
pnpm add -D typescript ts-node @types/node
pnpm add -D eslint prettier eslint-config-prettier eslint-plugin-prettier
pnpm add -D jest ts-jest @types/jest
```

### Create Configuration Files

```bash
# TypeScript configuration
npx tsc --init

# Jest configuration
npx ts-jest config:init
```

---

## 📄 Automatically Generated Configuration Files

### tsconfig.json (CJS output + strict mode)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "declaration": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### .eslintrc.js

```js
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  rules: {
    'prettier/prettier': 'error'
  }
};
```

### jest.config.ts

```ts
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts']
};
```

---

## 🚫 Strictly Prohibited

- Using `npm` or `yarn` anywhere is prohibited
- Generating functions/classes without type annotations is prohibited
- Using default exports is prohibited (maintain named exports)
- Mixing test code into production modules is prohibited (must be isolated)
- Generating functions/classes without comments or documentation is prohibited

---

## 🧠 Output Requirements

- All module files must be in `.ts` format
- All exports must be named exports
- All functions, classes, and type definitions must include comment descriptions
- If involving new functional modules, the response needs to indicate the content that needs to be added to the `memory_bank` entry
- Test code must correspond one-to-one with the main module, covering all edge cases