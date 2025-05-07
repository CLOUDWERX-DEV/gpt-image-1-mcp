#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import OpenAI from "openai";
import type { ImageGenerateParams, ImageEditParams } from "openai/resources";
import { Readable } from "stream";
import { toFile } from "openai/uploads";
import fs from 'fs';
import path from 'path';
import os from 'os';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { execSync } from 'child_process';

// Get the API key from the environment variable
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error("OPENAI_API_KEY environment variable is required.");
  process.exit(1);
}

// Configure OpenAI client with strict defaults for gpt-image-1
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  defaultQuery: {}, // Ensure no default query parameters
  defaultHeaders: {} // Ensure no default headers that might affect the request
});

// Determine the output directory for saving images
// Priority:
// 1. Environment variable GPT_IMAGE_OUTPUT_DIR if set
// 2. User's Pictures folder with a gpt-image-1 subfolder
// 3. Fallback to a 'generated-images' folder in the current directory if Pictures folder can't be determined
const OUTPUT_DIR_ENV = process.env.GPT_IMAGE_OUTPUT_DIR;
let outputDir: string;

if (OUTPUT_DIR_ENV) {
  // Use the directory specified in the environment variable
  outputDir = OUTPUT_DIR_ENV;
  console.error(`Using output directory from environment variable: ${outputDir}`);
} else {
  // Try to use the user's Pictures folder
  try {
    // Determine the user's home directory
    const homeDir = os.homedir();

    // Determine the Pictures folder based on the OS
    let picturesDir: string;

    if (process.platform === 'win32') {
      // Windows: Use the standard Pictures folder
      picturesDir = path.join(homeDir, 'Pictures');
    } else if (process.platform === 'darwin') {
      // macOS: Use the standard Pictures folder
      picturesDir = path.join(homeDir, 'Pictures');
    } else {
      // Linux and other Unix-like systems: Use the XDG standard if possible
      const xdgPicturesDir = process.env.XDG_PICTURES_DIR;
      if (xdgPicturesDir) {
        picturesDir = xdgPicturesDir;
      } else {
        // Fallback to a standard location
        picturesDir = path.join(homeDir, 'Pictures');
      }
    }

    // Create a gpt-image-1 subfolder in the Pictures directory
    outputDir = path.join(picturesDir, 'gpt-image-1');
    console.error(`Using user's Pictures folder for output: ${outputDir}`);
  } catch (error) {
    // If there's any error determining the Pictures folder, fall back to the current directory
    outputDir = path.join(process.cwd(), 'generated-images');
    console.error(`Could not determine Pictures folder, using fallback directory: ${outputDir}`);
  }
}

// Create the output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.error(`Created output directory: ${outputDir}`);
} else {
  console.error(`Using existing output directory: ${outputDir}`);
}

// Function to save base64 image to disk and return the file path
function saveImageToDisk(base64Data: string, format: string = 'png'): string {
  // Create a dedicated folder for generated images if we're using the workspace root
  // This keeps the workspace organized while still saving in the current directory
  const imagesFolder = path.join(outputDir, 'gpt-images');

  // Create the images folder if it doesn't exist
  if (!fs.existsSync(imagesFolder)) {
    fs.mkdirSync(imagesFolder, { recursive: true });
    console.error(`Created images folder: ${imagesFolder}`);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `image-${timestamp}.${format}`;
  const outputPath = path.join(imagesFolder, filename);

  // Remove the data URL prefix if present
  const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');

  // Write the image to disk
  fs.writeFileSync(outputPath, Buffer.from(base64Image, 'base64'));
  console.error(`Image saved to: ${outputPath}`);

  return outputPath;
}

// Function to read an image file and convert it to base64
function readImageAsBase64(imagePath: string): string {
  try {
    // Check if the file exists
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image file not found: ${imagePath}`);
    }

    // Read the file as a buffer
    const imageBuffer = fs.readFileSync(imagePath);

    // Determine the MIME type based on file extension
    const fileExtension = path.extname(imagePath).toLowerCase();
    let mimeType = 'image/png'; // Default to PNG

    if (fileExtension === '.jpg' || fileExtension === '.jpeg') {
      mimeType = 'image/jpeg';
    } else if (fileExtension === '.webp') {
      mimeType = 'image/webp';
    } else if (fileExtension === '.gif') {
      mimeType = 'image/gif';
    }

    // Convert the buffer to a base64 string with data URL prefix
    const base64Data = imageBuffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    console.error(`Read image from: ${imagePath} (${mimeType})`);

    return dataUrl;
  } catch (error: any) {
    console.error(`Error reading image: ${error.message}`);
    throw error;
  }
}

const server = new McpServer({
  name: "@cloudwerxlab/gpt-image-1-mcp",
  version: "1.1.7",
  description: "An MCP server for generating and editing images using the OpenAI gpt-image-1 model.",
});

// Define the create_image tool
const createImageSchema = z.object({
  prompt: z.string().max(32000, "Prompt exceeds maximum length for gpt-image-1."),
  background: z.enum(["transparent", "opaque", "auto"]).optional(),
  n: z.number().int().min(1).max(10).optional(),
  output_compression: z.number().int().min(0).max(100).optional(),
  output_format: z.enum(["png", "jpeg", "webp"]).optional(),
  quality: z.enum(["high", "medium", "low", "auto"]).optional(),
  size: z.enum(["1024x1024", "1536x1024", "1024x1536", "auto"]).optional(),
  user: z.string().optional(),
  moderation: z.enum(["low", "auto"]).optional()
});
type CreateImageArgs = z.infer<typeof createImageSchema>;

server.tool(
  "create_image",
  createImageSchema.shape,
  {
    title: "Generate new images using OpenAI's gpt-image-1 model"
  },
  async (args: CreateImageArgs, extra: any) => {
    try {
      // Use the OpenAI SDK's createImage method with detailed error handling
      let apiResponse;
      try {
        apiResponse = await openai.images.generate({
          model: "gpt-image-1",
          prompt: args.prompt,
          size: args.size || "1024x1024",
          quality: args.quality || "high",
          n: args.n || 1
        });

        // Check if the response contains an error field (shouldn't happen with SDK but just in case)
        if (apiResponse && 'error' in apiResponse) {
          const error = (apiResponse as any).error;
          throw {
            message: error.message || 'Unknown API error',
            type: error.type || 'api_error',
            code: error.code || 'unknown',
            response: { data: { error } }
          };
        }
      } catch (apiError: any) {
        // Enhance the error with more details if possible
        console.error("OpenAI API Error:", apiError);

        // Rethrow with enhanced information
        throw apiError;
      }

      // Create a Response-like object with a json() method for compatibility with the built-in tool
      const response = {
        json: () => Promise.resolve(apiResponse)
      };

      const responseData = apiResponse;
      const format = args.output_format || "png";

      // Save images to disk and create response with file paths
      const savedImages = [];
      const imageContents = [];

      if (responseData.data && responseData.data.length > 0) {
        for (const item of responseData.data) {
          if (item.b64_json) {
            // Save the image to disk
            const imagePath = saveImageToDisk(item.b64_json, format);

            // Add the saved image info to our response
            savedImages.push({
              path: imagePath,
              format: format
            });

            // Also include the image content for compatibility
            imageContents.push({
              type: "image" as const,
              data: item.b64_json,
              mimeType: `image/${format}`
            });
          } else if (item.url) {
            console.error(`Image URL: ${item.url}`);
            console.error("The gpt-image-1 model returned a URL instead of base64 data.");
            console.error("To view the image, open the URL in your browser.");

            // Add the URL info to our response
            savedImages.push({
              url: item.url,
              format: format
            });

            // Include a text message about the URL in the content
            imageContents.push({
              type: "text" as const,
              text: `Image available at URL: ${item.url}`
            });
          }
        }
      }

      // Create a beautifully formatted response with emojis and details
      const formatSize = (size: string | undefined) => size || "1024x1024";
      const formatQuality = (quality: string | undefined) => quality || "high";

      // Create a beautiful formatted message
      const formattedMessage = `
🎨 **Image Generation Complete!** 🎨

✨ **Prompt**: "${args.prompt}"

📊 **Generation Parameters**:
   • Size: ${formatSize(args.size)}
   • Quality: ${formatQuality(args.quality)}
   • Number of Images: ${args.n || 1}
   ${args.background ? `• Background: ${args.background}` : ''}
   ${args.output_format ? `• Format: ${args.output_format}` : ''}
   ${args.output_compression ? `• Compression: ${args.output_compression}%` : ''}
   ${args.moderation ? `• Moderation: ${args.moderation}` : ''}

📁 **Generated ${savedImages.length} Image${savedImages.length > 1 ? 's' : ''}**:
${savedImages.map((img, index) => `   ${index + 1}. ${img.path || img.url}`).join('\n')}

${responseData.usage ? `⚡ **Token Usage**:
   • Total Tokens: ${responseData.usage.total_tokens}
   • Input Tokens: ${responseData.usage.input_tokens}
   • Output Tokens: ${responseData.usage.output_tokens}` : ''}

🔍 You can find your image${savedImages.length > 1 ? 's' : ''} at the path${savedImages.length > 1 ? 's' : ''} above!
`;

      // Return both the image content and the saved file paths with the beautiful message
      return {
        content: [
          {
            type: "text" as const,
            text: formattedMessage
          },
          ...imageContents
        ],
        ...(responseData.usage && {
          _meta: {
            usage: responseData.usage,
            savedImages: savedImages
          }
        })
      };
    } catch (error: any) {
      // Log the full error for debugging
      console.error("Error generating image:", error);

      // Extract detailed error information
      const errorCode = error.status || error.code || 'Unknown';
      const errorType = error.type || 'Error';
      const errorMessage = error.message || 'An unknown error occurred';

      // Check for specific OpenAI API errors
      let detailedError = '';

      if (error.response) {
        // If we have a response object from OpenAI, extract more details
        try {
          const responseData = error.response.data || {};
          if (responseData.error) {
            detailedError = `\n📋 **Details**: ${responseData.error.message || 'No additional details available'}`;

            // Add parameter errors if available
            if (responseData.error.param) {
              detailedError += `\n🔍 **Parameter**: ${responseData.error.param}`;
            }

            // Add code if available
            if (responseData.error.code) {
              detailedError += `\n🔢 **Error Code**: ${responseData.error.code}`;
            }

            // Add type if available
            if (responseData.error.type) {
              detailedError += `\n📝 **Error Type**: ${responseData.error.type}`;
            }
          }
        } catch (parseError) {
          // If we can't parse the response, just use what we have
          detailedError = '\n📋 **Details**: Could not parse error details from API response';
        }
      }

      // Construct a comprehensive error message
      const fullErrorMessage = `❌ **Image Generation Failed**\n\n⚠️ **Error ${errorCode}**: ${errorType} - ${errorMessage}${detailedError}\n\n🔄 Please try again with a different prompt or parameters.`;

      // Return the detailed error to the client
      return {
        content: [{
          type: "text",
          text: fullErrorMessage
        }],
        isError: true,
        _meta: {
          error: {
            code: errorCode,
            type: errorType,
            message: errorMessage,
            raw: JSON.stringify(error, Object.getOwnPropertyNames(error))
          }
        }
      };
    }
  }
);

// Define the create_image_edit tool
const createImageEditSchema = z.object({
  image: z.union([
    z.string(), // Can be base64 encoded image string
    z.array(z.string()), // Can be array of base64 encoded image strings
    z.object({ // Can be an object with a file path
      filePath: z.string(),
      isBase64: z.boolean().optional().default(false)
    }),
    z.array(z.object({ // Can be an array of objects with file paths
      filePath: z.string(),
      isBase64: z.boolean().optional().default(false)
    }))
  ]),
  prompt: z.string().max(32000, "Prompt exceeds maximum length for gpt-image-1."),
  background: z.enum(["transparent", "opaque", "auto"]).optional(),
  mask: z.union([
    z.string(), // Can be base64 encoded mask string
    z.object({ // Can be an object with a file path
      filePath: z.string(),
      isBase64: z.boolean().optional().default(false)
    })
  ]).optional(),
  n: z.number().int().min(1).max(10).optional(),
  quality: z.enum(["high", "medium", "low", "auto"]).optional(),
  size: z.enum(["1024x1024", "1536x1024", "1024x1536", "auto"]).optional(),
  user: z.string().optional()
});
type CreateImageEditArgs = z.infer<typeof createImageEditSchema>;

server.tool(
  "create_image_edit",
  createImageEditSchema.shape,
  {
    title: "Edit existing images using OpenAI's gpt-image-1 model"
  },
  async (args: CreateImageEditArgs, extra: any) => {
    try {
      // The OpenAI SDK expects 'image' and 'mask' to be Node.js ReadStream or Blob.
      // Since we are receiving base64 strings from the client, we need to convert them.
      // This is a simplified approach. A robust solution might involve handling file uploads
      // or different data formats depending on the client's capabilities.
      // For this implementation, we'll assume base64 and convert to Buffer, which the SDK might accept
      // or require further processing depending on its exact requirements for file-like objects.
      // NOTE: The OpenAI SDK's `images.edit` method specifically expects `File` or `Blob` in browser
      // environments and `ReadableStream` or `Buffer` in Node.js. Converting base64 to Buffer is
      // the most straightforward approach for a Node.js server receiving base64.

      // Process image input which can be file paths or base64 strings
      const imageFiles = [];

      // Handle different image input formats
      if (Array.isArray(args.image)) {
        // Handle array of strings or objects
        for (const img of args.image) {
          if (typeof img === 'string') {
            // Base64 string - create a temporary file
            const tempFile = path.join(os.tmpdir(), `image-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.png`);
            const base64Data = img.replace(/^data:image\/\w+;base64,/, '');
            fs.writeFileSync(tempFile, Buffer.from(base64Data, 'base64'));
            imageFiles.push(tempFile);
          } else {
            // Object with filePath - use the file directly
            imageFiles.push(img.filePath);
          }
        }
      } else if (typeof args.image === 'string') {
        // Single base64 string - create a temporary file
        const tempFile = path.join(os.tmpdir(), `image-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.png`);
        const base64Data = args.image.replace(/^data:image\/\w+;base64,/, '');
        fs.writeFileSync(tempFile, Buffer.from(base64Data, 'base64'));
        imageFiles.push(tempFile);
      } else {
        // Single object with filePath - use the file directly
        imageFiles.push(args.image.filePath);
      }

      // Process mask input which can be a file path or base64 string
      let maskFile = undefined;

      if (args.mask) {
        if (typeof args.mask === 'string') {
          // Mask is a base64 string - create a temporary file
          const tempFile = path.join(os.tmpdir(), `mask-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.png`);
          const base64Data = args.mask.replace(/^data:image\/\w+;base64,/, '');
          fs.writeFileSync(tempFile, Buffer.from(base64Data, 'base64'));
          maskFile = tempFile;
        } else {
          // Mask is an object with filePath - use the file directly
          maskFile = args.mask.filePath;
        }
      }

      // Use a direct curl command to call the OpenAI API
      // This is more reliable than using the SDK for file uploads

      // Create a temporary file to store the response
      const tempResponseFile = path.join(os.tmpdir(), `response-${Date.now()}.json`);

      // Build the curl command
      let curlCommand = `curl -s -X POST "https://api.openai.com/v1/images/edits" -H "Authorization: Bearer ${process.env.OPENAI_API_KEY}"`;

      // Add the model
      curlCommand += ` -F "model=gpt-image-1"`;

      // Add the prompt
      curlCommand += ` -F "prompt=${args.prompt}"`;

      // Add the images
      for (const imageFile of imageFiles) {
        curlCommand += ` -F "image[]=@${imageFile}"`;
      }

      // Add the mask if it exists
      if (maskFile) {
        curlCommand += ` -F "mask=@${maskFile}"`;
      }

      // Add other parameters
      if (args.n) curlCommand += ` -F "n=${args.n}"`;
      if (args.size) curlCommand += ` -F "size=${args.size}"`;
      if (args.quality) curlCommand += ` -F "quality=${args.quality}"`;
      if (args.background) curlCommand += ` -F "background=${args.background}"`;
      if (args.user) curlCommand += ` -F "user=${args.user}"`;

      // Add output redirection
      curlCommand += ` > "${tempResponseFile}"`;

      // Execute the curl command
      // Use execSync to run the curl command

      try {
        console.error(`Executing curl command to edit image...`);
        execSync(curlCommand, { stdio: ['pipe', 'pipe', 'inherit'] });
        console.error(`Curl command executed successfully.`);
      } catch (error: any) {
        console.error(`Error executing curl command: ${error.message}`);
        throw new Error(`Failed to edit image: ${error.message}`);
      }

      // Read the response from the temporary file
      let responseJson;
      try {
        responseJson = fs.readFileSync(tempResponseFile, 'utf8');
        console.error(`Response file read successfully.`);
      } catch (error: any) {
        console.error(`Error reading response file: ${error.message}`);
        throw new Error(`Failed to read response file: ${error.message}`);
      }

      // Parse the response
      let responseData;
      try {
        responseData = JSON.parse(responseJson);
        console.error(`Response parsed successfully.`);

        // Check if the response contains an error
        if (responseData.error) {
          console.error(`OpenAI API returned an error:`, responseData.error);
          const errorMessage = responseData.error.message || 'Unknown API error';
          const errorType = responseData.error.type || 'api_error';
          const errorCode = responseData.error.code || responseData.error.status || 'unknown';

          throw {
            message: errorMessage,
            type: errorType,
            code: errorCode,
            response: { data: responseData }
          };
        }
      } catch (error: any) {
        // If the error is from our API error check, rethrow it
        if (error.response && error.response.data) {
          throw error;
        }

        console.error(`Error parsing response: ${error.message}`);
        throw new Error(`Failed to parse response: ${error.message}`);
      }

      // Delete the temporary response file
      try {
        fs.unlinkSync(tempResponseFile);
        console.error(`Temporary response file deleted.`);
      } catch (error: any) {
        console.error(`Error deleting temporary file: ${error.message}`);
        // Don't throw an error here, just log it
      }

      // Clean up temporary files
      try {
        // Delete temporary image files
        for (const imageFile of imageFiles) {
          // Only delete files we created (temporary files in the os.tmpdir directory)
          if (imageFile.startsWith(os.tmpdir())) {
            try { fs.unlinkSync(imageFile); } catch (e) { /* ignore errors */ }
          }
        }

        // Delete temporary mask file
        if (maskFile && maskFile.startsWith(os.tmpdir())) {
          try { fs.unlinkSync(maskFile); } catch (e) { /* ignore errors */ }
        }
      } catch (cleanupError) {
        console.error("Error cleaning up temporary files:", cleanupError);
      }

      // No need for a Response-like object anymore since we're using fetch directly

      // Save images to disk and create response with file paths
      const savedImages = [];
      const imageContents = [];
      const format = "png"; // Assuming png for edits based on common practice

      if (responseData.data && responseData.data.length > 0) {
        for (const item of responseData.data) {
          if (item.b64_json) {
            // Save the image to disk
            const imagePath = saveImageToDisk(item.b64_json, format);

            // Add the saved image info to our response
            savedImages.push({
              path: imagePath,
              format: format
            });

            // Also include the image content for compatibility
            imageContents.push({
              type: "image" as const,
              data: item.b64_json,
              mimeType: `image/${format}`
            });
          } else if (item.url) {
            console.error(`Image URL: ${item.url}`);
            console.error("The gpt-image-1 model returned a URL instead of base64 data.");
            console.error("To view the image, open the URL in your browser.");

            // Add the URL info to our response
            savedImages.push({
              url: item.url,
              format: format
            });

            // Include a text message about the URL in the content
            imageContents.push({
              type: "text" as const,
              text: `Image available at URL: ${item.url}`
            });
          }
        }
      }

      // Create a beautifully formatted response with emojis and details
      const formatSize = (size: string | undefined) => size || "1024x1024";
      const formatQuality = (quality: string | undefined) => quality || "high";

      // Get source image information
      let sourceImageInfo = "";
      if (Array.isArray(args.image)) {
        // Handle array of strings or objects
        sourceImageInfo = args.image.map((img, index) => {
          if (typeof img === 'string') {
            return `   ${index + 1}. Base64 encoded image`;
          } else {
            return `   ${index + 1}. ${img.filePath}`;
          }
        }).join('\n');
      } else if (typeof args.image === 'string') {
        sourceImageInfo = "   Base64 encoded image";
      } else {
        sourceImageInfo = `   ${args.image.filePath}`;
      }

      // Get mask information
      let maskInfo = "";
      if (args.mask) {
        if (typeof args.mask === 'string') {
          maskInfo = "🎭 **Mask**: Base64 encoded mask applied";
        } else {
          maskInfo = `🎭 **Mask**: Mask from ${args.mask.filePath} applied`;
        }
      }

      // Create a beautiful formatted message
      const formattedMessage = `
✏️ **Image Edit Complete!** 🖌️

✨ **Edit Prompt**: "${args.prompt}"

🖼️ **Source Image${imageFiles.length > 1 ? 's' : ''}**:
${sourceImageInfo}
${maskInfo}

📊 **Edit Parameters**:
   • Size: ${formatSize(args.size)}
   • Quality: ${formatQuality(args.quality)}
   • Number of Results: ${args.n || 1}
   ${args.background ? `• Background: ${args.background}` : ''}

📁 **Edited ${savedImages.length} Image${savedImages.length > 1 ? 's' : ''}**:
${savedImages.map((img, index) => `   ${index + 1}. ${img.path || img.url}`).join('\n')}

${responseData.usage ? `⚡ **Token Usage**:
   • Total Tokens: ${responseData.usage.total_tokens}
   • Input Tokens: ${responseData.usage.input_tokens}
   • Output Tokens: ${responseData.usage.output_tokens}` : ''}

🔍 You can find your edited image${savedImages.length > 1 ? 's' : ''} at the path${savedImages.length > 1 ? 's' : ''} above!
`;

      // Return both the image content and the saved file paths with the beautiful message
      return {
        content: [
          {
            type: "text" as const,
            text: formattedMessage
          },
          ...imageContents
        ],
        ...(responseData.usage && {
          _meta: {
            usage: {
              totalTokens: responseData.usage.total_tokens,
              inputTokens: responseData.usage.input_tokens,
              outputTokens: responseData.usage.output_tokens,
            },
            savedImages: savedImages
          }
        })
      };
    } catch (error: any) {
      // Log the full error for debugging
      console.error("Error creating image edit:", error);

      // Extract detailed error information
      const errorCode = error.status || error.code || 'Unknown';
      const errorType = error.type || 'Error';
      const errorMessage = error.message || 'An unknown error occurred';

      // Check for specific error types and provide more helpful messages
      let detailedError = '';
      let suggestedFix = '';

      // Handle file-related errors
      if (errorMessage.includes('ENOENT') || errorMessage.includes('no such file')) {
        detailedError = '\n📋 **Details**: The specified image or mask file could not be found';
        suggestedFix = '\n💡 **Suggestion**: Verify that the file path is correct and the file exists';
      }
      // Handle permission errors
      else if (errorMessage.includes('EACCES') || errorMessage.includes('permission denied')) {
        detailedError = '\n📋 **Details**: Permission denied when trying to access the file';
        suggestedFix = '\n💡 **Suggestion**: Check file permissions or try running with elevated privileges';
      }
      // Handle curl errors
      else if (errorMessage.includes('curl')) {
        detailedError = '\n📋 **Details**: Error occurred while sending the request to OpenAI API';
        suggestedFix = '\n💡 **Suggestion**: Check your internet connection and API key';
      }
      // Handle OpenAI API errors
      else if (error.response) {
        try {
          const responseData = error.response.data || {};
          if (responseData.error) {
            detailedError = `\n📋 **Details**: ${responseData.error.message || 'No additional details available'}`;

            // Add parameter errors if available
            if (responseData.error.param) {
              detailedError += `\n🔍 **Parameter**: ${responseData.error.param}`;
            }

            // Add code if available
            if (responseData.error.code) {
              detailedError += `\n🔢 **Error Code**: ${responseData.error.code}`;
            }

            // Add type if available
            if (responseData.error.type) {
              detailedError += `\n📝 **Error Type**: ${responseData.error.type}`;
            }

            // Provide suggestions based on error type
            if (responseData.error.type === 'invalid_request_error') {
              suggestedFix = '\n💡 **Suggestion**: Check that your image format is supported (PNG, JPEG) and the prompt is valid';
            } else if (responseData.error.type === 'authentication_error') {
              suggestedFix = '\n💡 **Suggestion**: Verify your OpenAI API key is correct and has access to the gpt-image-1 model';
            }
          }
        } catch (parseError) {
          detailedError = '\n📋 **Details**: Could not parse error details from API response';
        }
      }

      // If we have a JSON response with an error, try to extract it
      if (errorMessage.includes('{') && errorMessage.includes('}')) {
        try {
          const jsonStartIndex = errorMessage.indexOf('{');
          const jsonEndIndex = errorMessage.lastIndexOf('}') + 1;
          const jsonStr = errorMessage.substring(jsonStartIndex, jsonEndIndex);
          const jsonError = JSON.parse(jsonStr);

          if (jsonError.error) {
            detailedError = `\n📋 **Details**: ${jsonError.error.message || 'No additional details available'}`;

            if (jsonError.error.code) {
              detailedError += `\n🔢 **Error Code**: ${jsonError.error.code}`;
            }

            if (jsonError.error.type) {
              detailedError += `\n📝 **Error Type**: ${jsonError.error.type}`;
            }
          }
        } catch (e) {
          // If we can't parse JSON from the error message, just continue
        }
      }

      // Construct a comprehensive error message
      const fullErrorMessage = `❌ **Image Edit Failed**\n\n⚠️ **Error ${errorCode}**: ${errorType} - ${errorMessage}${detailedError}${suggestedFix}\n\n🔄 Please try again with a different prompt, image, or parameters.`;

      // Return the detailed error to the client
      return {
        content: [{
          type: "text",
          text: fullErrorMessage
        }],
        isError: true,
        _meta: {
          error: {
            code: errorCode,
            type: errorType,
            message: errorMessage,
            details: detailedError.replace(/\n📋 \*\*Details\*\*: /, ''),
            suggestion: suggestedFix.replace(/\n💡 \*\*Suggestion\*\*: /, ''),
            raw: JSON.stringify(error, Object.getOwnPropertyNames(error))
          }
        }
      };
    }
  }
);


// Start the server
const transport = new StdioServerTransport();
server.connect(transport).then(() => {
  console.error("✅ GPT-Image-1 MCP server running on stdio");
  console.error("🎨 Ready to generate and edit images!");
}).catch(console.error);

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.error("🛑 Shutting down GPT-Image-1 MCP server...");
  await server.close();
  console.error("👋 Server shutdown complete. Goodbye!");
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.error("🛑 Shutting down GPT-Image-1 MCP server...");
  await server.close();
  console.error("👋 Server shutdown complete. Goodbye!");
  process.exit(0);
});
