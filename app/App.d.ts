import 'styled-components'

import type { Theme } from '@singularity/core'

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
