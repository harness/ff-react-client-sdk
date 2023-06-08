import { renderHook, RenderHookResult } from '@testing-library/react'
import { useFeatureFlag } from '../useFeatureFlag'
import { TestWrapper } from '../../test-utils/TestWrapper'

const renderUseFeatureFlagHook = (
  args: Parameters<typeof useFeatureFlag>,
  flags: Record<string, any>
): RenderHookResult<any, any> =>
  renderHook((args) => useFeatureFlag(...args), {
    initialProps: args,
    wrapper: ({ children }) => (
      <TestWrapper flags={flags}>{children}</TestWrapper>
    )
  })

describe('useFeatureFlag', () => {
  test('it should return the value if flag identifier is known', async () => {
    const flagIdentifier = 'knownFlag'
    const flagValue = 'test value'

    const { result } = renderUseFeatureFlagHook([flagIdentifier, 'default'], {
      [flagIdentifier]: flagValue
    })

    expect(result.current).toBe(flagValue)
  })

  test('it should return the passed default value if flag identifier is not known', async () => {
    const defaultValue = 'DEFAULT'

    const { result } = renderUseFeatureFlagHook(
      ['unknownFlag', defaultValue],
      {}
    )

    expect(result.current).toBe(defaultValue)
  })

  test('it should return undefined if flag identifier is not known and a default value is not set', async () => {
    const { result } = renderUseFeatureFlagHook(['unknownFlag'], {})

    expect(result.current).toBeUndefined()
  })
})
