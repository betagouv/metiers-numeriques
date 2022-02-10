import { useQuery } from '@apollo/client'
import { FieldWithAction } from '@app/atoms/FieldWithAction'
import generateKeyFromValue from '@app/helpers/generateKeyFromValue'
import { showApolloError } from '@app/helpers/showApolloError'
import { NewProfessionModal } from '@app/organisms/NewProfessionModal'
import { Select } from '@singularity/core'
import { useFormikContext } from 'formik'
import * as R from 'ramda'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import queries from '../../queries'

type ProfessionSelectProps = {
  helper?: string
  isDisabled?: boolean
  isMulti?: boolean
  label: string
  name: string
  placeholder?: string
}

export function ProfessionSelect({
  helper,
  isDisabled = false,
  isMulti = false,
  label,
  name,
  placeholder,
}: ProfessionSelectProps) {
  const $newProfessionId = useRef<string>()
  const [hasNewProfessionModal, setHasNewProfessionModal] = useState(false)
  const [options, setOptions] = useState<Common.App.SelectOption[]>([])
  const { errors, isSubmitting, setFieldValue, submitCount, touched, values } = useFormikContext<any>()
  const getProfessionsListResult = useQuery(queries.profession.GET_LIST)

  const hasError = (touched[name] !== undefined || submitCount > 0) && Boolean(errors[name])
  const isControlledDisabled = getProfessionsListResult.loading || isDisabled || isSubmitting
  const maybeError = hasError ? String(errors[name]) : undefined

  const defaultValue = useMemo(() => {
    const valueOrValues: string | string[] | null | undefined = values[name]

    if (valueOrValues === undefined || valueOrValues === null) {
      return valueOrValues
    }

    if (Array.isArray(valueOrValues)) {
      return valueOrValues
        .map(value => options.find(option => option.value === value))
        .filter(value => value !== undefined) as Common.App.SelectOption[]
    }

    return options.find(({ value }) => value === valueOrValues)
  }, [values[name]])

  const closeNewProfessionModal = useCallback(() => {
    setHasNewProfessionModal(false)
  }, [])

  const handleProfessionCreation = useCallback(async (newProfessionId: string) => {
    closeNewProfessionModal()

    $newProfessionId.current = newProfessionId

    await getProfessionsListResult.refetch()
  }, [])

  const openNewProfessionModal = useCallback(() => {
    setHasNewProfessionModal(true)
  }, [])

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
    if (getProfessionsListResult.loading) {
      return
    }

    if (getProfessionsListResult.error) {
      showApolloError(getProfessionsListResult.error)

      return
    }

    const newProfessionsAsOptions = R.map(({ id, name }) => ({
      label: name,
      value: id,
    }))(getProfessionsListResult.data.getProfessionsList)

    setOptions(newProfessionsAsOptions)

    if ($newProfessionId.current === undefined) {
      return
    }

    if (isMulti) {
      if (defaultValue === undefined || defaultValue === null) {
        setFieldValue(name, [$newProfessionId.current])
      } else {
        setFieldValue(name, [...(defaultValue as Common.App.SelectOption<string>[]), $newProfessionId.current])
      }
    } else {
      setFieldValue(name, $newProfessionId.current)
    }

    $newProfessionId.current = undefined
  }, [getProfessionsListResult.data])

  return (
    <FieldWithAction onClick={openNewProfessionModal}>
      <Select
        key={generateKeyFromValue(values[name])}
        defaultValue={defaultValue}
        error={maybeError}
        helper={helper}
        isClearable
        isDisabled={isControlledDisabled}
        isMulti={isMulti}
        label={label}
        name={name}
        onChange={updateFormikValues}
        options={options}
        placeholder={placeholder}
      />

      {hasNewProfessionModal && (
        <NewProfessionModal onCancel={closeNewProfessionModal} onCreate={handleProfessionCreation} />
      )}
    </FieldWithAction>
  )
}
