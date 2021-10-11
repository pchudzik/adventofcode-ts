import { getFuel, getFuel2 } from './01';

describe('01.test.ts', () => {
  [
    [12, 2],
    [14, 2],
    [1969, 654],
    [100756, 33583]
  ].forEach(([mass, expectedFuel]) => {
    test(`${expectedFuel} units of fuel are required for mass of ${mass}`, () => {
      expect(getFuel(mass)).toBe(expectedFuel)
    });
  });

  [
    [14, 2],
    [1969, 966],
    [100756, 50346],
  ].forEach(([mass, expectedFuel]) => {
    test(`${expectedFuel} units of fuel are required for mass ${mass} including fuel mass`, () => {
      expect(getFuel2(mass)).toBe(expectedFuel);
    });
  });
});

export {};
