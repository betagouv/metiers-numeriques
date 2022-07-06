import { Button } from '@app/atoms/Button'
import { useFormikContext } from 'formik'
import { useMemo } from 'react'

import type { ButtonProps } from '@app/atoms/Button'

export function Submit(props: ButtonProps) {
  const { disabled } = props
  const { isSubmitting } = useFormikContext<any>()

  const isControlledDisabled = useMemo(() => disabled || isSubmitting, [disabled, isSubmitting])

  return <Button disabled={isControlledDisabled} type="submit" {...props} />
}
