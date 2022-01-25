/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react-hooks'

import { useIsMounted } from '../useIsMounted'

describe('app/hooks/useIsMounted()', () => {
  test('returns TRUE with a mounted component', () => {
    const renderHookResult = renderHook(() => useIsMounted())

    const result = renderHookResult.result.current()

    expect(result).toStrictEqual(true)
  })

  test('returns FALSE with an unmounted component', () => {
    const renderHookResult = renderHook(() => useIsMounted())

    act(() => {
      renderHookResult.unmount()
    })

    const result = renderHookResult.result.current()

    expect(result).toStrictEqual(false)
  })
})
