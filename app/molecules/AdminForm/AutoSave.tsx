import { useFormikContext } from 'formik'
import debounce from 'lodash.debounce'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

const Box = styled.div`
  align-items: center;
  background-color: gray;
  border-radius: 0.33rem;
  display: flex;
  padding: 0.25rem 0.5rem 0.5rem;
  opacity: 0.65;
  position: fixed;
  right: 1rem;
  top: 1rem;
  z-index: 1;

  > span {
    color: white;
    line-height: 1;
    padding-top: 0.125rem;
  }
`

const Spinner = styled.div`
  display: inline-block;
  height: 1rem;
  margin-right: 1rem;
  width: 1rem;

  :after {
    content: ' ';
    display: block;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    border: 0.125rem solid white;
    border-color: white transparent white transparent;
    animation: spin 1.2s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

type AutoSaveProps = {
  onChange: (values: Record<string, any>) => Promise<void>
}

export function AutoSave({ onChange }: AutoSaveProps) {
  const { values } = useFormikContext<any>()
  const [isSaving, setIsSaving] = useState(false)

  const handleOnChange = useCallback(
    debounce(async () => {
      setIsSaving(true)

      await onChange(values)

      setIsSaving(false)
    }, 500),
    [values],
  )

  useEffect(() => {
    handleOnChange()
  }, [values])

  if (!isSaving) {
    return null
  }

  return (
    <Box>
      <Spinner />
      <span>Sauvegarde…</span>
    </Box>
  )
}
