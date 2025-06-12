# Project Rules Document

## 🎯 Project Overview

This project is a Node.js tool for generating `llms.txt` and `llms-full.txt` files, which can be used for websites.

## ⚙️ Technology Stack Configuration

- Using **Node.js v18+**
- Programming language is **TypeScript**
- Output format is **CommonJS (cjs)**
- Package manager is **pnpm**, npm/yarn are prohibited
- Unit testing framework is **Jest**
- Code standard tools are **ESLint + Prettier**
- Strict type checking (enable `strict`)

## 📦 Project Structure

```bash
📁 src/                 # Core source code
├── index.ts           # Module entry
├── utils/             # Utility functions
├── services/          # External service wrappers
├── types/             # Type definitions
📁 tests/              # Unit test folder
├── index.test.ts
.trae/
├── project_rules.md
├── memory_bank/
```

## 📐 Development Principles

- All function modules must use **explicit type annotations**
- All utility functions should have accompanying test cases (Jest)
- All modules must support Tree-shaking (use pure functions when possible)
- Function/class comments should include purpose description, parameter definitions, and usage examples
- Strictly follow ESLint + Prettier style (configuration in root directory)

## 🧪 Unit Testing Rules

- All core logic must have test coverage (recommended above 90% coverage)
- Test files should be placed in the `tests/` directory or with the same name and path as the source code
- Testing framework: Jest (default TypeScript support)

## 🚫 Strictly Prohibited

- Using `npm` or `yarn` anywhere
- Generating functions/classes without type annotations
- Using default exports (maintain named exports)
- Mixing test code into production modules (must be isolated)
- Generating functions/classes without comments or documentation
- Using Chinese in code comments, all comments must be in English
- Using Chinese in documentation (README, etc.), all documentation must be in English
- Using any language other than English in project files, English is the preferred language for this project
- Using any language other than English in commit messages, all commit messages must be in English

## 📄 Naming Conventions

- File names: use lowercase letters and hyphens (kebab-case)
- Class names: use PascalCase
- Function/variable names: use camelCase
- Constants: use UPPER_SNAKE_CASE
- Interfaces/types: use PascalCase and start with `I` or `T` (IUserData, TConfig)

## 🔄 Version Control

- Use Semantic Versioning
- Commit messages follow Conventional Commits specification