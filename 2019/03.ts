type Point = [number, number];

export function findCutPoints(path1: Point[], path2: Point[]): Point[] {
  const toString = (p: Point) => JSON.stringify(p)
  const path2set = new Set(path2.map(p => toString(p)))
  return path1
    .filter(p => path2set.has(toString(p)))
    .filter(([x, y]) => !(x === 0 && y === 0));
}

export function parsePuzzle(puzzle: string): string[] {
  return puzzle.split(',').filter(s => s != null && s.trim() !== '');
}

export function pathPloter(directions: string[]): Point[] {
  let startDirection: Point = [0, 0]
  let result: Point[] = [[0, 0]]
  directions.forEach(direction => {
    result = [...result, ...pathFrom(startDirection, direction)];
    startDirection = result.slice(-1)[0]
  })

  return result;
}

export function part1(wire1: string[], wire2: string[]): number {
  const path1 = pathPloter(wire1)
  const path2 = pathPloter(wire2)
  const cutPoints = findCutPoints(path1, path2)

  return cutPoints
    .map(point => manhattanDistance([0, 0], point))
    .reduce((a, b) => a > b ? b : a)
}

function findNumberOfStepsUntilPoint(wire: Point[], point: Point): number {
  return wire.indexOf(wire.find(p => p[0] === point[0] && p[1] === point[1])!)
}

export function part2(wire1: string[], wire2: string[]): number {
  const path1 = pathPloter(wire1)
  const path2 = pathPloter(wire2)
  const cutPoints = findCutPoints(path1, path2)

  return cutPoints
    .map(p => findNumberOfStepsUntilPoint(path2, p) + findNumberOfStepsUntilPoint(path1, p))
    .reduce((a, b) => a > b ? b : a);
}

function manhattanDistance(p1: Point, p2: Point): number {
  return Math.abs(p2[0] - p1[0]) + Math.abs(p2[1] - p1[1]);
}

function pathFrom(start: Point, directionCommand: string): Point[] {
  type SingleMoveExecutor = (position: Point) => Point
  type PathPlotter = (length: number) => Point[]
  type Direction = 'U' | 'D' | 'L' | 'R'

  function moveExecutor(action: SingleMoveExecutor): PathPlotter {
    return (length) => {
      let result = [start]
      for (let i = 0; i < length; i++) {
        let previousPosition = result.slice(-1)[0]
        result = [...result, action(previousPosition)]
      }
      return result
    }
  }

  const directions: Record<Direction, PathPlotter> = {
    'U': moveExecutor(([x, y]) => ([x, y + 1])),
    'D': moveExecutor(([x, y]) => ([x, y - 1])),
    'L': moveExecutor(([x, y]) => ([x - 1, y])),
    'R': moveExecutor(([x, y]) => ([x + 1, y])),
  }

  const direction: Direction = directionCommand[0] as Direction
  const pathLength = parseInt(directionCommand.substr(1))

  const action = directions[direction]!;

  return action(pathLength).slice(1);
}
