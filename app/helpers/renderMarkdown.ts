import { handleError } from '@common/helpers/handleError'
import React from 'react'
import rehypeReact from 'rehype-react'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

import type { ReactElement, JSXElementConstructor } from 'react'

export function renderMarkdown(
  markdownSource: string,
): ReactElement<unknown, string | JSXElementConstructor<any>> | null {
  try {
    const content = unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeReact, { createElement: React.createElement })
      .processSync(markdownSource).result

    return content
  } catch (err) /* istanbul ignore next */ {
    handleError(err, 'app/helpers/renderMarkdown()')

    return null
  }
}
