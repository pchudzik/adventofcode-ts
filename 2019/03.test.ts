import { findCutPoints, part1, part2, pathPloter } from './03';
import { expect } from '@jest/globals';

describe('03.ts', () => {
  it('moves up', () => {
    //when
    const path = pathPloter(['U3'])

    //then
    expect(path).toStrictEqual([
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
    ]);
  });

  it('moves down', () => {
    //when
    const path = pathPloter(['D3'])

    //then
    expect(path).toStrictEqual([
      [0, 0],
      [0, -1],
      [0, -2],
      [0, -3],
    ]);
  });

  it('moves left', () => {
    //when
    const path = pathPloter(['L3'])

    //then
    expect(path).toStrictEqual([
      [0, 0],
      [-1, 0],
      [-2, 0],
      [-3, 0],
    ]);
  });

  it('moves right', () => {
    //when
    const path = pathPloter(['R3'])

    //then
    expect(path).toStrictEqual([
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
    ]);
  });

  it('plot path', () => {
    //when
    const path = pathPloter(['R3', 'L3', 'U3', 'D3'])

    //then
    expect(path).toStrictEqual([
      [0, 0],
      [1, 0], [2, 0], [3, 0],
      [2, 0], [1, 0], [0, 0],
      [0, 1], [0, 2], [0, 3],
      [0, 2], [0, 1], [0, 0],
    ]);
  })

  it('finds cut points from path', () => {
    //when
    //then
    expect(
      findCutPoints(
        pathPloter(['R8', 'U5', 'L5', 'D3']),
        pathPloter(['U7', 'R6', 'D4', 'L4'])))
      .toStrictEqual([
        [6, 5],
        [3, 3]
      ]);

    //when
    expect(
      findCutPoints(
        pathPloter(['R3', 'U3', 'L3', 'D3']),
        pathPloter(['D1', 'R1', 'U2'])
      ))
      .toStrictEqual([
        [1, 0]
      ]);
  });


  it('solves puzzle', () => {
    expect(part1(
      ['R8', 'U5', 'L5', 'D3'],
      ['U7', 'R6', 'D4', 'L4']
    )).toBe(6);

    expect(part1(
      ['R75', 'D30', 'R83', 'U83', 'L12', 'D49', 'R71', 'U7', 'L72'],
      ['U62', 'R66', 'U55', 'R34', 'D71', 'R55', 'D58', 'R83']
    )).toBe(159);

    expect(part1(
      ['R98', 'U47', 'R26', 'D63', 'R33', 'U87', 'L62', 'D20', 'R33', 'U53', 'R51'],
      ['U98', 'R91', 'D20', 'R16', 'D67', 'R40', 'U7', 'R15', 'U6', 'R7']
    )).toBe(135);
  });

  it('calculates number of steps', () => {
    expect(part2(
      ['R8', 'U5', 'L5', 'D3'],
      ['U7', 'R6', 'D4', 'L4']
    )).toBe(30);

    expect(part2(
      ['R75', 'D30', 'R83', 'U83', 'L12', 'D49', 'R71', 'U7', 'L72'],
      ['U62', 'R66', 'U55', 'R34', 'D71', 'R55', 'D58', 'R83']
    )).toBe(610);

    expect(part2(
      ['R98', 'U47', 'R26', 'D63', 'R33', 'U87', 'L62', 'D20', 'R33', 'U53', 'R51'],
      ['U98', 'R91', 'D20', 'R16', 'D67', 'R40', 'U7', 'R15', 'U6', 'R7']
    )).toBe(410);
  });
});
