import { useCallback, useState } from 'react'

export function useObjectState<T extends Common.Pojo>(initialState: T): [T, (newPartialState: Partial<T>) => void] {
  const [state, setState] = useState<T>(initialState)

  const updateState = useCallback(
    (newPartialState: Partial<T>) => {
      setState({
        ...state,
        ...newPartialState,
      })
    },
    [state],
  )

  return [state, updateState]
}
