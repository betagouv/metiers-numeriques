/**
 * @jest-environment jsdom
 */

import { renderMarkdown } from '../renderMarkdown'

describe.only('app/helpers/renderMarkdown()', () => {
  test(`with a paragraph`, () => {
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

    const result = renderMarkdown(markdownSource)

    expect(result).toMatchSnapshot()
  })
})
