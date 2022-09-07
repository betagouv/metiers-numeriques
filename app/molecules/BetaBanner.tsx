import { theme } from '@app/theme'
import React from 'react'
import styled from 'styled-components'

const Banner = styled.div`
  text-transform: uppercase;
  font-weight: 600;
  background-color: ${theme.color.primary.darkBlue};
  color: white;
  position: absolute;
  top: 5px;
  right: -120px;
  padding: 0.25rem 53px;
  transform: rotate(45deg);
  overflow: hidden;
  clip-path: polygon(0 0, 0 0, 100% 0, 100% 100%, 100% 0%, 84% 100%, 0% 100%, 0% 100%, 0% 0%);

  p {
    font-size: 0.8rem;
  }
`

export const BetaBanner = () => (
  <Banner className="fr-displayed-lg">
    <p>Version Bêta</p>
  </Banner>
)
