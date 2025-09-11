# Obsidian Copy with Link Plugin

This is an Obsidian plugin that allows you to copy highlighted text along with a link to the original file and line number.

## Features

- Copy selected text with a link to its source
- Preserves context by including file name and line number
- Easy to use with a simple keyboard shortcut
- Automatically creates inline quotes with unique IDs for precise linking

## How It Works

When you select text and use the plugin:
1. The selected text is copied to your clipboard
2. A link to the source is appended in the format: `[🔗](link)`
3. An inline quote is automatically inserted at the end of your note with a unique ID
4. The inline quote uses CSS styling to appear appropriately in both source and reading modes

## Development

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to compile and watch for changes
4. Copy the build folder to your Obsidian plugins directory

## Installation

1. Download the latest release
2. Extract the files to your Obsidian plugins folder
3. Enable the plugin in Obsidian settings

## Usage

1. Select text in any note
2. Use the designated keyboard shortcut (Ctrl+Shift+C) to copy the text with link
3. Paste anywhere you need both the text and its source reference

The plugin will automatically create an inline quote at the end of your note with a unique ID, which allows the link to work properly.