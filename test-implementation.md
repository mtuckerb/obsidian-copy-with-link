# Test Implementation

This file is for testing the new copy-with-link functionality.

## Single Paragraph Test

This is a single paragraph with some text that we can select partially to test the highlighting functionality. The selected portion should be wrapped in highlight marks while the entire paragraph gets wrapped in an invisible callout.

## Multi-Paragraph Test

This is the first paragraph of a multi-paragraph selection test. When we select text that spans across multiple paragraphs, each paragraph should get its own callout with appropriate highlighting.

This is the second paragraph that continues the multi-paragraph test. The plugin should handle this correctly by creating separate callouts for each paragraph while maintaining the highlight marks only around the selected portions.

## Edge Cases

Text at the beginning of this paragraph should work correctly.

Some text in the middle and text at the end should also work properly.

## Single Line Test

Short line for testing single line selections and edge cases.