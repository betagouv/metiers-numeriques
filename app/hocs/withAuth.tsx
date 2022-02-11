import { AuthProvider } from 'nexauth'

import Loader from '../molecules/Loader'
import SignInDialog from '../organisms/SignInDialog'

const PRIVATE_PATHS = [/^\/admin($|\/)/]

export function withAuth(WrappedComponent: any) {
  return function WithAuth(props: any) {
    return (
      <AuthProvider Loader={Loader} privatePaths={PRIVATE_PATHS} SignInDialog={SignInDialog}>
        <WrappedComponent {...props} />
      </AuthProvider>
    )
  }
}
