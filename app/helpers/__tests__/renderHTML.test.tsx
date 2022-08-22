/**
 * @jest-environment jsdom
 */
import { renderHTML } from '../renderHTML'

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

    const result = renderHTML(markdownSource)

    expect(result).toMatchSnapshot()
  })
})
