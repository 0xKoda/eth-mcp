const axios = require('axios');
const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { z } = require('zod');

// Redirect console.log to stderr to avoid breaking the MCP protocol
const originalConsoleLog = console.log;
console.log = function() {
  console.error.apply(console, arguments);
};

// Ethereum RPC URL
const ETH_RPC_URL = 'https://eth.llamarpc.com';

// Initialize the MCP server
const server = new McpServer({
  name: 'ethereum-rpc',
  version: '1.0.0'
});

// Define prompts for common Ethereum interactions
server.prompt(
  'check-contract',
  {
    address: z.string().regex(/^0x[a-fA-F0-9]{40}$/).describe('The Ethereum address to check')
  },
  ({ address }) => ({
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `Please analyze the contract at address ${address}:
1. First, get the contract code
2. Check if it's a contract or regular address
3. If it's a contract, help me understand what type of contract it might be based on the code`
        }
      }
    ]
  })
);

server.prompt(
  'check-wallet',
  {
    address: z.string().regex(/^0x[a-fA-F0-9]{40}$/).describe('The Ethereum address to check')
  },
  ({ address }) => ({
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `Please analyze the wallet at address ${address}:
1. Get the current balance
2. Format the balance in both Wei and ETH
3. Provide context about whether this is a significant amount`
        }
      }
    ]
  })
);

server.prompt(
  'gas-analysis',
  {},
  () => ({
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `Please analyze the current gas situation:
1. Get the current gas price
2. Convert it to Gwei for readability
3. Suggest whether this is a good time for transactions based on historical averages`
        }
      }
    ]
  })
);

// Helper function to make RPC calls
async function makeRpcCall(method, params = []) {
  try {
    const response = await axios.post(ETH_RPC_URL, {
      jsonrpc: '2.0',
      id: 1,
      method,
      params
    });

    if (response.data.error) {
      throw new Error(`RPC Error: ${response.data.error.message}`);
    }

    return response.data.result;
  } catch (error) {
    console.error(`Error making RPC call to ${method}:`, error.message);
    throw error;
  }
}

// Tool 1: eth_getCode - Gets the code at a specific address
server.tool(
  'eth_getCode',
  'Retrieves the code at a given Ethereum address',
  {
    address: z.string().regex(/^0x[a-fA-F0-9]{40}$/).describe('The Ethereum address to get code from'),
    blockParameter: z.string().default('latest').describe('Block parameter (default: "latest")')
  },
  async (args) => {
    try {
      console.error(`Getting code for address: ${args.address} at block: ${args.blockParameter}`);
      
      const code = await makeRpcCall('eth_getCode', [args.address, args.blockParameter]);
      
      return {
        content: [{ 
          type: "text", 
          text: code === '0x' ? 
            `No code found at address ${args.address} (this may be a regular wallet address, not a contract)` : 
            `Contract code at ${args.address}:\n${code}`
        }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: Failed to get code. ${error.message}` }],
        isError: true
      };
    }
  }
);

// Tool 2: eth_gasPrice - Gets the current gas price
server.tool(
  'eth_gasPrice',
  'Retrieves the current gas price in wei',
  {},
  async () => {
    try {
      console.error('Getting current gas price');
      
      const gasPrice = await makeRpcCall('eth_gasPrice');
      // Convert hex gas price to decimal and then to Gwei for readability
      const gasPriceWei = parseInt(gasPrice, 16);
      const gasPriceGwei = gasPriceWei / 1e9;
      
      return {
        content: [{ 
          type: "text", 
          text: `Current Gas Price:\n${gasPriceWei} Wei\n${gasPriceGwei.toFixed(2)} Gwei` 
        }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: Failed to get gas price. ${error.message}` }],
        isError: true
      };
    }
  }
);

// Tool 3: eth_getBalance - Gets the balance of an account
server.tool(
  'eth_getBalance',
  'Retrieves the balance of a given Ethereum address',
  {
    address: z.string().regex(/^0x[a-fA-F0-9]{40}$/).describe('The Ethereum address to check balance'),
    blockParameter: z.string().default('latest').describe('Block parameter (default: "latest")')
  },
  async (args) => {
    try {
      console.error(`Getting balance for address: ${args.address} at block: ${args.blockParameter}`);
      
      const balance = await makeRpcCall('eth_getBalance', [args.address, args.blockParameter]);
      // Convert hex balance to decimal and then to ETH for readability
      const balanceWei = parseInt(balance, 16);
      const balanceEth = balanceWei / 1e18;
      
      return {
        content: [{ 
          type: "text", 
          text: `Balance for ${args.address}:\n${balanceWei} Wei\n${balanceEth.toFixed(6)} ETH` 
        }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: Failed to get balance. ${error.message}` }],
        isError: true
      };
    }
  }
);

// Connect to the stdio transport and start the server
server.connect(new StdioServerTransport())
  .then(() => {
    console.error('Ethereum RPC MCP Server is running...');
  })
  .catch((err) => {
    console.error('Failed to start MCP server:', err);
    process.exit(1);
  });
