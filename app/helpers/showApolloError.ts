import { handleError } from '@common/helpers/handleError'
import { toast } from 'react-hot-toast'

import { convertErrorToPojo } from './convertErrorToPojo'

import type { ApolloError, ServerError } from '@apollo/client'

// eslint-disable-next-line no-console
const debug = (err: Error): void => console.debug(convertErrorToPojo(err))

export function showApolloError(apolloError?: ApolloError): void {
  try {
    if (apolloError === undefined) {
      return
    }

    if (Array.isArray(apolloError.graphQLErrors) && apolloError.graphQLErrors.length > 0) {
      apolloError.graphQLErrors.forEach(({ extensions, message, path }) => {
        if (Array.isArray(path) && path.length > 0 && extensions !== undefined) {
          switch (extensions?.code) {
            case 'FORBIDDEN':
              toast.error(`L’accès au chemin GraphQL ${path.join(',')} vous est interdit.`)

              return

            case 'UNAUTHENTICATED':
              toast(`Votre session a expirée. Veuillez rechargez la page pour vous reconnecter.`)

              return

            default:
              debug(apolloError)
              toast.error(message)

              return
          }
        }

        debug(apolloError)
        toast.error(message)
      })

      return
    }

    if (
      apolloError.networkError !== null &&
      typeof apolloError.networkError === 'object' &&
      apolloError.networkError.constructor.name === 'ServerError'
    ) {
      const serverError = apolloError.networkError as ServerError
      toast.error(`${serverError.result.message} in ${serverError.result.path}`)

      return
    }

    if (typeof apolloError.message !== 'string' || apolloError.message.length === 0) {
      debug(apolloError)
      toast.error(`Une requête GraphQL a retourné une erreur illisible.`)

      return
    }

    debug(apolloError)
    toast.error(apolloError.message)
  } catch (err) {
    handleError(err, 'app/helpers/showApolloError()')
  }
}
