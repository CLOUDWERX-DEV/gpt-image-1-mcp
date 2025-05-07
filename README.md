<p align="center">
  <img src="logo.png" alt="GPT Image 1 MCP Logo" width="200"/>
</p>

<h1 align="center">@cloudwerxlab/gpt-image-1-mcp</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/@cloudwerxlab/gpt-image-1-mcp"><img src="https://img.shields.io/npm/v/@cloudwerxlab/gpt-image-1-mcp.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@cloudwerxlab/gpt-image-1-mcp"><img src="https://img.shields.io/npm/dm/@cloudwerxlab/gpt-image-1-mcp.svg" alt="npm downloads"></a>
  <a href="https://github.com/CLOUDWERX-DEV/gpt-image-1-mcp/blob/main/LICENSE"><img src="https://img.shields.io/github/license/CLOUDWERX-DEV/gpt-image-1-mcp.svg" alt="license"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/node/v/@cloudwerxlab/gpt-image-1-mcp.svg" alt="node version"></a>
  <a href="https://cloudwerx.dev"><img src="https://img.shields.io/badge/website-cloudwerx.dev-blue" alt="Website"></a>
</p>

<p align="center">
  A Model Context Protocol (MCP) server for generating and editing images using the OpenAI <code>gpt-image-1</code> model.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/OpenAI-GPT--Image--1-6E46AE" alt="OpenAI GPT-Image-1">
  <img src="https://img.shields.io/badge/MCP-Compatible-00A3E0" alt="MCP Compatible">
</p>

## 🚀 Quick Start

<div align="center">
  <a href="https://www.npmjs.com/package/@cloudwerxlab/gpt-image-1-mcp"><img src="https://img.shields.io/badge/NPX-Ready-red.svg" alt="NPX Ready"></a>
</div>

<p align="center">Run this MCP server directly using NPX without installing it. <a href="https://www.npmjs.com/package/@cloudwerxlab/gpt-image-1-mcp">View on npm</a>.</p>

```bash
npx -y @cloudwerxlab/gpt-image-1-mcp
```

<p align="center">The <code>-y</code> flag automatically answers "yes" to any prompts that might appear during the installation process.</p>

### 📋 Prerequisites

<table>
  <tr>
    <td width="50%" align="center">
      <img src="https://img.shields.io/badge/Node.js-v14+-339933?logo=node.js&logoColor=white" alt="Node.js v14+">
      <p>Node.js (v14 or higher)</p>
    </td>
    <td width="50%" align="center">
      <img src="https://img.shields.io/badge/OpenAI-API_Key-412991?logo=openai&logoColor=white" alt="OpenAI API Key">
      <p>OpenAI API key with access to gpt-image-1</p>
    </td>
  </tr>
</table>

### 🔑 Environment Variables

<table>
  <tr>
    <th>Variable</th>
    <th>Required</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>OPENAI_API_KEY</code></td>
    <td>✅ Yes</td>
    <td>Your OpenAI API key with access to the gpt-image-1 model</td>
  </tr>
  <tr>
    <td><code>GPT_IMAGE_OUTPUT_DIR</code></td>
    <td>❌ No</td>
    <td>Custom directory for saving generated images (defaults to user's Pictures folder under <code>gpt-image-1</code> subfolder)</td>
  </tr>
</table>

### 💻 Example Usage with NPX

<table>
  <tr>
    <th>Operating System</th>
    <th>Command Line Example</th>
  </tr>
  <tr>
    <td><strong>Linux/macOS</strong></td>
    <td>

```bash
# Set your OpenAI API key
export OPENAI_API_KEY=sk-your-openai-api-key

# Optional: Set custom output directory
export GPT_IMAGE_OUTPUT_DIR=/home/username/Pictures/ai-generated-images

# Run the server with NPX
npx -y @cloudwerxlab/gpt-image-1-mcp
```
  </tr>
  <tr>
    <td><strong>Windows (PowerShell)</strong></td>
    <td>

```powershell
# Set your OpenAI API key
$env:OPENAI_API_KEY = "sk-your-openai-api-key"

# Optional: Set custom output directory
$env:GPT_IMAGE_OUTPUT_DIR = "C:\Users\username\Pictures\ai-generated-images"

# Run the server with NPX
npx -y @cloudwerxlab/gpt-image-1-mcp
```
  </tr>
  <tr>
    <td><strong>Windows (Command Prompt)</strong></td>
    <td>

```cmd
:: Set your OpenAI API key
set OPENAI_API_KEY=sk-your-openai-api-key

:: Optional: Set custom output directory
set GPT_IMAGE_OUTPUT_DIR=C:\Users\username\Pictures\ai-generated-images

:: Run the server with NPX
npx -y @cloudwerxlab/gpt-image-1-mcp
```
  </tr>
</table>

## 🔌 Integration with MCP Clients

<div align="center">
  <img src="https://img.shields.io/badge/VS_Code-MCP_Extension-007ACC?logo=visual-studio-code&logoColor=white" alt="VS Code MCP Extension">
  <img src="https://img.shields.io/badge/Roo-Compatible-FF6B6B" alt="Roo Compatible">
  <img src="https://img.shields.io/badge/Cursor-Compatible-4C2889" alt="Cursor Compatible">
  <img src="https://img.shields.io/badge/Augment-Compatible-6464FF" alt="Augment Compatible">
  <img src="https://img.shields.io/badge/Windsurf-Compatible-00B4D8" alt="Windsurf Compatible">
</div>

### 🛠️ Setting Up in an MCP Client

<table>
  <tr>
    <td>
      <h4>Step 1: Locate Settings File</h4>
      <ul>
        <li>For <strong>Roo</strong>: <code>c:\Users\&lt;username&gt;\AppData\Roaming\Code\User\globalStorage\rooveterinaryinc.roo-cline\settings\mcp_settings.json</code></li>
        <li>For <strong>VS Code MCP Extension</strong>: Check your extension documentation for the settings file location</li>
        <li>For <strong>Cursor</strong>: <code>~/.config/cursor/mcp_settings.json</code> (Linux/macOS) or <code>%APPDATA%\Cursor\mcp_settings.json</code> (Windows)</li>
        <li>For <strong>Augment</strong>: <code>~/.config/augment/mcp_settings.json</code> (Linux/macOS) or <code>%APPDATA%\Augment\mcp_settings.json</code> (Windows)</li>
        <li>For <strong>Windsurf</strong>: <code>~/.config/windsurf/mcp_settings.json</code> (Linux/macOS) or <code>%APPDATA%\Windsurf\mcp_settings.json</code> (Windows)</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <h4>Step 2: Add Configuration</h4>
      <p>Add the following configuration to the <code>mcpServers</code> object:</p>
    </td>
  </tr>
</table>

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
        "OPENAI_API_KEY": "PASTE YOUR OPEN-AI KEY HERE",
        "GPT_IMAGE_OUTPUT_DIR": "OPTIONAL: PATH TO SAVE GENERATED IMAGES"
      }
    }
  }
}
```

#### Example Configurations for Different Operating Systems

<table>
  <tr>
    <th>Operating System</th>
    <th>Example Configuration</th>
  </tr>
  <tr>
    <td><strong>Windows</strong></td>
    <td>

```json
{
  "mcpServers": {
    "gpt-image-1": {
      "command": "npx",
      "args": ["-y", "@cloudwerxlab/gpt-image-1-mcp"],
      "env": {
        "OPENAI_API_KEY": "sk-your-openai-api-key",
        "GPT_IMAGE_OUTPUT_DIR": "C:\\Users\\username\\Pictures\\ai-generated-images"
      }
    }
  }
}
```
  </tr>
  <tr>
    <td><strong>Linux/macOS</strong></td>
    <td>

```json
{
  "mcpServers": {
    "gpt-image-1": {
      "command": "npx",
      "args": ["-y", "@cloudwerxlab/gpt-image-1-mcp"],
      "env": {
        "OPENAI_API_KEY": "sk-your-openai-api-key",
        "GPT_IMAGE_OUTPUT_DIR": "/home/username/Pictures/ai-generated-images"
      }
    }
  }
}
```
  </tr>
</table>

> **Note**: For Windows paths, use double backslashes (`\\`) to escape the backslash character in JSON. For Linux/macOS, use forward slashes (`/`).

## ✨ Features

<div align="center">
  <table>
    <tr>
      <td align="center">
        <h3>🎨 Core Tools</h3>
        <ul>
          <li><code>create_image</code>: Generate new images from text prompts</li>
          <li><code>create_image_edit</code>: Edit existing images with text prompts and masks</li>
        </ul>
      </td>
      <td align="center">
        <h3>🚀 Key Benefits</h3>
        <ul>
          <li>Simple integration with MCP clients</li>
          <li>Full access to OpenAI's gpt-image-1 capabilities</li>
          <li>Streamlined workflow for AI image generation</li>
        </ul>
      </td>
    </tr>
  </table>
</div>

### 💡 Enhanced Capabilities

<table>
  <tr>
    <td>
      <h4>📊 Output & Formatting</h4>
      <ul>
        <li>✅ <strong>Beautifully Formatted Output</strong>: Responses include emojis and detailed information</li>
        <li>✅ <strong>Automatic Image Saving</strong>: All generated images saved to disk for easy access</li>
        <li>✅ <strong>Detailed Token Usage</strong>: View token consumption for each request</li>
      </ul>
    </td>
    <td>
      <h4>⚙️ Configuration & Handling</h4>
      <ul>
        <li>✅ <strong>Configurable Output Directory</strong>: Customize where images are saved</li>
        <li>✅ <strong>File Path Support</strong>: Edit images using file paths instead of base64 encoding</li>
        <li>✅ <strong>Comprehensive Error Handling</strong>: Detailed error reporting with specific error codes, descriptions, and troubleshooting suggestions</li>
      </ul>
    </td>
  </tr>
</table>

## 🔄 How It Works

<div align="center">
  <table>
    <tr>
      <th align="center">🖼️ Image Generation</th>
      <th align="center">✏️ Image Editing</th>
    </tr>
    <tr>
      <td>
        <ol>
          <li>Server receives prompt and parameters</li>
          <li>Calls OpenAI API using gpt-image-1 model</li>
          <li>API returns base64-encoded images</li>
          <li>Server saves images to configured directory</li>
          <li>Returns formatted response with paths and metadata</li>
        </ol>
      </td>
      <td>
        <ol>
          <li>Server receives image, prompt, and optional mask</li>
          <li>For file paths, reads and prepares files for API</li>
          <li>Uses direct curl command for proper MIME handling</li>
          <li>API returns base64-encoded edited images</li>
          <li>Server saves images to configured directory</li>
          <li>Returns formatted response with paths and metadata</li>
        </ol>
      </td>
    </tr>
  </table>
</div>

### 📁 Output Directory Behavior

<table>
  <tr>
    <td width="50%">
      <h4>📂 Storage Location</h4>
      <ul>
        <li>🔹 <strong>Default Location</strong>: User's Pictures folder under <code>gpt-image-1</code> subfolder (e.g., <code>C:\Users\username\Pictures\gpt-image-1</code> on Windows)</li>
        <li>🔹 <strong>Custom Location</strong>: Set via <code>GPT_IMAGE_OUTPUT_DIR</code> environment variable</li>
        <li>🔹 <strong>Fallback Location</strong>: <code>./generated-images</code> (if Pictures folder can't be determined)</li>
      </ul>
    </td>
    <td width="50%">
      <h4>🗂️ File Management</h4>
      <ul>
        <li>🔹 <strong>Directory Creation</strong>: Automatically creates output directory if it doesn't exist</li>
        <li>🔹 <strong>File Naming</strong>: Images saved with timestamped filenames (e.g., <code>image-2023-05-05T12-34-56-789Z.png</code>)</li>
        <li>🔹 <strong>Cross-Platform</strong>: Works on Windows, macOS, and Linux with appropriate Pictures folder detection</li>
      </ul>
    </td>
  </tr>
</table>

## Installation & Usage

### NPM Package

This package is available on npm: [@cloudwerxlab/gpt-image-1-mcp](https://www.npmjs.com/package/@cloudwerxlab/gpt-image-1-mcp)

You can install it globally:

```bash
npm install -g @cloudwerxlab/gpt-image-1-mcp
```

Or run it directly with npx as shown in the Quick Start section.

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

## 🔧 Troubleshooting

<div align="center">
  <img src="https://img.shields.io/badge/Support-Available-brightgreen" alt="Support Available">
</div>

### 🚨 Common Issues

<table>
  <tr>
    <th align="center">Issue</th>
    <th align="center">Solution</th>
  </tr>
  <tr>
    <td>
      <h4>🖼️ MIME Type Errors</h4>
      <p>Errors related to image format or MIME type handling</p>
    </td>
    <td>
      <p>Ensure image files have the correct extension (.png, .jpg, etc.) that matches their actual format. The server uses file extensions to determine MIME types.</p>
    </td>
  </tr>
  <tr>
    <td>
      <h4>🔑 API Key Issues</h4>
      <p>Authentication errors with OpenAI API</p>
    </td>
    <td>
      <p>Verify your OpenAI API key is correct and has access to the gpt-image-1 model. Check for any spaces or special characters that might have been accidentally included.</p>
    </td>
  </tr>
  <tr>
    <td>
      <h4>🛠️ Build Errors</h4>
      <p>Issues when building from source</p>
    </td>
    <td>
      <p>Ensure you have the correct TypeScript version installed (v5.3.3 or compatible) and that your <code>tsconfig.json</code> is properly configured. Run <code>npm install</code> to ensure all dependencies are installed.</p>
    </td>
  </tr>
  <tr>
    <td>
      <h4>📁 Output Directory Issues</h4>
      <p>Problems with saving generated images</p>
    </td>
    <td>
      <p>Check if the process has write permissions to the configured output directory. Try using an absolute path for <code>GPT_IMAGE_OUTPUT_DIR</code> if relative paths aren't working.</p>
    </td>
  </tr>
</table>

### 🔍 Error Handling and Reporting

The MCP server includes comprehensive error handling that provides detailed information when something goes wrong. When an error occurs:

1. **Error Format**: All errors are returned with:
   - A clear error message describing what went wrong
   - The specific error code or type
   - Additional context about the error when available

2. **AI Assistant Behavior**: When using this MCP server with AI assistants:
   - The AI will always report the full error message to help with troubleshooting
   - The AI will explain the likely cause of the error in plain language
   - The AI will suggest specific steps to resolve the issue

## 📄 License

<div align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License"></a>
</div>

<p align="center">
  This project is licensed under the MIT License - see the <a href="LICENSE">LICENSE</a> file for details.
</p>

<details>
  <summary>License Summary</summary>

  <p>The MIT License is a permissive license that is short and to the point. It lets people do anything with your code with proper attribution and without warranty.</p>

  <p><strong>You are free to:</strong></p>
  <ul>
    <li>Use the software commercially</li>
    <li>Modify the software</li>
    <li>Distribute the software</li>
    <li>Use and modify the software privately</li>
  </ul>

  <p><strong>Under the following terms:</strong></p>
  <ul>
    <li>Include the original copyright notice and the license notice in all copies or substantial uses of the work</li>
  </ul>

  <p><strong>Limitations:</strong></p>
  <ul>
    <li>The authors provide no warranty with the software and are not liable for any damages</li>
  </ul>
</details>

## 🙏 Acknowledgments

<div align="center">
  <table>
    <tr>
      <td align="center">
        <a href="https://openai.com/">
          <img src="https://img.shields.io/badge/OpenAI-412991?logo=openai&logoColor=white" alt="OpenAI">
          <p>For providing the gpt-image-1 model</p>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/model-context-protocol/mcp">
          <img src="https://img.shields.io/badge/MCP-Protocol-00A3E0" alt="MCP Protocol">
          <p>For the protocol specification</p>
        </a>
      </td>
    </tr>
  </table>
</div>

<div align="center">
  <p>
    <a href="https://github.com/CLOUDWERX-DEV/gpt-image-1-mcp/issues">Report Bug</a> •
    <a href="https://github.com/CLOUDWERX-DEV/gpt-image-1-mcp/issues">Request Feature</a> •
    <a href="https://cloudwerx.dev">Visit Our Website</a>
  </p>
</div>

<div align="center">
  <p>
    Developed with ❤️ by <a href="https://cloudwerx.dev">CLOUDWERX</a>
  </p>
</div>
