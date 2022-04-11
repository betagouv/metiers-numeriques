import { Formik, Form as FormikForm } from 'formik'
import styled from 'styled-components'

import { AddressSelect } from './AddressSelect'
import { AutoSave } from './AutoSave'
import { Cancel } from './Cancel'
import { Checkbox } from './Checkbox'
import { Code } from './Code'
import { ContactSelect } from './ContactSelect'
import { CountrySelect } from './CountrySelect'
import { Editor } from './Editor'
import { Error } from './Error'
// import { Image } from './Image'
import { InstitutionSelect } from './InstitutionSelect'
import { ProfessionSelect } from './ProfessionSelect'
import { RecruiterSelect } from './RecruiterSelect'
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
const _AdminForm = ({
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

export const AdminForm = Object.assign(_AdminForm, {
  AddressSelect,
  AutoSave,
  Cancel,
  Checkbox,
  Code,
  ContactSelect,
  CountrySelect,
  Editor,
  Error,
  // Image,
  InstitutionSelect,
  ProfessionSelect,
  RecruiterSelect,
  Select,
  Submit,
  Textarea,
  TextInput,
})
