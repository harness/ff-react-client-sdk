import { getFlagsSubset } from '../getFlagsSubset'

describe('getFlagsSubset', () => {
  const allFlags = {
    f1: 'f1',
    f2: 'f2',
    f3: 'f3'
  }

  test('it should return only the named flags passed as an array', async () => {
    const result = getFlagsSubset(allFlags, ['f1', 'f3'])

    expect(Object.keys(result)).toHaveLength(2)
    expect(result).toHaveProperty('f1', allFlags.f1)
    expect(result).toHaveProperty('f3', allFlags.f3)
    expect(result).not.toHaveProperty('f2')
  })

  test('it should return only the named flags passed as an object with default values', async () => {
    const result = getFlagsSubset(allFlags, { f1: 'f1', f3: 'f3' })

    expect(Object.keys(result)).toHaveLength(2)
    expect(result).toHaveProperty('f1', allFlags.f1)
    expect(result).toHaveProperty('f3', allFlags.f3)
    expect(result).not.toHaveProperty('f2')
  })

  test('it should use the default value of unknown flags passed as an object', async () => {
    const result = getFlagsSubset(allFlags, { somethingElse: 123 })

    expect(Object.keys(result)).toHaveLength(1)
    expect(result).toHaveProperty('somethingElse', 123)
  })

  test('it should use undefined as the default value of unknown flags passed as an array', async () => {
    const result = getFlagsSubset(allFlags, ['somethingElse'])

    expect(Object.keys(result)).toHaveLength(1)
    expect(result).toHaveProperty('somethingElse', undefined)
  })
})
