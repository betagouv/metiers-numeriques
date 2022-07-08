import { Formik, Form as FormikForm } from 'formik'

import { Cancel } from './Cancel'
import { Checkbox } from './Checkbox'
import { Submit } from './Submit'
import { TextInput } from './TextInput'

import type { FormikConfig, FormikValues } from 'formik'
import type { FormHTMLAttributes } from 'react'

type FormProps<Values extends FormikValues = FormikValues, ExtraProps = {}> = FormikConfig<Values> &
  ExtraProps &
  Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'>
const FormComponent = ({
  children,
  initialErrors,
  initialValues,
  onSubmit,
  validate,
  validationSchema,
  ...props
}: FormProps) => (
  <Formik
    enableReinitialize
    initialErrors={initialErrors}
    initialValues={initialValues}
    onSubmit={onSubmit}
    validate={validate}
    validationSchema={validationSchema}
  >
    <FormikForm noValidate {...props}>
      {children}
    </FormikForm>
  </Formik>
)

FormComponent.displayName = 'Form'

export const Form = Object.assign(FormComponent, {
  Cancel,
  Checkbox,
  Submit,
  TextInput,
})
