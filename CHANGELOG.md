# Changelog

All notable changes to this project will be documented in this file.

## 1.1.7 - 2025-05-07

### Fixed

- **Documentation**: Fixed formatting issues in README.md
- **Documentation**: Restored enhanced README with centered logo and improved layout

## 1.1.6 - 2025-05-07

### Changed

- **Default Output Directory**: Changed default image save location to user's Pictures folder under `gpt-image-1` subfolder
- **Cross-Platform Support**: Added detection of Pictures folder location on Windows, macOS, and Linux
- **Documentation**: Updated README with new default output directory information

## 1.1.0 - 2025-05-05

### Added

- **File Path Support**: Added ability to use file paths for images and masks in the `create_image_edit` tool
- **Configurable Output Directory**: Added support for customizing the output directory via the `GPT_IMAGE_OUTPUT_DIR` environment variable
- **Enhanced Output Formatting**: Improved response formatting with emojis and detailed information
- **Detailed Token Usage**: Added token usage information to the response metadata
- **Comprehensive Documentation**: Completely rewrote the README.md with detailed usage examples and configuration options
- **Proper .gitignore**: Added a comprehensive .gitignore file to exclude build artifacts and generated images

### Fixed

- **Build Structure**: Fixed the build process to output to the root build directory instead of inside the src folder
- **MIME Type Handling**: Improved MIME type handling for image uploads in the `create_image_edit` tool
- **Error Handling**: Enhanced error handling with more informative error messages
- **Cleanup Process**: Improved the cleanup process for temporary files

### Changed

- **API Implementation**: Changed the image editing implementation to use a direct curl command for better MIME type handling
- **Response Structure**: Updated the response structure to include more detailed information about generated images
- **File Naming**: Improved the file naming convention for saved images with timestamps
- **Dependencies**: Added node-fetch and form-data dependencies for improved HTTP requests

## 1.0.0 - 2025-05-04

### Added

- Initial release of the GPT-Image-1 MCP Server.
- Implemented `create_image` tool for generating images using OpenAI `gpt-image-1`.
- Implemented `create_image_edit` tool for editing images using OpenAI `gpt-image-1`.
- Added support for all `gpt-image-1` specific parameters in both tools (`background`, `output_compression`, `output_format`, `quality`, `size`).
- Included basic error handling for OpenAI API calls.
- Created `README.md` with installation and configuration instructions.
- Created `gpt-image-1-mcp.md` with a detailed architecture and tool overview.