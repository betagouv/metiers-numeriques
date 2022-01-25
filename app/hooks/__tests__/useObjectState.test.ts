/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react-hooks'

import { useObjectState } from '../useObjectState'

describe('app/hooks/useObjectState()', () => {
  test('should update accordingly', () => {
    const renderHookResult = renderHook(() =>
      useObjectState<any>({
        a: 1,
      }),
    )

    const [initialState, setState] = renderHookResult.result.current

    expect(initialState).toStrictEqual({
      a: 1,
    })

    setState({
      b: 2,
    })

    act(() => {
      renderHookResult.rerender()
    })

    const [newState] = renderHookResult.result.current

    expect(newState).toStrictEqual({
      a: 1,
      b: 2,
    })
  })
})
