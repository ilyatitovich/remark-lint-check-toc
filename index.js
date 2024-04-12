/*

1. Find TOC:
- Look for list items (listItem) that contain links (link) with URLs pointing to headings within the document (usually identified by URLs starting with #).

2. Collect all headings from document.

3. Find TOC elemets and compare them with the existing titles.

*/

import { lintRule } from 'unified-lint-rule'
import { visit } from 'unist-util-visit'

function checkToc(tree, file) {
  // Find out if the document contains a TOC
  let tocIsExist = false
  visit(tree, 'listItem', node => {
    if (node.children[0].type === 'paragraph') {
      // Try to extract URL
      const { url } = node.children[0].children[0]

      // If so - check is it TOC URL or not
      if (url && url.startsWith('#')) {
        tocIsExist = true
        return
      }
    }
  })

  // If the TOC is not detected, no further calculations are performed
  if (!tocIsExist) {
    file.data.customInfo = {
      message: 'No TOC detected. Stopping the plugin.'
    }

    return
  }

  // Collect all headings and add right URLs
  const headings = {}

  visit(tree, 'heading', node => {
    const heading = node.children[0].value
    headings[heading] = {
      url:
        '#' +
        heading
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]+/g, '')
    }
  })

  // Find TOC elemets and compare them with the existing titles
  visit(tree, 'link', node => {
    if (node.url.startsWith('#')) {
      const tocTitle = node.children[0].value

      if (!headings[tocTitle] || node.url !== headings[tocTitle].url) {
        file.message(
          `Incorrect title or URL in TOC. Title: ${tocTitle}, URL: ${node.url}`,
          node
        )
      }
    }
  })
}

const remarkLintCheckToc = lintRule('remark-lint:check-toc', checkToc)

export default remarkLintCheckToc
