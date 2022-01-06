import handleError from '@common/helpers/handleError'
import React from 'react'
import rehypeReact from 'rehype-react'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

export default function renderMarkdown(markdownSource: string) {
  try {
    const content = unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeReact, { createElement: React.createElement })
      .processSync(markdownSource).result

    return content
  } catch (err) {
    handleError(err, 'app/helpers/')
  }
}
