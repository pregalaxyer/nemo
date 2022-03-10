import {
  RESERVED_WORDS,
  VARIABLES_ILLEGAL_REG,
  VARIABLES_SEPARATOR,
} from './const'

it('reserved words should include delete ', () => {
  expect(RESERVED_WORDS).toContain('delete')
})

it('variables illegal reg should match "-"', () => {
  expect(VARIABLES_ILLEGAL_REG.test('user-name')).toBe(true)
})

it('legal separator is "_" ', () => {
  expect(VARIABLES_SEPARATOR).toBe('_')
})
