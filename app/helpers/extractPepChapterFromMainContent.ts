export function extractPepChapterFromMainContent(htmlSource: string, chapterTitle: string): string | undefined {
  const htmlSourceWithoutBlockCards = htmlSource.replace(/<!.*/is, '')

  const chapterTitleAsRegex = chapterTitle.replace(/\s+/g, '\\s+')
  const nonLastTitleRegExp = new RegExp(`<h2>\\s*${chapterTitleAsRegex}\\s*</h2>(.*?)<h2>`, 'is')
  const nonLastMatch = nonLastTitleRegExp.exec(htmlSourceWithoutBlockCards)
  if (nonLastMatch !== null && nonLastMatch.length === 2) {
    return nonLastMatch[1].trim()
  }

  const lastTitleRegExp = new RegExp(`<h2>\\s*${chapterTitleAsRegex}\\s*</h2>(.*)`, 'is')
  const lastMatch = lastTitleRegExp.exec(htmlSourceWithoutBlockCards)
  if (lastMatch !== null && lastMatch.length === 2) {
    return lastMatch[1].trim()
  }
}
