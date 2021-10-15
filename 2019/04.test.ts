import { expect } from '@jest/globals';
import { part1IsValidPassword, part2IsValidPassword } from './04';

describe('04.ts', () => {
  it('validates password 1', () => {
    expect(part1IsValidPassword('111111')).toBe(true)
    expect(part1IsValidPassword('300000')).toBe(false)
    expect(part1IsValidPassword('223450')).toBe(false)
    expect(part1IsValidPassword('123789')).toBe(false)
  })

  it('validates password 2', () => {
    expect(part2IsValidPassword('112233')).toBe(true)
    expect(part2IsValidPassword('111122')).toBe(true)
    expect(part2IsValidPassword('123444')).toBe(false)
  })
})
