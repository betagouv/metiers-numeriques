/* eslint-disable no-case-declarations, @typescript-eslint/no-use-before-define */

import { handleError } from '@common/helpers/handleError'

import type { FilesOnLegacyInstitutionsWithRelation } from '@app/organisms/InstitutionCard'

export default function renderLegacyInstitutionFile(legacyInstitutionFile: FilesOnLegacyInstitutionsWithRelation) {
  try {
    const { id, title, url } = legacyInstitutionFile.file

    switch (true) {
      case /\.(gif|jpg|png|svg)(\?|$)/.test(url):
        return (
          <div key={id} className="FileAsImage">
            <img alt={title} src={url} />
          </div>
        )

      case /\.pdf(\?|$)/.test(url):
        return (
          <div key={id} className="FileAsDocument">
            <a href={url} rel="noopener noreferrer" target="_blank">
              <i className="ri-file-pdf-fill" />
              <b>{title}</b>
            </a>
          </div>
        )

      case /\.youtube\.com/.test(url):
        return embedYoutube(url, title, id)

      case /\.dailymotion\.com/.test(url):
        return embedDailymotion(url, title, id)

      default:
        return (
          <div key={id} className="FileAsDocument">
            <a href={url} rel="noopener noreferrer" target="_blank">
              <i className="ri-file-mark-fill" />
              <b>{title}</b>
            </a>
          </div>
        )
    }
  } catch (err) {
    handleError(err, 'helpers/renderFile()')
  }
}

const embedDailymotion = (url: string, title: string, id: string) => {
  const maybeResults = url.match(/[^/]+$/)

  if (maybeResults === null) {
    return (
      <div key={id} className="FileAsDocument">
        <a href={url} rel="noopener noreferrer" target="_blank">
          <i className="ri-file-mark-fill" />
          <b>{title}</b>
        </a>
      </div>
    )
  }

  const [dailymotionId] = maybeResults

  return (
    <div key={id} className="FileAsEmbed">
      <div>
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          frameBorder="0"
          src={`https://www.dailymotion.com/embed/video/${dailymotionId}`}
          title={title}
        />
      </div>
    </div>
  )
}

const embedYoutube = (url: string, title: string, id: string) => {
  const maybeResults = url.match(/[^=]+$/)
  if (maybeResults === null) {
    return (
      <div key={id} className="FileAsDocument">
        <a href={url} rel="noopener noreferrer" target="_blank">
          <i className="ri-file-mark-fill" />
          <b>{title}</b>
        </a>
      </div>
    )
  }

  const [youtubeId] = maybeResults

  return (
    <div className="FileAsEmbed">
      <div>
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          frameBorder="0"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title={title}
        />
      </div>
    </div>
  )
}
