import { theme } from '@app/theme'
import styled from 'styled-components'

type MessageStatus = 'info' | 'success' | 'danger'

const MESSAGE_COLORS: { [key in MessageStatus]: string } = {
  danger: theme.color.danger.scarlet,
  info: theme.color.neutral.greyBlue,
  success: theme.color.success.herbal,
}

export const Message = styled.div<{ status: MessageStatus }>`
  padding: 1.5rem;
  color: ${p => MESSAGE_COLORS[p.status]};
  font-weight: 500;
  border: 1px solid ${p => MESSAGE_COLORS[p.status]};
  border-radius: 0.5rem;
`
