import { promises as fs } from 'fs'

import { extractPepChapterFromMainContent } from '../extractPepChapterFromMainContent'

describe('app/helpers/extractPepChapterFromMainContent()', () => {
  describe('Fixture A', () => {
    test(`should extract first chapter`, async () => {
      const htmlSource = await fs.readFile(
        `${__dirname}/__fixtures__/extractPepChapterFromMainContent.a.source.html`,
        'utf8',
      )

      const result = extractPepChapterFromMainContent(htmlSource, 'Vos missions en quelques mots')

      const expected = await fs.readFile(
        `${__dirname}/__fixtures__/extractPepChapterFromMainContent.a1.result.html`,
        'utf8',
      )

      expect(result).toBe(expected)
    })

    test(`should extract last chapter`, async () => {
      const htmlSource = await fs.readFile(
        `${__dirname}/__fixtures__/extractPepChapterFromMainContent.a.source.html`,
        'utf8',
      )

      const result = extractPepChapterFromMainContent(htmlSource, 'Profil recherché')

      const expected = await fs.readFile(
        `${__dirname}/__fixtures__/extractPepChapterFromMainContent.a2.result.html`,
        'utf8',
      )

      expect(result).toBe(expected)
    })
  })

  describe('Fixture B', () => {
    test(`should extract first chapter`, async () => {
      const htmlSource = await fs.readFile(
        `${__dirname}/__fixtures__/extractPepChapterFromMainContent.b.source.html`,
        'utf8',
      )

      const result = extractPepChapterFromMainContent(htmlSource, 'Vos missions en quelques mots')

      const expected = await fs.readFile(
        `${__dirname}/__fixtures__/extractPepChapterFromMainContent.b1.result.html`,
        'utf8',
      )

      expect(result).toBe(expected)
    })

    test(`should extract last chapter`, async () => {
      const htmlSource = await fs.readFile(
        `${__dirname}/__fixtures__/extractPepChapterFromMainContent.b.source.html`,
        'utf8',
      )

      const result = extractPepChapterFromMainContent(htmlSource, 'Profil recherché')

      const expected = await fs.readFile(
        `${__dirname}/__fixtures__/extractPepChapterFromMainContent.b2.result.html`,
        'utf8',
      )

      expect(result).toBe(expected)
    })
  })
})
