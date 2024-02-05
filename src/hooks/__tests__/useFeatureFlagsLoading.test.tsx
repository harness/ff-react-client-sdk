import { renderHook, RenderHookResult } from '@testing-library/react'
import { TestWrapper } from '../../test-utils'
import { useFeatureFlagsLoading } from '../useFeatureFlagsLoading'

const renderUseFeatureFlagsLoadingHook = (
  loading = false
): RenderHookResult<boolean, any> =>
  renderHook(() => useFeatureFlagsLoading(), {
    wrapper: ({ children }) => (
      <TestWrapper flags={{}} loading={loading}>
        {children}
      </TestWrapper>
    )
  })

describe('useFeatureFlagsLoading', () => {
  test('it should return true when feature flags are loading', async () => {
    const { result } = renderUseFeatureFlagsLoadingHook(true)

    expect(result.current).toEqual(true)
  })

  test('it should return false when feature flags are not loading', async () => {
    const { result } = renderUseFeatureFlagsLoadingHook(false)

    expect(result.current).toEqual(false)
  })
})
