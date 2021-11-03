import exp from 'constants';

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
  //atan2
  const x = other.x - start.x
  const y = other.y - start.y
  const result = Math.atan2(y, x) * 180 / Math.PI;
  return result;
  // return (other.y - start.y) / (other.x - start.x);
}

type MonitoringStationScanningResult = [Coordinate, Record<number, Coordinate[]>]

export function findAsteroidsEclipses(asteroids: Coordinate[]) {
  const eclipses: MonitoringStationScanningResult[] = [];
  for (const center of asteroids) {
    // const center = {x:0, y: 0};
    const asteroidsAtTheAngle: Record<number, Coordinate[]> = {}
    for (const a of asteroids.filter(p => !(p.x === center.x && p.y === center.y))) {
      if (a.x === center.x && a.y === center.y) {
        continue;
      }
      const angle = calculateAngle(center, a)
      // console.log(center, a,);
      const asteroids = asteroidsAtTheAngle[angle] || [];
      asteroids.push(a)
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

export function part1(puzzle:string) {
  const eclipses = findAsteroidsEclipses(parsePuzzle(puzzle));
  return findBestMonitoringStationPosition(eclipses);
}
