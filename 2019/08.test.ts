import { countDigits, flatten, partitionToLayers } from './08';
import { expect } from '@jest/globals';
import { main } from './08.index';

describe('08.ts', () => {
  const puzzle = '123456789012'.split('').map(s => parseInt(s));

  it('splits input into layers', () => {
    const partitioned = partitionToLayers([...puzzle], 3, 2);

    expect(partitioned).toStrictEqual([
      [[1, 2, 3], [4, 5, 6]],
      [[7, 8, 9], [0, 1, 2]]
    ]);
  });

  it('flattens layers', () => {
    const flatLayers = partitionToLayers([...puzzle], 3, 2).map(flatten);

    expect(flatLayers).toStrictEqual([
      [1, 2, 3, 4, 5, 6],
      [7, 8, 9, 0, 1, 2]
    ]);
  });

  describe('digits count', () => {
    it('includes count for 0, 1 and 2', () => {
      const counted = countDigits([]);

      expect(counted).toStrictEqual({
        0: 0,
        1: 0,
        2: 0
      });
    });

    it('counts digits in array', () => {
      const array = [1, 2, 2, 0, 0, 0];

      const counted = countDigits(array);

      expect(counted).toStrictEqual({
        1: 1,
        2: 2,
        0: 3
      });
    });
  });
})
