import path from 'node:path';

// MCP servers configuration
import { type IServerConfig, type IServersConfig } from '../../types';

// 向后兼容的类型别名
export type ServerConfig = IServerConfig;
export type ServersConfig = IServersConfig;

const servers: IServersConfig = {};

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
