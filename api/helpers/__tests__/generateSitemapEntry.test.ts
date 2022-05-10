import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

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
        '    <loc>http://localhost:3000/a/path</loc>\n' +
        '  </url>',
    )
  })

  test(`with a path and a date`, () => {
    const path = '/a/path'
    const updatedAt = dayjs.utc('2022-01-01').toDate()

    const result = generateSitemapEntry(path, updatedAt)

    expect(result).toBe(
      '  <url>\n' +
        '    <loc>http://localhost:3000/a/path</loc>\n' +
        '    <lastmod>2022-01-01</lastmod>\n' +
        '  </url>',
    )
  })
})
