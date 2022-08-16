import { useQuery } from '@apollo/client'
import { generateKeyFromValues } from '@app/helpers/generateKeyFromValues'
import { showApolloError } from '@app/helpers/showApolloError'
import { queries } from '@app/queries'
import { Select } from '@singularity/core'
import { useFormikContext } from 'formik'
import * as R from 'ramda'
import { useEffect, useMemo, useRef, useState } from 'react'

import type { Profession } from '@prisma/client'

type ProfessionSelectProps = {
  helper?: string
  isDisabled?: boolean
  label: string
  name: string
  onBlur?: (values) => void
  onChange?: (professionId?: string) => void
  placeholder?: string
}

export function ProfessionSelect({
  helper,
  isDisabled = false,
  label,
  name,
  onBlur,
  onChange,
  placeholder,
}: ProfessionSelectProps) {
  const $newProfessionId = useRef<string>()
  const [options, setOptions] = useState<Common.App.SelectOption[]>([])
  const { errors, isSubmitting, setFieldValue, submitCount, touched, values } = useFormikContext<any>()
  const getProfessionsListResult = useQuery<{
    getProfessionsList: Profession[]
  }>(queries.profession.GET_LIST, {
    fetchPolicy: 'no-cache',
  })

  const hasError = (touched[name] !== undefined || submitCount > 0) && Boolean(errors[name])
  const isControlledDisabled = getProfessionsListResult.loading || isDisabled || isSubmitting
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

    const value = optionOrOptions?.value

    setFieldValue(name, value)
    if (onChange) {
      onChange(value)
    }
  }

  useEffect(() => {
    if (getProfessionsListResult.loading) {
      return
    }

    if (getProfessionsListResult.error) {
      showApolloError(getProfessionsListResult.error)

      return
    }
    if (getProfessionsListResult.data === undefined) {
      return
    }

    const newProfessionsAsOptions = R.map(({ id, name }) => ({
      label: name,
      value: id,
    }))(getProfessionsListResult.data.getProfessionsList as any) as Common.App.SelectOption[]

    setOptions(newProfessionsAsOptions)

    if ($newProfessionId.current === undefined) {
      return
    }

    setFieldValue(name, $newProfessionId.current)

    $newProfessionId.current = undefined
  }, [getProfessionsListResult.data])

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
      onBlur={onBlur}
      onChange={updateFormikValues as any}
      options={options}
      placeholder={placeholder}
    />
  )
}
