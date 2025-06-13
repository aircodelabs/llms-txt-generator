#!/usr/bin/env node

/**
 * Text Generator Entry File
 * Provides basic text generation functionality
 */

/**
 * Example function
 * @returns {string} Greeting message
 */
export function helloWorld(): string {
  return 'Hello World from LLMs TXT Generator!';
}

/**
 * Main function that runs when the script is executed directly
 */
if (import.meta.url === import.meta.resolve('./index.js')) {
  console.log(helloWorld());
  console.log('LLMs TXT Generator CLI is ready!');
}

export * from './types';