#!/usr/bin/env ts-node

/*
--- Day 13: Care Package ---

As you ponder the solitude of space and the ever-increasing three-hour roundtrip for messages between you and Earth, you
notice that the Space Mail Indicator Light is blinking. To help keep you sane, the Elves have sent you a care package.

It's a new game for the ship's arcade cabinet! Unfortunately, the arcade is all the way on the other end of the ship.
Surely, it won't be hard to build your own - the care package even comes with schematics.

The arcade cabinet runs Intcode software like the game the Elves sent (your puzzle input). It has a primitive screen
capable of drawing square tiles on a grid. The software draws tiles to the screen with output instructions: every three
output instructions specify the x position (distance from the left), y position (distance from the top), and tile id.
The tile id is interpreted as follows:

0 is an empty tile. No game object appears in this tile.
1 is a wall tile. Walls are indestructible barriers.
2 is a block tile. Blocks can be broken by the ball.
3 is a horizontal paddle tile. The paddle is indestructible.
4 is a ball tile. The ball moves diagonally and bounces off objects.

For example, a sequence of output values like 1,2,3,6,5,4 would draw a horizontal paddle tile (1 tile from the left and
2 tiles from the top) and a ball tile (6 tiles from the left and 5 tiles from the top).

Start the game. How many block tiles are on the screen when the game exits?

Your puzzle answer was 301.

--- Part Two ---

The game didn't run because you didn't put in any quarters. Unfortunately, you did not bring any quarters. Memory
address 0 represents the number of quarters that have been inserted; set it to 2 to play for free.

The arcade cabinet has a joystick that can move left and right. The software reads the position of the joystick with
input instructions:

If the joystick is in the neutral position, provide 0.
If the joystick is tilted to the left, provide -1.
If the joystick is tilted to the right, provide 1.

The arcade cabinet also has a segment display capable of showing a single number that represents the player's current
score. When three output instructions specify X=-1, Y=0, the third output instruction is not a tile; the value instead
specifies the new score to show in the segment display. For example, a sequence of output values like -1,0,12345 would
show 12345 as the player's current score.

Beat the game by breaking all the blocks. What is your score after the last block is broken?

Your puzzle answer was 14096.

Both parts of this puzzle are complete! They provide two gold stars: **
 */

import { part1, part2 } from './13';

const puzzlePart1 = [1, 380, 379, 385, 1008, 2235, 854990, 381, 1005, 381, 12, 99, 109, 2236, 1101, 0, 0, 383, 1102, 1, 0, 382, 20101, 0, 382, 1, 20102, 1, 383, 2, 21102, 1, 37, 0, 1106, 0, 578, 4, 382, 4, 383, 204, 1, 1001, 382, 1, 382, 1007, 382, 38, 381, 1005, 381, 22, 1001, 383, 1, 383, 1007, 383, 21, 381, 1005, 381, 18, 1006, 385, 69, 99, 104, -1, 104, 0, 4, 386, 3, 384, 1007, 384, 0, 381, 1005, 381, 94, 107, 0, 384, 381, 1005, 381, 108, 1106, 0, 161, 107, 1, 392, 381, 1006, 381, 161, 1102, 1, -1, 384, 1106, 0, 119, 1007, 392, 36, 381, 1006, 381, 161, 1101, 0, 1, 384, 20102, 1, 392, 1, 21101, 19, 0, 2, 21101, 0, 0, 3, 21101, 0, 138, 0, 1106, 0, 549, 1, 392, 384, 392, 21001, 392, 0, 1, 21101, 19, 0, 2, 21102, 1, 3, 3, 21102, 1, 161, 0, 1105, 1, 549, 1102, 1, 0, 384, 20001, 388, 390, 1, 21002, 389, 1, 2, 21102, 1, 180, 0, 1106, 0, 578, 1206, 1, 213, 1208, 1, 2, 381, 1006, 381, 205, 20001, 388, 390, 1, 20101, 0, 389, 2, 21102, 1, 205, 0, 1106, 0, 393, 1002, 390, -1, 390, 1101, 1, 0, 384, 20102, 1, 388, 1, 20001, 389, 391, 2, 21101, 0, 228, 0, 1105, 1, 578, 1206, 1, 261, 1208, 1, 2, 381, 1006, 381, 253, 20102, 1, 388, 1, 20001, 389, 391, 2, 21101, 253, 0, 0, 1106, 0, 393, 1002, 391, -1, 391, 1101, 1, 0, 384, 1005, 384, 161, 20001, 388, 390, 1, 20001, 389, 391, 2, 21102, 1, 279, 0, 1105, 1, 578, 1206, 1, 316, 1208, 1, 2, 381, 1006, 381, 304, 20001, 388, 390, 1, 20001, 389, 391, 2, 21101, 0, 304, 0, 1105, 1, 393, 1002, 390, -1, 390, 1002, 391, -1, 391, 1101, 1, 0, 384, 1005, 384, 161, 21002, 388, 1, 1, 21002, 389, 1, 2, 21101, 0, 0, 3, 21102, 1, 338, 0, 1106, 0, 549, 1, 388, 390, 388, 1, 389, 391, 389, 20101, 0, 388, 1, 21002, 389, 1, 2, 21102, 1, 4, 3, 21102, 365, 1, 0, 1106, 0, 549, 1007, 389, 20, 381, 1005, 381, 75, 104, -1, 104, 0, 104, 0, 99, 0, 1, 0, 0, 0, 0, 0, 0, 301, 17, 16, 1, 1, 19, 109, 3, 22102, 1, -2, 1, 22101, 0, -1, 2, 21101, 0, 0, 3, 21102, 414, 1, 0, 1106, 0, 549, 21202, -2, 1, 1, 21202, -1, 1, 2, 21102, 1, 429, 0, 1105, 1, 601, 1201, 1, 0, 435, 1, 386, 0, 386, 104, -1, 104, 0, 4, 386, 1001, 387, -1, 387, 1005, 387, 451, 99, 109, -3, 2106, 0, 0, 109, 8, 22202, -7, -6, -3, 22201, -3, -5, -3, 21202, -4, 64, -2, 2207, -3, -2, 381, 1005, 381, 492, 21202, -2, -1, -1, 22201, -3, -1, -3, 2207, -3, -2, 381, 1006, 381, 481, 21202, -4, 8, -2, 2207, -3, -2, 381, 1005, 381, 518, 21202, -2, -1, -1, 22201, -3, -1, -3, 2207, -3, -2, 381, 1006, 381, 507, 2207, -3, -4, 381, 1005, 381, 540, 21202, -4, -1, -1, 22201, -3, -1, -3, 2207, -3, -4, 381, 1006, 381, 529, 21202, -3, 1, -7, 109, -8, 2105, 1, 0, 109, 4, 1202, -2, 38, 566, 201, -3, 566, 566, 101, 639, 566, 566, 2102, 1, -1, 0, 204, -3, 204, -2, 204, -1, 109, -4, 2105, 1, 0, 109, 3, 1202, -1, 38, 594, 201, -2, 594, 594, 101, 639, 594, 594, 20102, 1, 0, -2, 109, -3, 2105, 1, 0, 109, 3, 22102, 21, -2, 1, 22201, 1, -1, 1, 21102, 401, 1, 2, 21101, 0, 307, 3, 21102, 1, 798, 4, 21101, 0, 630, 0, 1105, 1, 456, 21201, 1, 1437, -2, 109, -3, 2106, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 0, 0, 2, 0, 2, 0, 0, 2, 0, 2, 0, 0, 0, 0, 2, 2, 2, 0, 0, 1, 1, 0, 2, 2, 0, 2, 2, 0, 0, 2, 2, 2, 2, 0, 2, 0, 0, 2, 2, 2, 0, 2, 2, 2, 0, 2, 0, 2, 2, 2, 0, 2, 2, 2, 2, 0, 0, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 2, 0, 2, 0, 2, 0, 0, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0, 0, 0, 1, 1, 0, 2, 2, 2, 2, 2, 0, 0, 2, 0, 2, 2, 2, 0, 2, 2, 2, 2, 0, 2, 2, 0, 0, 2, 2, 2, 0, 2, 2, 0, 0, 2, 2, 2, 2, 0, 1, 1, 0, 2, 2, 2, 2, 0, 2, 2, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 2, 2, 0, 2, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 2, 0, 0, 1, 1, 0, 2, 0, 2, 0, 2, 0, 0, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 2, 2, 0, 0, 2, 0, 2, 2, 0, 2, 0, 1, 1, 0, 0, 2, 2, 0, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 0, 2, 0, 2, 2, 2, 2, 2, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1, 1, 0, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 0, 1, 1, 0, 2, 0, 2, 2, 2, 2, 2, 2, 0, 0, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 0, 0, 2, 2, 0, 2, 2, 2, 2, 2, 0, 1, 1, 0, 2, 2, 0, 2, 0, 2, 2, 0, 2, 2, 2, 2, 0, 2, 2, 0, 2, 2, 2, 0, 2, 0, 2, 2, 0, 0, 2, 2, 0, 2, 2, 2, 2, 2, 0, 1, 1, 0, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 0, 0, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 0, 1, 1, 0, 0, 2, 0, 2, 2, 2, 2, 2, 0, 2, 0, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 2, 0, 2, 2, 2, 2, 2, 0, 2, 0, 0, 1, 1, 0, 2, 2, 2, 2, 0, 2, 2, 0, 2, 0, 2, 0, 2, 0, 0, 0, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 0, 2, 0, 2, 2, 2, 2, 2, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 19, 17, 32, 32, 30, 23, 60, 68, 82, 56, 72, 40, 27, 48, 77, 57, 13, 60, 84, 97, 20, 33, 94, 75, 82, 43, 88, 20, 93, 46, 43, 23, 77, 13, 1, 76, 69, 79, 27, 89, 11, 4, 13, 54, 84, 5, 49, 2, 37, 49, 78, 67, 79, 63, 21, 23, 64, 4, 57, 14, 26, 66, 57, 78, 44, 5, 77, 31, 50, 68, 49, 42, 46, 67, 38, 30, 5, 43, 86, 70, 62, 18, 56, 26, 16, 18, 28, 3, 91, 95, 49, 35, 9, 17, 42, 76, 47, 42, 65, 72, 75, 38, 30, 96, 92, 93, 12, 80, 35, 75, 86, 36, 82, 58, 90, 6, 95, 6, 82, 59, 21, 10, 49, 58, 60, 4, 63, 68, 39, 94, 59, 19, 50, 56, 36, 16, 39, 86, 61, 74, 37, 42, 23, 45, 90, 54, 63, 7, 9, 66, 62, 39, 67, 84, 66, 7, 16, 3, 37, 64, 83, 41, 57, 52, 90, 89, 6, 58, 42, 60, 9, 56, 83, 74, 10, 68, 5, 21, 6, 52, 68, 60, 9, 26, 2, 76, 6, 1, 66, 11, 6, 55, 31, 71, 93, 61, 69, 16, 76, 52, 10, 97, 79, 56, 22, 26, 65, 59, 90, 44, 64, 1, 63, 93, 5, 2, 48, 91, 78, 26, 15, 60, 35, 97, 89, 2, 21, 77, 54, 14, 57, 71, 32, 38, 60, 98, 66, 94, 87, 67, 13, 14, 43, 96, 24, 90, 45, 35, 12, 82, 20, 84, 31, 94, 24, 79, 63, 85, 49, 55, 68, 4, 35, 6, 81, 26, 64, 89, 42, 93, 54, 91, 47, 66, 7, 52, 48, 39, 71, 67, 98, 90, 96, 85, 70, 85, 72, 93, 71, 88, 34, 54, 94, 98, 1, 46, 89, 83, 56, 70, 17, 11, 25, 36, 57, 77, 83, 18, 23, 36, 2, 44, 13, 77, 69, 13, 61, 48, 79, 43, 94, 49, 51, 16, 76, 7, 24, 19, 51, 12, 43, 24, 81, 74, 13, 59, 22, 6, 8, 20, 4, 42, 58, 64, 41, 87, 14, 54, 71, 82, 56, 72, 25, 24, 15, 24, 1, 92, 28, 9, 33, 10, 9, 32, 69, 38, 19, 23, 48, 22, 50, 79, 54, 11, 98, 62, 52, 25, 9, 93, 37, 52, 75, 9, 78, 44, 10, 3, 73, 87, 16, 36, 78, 75, 80, 3, 26, 8, 74, 53, 26, 30, 62, 21, 65, 32, 85, 75, 91, 35, 84, 94, 80, 67, 92, 28, 34, 80, 64, 89, 19, 12, 78, 90, 33, 42, 34, 98, 66, 9, 37, 98, 95, 34, 35, 9, 91, 43, 37, 94, 23, 37, 46, 44, 78, 46, 6, 72, 85, 5, 78, 51, 46, 29, 74, 93, 34, 33, 76, 27, 90, 59, 17, 93, 43, 1, 6, 74, 78, 65, 83, 68, 60, 40, 32, 75, 37, 65, 51, 39, 28, 6, 74, 75, 83, 74, 48, 41, 43, 62, 76, 46, 29, 86, 39, 73, 34, 51, 19, 91, 73, 84, 95, 51, 3, 36, 83, 81, 90, 16, 48, 15, 14, 3, 39, 86, 75, 16, 56, 35, 20, 13, 18, 2, 48, 13, 76, 18, 60, 58, 91, 17, 43, 80, 52, 82, 44, 51, 21, 95, 49, 46, 22, 25, 50, 51, 79, 6, 78, 13, 87, 48, 45, 58, 3, 7, 40, 91, 94, 4, 62, 34, 34, 23, 36, 64, 72, 79, 32, 13, 48, 48, 27, 38, 92, 63, 30, 23, 18, 50, 5, 27, 25, 85, 59, 18, 33, 50, 72, 80, 93, 51, 41, 45, 49, 57, 59, 5, 54, 85, 94, 44, 54, 19, 48, 52, 7, 17, 97, 32, 72, 7, 11, 84, 55, 34, 72, 59, 38, 24, 76, 69, 58, 6, 71, 88, 6, 16, 73, 18, 50, 23, 67, 11, 61, 60, 25, 48, 18, 28, 15, 33, 25, 75, 24, 61, 45, 5, 59, 87, 27, 70, 83, 5, 24, 69, 4, 2, 41, 19, 10, 73, 94, 22, 78, 72, 44, 52, 21, 57, 95, 29, 65, 93, 61, 85, 38, 85, 51, 28, 43, 90, 93, 24, 66, 74, 39, 92, 83, 3, 52, 21, 63, 50, 83, 33, 71, 8, 25, 1, 69, 63, 77, 68, 24, 36, 35, 39, 8, 63, 85, 45, 22, 15, 3, 80, 53, 67, 78, 76, 30, 90, 94, 2, 44, 8, 26, 53, 60, 35, 8, 12, 87, 24, 93, 92, 93, 96, 96, 10, 95, 56, 12, 93, 47, 8, 16, 13, 49, 87, 27, 47, 62, 33, 62, 5, 32, 91, 49, 3, 37, 24, 31, 96, 59, 29, 65, 62, 20, 38, 76, 29, 76, 90, 98, 9, 18, 47, 57, 31, 30, 1, 48, 24, 10, 21, 52, 36, 42, 90, 34, 42, 77, 92, 23, 84, 95, 94, 854990];
const puzzlePart2 = [2, 380, 379, 385, 1008, 2235, 854990, 381, 1005, 381, 12, 99, 109, 2236, 1101, 0, 0, 383, 1102, 1, 0, 382, 20101, 0, 382, 1, 20102, 1, 383, 2, 21102, 1, 37, 0, 1106, 0, 578, 4, 382, 4, 383, 204, 1, 1001, 382, 1, 382, 1007, 382, 38, 381, 1005, 381, 22, 1001, 383, 1, 383, 1007, 383, 21, 381, 1005, 381, 18, 1006, 385, 69, 99, 104, -1, 104, 0, 4, 386, 3, 384, 1007, 384, 0, 381, 1005, 381, 94, 107, 0, 384, 381, 1005, 381, 108, 1106, 0, 161, 107, 1, 392, 381, 1006, 381, 161, 1102, 1, -1, 384, 1106, 0, 119, 1007, 392, 36, 381, 1006, 381, 161, 1101, 0, 1, 384, 20102, 1, 392, 1, 21101, 19, 0, 2, 21101, 0, 0, 3, 21101, 0, 138, 0, 1106, 0, 549, 1, 392, 384, 392, 21001, 392, 0, 1, 21101, 19, 0, 2, 21102, 1, 3, 3, 21102, 1, 161, 0, 1105, 1, 549, 1102, 1, 0, 384, 20001, 388, 390, 1, 21002, 389, 1, 2, 21102, 1, 180, 0, 1106, 0, 578, 1206, 1, 213, 1208, 1, 2, 381, 1006, 381, 205, 20001, 388, 390, 1, 20101, 0, 389, 2, 21102, 1, 205, 0, 1106, 0, 393, 1002, 390, -1, 390, 1101, 1, 0, 384, 20102, 1, 388, 1, 20001, 389, 391, 2, 21101, 0, 228, 0, 1105, 1, 578, 1206, 1, 261, 1208, 1, 2, 381, 1006, 381, 253, 20102, 1, 388, 1, 20001, 389, 391, 2, 21101, 253, 0, 0, 1106, 0, 393, 1002, 391, -1, 391, 1101, 1, 0, 384, 1005, 384, 161, 20001, 388, 390, 1, 20001, 389, 391, 2, 21102, 1, 279, 0, 1105, 1, 578, 1206, 1, 316, 1208, 1, 2, 381, 1006, 381, 304, 20001, 388, 390, 1, 20001, 389, 391, 2, 21101, 0, 304, 0, 1105, 1, 393, 1002, 390, -1, 390, 1002, 391, -1, 391, 1101, 1, 0, 384, 1005, 384, 161, 21002, 388, 1, 1, 21002, 389, 1, 2, 21101, 0, 0, 3, 21102, 1, 338, 0, 1106, 0, 549, 1, 388, 390, 388, 1, 389, 391, 389, 20101, 0, 388, 1, 21002, 389, 1, 2, 21102, 1, 4, 3, 21102, 365, 1, 0, 1106, 0, 549, 1007, 389, 20, 381, 1005, 381, 75, 104, -1, 104, 0, 104, 0, 99, 0, 1, 0, 0, 0, 0, 0, 0, 301, 17, 16, 1, 1, 19, 109, 3, 22102, 1, -2, 1, 22101, 0, -1, 2, 21101, 0, 0, 3, 21102, 414, 1, 0, 1106, 0, 549, 21202, -2, 1, 1, 21202, -1, 1, 2, 21102, 1, 429, 0, 1105, 1, 601, 1201, 1, 0, 435, 1, 386, 0, 386, 104, -1, 104, 0, 4, 386, 1001, 387, -1, 387, 1005, 387, 451, 99, 109, -3, 2106, 0, 0, 109, 8, 22202, -7, -6, -3, 22201, -3, -5, -3, 21202, -4, 64, -2, 2207, -3, -2, 381, 1005, 381, 492, 21202, -2, -1, -1, 22201, -3, -1, -3, 2207, -3, -2, 381, 1006, 381, 481, 21202, -4, 8, -2, 2207, -3, -2, 381, 1005, 381, 518, 21202, -2, -1, -1, 22201, -3, -1, -3, 2207, -3, -2, 381, 1006, 381, 507, 2207, -3, -4, 381, 1005, 381, 540, 21202, -4, -1, -1, 22201, -3, -1, -3, 2207, -3, -4, 381, 1006, 381, 529, 21202, -3, 1, -7, 109, -8, 2105, 1, 0, 109, 4, 1202, -2, 38, 566, 201, -3, 566, 566, 101, 639, 566, 566, 2102, 1, -1, 0, 204, -3, 204, -2, 204, -1, 109, -4, 2105, 1, 0, 109, 3, 1202, -1, 38, 594, 201, -2, 594, 594, 101, 639, 594, 594, 20102, 1, 0, -2, 109, -3, 2105, 1, 0, 109, 3, 22102, 21, -2, 1, 22201, 1, -1, 1, 21102, 401, 1, 2, 21101, 0, 307, 3, 21102, 1, 798, 4, 21101, 0, 630, 0, 1105, 1, 456, 21201, 1, 1437, -2, 109, -3, 2106, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 0, 0, 2, 0, 2, 0, 0, 2, 0, 2, 0, 0, 0, 0, 2, 2, 2, 0, 0, 1, 1, 0, 2, 2, 0, 2, 2, 0, 0, 2, 2, 2, 2, 0, 2, 0, 0, 2, 2, 2, 0, 2, 2, 2, 0, 2, 0, 2, 2, 2, 0, 2, 2, 2, 2, 0, 0, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 2, 0, 2, 0, 2, 0, 0, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0, 0, 0, 1, 1, 0, 2, 2, 2, 2, 2, 0, 0, 2, 0, 2, 2, 2, 0, 2, 2, 2, 2, 0, 2, 2, 0, 0, 2, 2, 2, 0, 2, 2, 0, 0, 2, 2, 2, 2, 0, 1, 1, 0, 2, 2, 2, 2, 0, 2, 2, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 2, 2, 0, 2, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 2, 0, 0, 1, 1, 0, 2, 0, 2, 0, 2, 0, 0, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 2, 2, 0, 0, 2, 0, 2, 2, 0, 2, 0, 1, 1, 0, 0, 2, 2, 0, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 0, 2, 0, 2, 2, 2, 2, 2, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1, 1, 0, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 0, 1, 1, 0, 2, 0, 2, 2, 2, 2, 2, 2, 0, 0, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 0, 0, 2, 2, 0, 2, 2, 2, 2, 2, 0, 1, 1, 0, 2, 2, 0, 2, 0, 2, 2, 0, 2, 2, 2, 2, 0, 2, 2, 0, 2, 2, 2, 0, 2, 0, 2, 2, 0, 0, 2, 2, 0, 2, 2, 2, 2, 2, 0, 1, 1, 0, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 0, 0, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 0, 1, 1, 0, 0, 2, 0, 2, 2, 2, 2, 2, 0, 2, 0, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 2, 0, 2, 2, 2, 2, 2, 0, 2, 0, 0, 1, 1, 0, 2, 2, 2, 2, 0, 2, 2, 0, 2, 0, 2, 0, 2, 0, 0, 0, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 0, 2, 0, 2, 2, 2, 2, 2, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 19, 17, 32, 32, 30, 23, 60, 68, 82, 56, 72, 40, 27, 48, 77, 57, 13, 60, 84, 97, 20, 33, 94, 75, 82, 43, 88, 20, 93, 46, 43, 23, 77, 13, 1, 76, 69, 79, 27, 89, 11, 4, 13, 54, 84, 5, 49, 2, 37, 49, 78, 67, 79, 63, 21, 23, 64, 4, 57, 14, 26, 66, 57, 78, 44, 5, 77, 31, 50, 68, 49, 42, 46, 67, 38, 30, 5, 43, 86, 70, 62, 18, 56, 26, 16, 18, 28, 3, 91, 95, 49, 35, 9, 17, 42, 76, 47, 42, 65, 72, 75, 38, 30, 96, 92, 93, 12, 80, 35, 75, 86, 36, 82, 58, 90, 6, 95, 6, 82, 59, 21, 10, 49, 58, 60, 4, 63, 68, 39, 94, 59, 19, 50, 56, 36, 16, 39, 86, 61, 74, 37, 42, 23, 45, 90, 54, 63, 7, 9, 66, 62, 39, 67, 84, 66, 7, 16, 3, 37, 64, 83, 41, 57, 52, 90, 89, 6, 58, 42, 60, 9, 56, 83, 74, 10, 68, 5, 21, 6, 52, 68, 60, 9, 26, 2, 76, 6, 1, 66, 11, 6, 55, 31, 71, 93, 61, 69, 16, 76, 52, 10, 97, 79, 56, 22, 26, 65, 59, 90, 44, 64, 1, 63, 93, 5, 2, 48, 91, 78, 26, 15, 60, 35, 97, 89, 2, 21, 77, 54, 14, 57, 71, 32, 38, 60, 98, 66, 94, 87, 67, 13, 14, 43, 96, 24, 90, 45, 35, 12, 82, 20, 84, 31, 94, 24, 79, 63, 85, 49, 55, 68, 4, 35, 6, 81, 26, 64, 89, 42, 93, 54, 91, 47, 66, 7, 52, 48, 39, 71, 67, 98, 90, 96, 85, 70, 85, 72, 93, 71, 88, 34, 54, 94, 98, 1, 46, 89, 83, 56, 70, 17, 11, 25, 36, 57, 77, 83, 18, 23, 36, 2, 44, 13, 77, 69, 13, 61, 48, 79, 43, 94, 49, 51, 16, 76, 7, 24, 19, 51, 12, 43, 24, 81, 74, 13, 59, 22, 6, 8, 20, 4, 42, 58, 64, 41, 87, 14, 54, 71, 82, 56, 72, 25, 24, 15, 24, 1, 92, 28, 9, 33, 10, 9, 32, 69, 38, 19, 23, 48, 22, 50, 79, 54, 11, 98, 62, 52, 25, 9, 93, 37, 52, 75, 9, 78, 44, 10, 3, 73, 87, 16, 36, 78, 75, 80, 3, 26, 8, 74, 53, 26, 30, 62, 21, 65, 32, 85, 75, 91, 35, 84, 94, 80, 67, 92, 28, 34, 80, 64, 89, 19, 12, 78, 90, 33, 42, 34, 98, 66, 9, 37, 98, 95, 34, 35, 9, 91, 43, 37, 94, 23, 37, 46, 44, 78, 46, 6, 72, 85, 5, 78, 51, 46, 29, 74, 93, 34, 33, 76, 27, 90, 59, 17, 93, 43, 1, 6, 74, 78, 65, 83, 68, 60, 40, 32, 75, 37, 65, 51, 39, 28, 6, 74, 75, 83, 74, 48, 41, 43, 62, 76, 46, 29, 86, 39, 73, 34, 51, 19, 91, 73, 84, 95, 51, 3, 36, 83, 81, 90, 16, 48, 15, 14, 3, 39, 86, 75, 16, 56, 35, 20, 13, 18, 2, 48, 13, 76, 18, 60, 58, 91, 17, 43, 80, 52, 82, 44, 51, 21, 95, 49, 46, 22, 25, 50, 51, 79, 6, 78, 13, 87, 48, 45, 58, 3, 7, 40, 91, 94, 4, 62, 34, 34, 23, 36, 64, 72, 79, 32, 13, 48, 48, 27, 38, 92, 63, 30, 23, 18, 50, 5, 27, 25, 85, 59, 18, 33, 50, 72, 80, 93, 51, 41, 45, 49, 57, 59, 5, 54, 85, 94, 44, 54, 19, 48, 52, 7, 17, 97, 32, 72, 7, 11, 84, 55, 34, 72, 59, 38, 24, 76, 69, 58, 6, 71, 88, 6, 16, 73, 18, 50, 23, 67, 11, 61, 60, 25, 48, 18, 28, 15, 33, 25, 75, 24, 61, 45, 5, 59, 87, 27, 70, 83, 5, 24, 69, 4, 2, 41, 19, 10, 73, 94, 22, 78, 72, 44, 52, 21, 57, 95, 29, 65, 93, 61, 85, 38, 85, 51, 28, 43, 90, 93, 24, 66, 74, 39, 92, 83, 3, 52, 21, 63, 50, 83, 33, 71, 8, 25, 1, 69, 63, 77, 68, 24, 36, 35, 39, 8, 63, 85, 45, 22, 15, 3, 80, 53, 67, 78, 76, 30, 90, 94, 2, 44, 8, 26, 53, 60, 35, 8, 12, 87, 24, 93, 92, 93, 96, 96, 10, 95, 56, 12, 93, 47, 8, 16, 13, 49, 87, 27, 47, 62, 33, 62, 5, 32, 91, 49, 3, 37, 24, 31, 96, 59, 29, 65, 62, 20, 38, 76, 29, 76, 90, 98, 9, 18, 47, 57, 31, 30, 1, 48, 24, 10, 21, 52, 36, 42, 90, 34, 42, 77, 92, 23, 84, 95, 94, 854990];

function main() {
  console.log(`1: ${part1(puzzlePart1)}`)
  console.log(`2: ${part2(puzzlePart2)}`)
}

main()
