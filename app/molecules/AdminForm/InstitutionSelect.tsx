import { useQuery } from '@apollo/client'
import { Select } from '@singularity/core'
import { useFormikContext } from 'formik'
import * as R from 'ramda'
import { useEffect, useMemo, useRef, useState } from 'react'

import { generateKeyFromValues } from '../../helpers/generateKeyFromValues'
import { showApolloError } from '../../helpers/showApolloError'
import { queries } from '../../queries'

import type { Institution } from '@prisma/client'

type InstitutionSelectProps = {
  helper?: string
  isDisabled?: boolean
  label: string
  name: string
  placeholder?: string
}

export function InstitutionSelect({ helper, isDisabled = false, label, name, placeholder }: InstitutionSelectProps) {
  const $newInstitutionId = useRef<string>()
  const [options, setOptions] = useState<Common.App.SelectOption[]>([])
  const { errors, isSubmitting, setFieldValue, submitCount, touched, values } = useFormikContext<any>()
  const getInstitutionsListResult = useQuery<{
    getInstitutionsList: Institution[]
  }>(queries.institution.GET_LIST, {
    fetchPolicy: 'no-cache',
  })

  const hasError = (touched[name] !== undefined || submitCount > 0) && Boolean(errors[name])
  const isControlledDisabled = getInstitutionsListResult.loading || isDisabled || isSubmitting
  const maybeError = hasError ? String(errors[name]) : undefined

  const defaultValue = useMemo(() => {
    const currentValue: string | null | undefined = values[name]

    if (currentValue === undefined || currentValue === null) {
      return currentValue
    }

    return options.find(({ value }) => value === currentValue)
  }, [options, values[name]])

  const updateFormikValues = (optionOrOptions: Common.App.SelectOption | Common.App.SelectOption[] | null) => {
    if (Array.isArray(optionOrOptions)) {
      const values = optionOrOptions.map(({ value }) => value)

      setFieldValue(name, values)

      return
    }

    if (optionOrOptions === null) {
      setFieldValue(name, null)

      return
    }

    const { value } = optionOrOptions

    setFieldValue(name, value)
  }

  useEffect(() => {
    if (getInstitutionsListResult.loading) {
      return
    }

    if (getInstitutionsListResult.error) {
      showApolloError(getInstitutionsListResult.error)

      return
    }
    if (getInstitutionsListResult.data === undefined) {
      return
    }

    const newInstitutionsAsOptions = R.map(({ id, name }) => ({
      label: name,
      value: id,
    }))(getInstitutionsListResult.data.getInstitutionsList as any) as Common.App.SelectOption[]

    setOptions(newInstitutionsAsOptions)

    if ($newInstitutionId.current === undefined) {
      return
    }

    setFieldValue(name, $newInstitutionId.current)

    $newInstitutionId.current = undefined
  }, [getInstitutionsListResult.data])

  return (
    <Select
      key={generateKeyFromValues(options, defaultValue)}
      defaultValue={defaultValue}
      error={maybeError}
      helper={helper}
      isClearable
      isDisabled={isControlledDisabled}
      label={label}
      name={name}
      onChange={updateFormikValues as any}
      options={options}
      placeholder={placeholder}
    />
  )
}
