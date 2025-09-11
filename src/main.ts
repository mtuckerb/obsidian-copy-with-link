import { Plugin, Editor, MarkdownView } from 'obsidian';

export default class CopyWithLinkPlugin extends Plugin {
	async onload() {
		console.log('Loading Copy with Link plugin');
		
		// Add command to copy selected text with link
		this.addCommand({
			id: 'copy-with-link',
			name: 'Copy selection with link',
			hotkeys: [{ modifiers: ['Ctrl', 'Shift'], key: 'c' }],
			editorCallback: (editor: Editor) => {
				this.copyWithLink(editor);
			}
		});
	}

	onunload() {
		console.log('Unloading Copy with Link plugin');
	}
	
	copyWithLink(editor: Editor) {
		const selection = editor.getSelection();
		if (!selection) return;
		
		// Get the current file path
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view || !view.file) return;
		
		const filePath = view.file.path;
		
		// Generate a unique ID for the block
		const uniqueId = this.generateUniqueId();
		
		// Create the inline quote with the unique ID at the end of the document
		const cursor = editor.getCursor();
		const line = cursor.line;
		const ch = cursor.ch;
		
		// Move to end of document to insert the quote
		const lineCount = editor.lineCount();
		editor.setCursor({ line: lineCount, ch: 0 });
		
		// Create the inline quote with the unique ID
		const inlineQuote = `\n\n> [!inline-quote] ${selection}\n> ^${uniqueId}\n`;
		
		// Insert the inline quote at the end of the document
		editor.replaceSelection(inlineQuote);
		
		// Restore cursor position
		editor.setCursor({ line, ch });
		
		// Create the link to the block
		const blockLink = `[[${filePath}#^${uniqueId}]]`;
		
		// Copy both the selection and the link to clipboard in the format: selection [🔗](link)
		const textToCopy = `${selection} [🔗](${blockLink})`;
		
		// Copy to clipboard
		navigator.clipboard.writeText(textToCopy);
	}
	
	generateUniqueId(): string {
		// Generate a random string of 6 characters
		return Math.random().toString(36).substring(2, 8);
	}
}