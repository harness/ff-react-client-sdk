import { createContext } from 'react'
import { renderHook, RenderHookResult } from '@testing-library/react'
import { useFeatureFlags } from '../useFeatureFlags'
import { FFContext } from '../../context/FFContext'

jest.mock('../../context/FFContext', () => ({
  FFContext: createContext({ flags: {} })
}))

const renderUseFeatureFlagsHook = (
  args: Parameters<typeof useFeatureFlags>,
  flags: Record<string, any>
): RenderHookResult<Record<string, any>, any> =>
  renderHook((args) => useFeatureFlags(...args), {
    initialProps: args,
    wrapper: ({ children }) => (
      <FFContext.Provider value={{ flags, loading: false }}>
        {children}
      </FFContext.Provider>
    )
  })

describe('useFeatureFlags', () => {
  describe('using an object of key/default mapping', () => {
    test('it should return the values if flag identifiers are known', async () => {
      const flags: Record<string, any> = {
        flag1: 'flag1Value',
        flag2: 'flag2Value',
        flag3: 'flag3Value'
      }

      const input = {
        flag1: 'defaultFlag1Value',
        flag2: 'defaultFlag2Value'
      }

      const { result } = renderUseFeatureFlagsHook([input], flags)

      expect(Object.keys(result.current)).toEqual(Object.keys(input))
      Object.keys(input).forEach((flagIdentifier) => {
        expect(result.current).toHaveProperty(
          flagIdentifier,
          flags[flagIdentifier]
        )
      })
    })

    test('it should return the defaults if flag identifiers are not known', async () => {
      const flags: Record<string, any> = {
        flag1: 'flag1Value',
        flag2: 'flag2Value',
        flag3: 'flag3Value'
      }

      const input: Record<string, any> = {
        flagA: 'defaultFlag1Value',
        flagB: 'defaultFlag2Value'
      }

      const { result } = renderUseFeatureFlagsHook([input], flags)

      expect(Object.keys(result.current)).toEqual(Object.keys(input))
      Object.entries(input).forEach(([flagIdentifier, flagValue]) => {
        expect(result.current).toHaveProperty(flagIdentifier, flagValue)
      })
    })
  })

  describe('using an array of keys', () => {
    test('it should return the values if flag identifiers are known', async () => {
      const flags: Record<string, any> = {
        flag1: 'flag1Value',
        flag2: 'flag2Value',
        flag3: 'flag3Value'
      }

      const input = ['flag1', 'flag2']

      const { result } = renderUseFeatureFlagsHook([input], flags)

      expect(Object.keys(result.current)).toHaveLength(input.length)
      input.forEach((flagIdentifier) => {
        expect(result.current).toHaveProperty(
          flagIdentifier,
          flags[flagIdentifier]
        )
      })
    })

    test('it should return undefined as the default if flag identifiers are not known', async () => {
      const flags: Record<string, any> = {
        flag1: 'flag1Value',
        flag2: 'flag2Value',
        flag3: 'flag3Value'
      }

      const input = ['flagA', 'flagB']

      const { result } = renderUseFeatureFlagsHook([input], flags)

      expect(Object.keys(result.current)).toHaveLength(input.length)
      input.forEach((flagIdentifier) => {
        expect(result.current).toHaveProperty(flagIdentifier, undefined)
      })
    })
  })

  test('it should return all known flags when no arguments are passed', async () => {
    const flags: Record<string, any> = {
      flag1: 'flag1Value',
      flag2: 'flag2Value',
      flag3: 'flag3Value'
    }

    const { result } = renderUseFeatureFlagsHook([], flags)

    expect(result.current).toEqual(flags)
  })
})
