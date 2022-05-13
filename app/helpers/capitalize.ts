import { handleError } from '@common/helpers/handleError'

import { capitalizeFirstLetter } from './capitalizeFirstLetter'

export function capitalize(text: string): string {
  try {
    return text
      .split(/\s+/)
      .map(word => word.split(/-/).map(capitalizeFirstLetter).join('-'))
      .join(' ')
  } catch (err) {
    handleError(err, 'app/helpers/capitalize()')

    return ''
  }
}
