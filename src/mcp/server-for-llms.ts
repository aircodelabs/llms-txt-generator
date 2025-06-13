#!/usr/bin/env node

/*
 * MCP Server
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import { promises as fs } from 'node:fs';
import { dirname } from 'node:path';
import { loadPrompt } from '../llm/utils';

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

// listFiles
server.tool(
  'listFiles', 
  `List files in the specified directory. This tool is restricted to be used only during the generate process for creating llms.txt and llms-full.txt files.`, 
  { path: z.string() }, 
  async ({ path }) => { 
    try {
      const files = await fs.readdir(path, { withFileTypes: true });
      const fileList = files.map(file => {
        const isDirectory = file.isDirectory();
        const fileType = isDirectory ? 'd' : '-';
        return `${fileType} ${file.name}${isDirectory ? '/' : ''}`;
      }).join('\n');
      
      return {
        content: [{ type: 'text', text: `File list for directory ${path}:\n\`\`\`\n${fileList}\`\`\`\n` }],
      };
    } catch (error) {
      console.error(`File listing error: ${error}`);
      return {
        content: [{ type: 'text', text: `File listing error: ${error}` }],
      };
    }
  }
);

// readFile
server.tool(
  'readFile',
  `Read the content of a specified file. This tool is restricted to be used only during the generate process for creating llms.txt and llms-full.txt files.`,
  { path: z.string() },
  async ({ path }) => {
    try {
      const content = await fs.readFile(path, 'utf8');
      return {
        content: [{ type: 'text', text: `File content for ${path}:\n\`\`\`\n${content}\`\`\`\n` }],
      };
    } catch (error) {
      console.error(`File reading error: ${error}`);
      return {
        content: [{ type: 'text', text: `File reading error: ${error}` }],
      };
    }
  }
);

// makeDirectory
server.tool(
  'makeDirectory',
  `Create a directory. This tool is restricted to be used only during the generate process for creating llms.txt and llms-full.txt files.`,
  { path: z.string() },
  async ({ path }) => {
    try {
      await fs.mkdir(path, { recursive: true });
      return {
        content: [{ type: 'text', text: `Directory created at ${path}` }],
      };
    } catch (error) {
      console.error(`Directory creation error: ${error}`);
      return {
        content: [{ type: 'text', text: `Directory creation error: ${error}` }],
      };
    }
  }
);

// writeFile
server.tool(
  'writeFile',
  `Write content to a specified file. This tool is restricted to be used only during the generate process for creating llms.txt and llms-full.txt files.`,
  { 
    path: z.string(),
    content: z.string() 
  },
  async ({ path, content }) => {
    try {
      // Create directory if it doesn't exist
      const dirPath = dirname(path);
      await fs.mkdir(dirPath, { recursive: true });
      
      // Write content to file
      await fs.writeFile(path, content, 'utf8');
      
      return {
        content: [{ type: 'text', text: `Content written to ${path}` }],
      };
    } catch (error) {
      console.error(`File writing error: ${error}`);
      return {
        content: [{ type: 'text', text: `File writing error: ${error}` }],
      };
    }
  }
);

// runCommand
server.tool(
  'runCommand',
  `Execute commands in the command line terminal. This tool is restricted to be used only during the generate process for creating llms.txt and llms-full.txt files.`,
  { 
    command: z.string() 
  },
  async ({ command }) => {
    try {
      const { exec } = await import('node:child_process');
      const util = await import('node:util');
      const execPromise = util.promisify(exec);
      
      const { stdout, stderr } = await execPromise(command);
      
      if (stderr) {
        console.error(`Command execution error: ${stderr}`);
        return {
          content: [{ type: 'text', text: `Command execution error: ${stderr}\n\nCommand output:\n${stdout}` }],
        };
      }
      
      return {
        content: [{ type: 'text', text: `Command executed successfully. Output:\n\n\`\`\`\n${stdout}\`\`\`\n` }],
      };
    } catch (error) {
      console.error(`Command execution error: ${error}`);
      return {
        content: [{ type: 'text', text: `Command execution error: ${error}` }],
      };
    }
  }
);

async function main() {
  // Start receiving messages on stdin and sending messages on stdout
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log('Server started');
}
main();