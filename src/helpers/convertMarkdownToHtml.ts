import MarkdownIt from 'markdown-it'

import handleError from './handleError'

const markdownIt = new MarkdownIt({ linkify: true })

export default function convertMarkdownToHtml(markdownSource: string): string {
  try {
    const htmlSource = markdownIt.renderInline(markdownSource)

    return htmlSource
  } catch (err) {
    handleError(err, 'helpers/convertMarkdownToHtml()')
  }
}
