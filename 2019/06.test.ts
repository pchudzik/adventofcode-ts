import { parsePlanets } from './06';

describe('06.ts', () => {
  const planetSystem1 = parsePlanets([
    'COM)B',
    'B)C',
    'C)D',
    'D)E',
    'E)F',
    'B)G',
    'G)H',
    'D)I',
    'E)J',
    'J)K',
    'K)L',
  ]);

  const planetSystem2 = parsePlanets([
    'COM)B',
    'B)C',
    'C)D',
    'D)E',
    'E)F',
    'B)G',
    'G)H',
    'D)I',
    'E)J',
    'J)K',
    'K)L',
    'K)YOU',
    'I)SAN',
  ])

  it('counts orbits for individual planets', () => {
    expect(planetSystem1.countOrbits('D')).toBe(3);
    expect(planetSystem1.countOrbits('L')).toBe(7);
    expect(planetSystem1.countOrbits('COM')).toBe(0);
  });

  it('counts all orbits', () => {
    expect(planetSystem1.countAllOrbits()).toBe(42);
  });

  it('counts orbit jumps', () => {
    expect(planetSystem2.countOrbitJumps('YOU', 'SAN')).toBe(4);
  });
});
