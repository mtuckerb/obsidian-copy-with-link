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

    // Get selection range
    const selectionRange = {
      from: editor.getCursor("from"),
      to: editor.getCursor("to")
    }
    console.log("Selection range:", selectionRange)

    // Find all paragraphs that intersect with the selection
    const affectedParagraphs = this.findAffectedParagraphs(
      editor,
      selectionRange
    )
    console.log("Affected paragraphs:", affectedParagraphs)

    if (affectedParagraphs.length === 0) {
      console.log("No paragraphs found, exiting")
      return
    }

    // Process each paragraph and create the replacement text
    const replacements = []
    const blockLinks = []

    for (const paragraph of affectedParagraphs) {
      const uniqueId = this.generateUniqueId()
      console.log(
        `Processing paragraph ${paragraph.startLine}-${paragraph.endLine}, ID: ${uniqueId}`
      )

      // Get the paragraph text
      const paragraphText = this.getParagraphText(editor, paragraph)

      // Find the intersection of selection with this paragraph
      const highlightedText = this.createHighlightedParagraph(
        paragraphText,
        paragraph,
        selectionRange
      )

      // Create the callout with highlighted text
      const callout = `> [!inline-quote] ${highlightedText}\n> ^${uniqueId}`

      replacements.push({
        paragraph,
        callout,
        uniqueId
      })

      // Create block link for this paragraph
      const blockLink = `[[${filePath}#^${uniqueId}|🔗]]`
      blockLinks.push(blockLink)
    }

    // Apply replacements in reverse order to maintain line numbers
    for (let i = replacements.length - 1; i >= 0; i--) {
      const replacement = replacements[i]
      const startPos = { line: replacement.paragraph.startLine, ch: 0 }
      const endPos = { line: replacement.paragraph.endLine + 1, ch: 0 }

      console.log(
        `Replacing paragraph at lines ${replacement.paragraph
          .startLine}-${replacement.paragraph.endLine}`
      )
      editor.replaceRange(replacement.callout + "\n\n", startPos, endPos)
    }

    // Copy original selection and all block links to clipboard
    const allLinks = blockLinks.join(" ")
    const textToCopy = `${selection} ${allLinks}`
    console.log("Text to copy:", textToCopy)

    // Copy to clipboard
    console.log("Copying to clipboard...")
    navigator.clipboard.writeText(textToCopy)
    console.log("=== CopyWithLink Debug End ===")
  }

  findAffectedParagraphs(editor: Editor, selectionRange: any) {
    const paragraphs = []
    const totalLines = editor.lineCount()

    let currentParagraphStart = null
    let currentParagraphEnd = null

    for (let lineNum = 0; lineNum < totalLines; lineNum++) {
      const lineText = editor.getLine(lineNum).trim()

      if (lineText === "") {
        // Empty line - end current paragraph if we have one
        if (currentParagraphStart !== null) {
          currentParagraphEnd = lineNum - 1

          // Check if this paragraph intersects with selection
          if (
            this.paragraphIntersectsSelection(
              {
                startLine: currentParagraphStart,
                endLine: currentParagraphEnd
              },
              selectionRange
            )
          ) {
            paragraphs.push({
              startLine: currentParagraphStart,
              endLine: currentParagraphEnd
            })
          }

          currentParagraphStart = null
          currentParagraphEnd = null
        }
      } else {
        // Non-empty line - start new paragraph if needed
        if (currentParagraphStart === null) {
          currentParagraphStart = lineNum
        }
      }
    }

    // Handle last paragraph if file doesn't end with empty line
    if (currentParagraphStart !== null) {
      currentParagraphEnd = totalLines - 1
      if (
        this.paragraphIntersectsSelection(
          { startLine: currentParagraphStart, endLine: currentParagraphEnd },
          selectionRange
        )
      ) {
        paragraphs.push({
          startLine: currentParagraphStart,
          endLine: currentParagraphEnd
        })
      }
    }

    return paragraphs
  }

  paragraphIntersectsSelection(paragraph: any, selectionRange: any): boolean {
    // Check if selection overlaps with paragraph
    return !(
      selectionRange.to.line < paragraph.startLine ||
      selectionRange.from.line > paragraph.endLine
    )
  }

  getParagraphText(editor: Editor, paragraph: any): string {
    const lines = []
    for (
      let lineNum = paragraph.startLine;
      lineNum <= paragraph.endLine;
      lineNum++
    ) {
      lines.push(editor.getLine(lineNum))
    }
    return lines.join("\n")
  }

  createHighlightedParagraph(
    paragraphText: string,
    paragraph: any,
    selectionRange: any
  ): string {
    // For now, we'll implement a simple approach that highlights the entire selection
    // within the paragraph. This could be enhanced to be more precise.

    // If selection is entirely within this paragraph, highlight just the selected part
    if (
      selectionRange.from.line >= paragraph.startLine &&
      selectionRange.to.line <= paragraph.endLine
    ) {
      const lines = paragraphText.split("\n")
      const result = []

      for (let i = 0; i < lines.length; i++) {
        const lineNum = paragraph.startLine + i
        const line = lines[i]

        if (
          lineNum < selectionRange.from.line ||
          lineNum > selectionRange.to.line
        ) {
          // Line is outside selection
          result.push(line)
        } else if (
          lineNum === selectionRange.from.line &&
          lineNum === selectionRange.to.line
        ) {
          // Selection is entirely on this line
          const before = line.substring(0, selectionRange.from.ch)
          const selected = line.substring(
            selectionRange.from.ch,
            selectionRange.to.ch
          )
          const after = line.substring(selectionRange.to.ch)
          result.push(before + "==" + selected + "==" + after)
        } else if (lineNum === selectionRange.from.line) {
          // First line of multi-line selection
          const before = line.substring(0, selectionRange.from.ch)
          const selected = line.substring(selectionRange.from.ch)
          result.push(before + "==" + selected + "==")
        } else if (lineNum === selectionRange.to.line) {
          // Last line of multi-line selection
          const selected = line.substring(0, selectionRange.to.ch)
          const after = line.substring(selectionRange.to.ch)
          result.push("==" + selected + "==" + after)
        } else {
          // Middle line of multi-line selection
          result.push("==" + line + "==")
        }
      }

      return result.join("\n")
    } else {
      // Selection spans multiple paragraphs, highlight the portion in this paragraph
      const lines = paragraphText.split("\n")
      const result = []

      for (let i = 0; i < lines.length; i++) {
        const lineNum = paragraph.startLine + i
        const line = lines[i]

        if (
          lineNum < selectionRange.from.line ||
          lineNum > selectionRange.to.line
        ) {
          // Line is completely outside selection
          result.push(line)
        } else if (lineNum === selectionRange.from.line) {
          // First line of selection in this paragraph
          const before = line.substring(0, Math.max(0, selectionRange.from.ch))
          const selected = line.substring(Math.max(0, selectionRange.from.ch))
          result.push(before + "==" + selected + "==")
        } else if (lineNum === selectionRange.to.line) {
          // Last line of selection in this paragraph
          const selected = line.substring(0, selectionRange.to.ch)
          const after = line.substring(selectionRange.to.ch)
          result.push("==" + selected + "==" + after)
        } else {
          // Middle line of multi-paragraph selection
          result.push("==" + line + "==")
        }
      }

      return result.join("\n")
    }
  }

  generateUniqueId(): string {
    // Generate a random string of 6 characters
    return Math.random().toString(36).substring(2, 8)
  }
}
