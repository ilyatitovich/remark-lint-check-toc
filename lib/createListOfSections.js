import { visit } from "unist-util-visit";
import { slug } from "github-slugger";

export default function createListOfSections(tree) {
    const docSections = []; // Use array for represent order of sections in doc
    
    visit(tree, "heading", (node) => {
        if (node.depth > 1) {
            const title = node.children[0].value;
            docSections.push({
                depth: node.depth - 1, // Heading hierarchy level in TOC (## = 1, or ### = 2 etc.)
                title: title,
                url: "#" + slug(title),
                position: node.position,
            });
        }
    });

    return docSections;
}
