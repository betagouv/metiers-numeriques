import { theme } from '@app/theme'
import React from 'react'
import styled from 'styled-components'

const RadioContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`

const RadioDotContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  border: 1px solid ${theme.color.primary.darkBlue};
  border-radius: 50%;
`

const RadioDot = styled.div`
  width: 0.6rem;
  height: 0.6rem;
  background-color: ${theme.color.primary.darkBlue};
  border-radius: 50%;
`

const RadioLabel = styled.div`
  color: ${theme.color.primary.darkBlue};
  margin-bottom: 2px;
`

type RadioProps = {
  checked?: boolean
  label: string
  onChange: () => void
}

export const Radio = ({ checked = false, label, onChange }: RadioProps) => (
  <RadioContainer onClick={onChange}>
    <RadioDotContainer>{checked && <RadioDot />}</RadioDotContainer>
    <RadioLabel>{label}</RadioLabel>
  </RadioContainer>
)
