# GPT-Image-1 MCP Server: Project Context

This document provides a comprehensive overview of the GPT-Image-1 MCP Server project, including its architecture, functionality, implementation details, and development history. It's designed to quickly bring developers and AI assistants up to speed on all aspects of the project.

## Project Overview

The GPT-Image-1 MCP Server is a Node.js application that implements the Model Context Protocol (MCP) to provide image generation and editing capabilities using OpenAI's gpt-image-1 model. It serves as a bridge between MCP clients (like Roo or VS Code extensions) and the OpenAI API, allowing users to generate and edit images using natural language prompts.

## Core Functionality

### Image Generation

The server provides the `create_image` tool, which:
1. Accepts a text prompt and optional parameters
2. Validates the input using Zod schemas
3. Calls the OpenAI API's images.generate endpoint
4. Saves the generated images to a configurable output directory
5. Returns a formatted response with image paths, base64 data, and metadata

### Image Editing

The server provides the `create_image_edit` tool, which:
1. Accepts an image (as base64 or file path), a text prompt, and an optional mask
2. Supports both base64-encoded images and file paths
3. Uses a direct curl command to ensure proper MIME type handling
4. Calls the OpenAI API's images.edit endpoint
5. Saves the edited images to the configured output directory
6. Returns a formatted response with image paths, base64 data, and metadata

## Technical Architecture

### Project Structure

```
gpt-image-1-server/
├── src/                  # TypeScript source code
│   └── index.ts          # Main server implementation
├── build/                # Compiled JavaScript (output of build process)
├── generated-images/     # Default location for saved images (created at runtime)
├── node_modules/         # Dependencies (not in version control)
├── .gitignore            # Git ignore configuration
├── package.json          # Project configuration and dependencies
├── tsconfig.json         # TypeScript compiler configuration
├── README.md             # User documentation
├── CHANGELOG.md          # Version history and changes
└── CONTEXT.md            # This comprehensive project overview
```

### Dependencies

The server relies on several key dependencies:
- `@modelcontextprotocol/sdk`: For implementing the MCP protocol
- `openai`: The official OpenAI SDK for API access
- `zod`: For input validation and type safety
- `node-fetch`: For making HTTP requests
- `form-data`: For handling multipart/form-data requests
- `child_process`: For executing curl commands

### Implementation Details

#### MCP Server Setup

The server is implemented using the MCP SDK's `McpServer` class. It registers two tools:
1. `create_image`: For generating images
2. `create_image_edit`: For editing images

Each tool has a defined schema for its parameters and a handler function that processes requests.

#### Image Generation Implementation

The image generation functionality uses the OpenAI SDK directly:

```typescript
const response = await openai.images.generate({
  model: "gpt-image-1",
  prompt: args.prompt,
  n: args.n || 1,
  size: args.size || "1024x1024",
  quality: args.quality || "high",
  // ... other parameters
});
```

The server then processes the response, saves the images to disk, and returns a formatted response.

#### Image Editing Implementation

The image editing functionality uses a direct curl command for better MIME type handling:

```typescript
// Build the curl command
let curlCommand = `curl -s -X POST "https://api.openai.com/v1/images/edits" -H "Authorization: Bearer ${process.env.OPENAI_API_KEY}"`;

// Add parameters
curlCommand += ` -F "model=gpt-image-1"`;
curlCommand += ` -F "prompt=${args.prompt}"`;
curlCommand += ` -F "image[]=@${imageFile}"`;
// ... other parameters

// Execute the command
execSync(curlCommand, { stdio: ['pipe', 'pipe', 'inherit'] });
```

This approach ensures proper handling of file uploads with correct MIME types.

#### Image Saving

Images are saved to a configurable output directory:

```typescript
function saveImageToDisk(base64Data: string, format: string = 'png'): string {
  // Determine the output directory
  const outputDir = process.env.GPT_IMAGE_OUTPUT_DIR || path.join(process.cwd(), 'generated-images');
  
  // Create the directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Generate a filename with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `image-${timestamp}.${format}`;
  const outputPath = path.join(outputDir, filename);
  
  // Save the image
  fs.writeFileSync(outputPath, Buffer.from(base64Data, 'base64'));
  
  return outputPath;
}
```

#### Response Formatting

The server provides beautifully formatted responses with emojis and detailed information:

```
🎨 **Image Generated Successfully!**

📝 **Prompt**: A futuristic city skyline at sunset, digital art

📁 **Saved 1 Image**:
   1. C:\Users\username\project\generated-images\image-2025-05-05T12-34-56-789Z.png

⚡ **Token Usage**:
   • Total Tokens: 123
   • Input Tokens: 45
   • Output Tokens: 78
```

## Configuration

### Environment Variables

The server uses the following environment variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | OpenAI API key with access to the gpt-image-1 model |
| `GPT_IMAGE_OUTPUT_DIR` | No | Custom directory for saving generated images (defaults to `./generated-images`) |

### MCP Client Configuration

To use the server with an MCP client, the following configuration is needed:

```json
{
  "mcpServers": {
    "gpt-image-1": {
      "command": "node",
      "args": ["<path-to-project>/build/index.js"],
      "env": {
        "OPENAI_API_KEY": "sk-your-openai-api-key",
        "GPT_IMAGE_OUTPUT_DIR": "C:/path/to/output/directory" // Optional
      },
      "disabled": false,
      "alwaysAllow": []
    }
  }
}
```

## Development History

### Version 1.0.0 (May 4, 2025)

The initial release included:
- Basic implementation of the `create_image` and `create_image_edit` tools
- Support for all gpt-image-1 specific parameters
- Basic error handling
- Initial documentation

### Version 1.1.0 (May 5, 2025)

Major improvements included:
- Added file path support for the `create_image_edit` tool
- Fixed the build structure to output to the root build directory
- Enhanced output formatting with emojis and detailed information
- Added configurable output directory via environment variable
- Improved MIME type handling for image uploads
- Enhanced error handling and cleanup processes
- Added comprehensive documentation
- Added proper .gitignore file

## Key Challenges and Solutions

### MIME Type Handling

**Challenge**: The OpenAI SDK didn't properly handle MIME types for file uploads in the image edit endpoint.

**Solution**: Implemented a direct curl command approach that ensures proper MIME type handling:
```typescript
curlCommand += ` -F "image[]=@${imageFile}"`;
```

### File Path Support

**Challenge**: The original implementation only supported base64-encoded images.

**Solution**: Added support for file paths by:
1. Detecting if the input is a file path object
2. Reading the file from disk
3. Handling the file appropriately based on whether using the SDK or curl approach

### Build Structure

**Challenge**: The build process was outputting to a directory inside the src folder.

**Solution**: Updated the tsconfig.json to output to the root build directory:
```json
{
  "compilerOptions": {
    "outDir": "./build",
    // other options...
  }
}
```

## Usage Examples

### Generating an Image

```xml
<use_mcp_tool>
<server_name>gpt-image-1</server_name>
<tool_name>create_image</tool_name>
<arguments>
{
  "prompt": "A futuristic city skyline at sunset, digital art",
  "size": "1024x1024",
  "quality": "high"
}
</arguments>
</use_mcp_tool>
```

### Editing an Image with File Path

```xml
<use_mcp_tool>
<server_name>gpt-image-1</server_name>
<tool_name>create_image_edit</tool_name>
<arguments>
{
  "image": {
    "filePath": "C:/path/to/your/image.png"
  },
  "prompt": "Add a small robot in the corner",
  "quality": "high"
}
</arguments>
</use_mcp_tool>
```

## Future Improvements

Potential areas for future development:
1. Add support for the DALL-E 3 model
2. Implement image variation functionality
3. Add batch processing capabilities
4. Create a web interface for easier testing
5. Add support for more image formats
6. Implement caching to reduce API calls
7. Add unit and integration tests

## Troubleshooting Guide

### Common Issues

1. **MIME Type Errors**: Ensure image files have the correct extension (.png, .jpg, etc.) that matches their actual format.

2. **API Key Issues**: Verify your OpenAI API key is correct and has access to the gpt-image-1 model.

3. **Build Errors**: Ensure you have the correct TypeScript version installed and that your tsconfig.json is properly configured.

4. **File Path Issues**: Make sure file paths are absolute or correctly relative to the current working directory.

5. **Output Directory Issues**: Check if the process has write permissions to the configured output directory.

## Conclusion

The GPT-Image-1 MCP Server provides a robust and user-friendly interface to OpenAI's image generation capabilities. With features like file path support, configurable output directories, and detailed response formatting, it enhances the image generation experience for users of MCP-compatible clients.

This document should provide a comprehensive understanding of the project's architecture, functionality, and development history, enabling developers and AI assistants to quickly get up to speed and contribute effectively.
