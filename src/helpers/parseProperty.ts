import { toDate } from 'date-fns-tz'

import { NotionProperty } from '../types/Notion'

function parseProperty(item: NotionProperty) {
  if (!item) {
    return undefined
  }

  try {
    if ('rich_text' in item) {
      const markdownSource = item.rich_text.map(richText => richText.plain_text).join('')
      // If there are some Markdown links containing email, we prepend a 'maito:' protocol to them
      if (/\([^)]+@[^)]+\)/.test(markdownSource)) {
        const markdownSourceWithMailtos = markdownSource
          .replace(/\(([^)]+@[^)]+)\)/g, '(mailto:$1)')
          // Easy way to avoid using negative look-aheads:
          .replace(/mailto:mailto:/g, 'mailto:')

        return markdownSourceWithMailtos
      }

      return markdownSource
    }

    if ('multi_select' in item) {
      return item.multi_select.map(select => select.name)
    }

    if ('select' in item) {
      return item.select !== null ? item.select.name : ''
    }

    if ('title' in item) {
      // Some titles have multiple empty elements, haven't figured why
      return item.title.filter(titleChunck => titleChunck.plain_text)[0].plain_text
    }

    if ('email' in item) {
      return (item as any).email[0].plain_text
    }
    if ('date' in item) {
      if (item.date === null) {
        return new Date()
      }

      return toDate(`${item.date.start}T00:00:00+02:00`, { timeZone: 'Europe/Paris' })
    }

    if ('files' in item) {
      return item.files
    }

    return undefined
  } catch (e) {
    return undefined
  }
}

export default parseProperty
