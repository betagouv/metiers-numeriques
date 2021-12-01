import handleError from './handleError'

export default function slugify(title: string, id: string): string {
  try {
    const slug = `${title}-${id}`
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '')

    return slug
  } catch (err) {
    handleError(err, 'helpers/slugify()')
  }
}
