import Image from 'next/image'
import React, { useState } from 'react'
import styled from 'styled-components'

const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
`

type CheckboxProps = {
  label: string
  name: string
  onChange: (checked: boolean) => void
}

export const Checkbox = ({ label, name, onChange }: CheckboxProps) => {
  const [checked, setChecked] = useState(false)

  const handleChange = () => {
    onChange(!checked)
    setChecked(prevChecked => !prevChecked)
  }

  return (
    <CheckboxContainer onClick={handleChange}>
      <Image height={24} src={`/images/checkbox-${checked ? 'checked' : 'empty'}.svg`} width={24} />
      <label htmlFor={name} style={{ flex: 1 }}>
        {label}
      </label>
    </CheckboxContainer>
  )
}
