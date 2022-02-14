import classnames from 'classnames'
import { ButtonHTMLAttributes } from 'react'
import styled from 'styled-components'

const ACCENT_TABLE = {
  moutarde: {
    backgroundColor: {
      default: 'rgb(255,202,0)',
      hover: 'rgb(255,215,91)',
      transparent: 'rgba(255,202,0,0.25)',
    },
    isLight: false,
  },
  normal: {
    backgroundColor: {
      default: 'rgb(0,178,186)',
      hover: 'rgb(0,106,111)',
      transparent: 'rgba(0,106,111,0.25)',
    },
    isLight: true,
  },
}

const SIZE_TABLE = {
  large: {
    backgroundColor: '#fcc63a',
    fontSize: '120%',
    padding: '0.75rem 1.5rem 1rem',
  },
  normal: {
    fontSize: '100%',
    padding: '0.75rem 1.5rem 1rem',
  },
  small: {
    fontSize: '90%',
    padding: '0.5rem 1rem 0.75rem',
  },
}

const StyledButton = styled.button<{
  accent: 'moutarde' | 'normal'
  isLight: boolean
  isSecondary: boolean
  size: 'large' | 'normal' | 'small'
}>`
  --blend: none;
  background-color: ${p => (p.isSecondary ? 'transparent' : ACCENT_TABLE[p.accent].backgroundColor.default)};
  box-shadow: inset 0 0 0 2px ${p => ACCENT_TABLE[p.accent].backgroundColor.default};
  color: ${p =>
    (p.isLight && p.isSecondary) || (ACCENT_TABLE[p.accent].isLight && !p.isSecondary) ? 'white' : 'black'};
  font-size: ${p => SIZE_TABLE[p.size].fontSize};
  line-height: 1;
  min-height: auto;
  padding: ${p => SIZE_TABLE[p.size].padding};
  transition: all 0.2s ease;

  :hover {
    background-color: ${p => (p.isSecondary ? 'transparent' : ACCENT_TABLE[p.accent].backgroundColor.hover)};
    box-shadow: inset 0 0 0 2px
      ${p =>
        p.isSecondary
          ? ACCENT_TABLE[p.accent].backgroundColor.transparent
          : ACCENT_TABLE[p.accent].backgroundColor.hover};
  }
`

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  accent?: 'moutarde' | 'normal'
  isLight?: boolean
  isSecondary?: boolean
  size?: 'large' | 'normal' | 'small'
}

export function Button({
  accent = 'normal',
  className,
  isLight = false,
  isSecondary = false,
  size = 'normal',
  ...rest
}: ButtonProps) {
  const controlledClassName = classnames('fr-btn', className)

  return (
    <StyledButton
      accent={accent}
      className={controlledClassName}
      isLight={isLight}
      isSecondary={isSecondary}
      size={size}
      type="button"
      {...rest}
    />
  )
}
