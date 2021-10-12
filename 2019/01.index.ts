#!/usr/bin/env ts-node

import * as fs from 'fs';
import { getFuel, getFuel2 } from './01';

function main() {
  const puzzle = fs
    .readFileSync('01.txt', 'utf-8')
    .split('\n')
    .filter(n => n && n.trim() != '')
    .map(n => parseInt(n, 10));
  const totalFuel = puzzle
    .map(n => getFuel(n))
    .reduce((a, b) => a + b)
  const totalFuel2 = puzzle
    .map(n => getFuel2(n))
    .reduce((a,b) => a+b);

  console.log('1: ' + totalFuel)
  console.log('2: ' + totalFuel2)
}

main()
