#!/usr/bin/env ts-node

/*
--- Day 9: Sensor Boost ---

You've just said goodbye to the rebooted rover and left Mars when you receive a faint distress signal coming from the
asteroid belt. It must be the Ceres monitoring station!

In order to lock on to the signal, you'll need to boost your sensors. The Elves send up the latest BOOST program - Basic
Operation Of System Test.

While BOOST (your puzzle input) is capable of boosting your sensors, for tenuous safety reasons, it refuses to do so
until the computer it runs on passes some checks to demonstrate it is a complete Intcode computer.

Your existing Intcode computer is missing one key feature: it needs support for parameters in relative mode.

Parameters in mode 2, relative mode, behave very similarly to parameters in position mode: the parameter is interpreted
as a position. Like position mode, parameters in relative mode can be read from or written to.

The important difference is that relative mode parameters don't count from address 0. Instead, they count from a value
called the relative base. The relative base starts at 0.

The address a relative mode parameter refers to is itself plus the current relative base. When the relative base is 0,
relative mode parameters and position mode parameters with the same value refer to the same address.

For example, given a relative base of 50, a relative mode parameter of -7 refers to memory address 50 + -7 = 43.

The relative base is modified with the relative base offset instruction:

Opcode 9 adjusts the relative base by the value of its only parameter. The relative base increases (or decreases, if the
value is negative) by the value of the parameter.

For example, if the relative base is 2000, then after the instruction 109,19, the relative base would be 2019. If the
next instruction were 204,-34, then the value at address 1985 would be output.

Your Intcode computer will also need a few other capabilities:

The computer's available memory should be much larger than the initial program. Memory beyond the initial program starts
with the value 0 and can be read or written like any other memory. (It is invalid to try to access memory at a negative
address, though.)

The computer should have support for large numbers. Some instructions near the beginning of the BOOST program will
verify this capability.

Here are some example programs that use these features:

109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99 takes no input and produces a copy of itself as output.
1102,34915192,34915192,7,4,7,99,0 should output a 16-digit number.
104,1125899906842624,99 should output the large number in the middle.

The BOOST program will ask for a single input; run it in test mode by providing it the value 1. It will perform a series
of checks on each opcode, output any opcodes (and the associated parameter modes) that seem to be functioning
incorrectly, and finally output a BOOST keycode.

Once your Intcode computer is fully functional, the BOOST program should report no malfunctioning opcodes when run in
test mode; it should only output a single value, the BOOST keycode. What BOOST keycode does it produce?

Your puzzle answer was 2457252183.

--- Part Two ---

You now have a complete Intcode computer.

Finally, you can lock on to the Ceres distress signal! You just need to boost your sensors using the BOOST program.

The program runs in sensor boost mode by providing the input instruction the value 2. Once run, it will boost the
sensors automatically, but it might take a few seconds to complete the operation on slower hardware. In sensor boost
mode, the program will output a single value: the coordinates of the distress signal.

Run the BOOST program in sensor boost mode. What are the coordinates of the distress signal?

Your puzzle answer was 70634.

Both parts of this puzzle are complete! They provide two gold stars: **
 */

import { executeProgram, processor } from './09';

const puzzle = [1102, 34463338, 34463338, 63, 1007, 63, 34463338, 63, 1005, 63, 53, 1102, 1, 3, 1000, 109, 988, 209, 12, 9, 1000, 209, 6, 209, 3, 203, 0, 1008, 1000, 1, 63, 1005, 63, 65, 1008, 1000, 2, 63, 1005, 63, 904, 1008, 1000, 0, 63, 1005, 63, 58, 4, 25, 104, 0, 99, 4, 0, 104, 0, 99, 4, 17, 104, 0, 99, 0, 0, 1101, 36, 0, 1004, 1102, 28, 1, 1003, 1101, 0, 0, 1020, 1102, 22, 1, 1016, 1101, 21, 0, 1015, 1102, 897, 1, 1028, 1101, 0, 815, 1022, 1101, 554, 0, 1027, 1101, 0, 38, 1005, 1102, 33, 1, 1008, 1101, 0, 23, 1018, 1101, 826, 0, 1025, 1101, 0, 30, 1013, 1102, 31, 1, 1017, 1102, 35, 1, 1010, 1102, 1, 34, 1007, 1102, 1, 892, 1029, 1101, 0, 808, 1023, 1102, 29, 1, 1014, 1102, 1, 1, 1021, 1101, 0, 39, 1002, 1101, 0, 561, 1026, 1102, 1, 27, 1009, 1102, 20, 1, 1019, 1102, 37, 1, 1011, 1101, 32, 0, 1000, 1102, 1, 26, 1001, 1101, 0, 25, 1012, 1102, 24, 1, 1006, 1101, 0, 835, 1024, 109, 10, 21108, 40, 41, 4, 1005, 1014, 201, 1001, 64, 1, 64, 1105, 1, 203, 4, 187, 1002, 64, 2, 64, 109, -12, 2101, 0, 9, 63, 1008, 63, 34, 63, 1005, 63, 229, 4, 209, 1001, 64, 1, 64, 1105, 1, 229, 1002, 64, 2, 64, 109, -4, 1202, 8, 1, 63, 1008, 63, 39, 63, 1005, 63, 255, 4, 235, 1001, 64, 1, 64, 1106, 0, 255, 1002, 64, 2, 64, 109, 12, 1201, 2, 0, 63, 1008, 63, 34, 63, 1005, 63, 279, 1001, 64, 1, 64, 1105, 1, 281, 4, 261, 1002, 64, 2, 64, 109, 12, 1206, 2, 299, 4, 287, 1001, 64, 1, 64, 1106, 0, 299, 1002, 64, 2, 64, 109, -21, 1202, 7, 1, 63, 1008, 63, 34, 63, 1005, 63, 319, 1106, 0, 325, 4, 305, 1001, 64, 1, 64, 1002, 64, 2, 64, 109, 5, 1201, -2, 0, 63, 1008, 63, 32, 63, 1005, 63, 347, 4, 331, 1105, 1, 351, 1001, 64, 1, 64, 1002, 64, 2, 64, 109, -2, 1208, 3, 28, 63, 1005, 63, 373, 4, 357, 1001, 64, 1, 64, 1106, 0, 373, 1002, 64, 2, 64, 109, 5, 2107, 28, 4, 63, 1005, 63, 389, 1106, 0, 395, 4, 379, 1001, 64, 1, 64, 1002, 64, 2, 64, 109, 3, 1208, 1, 26, 63, 1005, 63, 415, 1001, 64, 1, 64, 1106, 0, 417, 4, 401, 1002, 64, 2, 64, 109, -5, 2101, 0, 0, 63, 1008, 63, 25, 63, 1005, 63, 441, 1001, 64, 1, 64, 1105, 1, 443, 4, 423, 1002, 64, 2, 64, 109, 14, 1206, 4, 459, 1001, 64, 1, 64, 1105, 1, 461, 4, 449, 1002, 64, 2, 64, 109, -11, 21107, 41, 40, 4, 1005, 1010, 477, 1105, 1, 483, 4, 467, 1001, 64, 1, 64, 1002, 64, 2, 64, 109, 1, 2107, 23, -1, 63, 1005, 63, 501, 4, 489, 1106, 0, 505, 1001, 64, 1, 64, 1002, 64, 2, 64, 109, 1, 1207, -4, 37, 63, 1005, 63, 523, 4, 511, 1106, 0, 527, 1001, 64, 1, 64, 1002, 64, 2, 64, 109, 8, 1205, 5, 545, 4, 533, 1001, 64, 1, 64, 1105, 1, 545, 1002, 64, 2, 64, 109, 14, 2106, 0, -3, 1001, 64, 1, 64, 1106, 0, 563, 4, 551, 1002, 64, 2, 64, 109, -29, 2108, 32, -1, 63, 1005, 63, 585, 4, 569, 1001, 64, 1, 64, 1105, 1, 585, 1002, 64, 2, 64, 109, 19, 21108, 42, 42, -6, 1005, 1014, 603, 4, 591, 1106, 0, 607, 1001, 64, 1, 64, 1002, 64, 2, 64, 109, -12, 1207, -7, 25, 63, 1005, 63, 627, 1001, 64, 1, 64, 1106, 0, 629, 4, 613, 1002, 64, 2, 64, 109, 12, 21102, 43, 1, -7, 1008, 1013, 43, 63, 1005, 63, 655, 4, 635, 1001, 64, 1, 64, 1105, 1, 655, 1002, 64, 2, 64, 109, -11, 21101, 44, 0, 6, 1008, 1015, 46, 63, 1005, 63, 675, 1106, 0, 681, 4, 661, 1001, 64, 1, 64, 1002, 64, 2, 64, 109, -1, 21102, 45, 1, 7, 1008, 1015, 42, 63, 1005, 63, 701, 1106, 0, 707, 4, 687, 1001, 64, 1, 64, 1002, 64, 2, 64, 109, -1, 2102, 1, 2, 63, 1008, 63, 26, 63, 1005, 63, 731, 1001, 64, 1, 64, 1106, 0, 733, 4, 713, 1002, 64, 2, 64, 109, 6, 21107, 46, 47, -2, 1005, 1011, 755, 4, 739, 1001, 64, 1, 64, 1105, 1, 755, 1002, 64, 2, 64, 109, 2, 21101, 47, 0, -2, 1008, 1013, 47, 63, 1005, 63, 777, 4, 761, 1106, 0, 781, 1001, 64, 1, 64, 1002, 64, 2, 64, 109, 10, 1205, -5, 793, 1106, 0, 799, 4, 787, 1001, 64, 1, 64, 1002, 64, 2, 64, 109, -1, 2105, 1, -1, 1001, 64, 1, 64, 1105, 1, 817, 4, 805, 1002, 64, 2, 64, 109, 9, 2105, 1, -9, 4, 823, 1001, 64, 1, 64, 1105, 1, 835, 1002, 64, 2, 64, 109, -36, 2108, 38, 7, 63, 1005, 63, 855, 1001, 64, 1, 64, 1106, 0, 857, 4, 841, 1002, 64, 2, 64, 109, 13, 2102, 1, -6, 63, 1008, 63, 36, 63, 1005, 63, 879, 4, 863, 1106, 0, 883, 1001, 64, 1, 64, 1002, 64, 2, 64, 109, 10, 2106, 0, 8, 4, 889, 1105, 1, 901, 1001, 64, 1, 64, 4, 64, 99, 21101, 0, 27, 1, 21101, 915, 0, 0, 1106, 0, 922, 21201, 1, 49329, 1, 204, 1, 99, 109, 3, 1207, -2, 3, 63, 1005, 63, 964, 21201, -2, -1, 1, 21102, 1, 942, 0, 1105, 1, 922, 21201, 1, 0, -1, 21201, -2, -3, 1, 21102, 957, 1, 0, 1106, 0, 922, 22201, 1, -1, -2, 1105, 1, 968, 22102, 1, -2, -2, 109, -3, 2105, 1, 0];

function part1() {
  return calculate(1)
}

function part2() {
  return calculate(2)
}

function calculate(input: number) {
  const puzzle1 = [...puzzle]
  let result = 0;
  executeProgram(processor(
    puzzle1,
    {
      input,
      output: (val) => {
        console.log(val);
        result = val;
      }
    }
  ));

  return result
}

function main() {
  console.log(`1: ${part1()}`)
  console.log(`2: ${part2()}`)
}

main()
