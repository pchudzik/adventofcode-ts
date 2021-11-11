#!/usr/bin/env ts-node


import { Satellite, SatelliteSystemSnapshot, tick } from './12';

const puzzle = [
  new Satellite({x: 12, y: 0, z: -15}),
  new Satellite({x: -8, y: -5, z: -10}),
  new Satellite({x: 7, y: -17, z: 1}),
  new Satellite({x: 2, y: -11, z: -6}),
]

function part1() {
  return tick(new SatelliteSystemSnapshot(puzzle), 1000).totalEnergy
}

function main() {
  console.log(`1: ${part1()}`)
  //part2 find cycle and step in cycle sizes somehow because those are moons so they orbit something
}

main()
