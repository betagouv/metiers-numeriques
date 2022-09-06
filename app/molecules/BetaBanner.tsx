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
  padding: 0.25rem 50px;
  transform: rotate(45deg);
  overflow: hidden;
  z-index: 1000;

  p {
    font-size: 0.8rem;
  }
`

export const BetaBanner = () => (
  <Banner className="fr-displayed-lg">
    <p>Version Bêta</p>
  </Banner>
)
