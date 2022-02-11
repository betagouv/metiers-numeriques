import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { useAuth } from 'nexauth'
import { useMemo } from 'react'

export function withGraphql(WrappedComponent: any) {
  return function WithGraphql(props: any) {
    const auth = useAuth()

    const graphqlClient = useMemo(
      () =>
        new ApolloClient({
          cache: new InMemoryCache(),
          headers: {
            Authorization: `Bearer ${auth.state.accessToken}`,
          },
          uri: '/api/graphql',
        }),
      [auth.state],
    )

    return (
      <ApolloProvider client={graphqlClient}>
        <WrappedComponent {...props} />
      </ApolloProvider>
    )
  }
}
