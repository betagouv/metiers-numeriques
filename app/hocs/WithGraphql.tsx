import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { useAuth } from 'nexauth'
import { useMemo } from 'react'

export default function WithGraphql({ children }) {
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

  return <ApolloProvider client={graphqlClient}>{children}</ApolloProvider>
}
