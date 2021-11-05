import { expect } from '@jest/globals';
import { findAsteroidsEclipses, fireOrder, parsePuzzle, part1, part2 } from './10';

describe('10.ts', () => {
  describe('part1', () => {
    it('sample 1', () => {
      const puzzle = `
        .#..#
        .....
        #####
        ....#
        ...##
      `;

      expect(part1(puzzle)).toBe(8);
    });

    it('sample 2', () => {
      const puzzle = `
        ......#.#.
        #..#.#....
        ..#######.
        .#.#.###..
        .#..#.....
        ..#....#.#
        #..#....#.
        .##.#..###
        ##...#..#.
        .#....####
      `;

      expect(part1(puzzle)).toBe(33);
    });

    it('sample 3', () => {
      const puzzle = `
        #.#...#.#.
        .###....#.
        .#....#...
        ##.#.#.#.#
        ....#.#.#.
        .##..###.#
        ..#...##..
        ..##....##
        ......#...
        .####.###.
      `;

      expect(part1(puzzle)).toBe(35);
    });

    it('sample 4', () => {
      const puzzle = `
        .#..#..###
        ####.###.#
        ....###.#.
        ..###.##.#
        ##.##.#.#.
        ....###..#
        ..#.#..#.#
        #..#.#.###
        .##...##.#
        .....#.#..
      `;

      expect(part1(puzzle)).toBe(41);
    });

    it('sample 5', () => {
      const puzzle = `
        .#..##.###...#######
        ##.############..##.
        .#.######.########.#
        .###.#######.####.#.
        #####.##.#.##.###.##
        ..#####..#.#########
        ####################
        #.####....###.#.#.##
        ##.#################
        #####.##.###..####..
        ..######..##.#######
        ####.##.####...##..#
        .#####..#.######.###
        ##...#.##########...
        #.##########.#######
        .####.#.###.###.#.##
        ....##.##.###..#####
        .#.#.###########.###
        #.#.#.#####.####.###
        ###.##.####.##.#..##
      `;

      expect(part1(puzzle)).toBe(210);
    });
  })

  describe('part 2', () => {
    it('sample 1', () => {
      const puzzle = `
        .#....#####...#..
        ##...##.#####..##
        ##...#...#.#####.
        ..#.....X...###..
        ..#.#.....#....##
      `;

      const parsed = findAsteroidsEclipses(parsePuzzle(puzzle)).filter(([p, _]) => p.x === 8 && p.y === 3)[0]
      const destroyedAsteroids = fireOrder(parsed);

      expect(destroyedAsteroids).toStrictEqual([
        {x: 8, y: 1},   //1
        {x: 9, y: 0},   //2
        {x: 9, y: 1},   //3
        {x: 10, y: 0},  //4
        {x: 9, y: 2},   //5
        {x: 11, y: 1},  //6
        {x: 12, y: 1},  //7
        {x: 11, y: 2},  //8
        {x: 15, y: 1},  //9

        {x: 12, y: 2},  //1
        {x: 13, y: 2},  //2
        {x: 14, y: 2},  //3
        {x: 15, y: 2},  //4
        {x: 12, y: 3},  //5
        {x: 16, y: 4},  //6
        {x: 15, y: 4},  //7
        {x: 10, y: 4},  //8
        {x: 4, y: 4},   //9

        {x: 2, y: 4},   //1
        {x: 2, y: 3},   //2
        {x: 0, y: 2},   //3
        {x: 1, y: 2},   //4
        {x: 0, y: 1},   //5
        {x: 1, y: 1},   //6
        {x: 5, y: 2},   //7
        {x: 1, y: 0},   //8
        {x: 5, y: 1},   //9

        {x: 6, y: 1},   //1
        {x: 6, y: 0},   //2
        {x: 7, y: 0},   //3
        {x: 8, y: 0},   //4
        {x: 10, y: 1},   //5
        {x: 14, y: 0},   //6
        {x: 16, y: 1},   //7
        {x: 13, y: 3},   //8
        {x: 14, y: 3},   //9
      ]);
    });


    it('part2 sample 2', () => {
      const puzzle = `
      .#..##.###...#######
      ##.############..##.
      .#.######.########.#
      .###.#######.####.#.
      #####.##.#.##.###.##
      ..#####..#.#########
      ####################
      #.####....###.#.#.##
      ##.#################
      #####.##.###..####..
      ..######..##.#######
      ####.##.####...##..#
      .#####..#.######.###
      ##...#.##########...
      #.##########.#######
      .####.#.###.###.#.##
      ....##.##.###..#####
      .#.#.###########.###
      #.#.#.#####.####.###
      ###.##.####.##.#..##
    `;

      const destroyedAsteroids = part2(puzzle);

      expect(destroyedAsteroids[0]).toStrictEqual({x: 11, y: 12})
      expect(destroyedAsteroids[1]).toStrictEqual({x: 12, y: 1})
      expect(destroyedAsteroids[2]).toStrictEqual({x: 12, y: 2})

      expect(destroyedAsteroids[9]).toStrictEqual({x: 12, y: 8})
      expect(destroyedAsteroids[19]).toStrictEqual({x: 16, y: 0})
      expect(destroyedAsteroids[49]).toStrictEqual({x: 16, y: 9})
      expect(destroyedAsteroids[99]).toStrictEqual({x: 10, y: 16})
      expect(destroyedAsteroids[198]).toStrictEqual({x: 9, y: 6})
      expect(destroyedAsteroids[199]).toStrictEqual({x: 8, y: 2})
      expect(destroyedAsteroids[200]).toStrictEqual({x: 10, y: 9})
      expect(destroyedAsteroids[298]).toStrictEqual({x: 11, y: 1})
    });
  });
});
