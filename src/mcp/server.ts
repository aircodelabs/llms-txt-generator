#!/usr/bin/env node

/*
 * MCP Server
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import { exec } from 'child_process';

// Create an MCP server
const server = new McpServer({
  name: 'Demo',
  version: '1.0.0',
});

// listFiles
server.tool('listFiles', 'List files in the specified directory', { path: z.string() }, async ({ path }) => {
  return new Promise((resolve, _reject) => {
    exec(`ls -la ${path}`, async (error, stdout, stderr) => {
      if (error) {
        console.error(`Command execution error: ${error}`);
        resolve({
          content: [{ type: 'text', text: `Command execution error: ${error}` }],
        });
        return;
      }
      if (stderr) {
        console.error(`Command stderr: ${stderr}`);
      }
      resolve({
        content: [{ type: 'text', text: `File list for directory ${path}:\n\`\`\`\n${stdout}\`\`\`\n` }],
      });
    })
  });
});

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
console.log('Server started');