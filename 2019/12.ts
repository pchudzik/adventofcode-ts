export interface Coordinates {
  x: number
  y: number
  z: number

  [key: string]: number;
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

export function findNumberOfStepsWhenPositionsAndVelocitiesAreTheSameAsAtTheBeginning(startingState: SatelliteSystemSnapshot) {
  function calculateLCM(arr: number[]) {
    function gcd2(a: number, b: number): number {
      if (!b) {
        return b === 0 ? a : NaN;
      }
      return gcd2(b, a % b);
    }

    function lcm2(a: number, b: number) {
      return a * b / gcd2(a, b);
    }

    let n = 1;
    for (let i = 0; i < arr.length; ++i) {
      n = lcm2(arr[i], n);
    }

    return n;
  }

  function zip<T>(a1: T[], a2: T[]): T[][] {
    const result: T[][] = [];

    for (let i = 0; i < a1.length; i++) {
      result.push([a1[i], a2[i]]);
    }

    return result;
  }

  function isAtStart(currentState: SatelliteSystemSnapshot, dimension: string) {
    return zip(currentState.satellites, startingState.satellites)
      .every(([currentSatellite, startingSatellite]) =>
        currentSatellite.position[dimension] === startingSatellite.position[dimension]
        && currentSatellite.velocity[dimension] === startingSatellite.velocity[dimension])
  }

  const result: Record<string, number> = {};

  for (let dimension of ['x', 'y', 'z']) {
    let s = startingState
    let numberOfTicks = 0;
    while (true) {
      s = s.tick()
      numberOfTicks++;
      if (isAtStart(s, dimension)) {
        result[dimension] = numberOfTicks;
        break;
      }
    }
  }

  return calculateLCM(Object.values(result));
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

  toStringPositionOnly() {
    return `pos=${toString(this.position)}`;
  }
}

export class SatelliteSystemSnapshot {
  satellites: Satellite[]

  constructor(satellites: Satellite[]) {
    this.satellites = [...satellites];
  }

  toStringPositionOnly() {
    return this.satellites.map(s => s.toStringPositionOnly()).join('\n');
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
