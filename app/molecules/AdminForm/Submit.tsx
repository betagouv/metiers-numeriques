import { Button } from '@singularity/core'
import { useFormikContext } from 'formik'

type SubmitProps = {
  accent?: 'danger' | 'info' | 'primary' | 'secondary' | 'warning'
  children: any
  isDisabled?: boolean
}
export function Submit({ accent, children, isDisabled = false }: SubmitProps) {
  const { isSubmitting } = useFormikContext<any>()

  const isControlledDisabled = isDisabled || isSubmitting

  return (
    <Button accent={accent} disabled={isControlledDisabled} type="submit">
      {children}
    </Button>
  )
}
