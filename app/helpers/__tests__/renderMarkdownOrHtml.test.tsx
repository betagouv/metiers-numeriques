/**
 * @jest-environment jsdom
 */

import { renderMarkdownOrHtml } from '../renderMarkdownOrHtml'

describe.only('app/helpers/renderMarkdownOrHtml()', () => {
  test(`with an HTML source`, () => {
    const markdownSource = [
      '<p>A paragraph.</p>',
      '<p>A <strong>bold</strong> and <em>italic</em> text with a <a href="https://example.org">link</a>.</p>',
      '<ul>',
      '  <li>A</li>',
      '  <li>bullet,</li>',
      '  <li>list.</li>',
      '</ul>',
      '<ol>',
      '  <li>An</li>',
      '  <li>ordered,</li>',
      '  <li>list.</li>',
      '</ol>',
    ].join('\n')

    const result = renderMarkdownOrHtml(markdownSource)

    expect(result).toMatchSnapshot()
  })

  test(`with a Markdown source`, () => {
    const markdownSource = [
      'A paragraph.',
      '',
      'A **bold** and _italic_ text with a [link](https://example.org).',
      '',
      '- A',
      '- bullet,',
      '- list.',
      '',
      '1. An',
      '2. ordered,',
      '3. list.',
    ].join('\n')

    const result = renderMarkdownOrHtml(markdownSource)

    expect(result).toMatchSnapshot()
  })
})
