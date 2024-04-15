import fs from 'fs'
import path from 'path'
import assert from 'node:assert/strict'
import test from 'node:test'
import { remark } from 'remark'
import remarkLintCheckToc from '../index.js'

// Paths
const invalidTocOnePath = path.join(
  import.meta.dirname,
  'docs',
  'section-deleted-but-toc-not-updated.md'
)
const invalidTocTwoPath = path.join(
  import.meta.dirname,
  'docs',
  'section-not-found-in-toc.md'
)

const invalidTocThreePath = path.join(
  import.meta.dirname,
  'docs',
  'incorrect-url.md'
)

const invalidTocFourPath = path.join(
  import.meta.dirname,
  'docs',
  'incorrect-order.md'
)

const invalidTocFivePath = path.join(
  import.meta.dirname,
  'docs',
  'incorrect-hierarchy.md'
)

const noTOCPath = path.join(import.meta.dirname, 'docs', 'no-toc.md')

const validTOCPath = path.join(import.meta.dirname, 'docs', 'valid-toc.md')

// Files
const invalidTocOne = fs.readFileSync(invalidTocOnePath, 'utf8')
const invalidTocTwo = fs.readFileSync(invalidTocTwoPath, 'utf8')
const invalidTocThree = fs.readFileSync(invalidTocThreePath, 'utf8')
const invalidTocFour = fs.readFileSync(invalidTocFourPath, 'utf8')
const invalidTocFive = fs.readFileSync(invalidTocFivePath, 'utf8')
const noTOC = fs.readFileSync(noTOCPath, 'utf8')
const validTOC = fs.readFileSync(validTOCPath, 'utf8')

// Section deleted from doc but TOC not updated
test('toc contains more sections then doc', async () => {
  const result = await remark().use(remarkLintCheckToc).process(invalidTocOne)

  assert.deepEqual(
    result.messages.map(d => d.reason),
    [
      'TOС contains more sections than document',
      "Incorrect order in TOC: 'Heading Four' must be after 'Sub Heading Three'"
    ]
  )
})

// Mistake in the TOC's title or the section was not added to the TOC
test('section not found in toc', async () => {
  const result = await remark().use(remarkLintCheckToc).process(invalidTocTwo)

  assert.deepEqual(
    result.messages.map(d => d.reason),
    [
      "Section: 'Heading Two' was not found in TOС",
      "Section: 'Heading Four' was not found in TOС"
    ]
  )
})

// Incorrect URl
test('incorrect url in toc', async () => {
  const result = await remark().use(remarkLintCheckToc).process(invalidTocThree)

  assert.deepEqual(
    result.messages.map(d => d.reason),
    [
      "Incorrect URL in TOС: '#eading-two'",
      "Incorrect URL in TOС: '#headingthree'",
      "Incorrect URL in TOС: '#heaing-four'"
    ]
  )
})

// Incorrect order
test('incorrect order in toc', async () => {
  const result = await remark().use(remarkLintCheckToc).process(invalidTocFour)

  assert.deepEqual(
    result.messages.map(d => d.reason),
    [
      "Incorrect order in TOC: 'Heading One' must be first element",
      "Incorrect order in TOC: 'Heading Two' must be after 'Heading One'",
      "Incorrect order in TOC: 'Heading Three' must be after 'Sub Heading Three'",
      "Incorrect order in TOC: 'Heading Four' must be after 'Heading Three'"
    ]
  )
})

// Incorrect hierarchy
test('incorrect hierarchy in toc', async () => {
  const result = await remark().use(remarkLintCheckToc).process(invalidTocFive)

  assert.deepEqual(
    result.messages.map(d => d.reason),
    [
      "Incorrect section hierarchy in TOC: 'Heading Two' ",
      "Incorrect section hierarchy in TOC: 'Sub Heading One' ",
      "Incorrect section hierarchy in TOC: 'Heading Four' "
    ]
  )
})

// No TOC
test('no toc detected', async () => {
  const result = await remark().use(remarkLintCheckToc).process(noTOC)

  assert.strictEqual(result.data.customInfo.message, 'No TOC detected')
})

// TOC is OK
test('toc is ok', async () => {
  const result = await remark().use(remarkLintCheckToc).process(validTOC)

  assert.strictEqual(result.messages.length, 0)
})
