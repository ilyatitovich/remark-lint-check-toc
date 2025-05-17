# remark-lint-check-toc

[remark-lint](https://github.com/remarkjs/remark-lint) plugin to ensure that your Markdown TOC is correct.

**The plugin checks:**

- The ratio of the number of sections in the document and the TOC (to ensure consistency when sections are added or removed).
- The presence of a section in the TOC (to detect when a section is missing or incorrectly listed).
- Correctness of URLs (ensuring they are generated correctly using a slugger for GitHub).
- The order of sections in the TOC compared to the document.
- Ensuring that the sections in the TOC maintain the correct hierarchy based on the headings in the document.

## Install

```sh
npm install remark-lint-check-toc
```

## Usage

Use like any other [remark-lint](https://github.com/remarkjs/remark-lint) plugin.
Check out the [remark-lint](https://github.com/remarkjs/remark-lint) documentation for details.

## Examples

When this rule is turned on, the following `valid.md` is ok:

```md
* [Heading One](#heading-one)
  * [Sub Heading](#sub-heading)
* [Heading Two](#heading-two)

## Heading One

Lorem ipsum dolor sit amet.

### Sub Heading

Lorem ipsum dolor sit amet.

## Heading Two

Lorem ipsum dolor sit amet.
```

When this rule is turned on, the following `invalid.md` is **not** ok:

```md
* [Heaing One](#heading-one)
  * [Sub Heading](#subheading)
* [heading Two](#heading-two)

## Heading One

Lorem ipsum dolor sit amet.

### Sub Heading

Lorem ipsum dolor sit amet.

## Heading Two

Lorem ipsum dolor sit amet.
```

```text
1:3-1:29 warning Incorrect title or URL in TOC. Title: Heaing One, URL: #heading-one  check-toc remark-lint

2:5-2:31 warning Incorrect title or URL in TOC. Title: Sub Heading, URL: #subheading  check-toc remark-lint

3:3-3:30 warning Incorrect title or URL in TOC. Title: heading Two, URL: #heading-two check-toc remark-lint
```

## Support the Project

If you find this tool helpful, consider supporting us:

- [**Support Our Work**](https://ilyatitov.vercel.app/payments)
