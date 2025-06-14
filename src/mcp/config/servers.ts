import path from 'node:path';

export interface ServerConfig {
  command: string;
  args: string[];
}

export interface ServersConfig {
  [name: string]: ServerConfig;
}

const servers: ServersConfig = {};

function registerServer(name: string, config: ServerConfig) {
  servers[name] = config;
}

function registerServers(config: { mcpServers: ServersConfig }) {
  for (const [name, server] of Object.entries(config.mcpServers)) {
    registerServer(name, server);
  }
}

// const localServerDir = path.resolve(__dirname, '..');
// registerServers({
//   "mcpServers": {
//     "llms-generator": {
//       "command": "npx",
//       "args": ["tsx", `${localServerDir}/server.ts`],
//     },
//   }
// });

registerServers({
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        process.cwd(),
      ]
    }
  }
});

export default servers;
