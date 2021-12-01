import handleError from './handleError'

export default function capitalize(text: string): string {
  try {
    return text.toLocaleLowerCase().replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase())
  } catch (err) {
    handleError(err, 'helpers/capitalize()')
  }
}
