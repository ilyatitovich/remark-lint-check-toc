import { lintRule } from 'unified-lint-rule'
import findTOC from './lib/findTOC.js'
import createListOfSections from './lib/createListOfSections.js'
import getTOCSections from './lib/getTOCSections.js'

function checkTOC(tree, file) {
  const toc = findTOC(tree)

  // If TOC not detected - stop plugin
  if (!toc) {
    file.data.customInfo = {
      message: 'No TOC detected'
    }

    return false
  }

  // Create a list of sections from documents that represent TOC
  const docSections = createListOfSections(tree)
  const docSectionsLength = docSections.length

  // Collect TOC headings in object for quick checking
  const tocSections = getTOCSections(toc)

  // Check if forgot to update TOC when sections was deleted
  if (tocSections.list.length > docSectionsLength) {
    file.message(
      `TOС contains more sections than document`,
      toc // TOC position
    )
  }

  // Check correspondence of document sections to the existing TOC
  for (let i = 0; i < docSectionsLength; i++) {
    const { title, url, depth } = docSections[i]

    // Check that the document section is included in the table of contents.
    if (!tocSections[title]) {
      file.message(
        `Section: '${title}' was not found in TOС`,
        toc // TOC position
      )

      continue // If not - check next section
    }

    // Check that URl is correct
    if (url !== tocSections[title].url) {
      file.message(
        `Incorrect URL in TOС: '${tocSections[title].url}'`,
        tocSections[title].position // position node with url in TOC
      )
    }

    // Check the order of sections in TOС
    if (title !== tocSections.list[i]) {
      // Find index of the section in existing TOC
      const sectionIndex = tocSections.list.indexOf(title)

      if (i === 0) {
        file.message(
          `Incorrect order in TOC: '${title}' must be first element`,
          tocSections[title].position
        )
      } // Check that the sections are in the same order as in the document
      else if (
        docSections[i - 1].title !== tocSections.list[sectionIndex - 1]
      ) {
        file.message(
          `Incorrect order in TOC: '${title}' must be after '${
            docSections[i - 1].title
          }'`,
          tocSections[title].position
        )
      }
    }

    // Check the section hierarchy according to the heading levels in the document
    if (depth !== tocSections[title].depth) {
      file.message(
        `Incorrect section hierarchy in TOC: '${title}' `,
        tocSections[title].position // position node with url in TOC
      )
    }
  }
}

const remarkLintCheckTOC = lintRule('remark-lint:check-toc', checkTOC)

export default remarkLintCheckTOC
