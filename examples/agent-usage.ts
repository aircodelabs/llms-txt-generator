import { Agent } from '../src/llm/agent';
import * as dotenv from 'dotenv';

dotenv.config({
  path: ['.env.local', '.env'],
});

async function main() {
  const agent = new Agent({
    options: {
      temperature: 0.7,
    },
    streaming: true,
  });
  
  const result = await agent.run(`
    What is the weather in San Francisco today?
  `);
  console.log(result);

  await agent.close();

  process.exit(0);
}

main();