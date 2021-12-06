/* eslint-disable no-case-declarations, @typescript-eslint/no-use-before-define */

import { NotionPropertyAsFiles } from '../types/Notion'
import handleError from './handleError'

export default function convertNotionNodeToHtmls(value: NotionPropertyAsFiles): string[] {
  try {
    switch (value.type) {
      case 'files':
        return fromFiles(value)

      default:
        return []
    }
  } catch (err) {
    handleError(err, 'helpers/convertNotionNodeToStrings()')
  }
}

const embedDailymotion = (url: string, name: string): string => {
  const maybeResults = url.match(/[^/]+$/)
  if (maybeResults === null) {
    return `
      <div class="FileAsDocument">
        <a href="${url}" rel="noopener" target="_blank">
          <i class="ri-file-mark-fill"></i>
          <b>${name}</b>
        </a>
      </div>
    `.trim()
  }

  const [dailymotionId] = maybeResults

  return `
    <div class="FileAsEmbed">
      <div>
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          frameborder="0"
          src="https://www.dailymotion.com/embed/video/${dailymotionId}"
          type="text/html"
        ></iframe>
      </div>
    </div>
  `.trim()
}

const embedYoutube = (url: string, name: string): string => {
  const maybeResults = url.match(/[^=]+$/)
  if (maybeResults === null) {
    return `
      <div class="FileAsDocument">
        <a href="${url}" rel="noopener" target="_blank">
          <i class="ri-file-mark-fill"></i>
          <b>${name}</b>
        </a>
      </div>
    `.trim()
  }

  const [youtubeId] = maybeResults

  return `
    <div class="FileAsEmbed">
      <div>
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          frameborder="0"
          src="https://www.youtube.com/embed/${youtubeId}"
        ></iframe>
      </div>
    </div>
  `.trim()
}

function fromFiles(value: NotionPropertyAsFiles): string[] {
  return value.files.reduce((htmlSources: string[], file): string[] => {
    const { name } = file
    const isExternal = file.type === 'external'
    const url = isExternal ? file.external.url : file.file.url

    switch (true) {
      case /\.(gif|jpg|png|svg)(\?|$)/.test(url):
        return [...htmlSources, `<div class="FileAsImage"><img alt="${name}" src="${url}" /></div>`]

      case /\.pdf(\?|$)/.test(url):
        return [
          ...htmlSources,
          `
            <div class="FileAsDocument">
              <a href="${url}" rel="noopener" target="_blank">
                <i class="ri-file-pdf-fill"></i>
                <b>${name}</b>
              </a>
            </div>
          `.trim(),
        ]

      case /\.youtube\.com/.test(url):
        return [...htmlSources, embedYoutube(url, name)]

      case /\.dailymotion\.com/.test(url):
        return [...htmlSources, embedDailymotion(url, name)]

      default:
        return [
          ...htmlSources,
          `
            <div class="FileAsDocument">
              <a href="${url}" rel="noopener" target="_blank">
                <i class="ri-file-mark-fill"></i>
                <b>${name}</b>
              </a>
            </div>
          `.trim(),
        ]
    }
  }, [])
}
