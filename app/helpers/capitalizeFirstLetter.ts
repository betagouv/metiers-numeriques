import { handleError } from '@common/helpers/handleError'

export function capitalizeFirstLetter(text: string): string {
  try {
    return text.charAt(0).toLocaleUpperCase() + text.slice(1)
  } catch (err) {
    handleError(err, 'app/helpers/capitalizeFirstLetter()')

    return ''
  }
}
