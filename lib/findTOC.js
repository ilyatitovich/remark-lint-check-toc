import { find } from "unist-util-find";

export default function findTOC(tree) {
    return find(tree, (node) => {
        return (
            node.type === "list" &&
            node.children.some((listItem) => {
                return (
                    listItem.type === "listItem" &&
                    listItem.children.some((paragraph) => {
                        return (
                            paragraph.type === "paragraph" &&
                            paragraph.children.some((linkNode) => {
                                return (
                                    linkNode.type === "link" &&
                                    linkNode.url &&
                                    linkNode.url.startsWith("#")
                                );
                            })
                        );
                    })
                );
            })
        );
    });
}
