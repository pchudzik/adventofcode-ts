type Coordinate = {
  x: number,
  y: number
}

export function parsePuzzle(puzzle: string) {
  return puzzle.trim()
    .split('\n')
    .map((line, y) => line.trim().split('')
      .map((a, x) => a !== '.' ? {x, y} as Coordinate : null)
      .filter(p => p !== null) as Coordinate[]
    )
    .reduce((a, b) => [...a, ...b]);
}

function calculateAngle(start: Coordinate, other: Coordinate) {
  const x = other.x - start.x
  const y = other.y - start.y
  const result = Math.atan2(y, x) * 180 / Math.PI + 90;
  if (result < 0) {
    return 360 - Math.abs(result);
  } else {
    return result;
  }
}

type MonitoringStationScanningResult = [Coordinate, Record<number, Coordinate[]>]

function byDistance(center: Coordinate) {
  function distance(p: Coordinate, q: Coordinate) {
    return Math.sqrt(
      Math.pow(p.x - q.x, 2) + Math.pow(p.y - q.y, 2),
    );
  }

  return (a: Coordinate, b: Coordinate) => {
    const aDistance = distance(a, center);
    const bDistance = distance(b, center);
    return aDistance - bDistance;
  }
}

export function findAsteroidsEclipses(asteroids: Coordinate[]) {
  const eclipses: MonitoringStationScanningResult[] = [];
  for (const center of asteroids) {
    const asteroidsAtTheAngle: Record<number, Coordinate[]> = {}
    for (const a of asteroids.filter(p => !(p.x === center.x && p.y === center.y))) {
      if (a.x === center.x && a.y === center.y) {
        continue;
      }
      const angle = calculateAngle(center, a)
      const asteroids = asteroidsAtTheAngle[angle] || [];
      asteroids.push(a)
      asteroids.sort(byDistance(center));
      asteroidsAtTheAngle[angle] = asteroids;
    }
    eclipses.push([center, asteroidsAtTheAngle]);
  }

  return eclipses;
}

export function findBestMonitoringStationPosition(scanningResults: MonitoringStationScanningResult[]) {
  return scanningResults
    .map(([_, angles]) => Object.keys(angles))
    .map(res => res.length)
    .reduce((a, b) => a > b ? a : b);
}

export function part1(puzzle: string) {
  const eclipses = findAsteroidsEclipses(parsePuzzle(puzzle));
  return findBestMonitoringStationPosition(eclipses);
}

export function part2(puzzle: string): Coordinate[] {
  const eclipses = findAsteroidsEclipses(parsePuzzle(puzzle));
  const asteroids = eclipses.reduce((a, b) => Object.keys(a[1]).length > Object.keys(b[1]).length ? a : b);
  return fireOrder(asteroids)
}


export function fireOrder([_, asteroids]: MonitoringStationScanningResult): Coordinate[] {
  function hasAnyAsteroidsToDestroy(values: Coordinate[][]) {
    return values.map(a => a.length).some(a => a > 0);
  }

  const sortedAngles = Object
    .keys(asteroids)
    .map(a => parseFloat(a))
    .sort((a, b) => a - b);

  const result: Coordinate[] = []

  while (hasAnyAsteroidsToDestroy(Object.values(asteroids))) {
    for (const angle of sortedAngles) {
      const asteroid = asteroids[angle].shift()
      if (asteroid) {
        result.push(asteroid)
      }
    }
  }
  return result;
}
