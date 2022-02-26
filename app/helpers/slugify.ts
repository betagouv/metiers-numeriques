import _slugify from 'slugify'

export function slugify(text: string): string {
  return _slugify(text.replace(/\//g, '-'))
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}
