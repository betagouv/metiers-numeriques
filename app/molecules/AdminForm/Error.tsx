import { ButtonAsLink } from '@app/atoms/ButtonAsLink'
import { useFormikContext } from 'formik'
import * as R from 'ramda'
import { useCallback } from 'react'
import styled from 'styled-components'

const StyledParagraph = styled.p`
  color: ${p => p.theme.color.danger.default};
  font-weight: 500;
  margin: 0 !important;
  padding: 0 0 ${p => p.theme.padding.layout.medium} 0;
`

export function Error() {
  const { errors, submitCount } = useFormikContext<any>()

  const hasError = submitCount > 0 && !R.isEmpty(errors)
  const errorCount = !hasError ? 0 : Object.keys(errors).length

  const goToTop = useCallback(() => {
    window.scroll({
      behavior: 'smooth',
      top: 0,
    })
  }, [])

  if (!hasError) {
    return null
  }

  return (
    <StyledParagraph>
      Il y a {errorCount} erreurs à corriger sur ce formulaire.{' '}
      <ButtonAsLink onClick={goToTop}>Revenir en haut ⬆️</ButtonAsLink>
    </StyledParagraph>
  )
}
