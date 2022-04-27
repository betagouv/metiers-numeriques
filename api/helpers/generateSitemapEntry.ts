import dayjs from 'dayjs'

const { DOMAIN_URL } = process.env

export function generateSitemapEntry(path: string, updatedAt?: Date): string {
  const rows = ['  <url>', `    <loc>${DOMAIN_URL}${path}</loc>`]

  if (updatedAt !== undefined) {
    rows.push(`    <lastmod>${dayjs(updatedAt).format('YYYY-MM-DD')}</lastmod>`)
  }

  rows.push('  </url>')

  return rows.join('\n')
}
