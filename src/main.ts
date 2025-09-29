import { Plugin, Editor, MarkdownView } from "obsidian"

export default class CopyWithLinkPlugin extends Plugin {
  async onload() {
    console.log("Loading Copy with Link plugin")

    // Add command to copy selected text with link
    this.addCommand({
      id: "copy-with-link",
      name: "Copy selection with link",
      hotkeys: [{ modifiers: ["Ctrl", "Shift"], key: "c" }],
      editorCallback: (editor: Editor) => {
        this.copyWithLink(editor)
      }
    })
  }

  onunload() {
    console.log("Unloading Copy with Link plugin")
  }

  copyWithLink(editor: Editor) {
    console.log("=== CopyWithLink Debug Start ===")
    const selection = editor.getSelection()
    console.log("Initial selection:", selection)
    if (!selection) {
      console.log("No selection found, exiting")
      return
    }

    // Get the current file path
    const view = this.app.workspace.getActiveViewOfType(MarkdownView)
    if (!view || !view.file) {
      console.log("No active view or file found")
      return
    }

    const filePath = view.file.path
    console.log("File path:", filePath)

    // Generate a unique ID for the block
    const uniqueId = this.generateUniqueId()
    console.log("Generated unique ID:", uniqueId)

    // Get the current cursor position (for reference, not to restore)
    const cursor = editor.getCursor()
    console.log(
      "Initial cursor position - line:",
      cursor.line,
      "ch:",
      cursor.ch
    )

    // Create the inline quote with the unique ID
    const inlineQuote = `> [!inline-quote] ${selection}\n> ^${uniqueId}`
    console.log("Created inline quote:", inlineQuote)

    // Replace the selected text with the inline quote
    // This will automatically position the quote where the selection was
    console.log("About to replace selection with inline quote")
    editor.replaceSelection(inlineQuote)

    // Get the new cursor position after replacement
    const newCursor = editor.getCursor()
    console.log(
      "New cursor position after replacement - line:",
      newCursor.line,
      "ch:",
      newCursor.ch
    )

    // Create the link to the block
    const blockLink = `[[${filePath}#^${uniqueId}|🔗]]`
    console.log("Created block link:", blockLink)

    // Copy both the selection and the link to clipboard in the format: selection [🔗](link)
    const textToCopy = `${selection} ${blockLink}`
    console.log("Text to copy:", textToCopy)

    // Copy to clipboard
    console.log("Copying to clipboard...")
    navigator.clipboard.writeText(textToCopy)
    console.log("=== CopyWithLink Debug End ===")
  }

  generateUniqueId(): string {
    // Generate a random string of 6 characters
    return Math.random().toString(36).substring(2, 8)
  }
}
