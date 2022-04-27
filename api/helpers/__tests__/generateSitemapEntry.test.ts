import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

process.env.DOMAIN_URL = 'https://www.example.com'

// eslint-disable-next-line import/first
import { generateSitemapEntry } from '../generateSitemapEntry'

dayjs.extend(utc)

describe('api/helpers/generateSitemapEntry()', () => {
  test(`with a path`, () => {
    const path = '/a/path'

    const result = generateSitemapEntry(path)

    // eslint-disable-next-line prettier/prettier
    expect(result).toBe(
      '  <url>\n' +
        '    <loc>https://www.example.com/a/path</loc>\n' +
        '  </url>',
    )
  })

  test(`with a path and a date`, () => {
    const path = '/a/path'
    const updatedAt = dayjs.utc('2022-01-01').toDate()

    const result = generateSitemapEntry(path, updatedAt)

    expect(result).toBe(
      '  <url>\n' +
        '    <loc>https://www.example.com/a/path</loc>\n' +
        '    <lastmod>2022-01-01</lastmod>\n' +
        '  </url>',
    )
  })
})
