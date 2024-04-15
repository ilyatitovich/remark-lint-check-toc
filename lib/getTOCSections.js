import { visitParents } from 'unist-util-visit-parents'

export default function getTOCSections(tocList) {
  const tocSections = { list: [] } // list array that represent order of headings in TOC
  visitParents(tocList, 'link', (node, ancestors) => {
    const title = node.children[0].value
    tocSections[title] = {
      depth: ancestors.filter(ancestor => ancestor.type === 'listItem').length, // Get the heading hierarchy level
      url: node.url,
      position: node.position
    }

    tocSections.list.push(title)
  })

  return tocSections
}
