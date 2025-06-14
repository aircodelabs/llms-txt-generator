#!/usr/bin/env node

import { existsSync } from 'fs';
import { join } from 'path';
import { init } from './init';
import { build } from './build';

/**
 * 显示帮助信息
 */
function showHelp(): void {
  console.log(`
llms-txt-generator - Generate standardized documentation files for AI models

Usage:
  llms-txt-generator [command]

Commands:
  init     Initialize configuration file (llms-txt-generator.yaml)
  build    Generate llms.txt and llms-full.txt files
  help     Show this help message

If no command is provided:
  - If llms-txt-generator.yaml exists: run build
  - If llms-txt-generator.yaml doesn't exist: run init, then build

Examples:
  llms-txt-generator init
  llms-txt-generator build
  llms-txt-generator
`);
}

/**
 * 主函数
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'init':
        await init();
        break;

      case 'build':
        await build();
        break;

      case 'help':
      case '--help':
      case '-h':
        showHelp();
        break;

      case undefined:
        // 无参数调用：检查配置文件是否存在
        const configPath = join(process.cwd(), 'llms-txt-generator.yaml');
        
        if (existsSync(configPath)) {
          console.log('📄 Configuration file found, generating documentation...');
          await build();
        } else {
          console.log('⚙️  No configuration file found, initializing...');
          await init();
          console.log('📄 Now generating documentation...');
          await build();
        }
        break;

      default:
        console.error(`❌ Unknown command: ${command}`);
        console.error('Run "llms-txt-generator help" for usage information.');
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// 运行主函数
main();

// export { main };