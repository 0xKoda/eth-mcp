# Ethereum RPC MCP Server

A Model Context Protocol (MCP) server for interacting with Ethereum blockchain.

<a href="https://glama.ai/mcp/servers/qpjvkozof7">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/qpjvkozof7/badge" alt="Ethereum RPC Server MCP server" />
</a>

## Overview

This MCP server provides tools to query Ethereum blockchain data through standard JSON-RPC methods. It enables AI assistants and applications to interact with the Ethereum blockchain through a standardized protocol.

## Features

This MCP server provides three key Ethereum RPC methods as tools:

- **eth_getCode**: Retrieve the code at a specific Ethereum address
- **eth_gasPrice**: Get the current gas price on the Ethereum network
- **eth_getBalance**: Check the balance of an Ethereum account

Note: More are coming

## Usage

### Adding to Cursor

To add this MCP to Cursor:

1. First, clone this repository:
   ```bash
   git clone https://github.com/yourusername/eth-mpc.git
   ```
   
2. Go to Cursor settings → MCP → Add new MCP server
3. Enter a name (e.g., "eth-mcp")
4. Select "command" as the type
5. Input the full path to the script:
   ```
   node /path/to/eth-mpc/index.js
   ```

![Adding Ethereum MCP to Cursor](image.png)

6. Click "Add" to enable the server

Once added, the Ethereum RPC tools will be available to use within Cursor.


The server uses stdio transport, making it compatible with MCP clients like Claude Desktop, Cursor, and others.

## Testing with MCP Inspector

The MCP Inspector is a development tool for testing and debugging MCP servers. It provides an interactive interface to test your MCP server's functionality without needing a full AI client.

### Running the Inspector

To test your Ethereum RPC MCP server with the Inspector:

To run the Inspector:
   ```bash
   npx @modelcontextprotocol/inspector
   ```

2. Input the command and path

3. The Inspector will connect to your running MCP server and display available tools.

### Testing Tools with Inspector

The Inspector allows you to:

- View available tools and their descriptions
- Test each tool with different parameters
- See the responses in a structured format
- Debug any issues with your MCP server implementation

For example, to test the `eth_getBalance` tool:
1. Select the tool in the Inspector interface
2. Enter a valid Ethereum address (e.g., `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045` - Vitalik's address)
3. Use the default block parameter (`latest`)
4. Submit the request and view the response


## Integration with MCP Clients

This MCP server can be integrated with any MCP-compatible client, including:

- Claude Desktop 
- Claude Code
- Cursor (instructions above)
- Cline
- Other MCP-compatible applications

When integrated, the client application can use the tools provided by this server to query Ethereum blockchain data directly.

## Understanding MCP

Model Context Protocol (MCP) is an open standard that allows AI models to interact with various tools and services. It provides a standardized way for developers to expose APIs, data sources, and functionality to AI assistants.

### Learn More About MCP

MCP servers like this one form part of an ecosystem that allows AI assistants to perform complex tasks across multiple services without requiring custom integration for each service.

📚 **Official Documentation**: [Model Context Protocol Overview](https://modelcontextprotocol.io/sdk/java/mcp-overview)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.