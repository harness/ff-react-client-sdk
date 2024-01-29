import { renderHook, RenderHookResult } from '@testing-library/react'
import { TestWrapper } from '../../test-utils'
import { useFeatureFlagsClient } from '../useFeatureFlagsClient'
import { FFContextValue } from '../../context/FFContext'

const renderUseFeatureFlagsClientHook = (): RenderHookResult<
  FFContextValue['client'],
  any
> =>
  renderHook(() => useFeatureFlagsClient(), {
    wrapper: ({ children }) => <TestWrapper flags={{}}>{children}</TestWrapper>
  })

describe('useFeatureFlagsClient', () => {
  test('it should return the client', async () => {
    const { result } = renderUseFeatureFlagsClientHook()

    expect(result.current).toHaveProperty('variation')
  })
})
