import { GlobalStyle, ThemeProvider } from '@singularity/core'
import { createGlobalStyle } from 'styled-components'

const GlobalStyleCustom = createGlobalStyle`
  html, body {
    height: 100%;
  }

  body,
  #__next {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-height: 0;
    min-width: 0;
 }

  [href] {
    box-shadow: none;
  }
`

export function withTheme(WrappedComponent: any) {
  return function WithTheme(props: any) {
    return (
      <ThemeProvider>
        <GlobalStyle />
        <GlobalStyleCustom />

        <WrappedComponent {...props} />
      </ThemeProvider>
    )
  }
}
