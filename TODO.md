### Background Context
This is for an Obsidian plugin that copies selected text with a link. The issue is that when pasting inline code blocks (like `> [!inline-quote] "defense of racial privilege."`), the replacement isn't working correctly - the inline code should immediately replace the selected text and highlight it without affecting other markdown/html.

### Steps:

1. **Locate and analyze the current implementation**
- Open `/src/main.ts` to examine the existing code
- Find the command handler for "Copy selection with link"
- Identify where the inline code replacement logic is implemented

2. **Implement proper selection replacement logic**
- Use Obsidian's Editor API to get the current selection
- Replace the selected text with the inline code block content
- Ensure only the selected text is replaced, preserving surrounding content

3. **Add highlighting functionality**
- After replacement, apply highlighting to the newly inserted text
- Use appropriate markdown syntax for highlighting (e.g., ==highlighted text== or custom highlight markers)
- Ensure highlighting doesn't interfere with existing markdown

4. **Handle callout CSS exclusion**
- Ensure the replacement text doesn't inherit callout styling
- Add logic to strip or override any callout-related CSS classes
- Verify normal text formatting is maintained

5. **Test the implementation**
- Test with various selection types (single line, multi-line, partial words)
- Verify that surrounding markdown/html remains unaltered
- Confirm highlighting appears correctly
- Check that callout styling is properly excluded

6. **Error handling and edge cases**
- Handle cases where no text is selected
- Manage scenarios where selection spans across different markdown elements
- Ensure compatibility with Obsidian's editor behavior

### Dependencies
- Use Obsidian's Editor API methods for selection manipulation
