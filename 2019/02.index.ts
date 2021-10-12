#!/usr/bin/env ts-node

import { computer, ProgramStep } from './02';

const puzzle = [1, 0, 0, 3, 1, 1, 2, 3, 1, 3, 4, 3, 1, 5, 0, 3, 2, 13, 1, 19, 1, 10, 19, 23, 1, 6, 23, 27, 1, 5, 27, 31, 1, 10, 31, 35, 2, 10, 35, 39, 1, 39, 5, 43, 2, 43, 6, 47, 2, 9, 47, 51, 1, 51, 5, 55, 1, 5, 55, 59, 2, 10, 59, 63, 1, 5, 63, 67, 1, 67, 10, 71, 2, 6, 71, 75, 2, 6, 75, 79, 1, 5, 79, 83, 2, 6, 83, 87, 2, 13, 87, 91, 1, 91, 6, 95, 2, 13, 95, 99, 1, 99, 5, 103, 2, 103, 10, 107, 1, 9, 107, 111, 1, 111, 6, 115, 1, 115, 2, 119, 1, 119, 10, 0, 99, 2, 14, 0, 0];

function part1() {
  return calculate(12, 2)
}

function calculate(noun: number, verb: number) {
  const puzzle1 = [...puzzle]
  puzzle1[1] = noun
  puzzle1[2] = verb
  const program = computer(new ProgramStep(
    true,
    0,
    puzzle1
  ));

  return program.program[0];
}

function part2() {
  const expectedResult = 19690720
  for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
      const result = calculate(i, j)
      if (result == expectedResult) {
        return 100 * i + j;
      }
    }
  }
}

function main() {
  console.log(`1: ${part1()}`)
  console.log(`2: ${part2()}`)
}

main()
