import exp from 'constants';
import { removeLinesBeforeExternalMatcherTrap } from 'jest-snapshot/build/utils';

export interface Coordinates {
  x: number
  y: number
  z: number
}

function getEnergy(coordinates: Coordinates) {
  return [
    coordinates.x,
    coordinates.y,
    coordinates.z
  ]
    .map(Math.abs)
    .reduce((a, b) => a + b);
}

function toString(c: Coordinates) {
  return `<x=${c.x}, y=${c.y}, z=${c.z}>`
}

function clone(c: Coordinates): Coordinates {
  return {
    x: c.x,
    y: c.y,
    z: c.z
  }
}

export function tick(system: SatelliteSystemSnapshot, numberOfSteps = 10,) {
  let s = system;
  for (let i = 0; i < numberOfSteps; i++) {
    s = s.tick();
  }
  return s;
}

export class Satellite {
  position: Coordinates
  velocity: Coordinates

  constructor(
    position: Coordinates,
    velocity: Coordinates = {x: 0, y: 0, z: 0}
  ) {
    this.position = position;
    this.velocity = velocity
  }

  private get potentialEnergy() {
    return getEnergy(this.position);
  }

  private get kineticEnergy() {
    return getEnergy(this.velocity);
  }

  get energy() {
    return this.kineticEnergy * this.potentialEnergy;
  }

  toString() {
    const position = `pos=${toString(this.position)}`;
    const velocity = `vel=${toString(this.velocity)}`;
    return `${position}, ${velocity}`;
  }
}

export class SatelliteSystemSnapshot {
  private satellites: Satellite[]

  constructor(satellites: Satellite[]) {
    this.satellites = [...satellites];
  }

  toString() {
    return this.satellites.map(s => s.toString()).join('\n');
  }

  get totalEnergy() {
    return this.satellites.map(s => s.energy).reduce((a, b) => a + b);
  }

  tick() {
    const applyGravity = (a: number, b: number) => {
      if (a > b) {
        return -1
      } else if (a < b) {
        return 1
      } else {
        return 0;
      }
    }

    const movedSatellites: Satellite[] = this.satellites.map(s => new Satellite(clone(s.position), clone(s.velocity)));
    const forAllSatellitesPairs = (action: (s1: Satellite, s2: Satellite) => void) => {
      const handled: Satellite[][] = [];
      for (const s1 of movedSatellites) {
        for (const s2 of movedSatellites) {
          if (s1 === s2 || handled.some(p => p.includes(s1) && p.includes(s2))) {
            continue;
          }

          action(s1, s2);
          handled.push([s1, s2]);
        }
      }
    }

    forAllSatellitesPairs((s1, s2) => {
      s1.velocity = {
        x: s1.velocity.x + applyGravity(s1.position.x, s2.position.x),
        y: s1.velocity.y + applyGravity(s1.position.y, s2.position.y),
        z: s1.velocity.z + applyGravity(s1.position.z, s2.position.z),
      };
      s2.velocity = {
        x: s2.velocity.x + applyGravity(s2.position.x, s1.position.x),
        y: s2.velocity.y + applyGravity(s2.position.y, s1.position.y),
        z: s2.velocity.z + applyGravity(s2.position.z, s1.position.z),
      }
    });

    for (const s of movedSatellites) {
      s.position = {
        x: s.position.x + s.velocity.x,
        y: s.position.y + s.velocity.y,
        z: s.position.z + s.velocity.z,
      }
    }

    return new SatelliteSystemSnapshot(movedSatellites);
  }
}
