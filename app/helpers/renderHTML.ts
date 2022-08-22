import { handleError } from '@common/helpers/handleError'
import React from 'react'
import rehypeParse from 'rehype-parse'
import rehypeReact from 'rehype-react'
import { unified } from 'unified'

import type { JSXElementConstructor, ReactElement } from 'react'

export function renderHTML(HTMLSource: string): ReactElement<unknown, string | JSXElementConstructor<any>> | null {
  try {
    return unified().use(rehypeParse).use(rehypeReact, { createElement: React.createElement }).processSync(HTMLSource)
      .result
  } catch (err) /* istanbul ignore next */ {
    handleError(err, 'app/helpers/renderHTML()')

    return null
  }
}
