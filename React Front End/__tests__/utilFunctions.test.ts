import { conversion, isValidDecimal } from '../util/utilFunctions'

test('single conversion are inverses', () => {
  const numbers = Array.from(Array(36).keys())
  expect(numbers).toEqual(numbers.map(n =>  conversion.singleAlphanumToNum(conversion.singleToAlphanum(n))))
})


describe('decimal regex', () => {
  test('with a leading decimal point is valid', () => {
    expect(isValidDecimal('.9')).toEqual(true)
    expect(isValidDecimal('.5')).toEqual(true)
    expect(isValidDecimal('.0')).toEqual(true)
  })

  test('with a trailing decimal point is valid', () => {
    expect(isValidDecimal('9.')).toEqual(true)
    expect(isValidDecimal('5.')).toEqual(true)
    expect(isValidDecimal('0.')).toEqual(true)
  })

  test('with a sandwiched decimal point is valid', () => {
    expect(isValidDecimal('9.9')).toEqual(true)
    expect(isValidDecimal('5.5')).toEqual(true)
    expect(isValidDecimal('0.0')).toEqual(true)
  })

  test('with a single digit and no decimal point is valid', () => {
    expect(isValidDecimal('9')).toEqual(true)
    expect(isValidDecimal('5')).toEqual(true)
    expect(isValidDecimal('0')).toEqual(true)
  })

  test('with only a single decimal point is invalid', () => {
    expect(isValidDecimal('.')).toEqual(false)
  })

  test('with multiple decimal points is invalid', () => {
    expect(isValidDecimal('..')).toEqual(false)
    expect(isValidDecimal('.0.')).toEqual(false)
    expect(isValidDecimal('0..')).toEqual(false)
    expect(isValidDecimal('..0')).toEqual(false)
    expect(isValidDecimal('0.0.')).toEqual(false)
    expect(isValidDecimal('0..0')).toEqual(false)
    expect(isValidDecimal('.0.0')).toEqual(false)
    expect(isValidDecimal('0.0.0')).toEqual(false)
  })
})
