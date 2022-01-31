import { Formik, Form as FormikForm } from 'formik'
import styled from 'styled-components'

import { AddressSelect } from './AddressSelect'
import { Cancel } from './Cancel'
import { Checkbox } from './Checkbox'
import { Code } from './Code'
import { Editor } from './Editor'
// import { Image } from './Image'
import { Select } from './Select'
import { Submit } from './Submit'
import { Textarea } from './Textarea'
import { TextInput } from './TextInput'

import type { FormikConfig, FormikValues } from 'formik'
import type { FormHTMLAttributes } from 'react'

const StyledForm = styled(FormikForm)`
  display: flex;
  flex-direction: column;
  width: 100%;
`

type FormProps<Values extends FormikValues = FormikValues, ExtraProps = {}> = FormikConfig<Values> &
  ExtraProps &
  Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'>
// eslint-disable-next-line @typescript-eslint/naming-convention
const _Form = ({
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
    <StyledForm noValidate {...props}>
      {children}
    </StyledForm>
  </Formik>
)

export const Form = Object.assign(_Form, {
  AddressSelect,
  Cancel,
  Checkbox,
  Code,
  Editor,
  // Image,
  Select,
  Submit,
  Textarea,
  TextInput,
})
