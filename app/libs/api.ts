import handleError from '@common/helpers/handleError'
import ky, { HTTPError } from 'ky'
import { KyInstance } from 'ky/distribution/types/ky'

const API_BASE_URL = '/api'

class Api {
  private genericError: Common.Api.ResponseBodyError
  private ky: KyInstance

  constructor() {
    this.genericError = {
      code: 0,
      hasError: true,
      message: 'Une erreur interne est survenue. Nous essayons de la corriger au plus vite !',
    }

    this.ky = ky.create({
      prefixUrl: API_BASE_URL,
    })
  }

  public async get<T = any>(path: string): Promise<Common.Api.ResponseBody<T>> {
    try {
      const body = await this.ky.get(path).json<Common.Api.ResponseBodySuccess<T>>()

      return body
    } catch (err) {
      return this.handleApiError(err, 'app/libs/Api.get()')
    }
  }

  private async handleApiError(err: any, scope: string): Promise<Common.Api.ResponseBodyError> {
    if (err instanceof HTTPError) {
      try {
        const body = (await err.response.json()) as Common.Api.ResponseBodyError

        return body
      } catch (err) {
        handleError(err, `${scope} > app/libs/Api.handleApiError()`)

        return this.genericError
      }
    }

    handleError(err, `${scope} > app/libs/Api.handleApiError()`)

    return this.genericError
  }
}

export default new Api()
