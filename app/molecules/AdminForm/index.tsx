import { Formik, Form as FormikForm } from 'formik'
import { forwardRef } from 'react'
import styled from 'styled-components'

import { AddressSelect } from './AddressSelect'
import { AutoSave } from './AutoSave'
import { Cancel } from './Cancel'
import { Checkbox } from './Checkbox'
import { ContactSelect } from './ContactSelect'
import { CountrySelect } from './CountrySelect'
import { DomainSelect } from './DomainSelect'
import { Editor } from './Editor'
import { Error } from './Error'
import { FileUpload } from './FileUpload'
import { InstitutionSelect } from './InstitutionSelect'
import { ProfessionSelect } from './ProfessionSelect'
import { RecruiterSelect } from './RecruiterSelect'
import { Select } from './Select'
import { Submit } from './Submit'
import { Textarea } from './Textarea'
import { TextInput } from './TextInput'

import type { FormikConfig, FormikValues } from 'formik'
import type { FormHTMLAttributes, ForwardedRef } from 'react'

const StyledForm = styled(FormikForm)`
  display: flex;
  flex-direction: column;
  width: 100%;
`

type FormProps<Values extends FormikValues = FormikValues, ExtraProps = {}> = FormikConfig<Values> &
  ExtraProps &
  Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'>
// eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention
const _AdminForm = (
  {
    children,
    initialErrors,
    initialValues,
    onSubmit,

    validate,
    validationSchema,
    ...props
  }: FormProps,
  ref: ForwardedRef<HTMLFormElement>,
) => (
  <Formik
    enableReinitialize
    initialErrors={initialErrors}
    initialValues={initialValues}
    onSubmit={onSubmit}
    validate={validate}
    validationSchema={validationSchema}
  >
    <StyledForm ref={ref} noValidate {...props}>
      {children}
    </StyledForm>
  </Formik>
)

// eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention
const _AdminFormWithRef = forwardRef(_AdminForm)

export const AdminForm = Object.assign(_AdminFormWithRef, {
  AddressSelect,
  AutoSave,
  Cancel,
  Checkbox,
  ContactSelect,
  CountrySelect,
  DomainSelect,
  Editor,
  Error,
  FileUpload,
  InstitutionSelect,
  ProfessionSelect,
  RecruiterSelect,
  Select,
  Submit,
  Textarea,
  TextInput,
})
