import handleError from './handleError'

export default function uncapitalizeFirstLetter(text): string {
  try {
    return text.charAt(0).toLocaleLowerCase() + text.slice(1)
  } catch (err) {
    handleError(err, 'helpers/capitalizeFirstLetter()')
  }
}
