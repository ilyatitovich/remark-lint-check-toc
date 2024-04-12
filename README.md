# remark-lint-check-toc

[remark-lint](https://github.com/remarkjs/remark-lint) plugin to ensure that your Markdown headings capitalization is correct.

The plugin finds the TOC and checks titles and URLs against existing titles in the document.

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
