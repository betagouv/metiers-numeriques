import { theme } from '@app/theme'
import { ButtonHTMLAttributes, useMemo } from 'react'
import { MoonLoader } from 'react-spinners'
import styled from 'styled-components'

/* eslint-disable sort-keys-fix/sort-keys-fix */
const ACCENT_TABLE = {
  primary: {
    backgroundColor: {
      default: theme.color.primary.darkBlue,
      hover: theme.color.primary.navy,
      focus: theme.color.primary.navy,
      click: theme.color.primary.azure,
      loading: theme.color.primary.darkBlue,
      disabled: theme.color.primary.lightBlue,
    },
    border: {
      default: 0,
      hover: 0,
      focus: 0,
      click: 0,
      loading: 0,
      disabled: 0,
    },
    color: {
      default: theme.color.neutral.white,
      hover: theme.color.neutral.white,
      focus: theme.color.neutral.white,
      click: theme.color.neutral.white,
      loading: theme.color.neutral.white,
      disabled: theme.color.neutral.greyBlue,
    },
    outline: theme.color.neutral.black,
  },
  secondary: {
    backgroundColor: {
      default: theme.color.neutral.white,
      hover: theme.color.primary.lightBlue,
      focus: theme.color.primary.lightBlue,
      click: theme.color.primary.lightBlue,
      loading: theme.color.primary.lightBlue,
      disabled: theme.color.primary.lightBlue,
    },
    border: {
      default: `solid 1px ${theme.color.primary.darkBlue}`,
      hover: `solid 1px ${theme.color.primary.darkBlue}`,
      focus: `solid 1px ${theme.color.primary.lightBlue}`,
      click: `solid 1px ${theme.color.primary.lightBlue}`,
      loading: `solid 1px ${theme.color.primary.lightBlue}`,
      disabled: `solid 1px ${theme.color.primary.lightBlue}`,
    },
    color: {
      default: theme.color.primary.darkBlue,
      hover: theme.color.primary.darkBlue,
      focus: theme.color.primary.darkBlue,
      click: theme.color.primary.darkBlue,
      loading: theme.color.primary.darkBlue,
      disabled: theme.color.neutral.greyBlue,
    },
    outline: theme.color.neutral.darkGrey,
  },
  tertiary: {
    backgroundColor: {
      default: theme.color.neutral.white,
      hover: theme.color.primary.lightBlue,
      focus: theme.color.neutral.white,
      click: theme.color.primary.sky,
      loading: theme.color.primary.sky,
      disabled: theme.color.primary.lightBlue,
    },
    border: {
      default: 0,
      hover: 0,
      focus: 0,
      click: 0,
      loading: 0,
      disabled: 0,
    },
    color: {
      default: theme.color.primary.darkBlue,
      hover: theme.color.primary.darkBlue,
      focus: theme.color.primary.darkBlue,
      click: theme.color.primary.darkBlue,
      loading: theme.color.primary.darkBlue,
      disabled: theme.color.neutral.greyBlue,
    },
    outline: theme.color.neutral.darkGrey,
  },
}

const convertFontSizePcToPx = (fontSizeInPc: string): number => (16 * Number(fontSizeInPc.replace(/%/, ''))) / 100
const SIZE_TABLE = {
  normal: {
    fontSize: theme.typography.desktop.button.normal.size,
    fontSizeInPx: convertFontSizePcToPx(theme.typography.desktop.button.normal.size),
    padding: '0.85rem 2rem 1.15rem',
  },
  medium: {
    fontSize: theme.typography.desktop.button.medium.size,
    fontSizeInPx: convertFontSizePcToPx(theme.typography.desktop.button.medium.size),
    padding: '0.75rem 2rem 1rem',
  },
  small: {
    fontSize: theme.typography.desktop.button.small.size,
    fontSizeInPx: convertFontSizePcToPx(theme.typography.desktop.button.small.size),
    padding: '0.425rem 1.5rem 0.575rem',
  },
}
/* eslint-enable sort-keys-fix/sort-keys-fix */

export const StyledButton = styled.button<{
  accent: 'primary' | 'secondary' | 'tertiary'
  isLoading: boolean
  size: 'medium' | 'normal' | 'small'
}>`
  --blend: none;
  align-items: center;
  justify-content: center;
  background-color: ${p => ACCENT_TABLE[p.accent].backgroundColor.default};
  border: ${p => ACCENT_TABLE[p.accent].border.default};
  border-radius: 0.25rem;
  box-shadow: none;
  color: ${p => ACCENT_TABLE[p.accent].color.default};
  display: inline-flex;
  font-size: ${p => SIZE_TABLE[p.size].fontSize};
  line-height: 1;
  min-height: auto;
  padding: ${p => SIZE_TABLE[p.size].padding};
  transition: all 0.2s ease;
  white-space: nowrap;

  :hover {
    background-color: ${p => ACCENT_TABLE[p.accent].backgroundColor.hover};
    border: ${p => ACCENT_TABLE[p.accent].border.hover};
    color: ${p => ACCENT_TABLE[p.accent].color.hover};
  }

  :focus {
    background-color: ${p => ACCENT_TABLE[p.accent].backgroundColor.focus};
    border: ${p => ACCENT_TABLE[p.accent].border.focus};
    box-shadow: 0 0 0 2px ${p => ACCENT_TABLE[p.accent].outline};
    color: ${p => ACCENT_TABLE[p.accent].color.focus};
  }

  :active {
    background-color: ${p => ACCENT_TABLE[p.accent].backgroundColor.click};
    border: ${p => ACCENT_TABLE[p.accent].border.click};
    color: ${p => ACCENT_TABLE[p.accent].color.click};
  }

  :disabled {
    background-color: ${p =>
      p.isLoading ? ACCENT_TABLE[p.accent].backgroundColor.loading : ACCENT_TABLE[p.accent].backgroundColor.disabled};
    border: ${p => (p.isLoading ? ACCENT_TABLE[p.accent].border.loading : ACCENT_TABLE[p.accent].border.disabled)};
    color: ${p => (p.isLoading ? ACCENT_TABLE[p.accent].color.loading : ACCENT_TABLE[p.accent].color.disabled)};
  }

  /* Right icons */
  > i {
    margin-left: 1rem;
    margin-top: 2px;
  }

  ::after {
    margin-top: 3px;
  }
`

const Icon = styled.span`
  margin-top: 2px;
  margin-right: 0.5rem;
  margin-left: -0.5rem;
`

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  accent?: 'primary' | 'secondary' | 'tertiary'
  iconClassName?: string
  isLoading?: boolean
  size?: 'medium' | 'normal' | 'small'
}
export function Button({
  accent = 'primary',
  children,
  iconClassName,
  isLoading = false,
  size = 'normal',
  type = 'button',
  ...nativeProps
}: ButtonProps) {
  const { disabled } = nativeProps
  const controlledDisabled = disabled || isLoading
  const spinnerColor = useMemo(() => ACCENT_TABLE[accent].color.loading, [])
  const spinnerSize = useMemo(() => SIZE_TABLE[size].fontSizeInPx / 1.5, [])

  return (
    <StyledButton
      accent={accent}
      className="Button"
      disabled={controlledDisabled}
      isLoading={isLoading}
      size={size}
      type={type}
      {...nativeProps}
    >
      {iconClassName && <Icon className={iconClassName} />}
      {children}
      {isLoading ? <MoonLoader color={spinnerColor} size={spinnerSize} /> : undefined}
    </StyledButton>
  )
}
