#!/usr/bin/env node

/*
 * MCP Server
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadPrompt } from '../llm/utils';

// Create an MCP server
const server = new McpServer({
  name: 'Generate LLMs',
  version: '1.0.0',
});

server.tool(
  'generate-llms',
  `Use this tool whenever the task is to create llms.txt and llms-full.txt files for the current project.`,
  {
    prompt: z.string(),
  },
  async ({ prompt }) => {
    try {
      const generateMcpPrompt = await loadPrompt('generate');
      
      return {
        content: [{ type: 'text', text: `${generateMcpPrompt}\n\nUser's requirement: \n${prompt}` }],
      };
    } catch (error) {
      console.error(`Error reading prompt file: ${error}`);
      return {
        content: [{ type: 'text', text: `Error reading prompt file: ${error}` }],
      };
    }
  }
)

async function main() {
  // Start receiving messages on stdin and sending messages on stdout
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log('Server started');
}
main();