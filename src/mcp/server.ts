#!/usr/bin/env node

/*
 * MCP Server
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import { generateMcpPrompt } from '../llm/prompts/generate';

// Create an MCP server
const server = new McpServer({
  name: 'Demo',
  version: '1.0.0',
});

server.tool(
  'generate',
  `Use this tool whenever the task is to create llms.txt and llms-full.txt files for the current project.`,
  {
    prompt: z.string(),
  },
  async ({ prompt }) => {
    return {
      content: [{ type: 'text', text: `${generateMcpPrompt}\n\nUser's requirement: \n${prompt}` }],
    };
  }
)

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
console.log('Server started');