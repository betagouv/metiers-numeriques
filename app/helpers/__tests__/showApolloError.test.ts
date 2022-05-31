/**
 * @jest-environment jsdom
 */

import { ApolloError } from '@apollo/client'
import { GraphQLError } from 'graphql'
import { toast } from 'react-hot-toast'

import { showApolloError } from '../showApolloError'

// @apollo/client/link/utils/throwServerError.d.ts
// @apollo/client/link/utils/throwServerError.js
class ServerError extends Error {
  public response: Response
  public result: Record<string, any>
  public statusCode: number

  constructor(response: Response, result: Record<string, any>, message?: string) {
    super(message)

    this.response = response
    this.result = result
    this.statusCode = response.status
  }
}

describe('app/helpers/showApolloError()', () => {
  describe('with GraphQL errors', () => {
    test(`with {extensions} with a "FORBIDDEN" code prop`, () => {
      const error = new ApolloError({
        graphQLErrors: [
          new GraphQLError('A GraphQLError message.', undefined, undefined, undefined, ['getPath'], undefined, {
            code: 'FORBIDDEN',
          }),
        ],
      })

      showApolloError(error as any)

      expect(console.debug).not.toHaveBeenCalled()
      expect(toast.error).toHaveBeenCalledTimes(1)
      expect(toast.error).toHaveBeenCalledWith('L’accès au chemin GraphQL getPath vous est interdit.')
    })

    test(`with {extensions} with an "UNAUTHENTICATED" code prop`, () => {
      const error = new ApolloError({
        graphQLErrors: [
          new GraphQLError('A GraphQLError message.', undefined, undefined, undefined, ['getPath'], undefined, {
            code: 'UNAUTHENTICATED',
          }),
        ],
      })

      showApolloError(error as any)

      expect(console.debug).not.toHaveBeenCalled()
      expect(toast).toHaveBeenCalledTimes(1)
      expect(toast).toHaveBeenCalledWith('Votre session a expirée. Veuillez rechargez la page pour vous reconnecter.')
    })

    test(`with {extensions} with an unknown code prop`, () => {
      const error = new ApolloError({
        graphQLErrors: [
          new GraphQLError('A GraphQLError message.', undefined, undefined, undefined, ['getPath'], undefined, {
            code: 'WHATEVER',
          }),
        ],
      })

      showApolloError(error as any)

      expect(console.debug).toHaveBeenCalledTimes(1)
      expect(toast.error).toHaveBeenCalledTimes(1)
      expect(toast.error).toHaveBeenCalledWith('A GraphQLError message.')
    })

    test(`with {extensions} with an undefined code prop`, () => {
      const error = new ApolloError({
        graphQLErrors: [
          new GraphQLError('A GraphQLError message.', undefined, undefined, undefined, ['getPath'], undefined, {}),
        ],
      })

      showApolloError(error as any)

      expect(console.debug).toHaveBeenCalledTimes(1)
      expect(toast.error).toHaveBeenCalledTimes(1)
      expect(toast.error).toHaveBeenCalledWith('A GraphQLError message.')
    })

    test(`with an empty {paths}`, () => {
      const error = new ApolloError({
        graphQLErrors: [new GraphQLError('A GraphQLError message.', undefined, undefined, undefined, [])],
      })

      showApolloError(error as any)

      expect(console.debug).toHaveBeenCalledTimes(1)
      expect(toast.error).toHaveBeenCalledTimes(1)
      expect(toast.error).toHaveBeenCalledWith('A GraphQLError message.')
    })

    test(`with an undefined {paths}`, () => {
      const error = new ApolloError({
        graphQLErrors: [new GraphQLError('A GraphQLError message.')],
      })

      showApolloError(error as any)

      expect(console.debug).toHaveBeenCalledTimes(1)
      expect(toast.error).toHaveBeenCalledTimes(1)
      expect(toast.error).toHaveBeenCalledWith('A GraphQLError message.')
    })

    test(`with an undefined {extension}`, () => {
      const error = new ApolloError({
        graphQLErrors: [new GraphQLError('A GraphQLError message.', undefined, undefined, undefined, ['getPath'])],
      })

      showApolloError(error as any)

      expect(console.debug).toHaveBeenCalledTimes(1)
      expect(toast.error).toHaveBeenCalledTimes(1)
      expect(toast.error).toHaveBeenCalledWith('A GraphQLError message.')
    })

    test(`with an empty array`, () => {
      const error = new ApolloError({
        errorMessage: 'An ApolloError message.',
        graphQLErrors: [],
      })

      showApolloError(error as any)

      expect(console.debug).toHaveBeenCalledTimes(1)
      expect(toast.error).toHaveBeenCalledTimes(1)
      expect(toast.error).toHaveBeenCalledWith('An ApolloError message.')
    })
  })

  describe('with network errors', () => {
    test(`with an empty array`, () => {
      const error = new ApolloError({
        networkError: new ServerError(new Response(), {
          message: 'A ServerError message',
          path: 'a path',
        }),
      })

      showApolloError(error as any)

      expect(console.debug).not.toHaveBeenCalled()
      expect(toast.error).toHaveBeenCalledTimes(1)
      expect(toast.error).toHaveBeenCalledWith('A ServerError message in a path')
    })
  })

  test(`with undefined`, () => {
    const error = undefined

    showApolloError(error)

    expect(console.debug).not.toHaveBeenCalled()
    expect(toast.error).not.toHaveBeenCalled()
  })

  test(`with an object with an undefined message prop`, () => {
    const error = {}

    showApolloError(error as any)

    expect(console.debug).toHaveBeenCalledTimes(1)
    expect(toast.error).toHaveBeenCalledTimes(1)
    expect(toast.error).toHaveBeenCalledWith('Une requête GraphQL a retourné une erreur illisible.')
  })

  test(`with an empty message prop`, () => {
    const error = new ApolloError({})

    showApolloError(error as any)

    expect(console.debug).toHaveBeenCalledTimes(1)
    expect(toast.error).toHaveBeenCalledTimes(1)
    expect(toast.error).toHaveBeenCalledWith('Une requête GraphQL a retourné une erreur illisible.')
  })

  test(`with a malformed input`, () => {
    const error = null

    showApolloError(error as any)

    expect(console.debug).not.toHaveBeenCalled()
    expect(toast.error).not.toHaveBeenCalled()
  })
})
