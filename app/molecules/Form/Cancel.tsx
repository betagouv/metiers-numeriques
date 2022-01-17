import { Button } from '@singularity/core'
import { useFormikContext } from 'formik'
import { MouseEventHandler } from 'react'

type CancelProps = {
  children: any
  isDisabled?: boolean
  onClick: MouseEventHandler<HTMLButtonElement>
}
export function Cancel({ children, isDisabled = false, onClick }: CancelProps) {
  const { isSubmitting } = useFormikContext<any>()

  const isControlledDisabled = isDisabled || isSubmitting

  return (
    <Button accent="secondary" disabled={isControlledDisabled} onClick={onClick} style={{ marginRight: '1rem' }}>
      {children}
    </Button>
  )
}
