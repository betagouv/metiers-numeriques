import MarkdownIt from 'markdown-it'

import handleError from './handleError'

const markdownIt = new MarkdownIt({ linkify: true })

export default function convertMarkdownToInlineHtml(markdownSource: string): string {
  try {
    let mormalizedMarkdownSource = markdownSource

    // If there are some Markdown links containing email, we prepend a 'maito:' protocol to them
    if (/\([^)]+@[^)]+\)/.test(mormalizedMarkdownSource)) {
      mormalizedMarkdownSource = mormalizedMarkdownSource
        .replace(/\(([^)]+@[^)]+)\)/g, '(mailto:$1)')
        // Easy way to avoid using negative look-aheads:
        .replace(/mailto:mailto:/g, 'mailto:')
    }

    const htmlSource = markdownIt
      .renderInline(mormalizedMarkdownSource)
      .replace(/\n/g, '')
      .replace(/^-/, '')
      .trim()
      .replace(/<a href="/g, '<a target="_blank" rel="noopener" href="')

    return htmlSource
  } catch (err) {
    handleError(err, 'helpers/convertMarkdownToHtml()')
  }
}
