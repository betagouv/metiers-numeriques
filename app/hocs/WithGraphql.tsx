import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { useAuth } from 'nexauth/client'
import { useMemo } from 'react'

type WithGraphqlProps = {
  children: any
}

export function WithGraphql({ children }: WithGraphqlProps) {
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
