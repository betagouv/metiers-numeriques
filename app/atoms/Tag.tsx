import { theme } from '@singularity/core'
import styled from 'styled-components'

type TagColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'

type TagProps = { color: TagColor; isSelected?: boolean; onClick?: () => void }

export const Tag = styled.div<TagProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  height: 1.5rem;
  border-radius: 0.75rem;
  padding: 0.25rem 0.5rem;
  color: ${p => (p.isSelected ? 'white' : theme.color.body.dark)};
  background-color: ${p => (p.isSelected ? theme.color[p.color].default : theme.color[p.color].background)};
  ${p => (p.onClick ? 'cursor: pointer;' : '')}
`
