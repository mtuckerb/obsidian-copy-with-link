import { Plugin } from 'obsidian';

export default class CopyWithLinkPlugin extends Plugin {
	async onload() {
		console.log('Loading Copy with Link plugin');
		
		// TODO: Implement the copy with link functionality
		// This will involve:
		// 1. Detecting when text is selected
		// 2. Creating a command to copy the selected text with a link
		// 3. Generating the proper Obsidian link format
	}

	onunload() {
		console.log('Unloading Copy with Link plugin');
	}
}