import { promises as fs } from 'node:fs';
import { join, dirname } from 'node:path';
import { createRequire } from 'node:module';

// ES2020 compatible way to get current directory
if(typeof require === 'undefined') {
  // 使用 __dirname 作为替代方案，避免使用 import.meta
  require = createRequire(__dirname);
}
const getCurrentDir = () => dirname(require.resolve('./utils.js'));

/**
 * Load prompt content from markdown files
 * @param promptName - The name of the prompt file (without extension)
 * @returns Promise<string> - The content of the prompt file
 */
export async function loadPrompt(promptName: string): Promise<string> {
  try {
    // Get the current file's directory
    const currentDir = getCurrentDir();
    
    // Construct the path to the prompt file
    const promptPath = join(currentDir, 'prompts', `${promptName}.md`);
    
    // Read and return the file content
    const content = await fs.readFile(promptPath, 'utf-8');
    return content;
  } catch (error) {
    throw new Error(`Failed to load prompt '${promptName}': ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check if a prompt file exists
 * @param promptName - The name of the prompt file (without extension)
 * @returns Promise<boolean> - Whether the prompt file exists
 */
export async function promptExists(promptName: string): Promise<boolean> {
  try {
    const currentDir = getCurrentDir();
    const promptPath = join(currentDir, 'prompts', `${promptName}.md`);
    
    await fs.access(promptPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * List all available prompt files
 * @returns Promise<string[]> - Array of prompt names (without extensions)
 */
export async function listPrompts(): Promise<string[]> {
  try {
    const currentDir = getCurrentDir();
    const promptsDir = join(currentDir, 'prompts');
    
    const files = await fs.readdir(promptsDir);
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace('.md', ''));
  } catch (error) {
    throw new Error(`Failed to list prompts: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}