import { InputHTMLAttributes, useCallback } from 'react'
import styled from 'styled-components'

const Label = styled.label<{
  isChecked: boolean
  isDisabled: boolean
}>`
  align-items: center;
  background-color: ${p => (p.isChecked ? 'lightgray' : 'transparent')};
  box-shadow: inset 0 0 1px ${p => (p.isChecked ? 'darkgray' : 'gray')};
  cursor: ${p => (p.isDisabled ? 'auto' : 'pointer')};
  display: inline-flex;
  font-size: 80%;
  justify-content: center;
  opacity: ${p => (p.isDisabled ? 0.65 : 1)};
  /* margin: 0 1rem 1rem 0; */
  padding: 1rem;
  text-align: center;
  user-select: none;

  > input {
    cursor: pointer;
    height: 0;
    opacity: 0;
    position: absolute;
    width: 0;
  }
`

const LabelText = styled.span<{
  isChecked: boolean
}>`
  font-weight: ${p => (p.isChecked ? 500 : 400)};
  overflow: hidden;
  text-overflow: ellipsis;
`

export type FilterRadioProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  name: string
  onCheck: (id: string) => void | Promise<void>
  onUncheck: (id: string) => void | Promise<void>
  value: string
}

export function FilterRadio({ label, name, onCheck, onUncheck, value, ...rest }: FilterRadioProps) {
  const isChecked = rest.checked === true || rest.defaultChecked === true
  const isDisabled = Boolean(rest.disabled)

  const handleCheck = useCallback(() => {
    if (isChecked) {
      onUncheck(value)
    } else {
      onCheck(value)
    }
  }, [isChecked, value])

  return (
    <Label isChecked={isChecked} isDisabled={isDisabled}>
      <input id={value} name={name} onChange={handleCheck} type="checkbox" value={value} {...rest} />

      <LabelText isChecked={isChecked}>{label}</LabelText>
    </Label>
  )
}
