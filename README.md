# @cloudwerxlab/gpt-image-1-mcp

A Model Context Protocol (MCP) server for generating and editing images using the OpenAI `gpt-image-1` model.

## NPX Usage

You can run this MCP server directly using NPX without installing it:

```bash
npx -y @cloudwerxlab/gpt-image-1-mcp
```

The `-y` flag automatically answers "yes" to any prompts that might appear during the installation process, which is especially important when running from MCP clients.

### Prerequisites

- Node.js (v14 or higher)
- An OpenAI API key with access to the gpt-image-1 model

### Environment Variables

The server uses the following environment variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | Your OpenAI API key with access to the gpt-image-1 model |
| `GPT_IMAGE_OUTPUT_DIR` | No | Custom directory for saving generated images (defaults to `./generated-images`) |

### Example Usage with NPX

```bash
# Set your OpenAI API key
export OPENAI_API_KEY=sk-your-openai-api-key

# Run the server with NPX
npx -y @cloudwerxlab/gpt-image-1-mcp
```

### Setting Up in an MCP Client

#### For Roo or VS Code MCP Extension

1. Locate your MCP settings file:
   - For Roo: `c:\Users\<username>\AppData\Roaming\Code\User\globalStorage\rooveterinaryinc.roo-cline\settings\mcp_settings.json`
   - For VS Code MCP Extension: Check your extension documentation for the settings file location

2. Add the following configuration to the `mcpServers` object:

```json
{
  "mcpServers": {
    "gpt-image-1": {
      "command": "npx",
      "args": [
        "-y",
        "@cloudwerxlab/gpt-image-1-mcp"
      ],
      "env": {
        "OPENAI_API_KEY": "PASTE YOUR OPEN-AI KEY HERE"
      }
    }
  }
}
```

## Features

This server exposes two tools:
- `create_image`: Generates a new image based on a text prompt.
- `create_image_edit`: Edits an existing image based on a text prompt and optional mask.

### Enhanced Capabilities

- **Beautifully Formatted Output**: Responses include emojis and detailed information about the generated images
- **Automatic Image Saving**: All generated images are saved to disk for easy access
- **Configurable Output Directory**: Customize where images are saved using environment variables
- **File Path Support**: Edit images using file paths instead of base64 encoding
- **Detailed Token Usage**: View token consumption for each request
- **Error Handling**: Robust error handling with informative error messages

### How It Works

#### Image Generation Process
1. The server receives a prompt and parameters from the client
2. It calls the OpenAI API using the gpt-image-1 model
3. The API returns base64-encoded images
4. The server saves these images to the configured output directory
5. It returns a formatted response with image paths and metadata

#### Image Editing Process
1. The server receives an image (as base64 or file path), a prompt, and optional mask
2. For file paths, it reads the files and prepares them for the API
3. It uses a direct curl command to ensure proper MIME type handling
4. The API returns base64-encoded edited images
5. The server saves these images to the configured output directory
6. It returns a formatted response with image paths and metadata

### Output Directory Behavior

- **Default Location**: `./generated-images` (relative to the current working directory)
- **Custom Location**: Set via `GPT_IMAGE_OUTPUT_DIR` environment variable
- **Directory Creation**: The server automatically creates the output directory if it doesn't exist
- **File Naming**: Images are saved with timestamped filenames (e.g., `image-2023-05-05T12-34-56-789Z.png`)

## Usage

### Tool: `create_image`

Generates a new image based on a text prompt.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `prompt` | string | Yes | The text description of the image to generate (max 32,000 chars) |
| `size` | string | No | Image size: "1024x1024" (default), "1536x1024", or "1024x1536" |
| `quality` | string | No | Image quality: "high" (default), "medium", or "low" |
| `n` | integer | No | Number of images to generate (1-10, default: 1) |
| `background` | string | No | Background style: "transparent", "opaque", or "auto" (default) |
| `output_format` | string | No | Output format: "png" (default), "jpeg", or "webp" |
| `output_compression` | integer | No | Compression level (0-100, default: 0) |
| `user` | string | No | User identifier for OpenAI usage tracking |
| `moderation` | string | No | Moderation level: "low" or "auto" (default) |

#### Example

```xml
<use_mcp_tool>
<server_name>gpt-image-1</server_name>
<tool_name>create_image</tool_name>
<arguments>
{
  "prompt": "A futuristic city skyline at sunset, digital art",
  "size": "1024x1024",
  "quality": "high",
  "n": 1,
  "background": "auto"
}
</arguments>
</use_mcp_tool>
```

#### Response

The tool returns:
- A formatted text message with details about the generated image(s)
- The image(s) as base64-encoded data
- Metadata including token usage and file paths

### Tool: `create_image_edit`

Edits an existing image based on a text prompt and optional mask.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `image` | string, object, or array | Yes | The image(s) to edit (base64 string or file path object) |
| `prompt` | string | Yes | The text description of the desired edit (max 32,000 chars) |
| `mask` | string or object | No | The mask that defines areas to edit (base64 string or file path object) |
| `size` | string | No | Image size: "1024x1024" (default), "1536x1024", or "1024x1536" |
| `quality` | string | No | Image quality: "high" (default), "medium", or "low" |
| `n` | integer | No | Number of images to generate (1-10, default: 1) |
| `background` | string | No | Background style: "transparent", "opaque", or "auto" (default) |
| `user` | string | No | User identifier for OpenAI usage tracking |

#### Example with Base64 Encoded Image

```xml
<use_mcp_tool>
<server_name>gpt-image-1</server_name>
<tool_name>create_image_edit</tool_name>
<arguments>
{
  "image": "BASE64_ENCODED_IMAGE_STRING",
  "prompt": "Add a small robot in the corner",
  "mask": "BASE64_ENCODED_MASK_STRING",
  "quality": "high"
}
</arguments>
</use_mcp_tool>
```

#### Example with File Path

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
  "mask": {
    "filePath": "C:/path/to/your/mask.png"
  },
  "quality": "high"
}
</arguments>
</use_mcp_tool>
```

#### Response

The tool returns:
- A formatted text message with details about the edited image(s)
- The edited image(s) as base64-encoded data
- Metadata including token usage and file paths

## Troubleshooting

### Common Issues

1. **MIME Type Errors**: If you encounter MIME type errors when editing images, ensure the image files have the correct extension (.png, .jpg, etc.) that matches their actual format.

2. **API Key Issues**: If you get authentication errors, verify your OpenAI API key is correct and has access to the gpt-image-1 model.

3. **Build Errors**: If you encounter build errors, ensure you have the correct TypeScript version installed and that your `tsconfig.json` is properly configured.

## License

This project is licensed under the MIT License.

## Acknowledgments

- [OpenAI](https://openai.com/) for providing the gpt-image-1 model
- [Model Context Protocol (MCP)](https://github.com/model-context-protocol/mcp) for the protocol specification
