import fs from 'fs'
import path from 'path'
import assert from 'node:assert/strict'
import test from 'node:test'
import { remark } from 'remark'
import remarkLintCheckToc from '../index.js'

const currentFilePath = new URL(import.meta.url).pathname
const currentDirPath = path.dirname(currentFilePath)

const invalidTocPath = path.join(currentDirPath, 'docs', 'invalid-toc.md')
const docWithoutTocPath = path.join(currentDirPath, 'docs', 'without-toc.md')
const validTocPath = path.join(currentDirPath, 'docs', 'valid-toc.md')

try {
  const invalidToc = fs.readFileSync(invalidTocPath, 'utf8')
  const docWithoutToc = fs.readFileSync(docWithoutTocPath, 'utf8')
  const validToc = fs.readFileSync(validTocPath, 'utf8')

  test('mistakes in toc', async () => {
    const result = await remark().use(remarkLintCheckToc).process(invalidToc)

    assert.deepEqual(
      result.messages.map(d => d.reason),
      [
        'Incorrect title or URL in TOC. Title: Sub Heding One, URL: #sub-heading-one',
        'Incorrect title or URL in TOC. Title: Sub Heading Three, URL: #subheading-three',
        'Incorrect title or URL in TOC. Title: Heading Three, URL: #heading'
      ]
    )
  })

  test('no TOC is detected', async () => {
    const result = await remark().use(remarkLintCheckToc).process(docWithoutToc)

    assert.strictEqual(
      result.data.customInfo.message,
      'No TOC detected. Stopping the plugin.'
    )
  })

  test('toc is valid', async () => {
    const result = await remark().use(remarkLintCheckToc).process(validToc)

    assert.strictEqual(result.messages.length, 0)
  })
} catch (error) {
  throw new Error(`Some error occurred: ${error.message}`)
}
