import handleError from '@common/helpers/handleError'

export default function uncapitalizeFirstLetter(text: string | null): string {
  try {
    if (text === null) {
      return ''
    }

    return text.charAt(0).toLocaleLowerCase() + text.slice(1)
  } catch (err) {
    handleError(err, 'app/helpers/capitalizeFirstLetter()')

    return ''
  }
}
