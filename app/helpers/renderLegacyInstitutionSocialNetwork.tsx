import { generateKeyFromValues } from './generateKeyFromValues'

export default function renderLegacyInstitutionSocialNetwork(url: string) {
  const key = generateKeyFromValues(url)

  switch (true) {
    case url.search('dailymotion.com') !== -1:
      return (
        <a key={key} href={url} rel="noopener noreferrer" target="_blank">
          <img alt="Chaîne Dailymotion" src="/icons/dailymotion.svg" />
        </a>
      )

    case url.search('facebook.com') !== -1:
      return (
        <a key={key} href={url} rel="noopener noreferrer" target="_blank">
          <i className="ri-facebook-fill" />
        </a>
      )

    case url.search('github.com') !== -1:
      return (
        <a key={key} href={url} rel="noopener noreferrer" target="_blank">
          <i className="ri-github-fill" />
        </a>
      )

    case url.search('instagram.com') !== -1:
      return (
        <a key={key} href={url} rel="noopener noreferrer" target="_blank">
          <i className="ri-instagram-fill" />
        </a>
      )

    case url.search('linkedin.com') !== -1:
      return (
        <a key={key} href={url} rel="noopener noreferrer" target="_blank">
          <i className="ri-linkedin-fill" />
        </a>
      )

    case url.search('soundcloud.com') !== -1:
      return (
        <a key={key} href={url} rel="noopener noreferrer" target="_blank">
          <i className="ri-soundcloud-fill" />
        </a>
      )

    case url.search('twitter.com') !== -1:
      return (
        <a key={key} href={url} rel="noopener noreferrer" target="_blank">
          <i className="ri-twitter-fill" />
        </a>
      )

    case url.search('youtube.com') !== -1:
      return (
        <a key={key} href={url} rel="noopener noreferrer" target="_blank">
          <i className="ri-youtube-fill" />
        </a>
      )

    default:
      return (
        <a key={key} href={url} rel="noopener noreferrer" target="_blank">
          {url}
        </a>
      )
  }
}
