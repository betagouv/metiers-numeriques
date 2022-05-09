import { Overlay } from './Overlay'
import { Spinner } from './Spinner'

export function AdminLoader() {
  return (
    <Overlay>
      <Spinner />
    </Overlay>
  )
}
