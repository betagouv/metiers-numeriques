import { useQuery } from '@apollo/client'
import { FieldWithAction } from '@app/atoms/FieldWithAction'
import { generateKeyFromValues } from '@app/helpers/generateKeyFromValues'
import { showApolloError } from '@app/helpers/showApolloError'
import { NewRecruiterModal } from '@app/organisms/NewRecruiterModal'
import { Select } from '@singularity/core'
import { useFormikContext } from 'formik'
import * as R from 'ramda'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import queries from '../../queries'

type RecruiterSelectProps = {
  helper?: string
  institutionId?: string
  isDisabled?: boolean
  isMulti?: boolean
  label: string
  name: string
  placeholder?: string
}

export function RecruiterSelect({
  helper,
  institutionId,
  isDisabled = false,
  isMulti = false,
  label,
  name,
  placeholder,
}: RecruiterSelectProps) {
  const $newRecruiterId = useRef<string>()
  const [hasNewRecruiterModal, setHasNewRecruiterModal] = useState(false)
  const [options, setOptions] = useState<Common.App.SelectOption[]>([])
  const { errors, isSubmitting, setFieldValue, submitCount, touched, values } = useFormikContext<any>()
  const getRecruitersListResult = useQuery(queries.recruiter.GET_LIST, {
    fetchPolicy: 'no-cache',
    variables: {
      institutionId,
    },
  })

  const hasError = (touched[name] !== undefined || submitCount > 0) && Boolean(errors[name])
  const isControlledDisabled = getRecruitersListResult.loading || isDisabled || isSubmitting
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
  }, [options, values[name]])

  const closeNewRecruiterModal = useCallback(() => {
    setHasNewRecruiterModal(false)
  }, [])

  const handleRecruiterCreation = useCallback(async (newRecruiterId: string) => {
    closeNewRecruiterModal()

    $newRecruiterId.current = newRecruiterId

    await getRecruitersListResult.refetch()
  }, [])

  const openNewRecruiterModal = useCallback(() => {
    setHasNewRecruiterModal(true)
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
    if (getRecruitersListResult.loading) {
      return
    }

    if (getRecruitersListResult.error) {
      showApolloError(getRecruitersListResult.error)

      return
    }

    const newRecruitersAsOptions = R.map(({ id, name }) => ({
      label: name,
      value: id,
    }))(getRecruitersListResult.data.getRecruitersList)

    setOptions(newRecruitersAsOptions)

    if ($newRecruiterId.current === undefined) {
      return
    }

    if (isMulti) {
      if (defaultValue === undefined || defaultValue === null) {
        setFieldValue(name, [$newRecruiterId.current])
      } else {
        setFieldValue(name, [...(defaultValue as Common.App.SelectOption<string>[]), $newRecruiterId.current])
      }
    } else {
      setFieldValue(name, $newRecruiterId.current)
    }

    $newRecruiterId.current = undefined
  }, [getRecruitersListResult.data])

  return (
    <FieldWithAction onClick={openNewRecruiterModal}>
      <Select
        key={generateKeyFromValues(options, defaultValue)}
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

      {hasNewRecruiterModal && (
        <NewRecruiterModal onCancel={closeNewRecruiterModal} onCreate={handleRecruiterCreation} />
      )}
    </FieldWithAction>
  )
}
