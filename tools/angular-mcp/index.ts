import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { exec as execSync } from 'child_process';
import { dirname } from 'path';
import { promisify } from 'util';
import { z } from 'zod';

const exec = promisify(execSync);

// Initialize the MCP server with a name and version
const server = new McpServer({ name: 'workshops-de-angular-mcp', version: '1.0.0' });

server.registerTool(
  'generate_component',
  {
    title: 'Generate Angular Component',
    description: 'Creates a new Angular component using the Angular CLI',
    inputSchema: {
      name: z.string().describe('Component name'),
      path: z.string().optional().describe('Target path or project')
    }
  },
  async ({ name, path }: { name: string; path?: string }) => {
    // CLI is already in the project root, so we need to remove the src/app prefix
    path = path?.replace(/^src\/app\/?/, '');

    // Construct the CLI command
    const target = path ? `${path}/${name}` : name;
    const cliCommand = `npx @angular/cli generate component ${target} --standalone --flat --skip-tests --inline-style --inline-template --no-interactive`;

    try {
      // Execute from the project root (two levels up from tools/angular-mcp)
      const result = await exec(cliCommand, { cwd: dirname(dirname(__dirname)) });
      return { content: [{ type: 'text', text: `✅ Component generated successfully:\n${result.stdout}` }] };
    } catch (error: unknown) {
      return {
        content: [{ type: 'text', text: `❌ CLI Error: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

server.registerTool(
  'execute_migrations',
  {
    title: 'Execute Angular Migrations',
    description: 'Executes Angular migrations using the Angular CLI',
    inputSchema: {
      name: z.string().describe('Migration name from https://angular.dev/reference/migrations'),
    }
  },
  async ({ name }: { name: string }) => {
    // Construct the CLI command
    const cliCommand = `npx @angular/cli generate @angular/core:${name} --no-interactive`;

    try {
      // Execute from the project root (two levels up from tools/angular-mcp)
      const result = await exec(cliCommand, { cwd: dirname(dirname(__dirname)) });
      return { content: [{ type: 'text', text: `✅ Migration executed successfully:\n${result.stdout}` }] };
    } catch (error: unknown) {
      return {
        content: [{ type: 'text', text: `❌ CLI Error: ${error instanceof Error ? error.message : 'Unknown error'}` }]
      };
    }
  }
);

// Start listening for MCP messages on STDIN/STDOUT
const transport = new StdioServerTransport();

server
  .connect(transport)
  .then(() =>  console.log('MCP server started'))
  .catch(error =>  console.error('Error connecting to MCP server:', error));