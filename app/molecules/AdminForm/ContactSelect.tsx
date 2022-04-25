import { useQuery } from '@apollo/client'
import { FieldWithAction } from '@app/atoms/FieldWithAction'
import { generateKeyFromValues } from '@app/helpers/generateKeyFromValues'
import { showApolloError } from '@app/helpers/showApolloError'
import { NewContactModal } from '@app/organisms/NewContactModal'
import { Select } from '@singularity/core'
import { useFormikContext } from 'formik'
import * as R from 'ramda'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import queries from '../../queries'

import type { Contact } from '@prisma/client'

type ContactSelectProps = {
  helper?: string
  isDisabled?: boolean
  isMulti?: boolean
  label: string
  name: string
  placeholder?: string
}

export function ContactSelect({
  helper,
  isDisabled = false,
  isMulti = false,
  label,
  name,
  placeholder,
}: ContactSelectProps) {
  const $newContactId = useRef<string>()
  const [hasNewContactModal, setHasNewContactModal] = useState(false)
  const [options, setOptions] = useState<Common.App.SelectOption[]>([])
  const { errors, isSubmitting, setFieldValue, submitCount, touched, values } = useFormikContext<any>()
  const getContactsListResult = useQuery<{
    getContactsList: Contact[]
  }>(queries.contact.GET_LIST, {
    fetchPolicy: 'no-cache',
  })

  const hasError = (touched[name] !== undefined || submitCount > 0) && Boolean(errors[name])
  const isControlledDisabled = getContactsListResult.loading || isDisabled || isSubmitting
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

  const closeNewContactModal = useCallback(() => {
    setHasNewContactModal(false)
  }, [])

  const handleContactCreation = useCallback(async (newContactId: string) => {
    closeNewContactModal()

    $newContactId.current = newContactId

    await getContactsListResult.refetch()
  }, [])

  const openNewContactModal = useCallback(() => {
    setHasNewContactModal(true)
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
    if (getContactsListResult.loading) {
      return
    }

    if (getContactsListResult.error) {
      showApolloError(getContactsListResult.error)

      return
    }
    if (getContactsListResult.data === undefined) {
      return
    }

    const newContactsAsOptions = R.map(({ email, id, name }) => ({
      label: `${name} (${email})`,
      value: id,
    }))(getContactsListResult.data.getContactsList)

    setOptions(newContactsAsOptions)

    if ($newContactId.current === undefined) {
      return
    }

    if (isMulti) {
      if (defaultValue === undefined || defaultValue === null) {
        setFieldValue(name, [$newContactId.current])
      } else {
        setFieldValue(name, [
          ...(defaultValue as Common.App.SelectOption<string>[]).map(({ value }) => value),
          $newContactId.current,
        ])
      }
    } else {
      setFieldValue(name, $newContactId.current)
    }

    $newContactId.current = undefined
  }, [getContactsListResult.data])

  return (
    <FieldWithAction onClick={openNewContactModal}>
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

      {hasNewContactModal && <NewContactModal onCancel={closeNewContactModal} onCreate={handleContactCreation} />}
    </FieldWithAction>
  )
}
