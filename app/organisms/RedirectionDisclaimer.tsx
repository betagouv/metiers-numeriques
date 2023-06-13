import { Title } from '@app/atoms/Title'
import { theme } from '@app/theme'
import styled from 'styled-components'

const Box = styled.div`
  margin-top: 4rem;
  border-radius: 2rem;
  border: 1px solid ${theme.color.primary.darkBlue};
  align-items: center;
  background-color: ${theme.color.neutral.white};
  color: ${theme.color.primary.darkBlue};
  display: flex;
  justify-content: space-between;
  padding: 3rem 3rem 4rem;
  margin-bottom: 4rem;
`

const Content = styled.div`
  > h2 {
    color: ${theme.color.primary.darkBlue};
  }
`

export const RedirectionDisclaimer = () => (
  <Box>
    <Content>
      <Title as="h2" isFirst>
        <i className="ri-lightbulb-flash-line" /> Le site des métiers du numérique évolue !
      </Title>
      <p>
        Retrouvez toutes nos offres dans le domaine du numérique sur{' '}
        <a href="https://choisirleservicepublic.gouv.fr/">choisirleservicepublic.gouv.fr</a>, qui recense plus de 4000
        offres à date.
      </p>
    </Content>
  </Box>
)
