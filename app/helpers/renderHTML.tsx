import { handleError } from '@common/helpers/handleError'
import React from 'react'
import rehypeParse from 'rehype-parse'
import rehypeReact from 'rehype-react'
import styled from 'styled-components'
import { unified } from 'unified'

import type { JSXElementConstructor, ReactElement } from 'react'

const HTMLContent = styled.div`
  p,
  li {
    font-size: 1rem;
    line-height: 1.5rem;
  }
`

export function renderHTML(HTMLSource: string): ReactElement<unknown, string | JSXElementConstructor<any>> | null {
  try {
    const htmlContent = unified()
      .use(rehypeParse)
      .use(rehypeReact, { createElement: React.createElement })
      .processSync(HTMLSource).result

    return <HTMLContent className="HTMLContent">{htmlContent}</HTMLContent>
  } catch (err) /* istanbul ignore next */ {
    handleError(err, 'app/helpers/renderHTML()')

    return null
  }
}
