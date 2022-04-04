import handleError from '@common/helpers/handleError'

const { DOMAIN_URL, LINKEDIN_CLIENT_ID } = process.env

const LINKEDIN_API_URL = 'https://api.linkedin.com/v2'

class Linkedin {
  constructor() {
    try {
      if (DOMAIN_URL === undefined) {
        throw new Error('`DOMAIN_URL` is undefined.')
      }
      if (LINKEDIN_CLIENT_ID === undefined) {
        throw new Error('`LINKEDIN_CLIENT_ID` is undefined.')
      }
    } catch (err) {
      handleError(err, 'api/libs/Linkedin.constructor()')
    }
  }

  public getAuthorisationUrl(state: string): string {
    try {
      const redirectUrl = `${DOMAIN_URL}/api/linkedin/signin`
      const searchParams = new URLSearchParams({
        client_id: LINKEDIN_CLIENT_ID as string,
        redirect_uri: redirectUrl,
        response_type: 'code',
        state,
      })

      const url = `${LINKEDIN_API_URL}/authorization?${searchParams.toString()}`

      return url
    } catch (err) {
      handleError(err, 'api/libs/Linkedin.getAuthorisationUrl()')

      return ''
    }
  }
}

export const linkedin = new Linkedin()
