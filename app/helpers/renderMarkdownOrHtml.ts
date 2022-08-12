import { handleError } from '@common/helpers/handleError'
import React from 'react'
import rehypeParse from 'rehype-parse'
import rehypeReact from 'rehype-react'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

import type { ReactElement, JSXElementConstructor } from 'react'

export function renderMarkdownOrHtml(
  markdownOrHtmlSource: string,
): ReactElement<unknown, string | JSXElementConstructor<any>> | null {
  try {
    if (/<p>/.test(markdownOrHtmlSource)) {
      return unified()
        .use(rehypeParse)
        .use(rehypeReact, { createElement: React.createElement })
        .processSync(markdownOrHtmlSource).result
    }

    const content = unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeReact, { createElement: React.createElement })
      .processSync(markdownOrHtmlSource).result

    return content
  } catch (err) /* istanbul ignore next */ {
    handleError(err, 'app/helpers/renderMarkdown()')

    return null
  }
}
