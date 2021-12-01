import handleError from './handleError'

export default function capitalizeFirstLetter(text: string): string {
  try {
    return text.charAt(0).toLocaleUpperCase() + text.slice(1)
  } catch (err) {
    handleError(err, 'helpers/capitalizeFirstLetter()')
  }
}
