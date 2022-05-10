import { Formik, Form as FormikForm } from 'formik'
import styled from 'styled-components'

import { Cancel } from './Cancel'
import { Checkbox } from './Checkbox'
import { Submit } from './Submit'
import { TextInput } from './TextInput'

import type { FormikConfig, FormikValues } from 'formik'
import type { FormHTMLAttributes } from 'react'

const StyledForm = styled(FormikForm)`
  align-items: flex-end;
  background-color: #f5f5fe;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  button {
    margin-top: 2rem;
    min-height: auto;
    padding: 0.45rem 1rem 0.6rem;
  }

  .fr-input-group {
    flex-grow: 1;
    margin: 0;
    width: 100%;
  }
  input {
    border-radius: 0;
    padding: 0.45rem 1rem 0.6rem;
  }
`

type FormProps<Values extends FormikValues = FormikValues, ExtraProps = {}> = FormikConfig<Values> &
  ExtraProps &
  Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> & {
    isInline?: boolean
  }

// eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention
const _Form = ({
  children,
  initialErrors,
  initialValues,
  isInline = false,
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
    {isInline ? (
      <FormikForm noValidate {...props}>
        {children}
      </FormikForm>
    ) : (
      <StyledForm noValidate {...props}>
        {children}
      </StyledForm>
    )}
  </Formik>
)

export const Form = Object.assign(_Form, {
  Cancel,
  Checkbox,
  Submit,
  TextInput,
})
