import { Button } from '@singularity/core'
import { useFormikContext } from 'formik'

type SubmitProps = {
  children: any
  isDisabled?: boolean
}
export function Submit({ children, isDisabled = false }: SubmitProps) {
  const { isSubmitting } = useFormikContext<any>()

  const isControlledDisabled = isDisabled || isSubmitting

  return (
    <Button disabled={isControlledDisabled} type="submit">
      {children}
    </Button>
  )
}
