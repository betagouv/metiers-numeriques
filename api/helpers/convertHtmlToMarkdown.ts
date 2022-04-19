import rehypeParse from 'rehype-parse'
import rehypeRemark from 'rehype-remark'
import remarkStringify from 'remark-stringify'
import { unified } from 'unified'

export function convertHtmlToMarkdown(htmlSource: string): string {
  const markdownSource = unified()
    .use(rehypeParse)
    .use(rehypeRemark)
    .use(remarkStringify)
    .processSync(htmlSource)
    .toString()
    // eslint-disable-next-line no-irregular-whitespace
    .replace(/[^\S\n]+/g, ' ')
    .replace(/\\\n/g, '  \n')
    .replace(/^\\/gm, '')
    .replace(/\s+\n-/g, '\n-')
    .replace(/^\s+$/gm, '')
    .replace(/(https:\/\/[^\s]+)/g, '[$1]($1)')
    .replace(/([a-z0-9-.]@[a-z0-9-.]\.[a-z]+)/g, '[$1](mailto:$1)')
    .trim()

  return markdownSource
}
