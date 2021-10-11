import * as fs from 'fs';

export function getFuel(mass: number): number {
  return Math.floor(mass / 3.0) - 2;
}

export function getFuel2(mass: number): number {
  const result = getFuel(mass)
  if(result >= 0) {
    return result + getFuel2(result)
  } else {
    return 0
  }
}

function main() {
  const puzzle = fs
    .readFileSync('2019/01.txt', 'utf-8')
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

if (process.argv.includes('exec')) {
  main()
}
