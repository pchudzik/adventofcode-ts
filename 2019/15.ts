interface Operation {
  execute(registry: Registry): void
}

type ParamIndex = 0 | 1 | 2
const FirstParam: ParamIndex = 0
const SecondParam: ParamIndex = 1
const ThirdParam: ParamIndex = 2

type OperandType = '0' | '1' | '2';

interface OperandHandler {
  getValue(param: ParamIndex, registry: Registry): number

  setValue(param: ParamIndex, value: number, registry: Registry): void
}

const PositionModeOperationHandler: OperandHandler = {
  getValue(param, registry) {
    return registry.getUsingPositionMode(param)
  },
  setValue(param: ParamIndex, value, registry) {
    const resultIndex = registry.getUsingImmediateMode(param)
    registry.setValue(resultIndex, value)
  }
};
const ImmediateModeOperationHandler: OperandHandler = {
  getValue(param, registry) {
    return registry.getUsingImmediateMode(param)
  },
  setValue(param: ParamIndex, value: number, registry: Registry) {
    throw new Error('Set value not supported!');
  }
};
const RelativeModeOperationHandler: OperandHandler = {
  getValue(param, registry) {
    return registry.getUsingRelativeMode(param);
  },
  setValue(param: ParamIndex, value: number, registry: Registry): void {
    const position = registry.getUsingImmediateMode(param) + registry.relativeBase;
    registry.setValue(position, value);
  }
}

type Command = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 99
type CommandType = {
  command: Command
  firstArg: OperandHandler | null,
  secondArg: OperandHandler | null,
  thirdArg: OperandHandler | null,
}

class AddOperation implements Operation {
  private readonly aHandler: OperandHandler
  private readonly bHandler: OperandHandler
  private readonly resultHandler: OperandHandler

  constructor(firstArg: OperandHandler, secondArg: OperandHandler, resultHandler: OperandHandler) {
    this.aHandler = firstArg;
    this.bHandler = secondArg;
    this.resultHandler = resultHandler;
  }

  execute(registry: Registry) {
    const a = this.aHandler.getValue(FirstParam, registry)
    const b = this.bHandler.getValue(SecondParam, registry)
    this.resultHandler.setValue(ThirdParam, a + b, registry);
    registry.moveForward(4)
  }
}

class ChangeRelativeBaseOperation implements Operation {
  private readonly aHandler: OperandHandler

  constructor(firstArg: OperandHandler) {
    this.aHandler = firstArg;
  }

  execute(registry: Registry): void {
    const relativeBase = this.aHandler.getValue(FirstParam, registry);
    registry.changeRelativeBase(relativeBase)
    registry.moveForward(2);
  }
}

class MultiplyOperation implements Operation {
  private readonly aHandler: OperandHandler
  private readonly bHandler: OperandHandler
  private readonly resultHandler: OperandHandler

  constructor(firstArg: OperandHandler, secondArg: OperandHandler, resultHandler: OperandHandler) {
    this.aHandler = firstArg;
    this.bHandler = secondArg;
    this.resultHandler = resultHandler;
  }

  execute(registry: Registry) {
    const a = this.aHandler.getValue(FirstParam, registry)
    const b = this.bHandler.getValue(SecondParam, registry)
    this.resultHandler.setValue(ThirdParam, a * b, registry);
    registry.moveForward(4)
  }
}

const HaltOperation: Operation = {
  execute: registry => {
    registry.halt()
  }
}

class InputOperation implements Operation {
  private readonly resultHandler: OperandHandler;

  constructor(resultHandler: OperandHandler) {
    this.resultHandler = resultHandler;
  }

  execute(registry: Registry) {
    const input = registry.input();
    this.resultHandler.setValue(FirstParam, input, registry)
    registry.moveForward(2);
  }
}

class OutputOperation implements Operation {
  private readonly aHandler: OperandHandler

  constructor(firstArg: OperandHandler) {
    this.aHandler = firstArg;
  }

  execute(registry: Registry) {
    const value = this.aHandler.getValue(FirstParam, registry);
    registry.outputHandler(value)
    registry.moveForward(2);
  }
}

class JumpIfTrueOperation implements Operation {
  private readonly aHandler: OperandHandler
  private readonly bHandler: OperandHandler

  constructor(firstArg: OperandHandler, secondArg: OperandHandler) {
    this.aHandler = firstArg;
    this.bHandler = secondArg;
  }

  execute(registry: Registry): void {
    const a = this.aHandler.getValue(FirstParam, registry)
    const b = this.bHandler.getValue(SecondParam, registry)
    if (a !== 0) {
      registry.setInstructionPointerTo(b)
    } else {
      registry.moveForward(3);
    }
  }
}

class JumpIfFalseOperation implements Operation {
  private readonly aHandler: OperandHandler
  private readonly bHandler: OperandHandler

  constructor(firstArg: OperandHandler, secondArg: OperandHandler) {
    this.aHandler = firstArg;
    this.bHandler = secondArg;
  }

  execute(registry: Registry): void {
    const a = this.aHandler.getValue(FirstParam, registry)
    const b = this.bHandler.getValue(SecondParam, registry)
    if (a === 0) {
      registry.setInstructionPointerTo(b)
    } else {
      registry.moveForward(3);
    }
  }
}

class LessThanOperation implements Operation {
  private readonly aHandler: OperandHandler
  private readonly bHandler: OperandHandler
  private readonly cHandler: OperandHandler

  constructor(firstArg: OperandHandler, secondArg: OperandHandler, thirdArg: OperandHandler) {
    this.aHandler = firstArg;
    this.bHandler = secondArg;
    this.cHandler = thirdArg;
  }

  execute(registry: Registry): void {
    const a = this.aHandler.getValue(FirstParam, registry)
    const b = this.bHandler.getValue(SecondParam, registry)
    this.cHandler.setValue(ThirdParam, a < b ? 1 : 0, registry)
    registry.moveForward(4);
  }
}

class EqualsOperation implements Operation {
  private readonly aHandler: OperandHandler
  private readonly bHandler: OperandHandler
  private readonly cHandler: OperandHandler

  constructor(firstArg: OperandHandler, secondArg: OperandHandler, thirdArg: OperandHandler) {
    this.aHandler = firstArg;
    this.bHandler = secondArg;
    this.cHandler = thirdArg;
  }

  execute(registry: Registry): void {
    const a = this.aHandler.getValue(FirstParam, registry)
    const b = this.bHandler.getValue(SecondParam, registry)
    this.cHandler.setValue(ThirdParam, a === b ? 1 : 0, registry);
    registry.moveForward(4);
  }
}

function commandFactory(processor: Registry): Operation {
  const currentCmd = processor.currentCmd;

  const commands: Record<Command, Operation> = {
    1: new AddOperation(currentCmd.firstArg!, currentCmd.secondArg!, currentCmd.thirdArg!),
    2: new MultiplyOperation(currentCmd.firstArg!, currentCmd.secondArg!, currentCmd.thirdArg!),
    3: new InputOperation(currentCmd.firstArg!),
    4: new OutputOperation(currentCmd.firstArg!),
    5: new JumpIfTrueOperation(currentCmd.firstArg!, currentCmd.secondArg!),
    6: new JumpIfFalseOperation(currentCmd.firstArg!, currentCmd.secondArg!),
    7: new LessThanOperation(currentCmd.firstArg!, currentCmd.secondArg!, currentCmd.thirdArg!),
    8: new EqualsOperation(currentCmd.firstArg!, currentCmd.secondArg!, currentCmd.thirdArg!),
    9: new ChangeRelativeBaseOperation(currentCmd.firstArg!),
    99: HaltOperation,
  }

  const cmd = commands[currentCmd.command]!;
  if (!cmd) {
    throw Error(`Unknown operation ${(currentCmd.command)}. Pointer: ${processor.pointer}, registry: ${processor.registry}`)
  }
  return cmd;
}

export type IOHandler = {
  input: () => number,
  output: (value: number) => void
}

class Registry {
  private _registry: number[]
  private instructionPointer: number
  private io: IOHandler
  relativeBase = 0;

  constructor(registry: number[], inputProvider: IOHandler, instructionPointer = 0) {
    this._registry = registry
    this.instructionPointer = instructionPointer
    this.io = inputProvider
  }

  get currentCmd(): CommandType {
    const commandStr = (this._registry[this.instructionPointer] + '').padStart(5, '0').split('');
    const command = parseInt(commandStr.slice(-2).join(''), 10) as Command;
    const operandSelector: Record<OperandType, OperandHandler> = {
      '0': PositionModeOperationHandler,
      '1': ImmediateModeOperationHandler,
      '2': RelativeModeOperationHandler,
    }
    const firstArg = operandSelector[commandStr[2] as OperandType]
    const secondArg = operandSelector[commandStr[1] as OperandType]
    const thirdArg = operandSelector[commandStr[0] as OperandType]
    return {
      command,
      firstArg,
      secondArg,
      thirdArg,
    }
  }

  get registry() {
    return [...this._registry]
  }

  input() {
    return this.io.input();
  }

  outputHandler(value: number) {
    return this.io.output(value);
  }

  get isRunning() {
    return this.instructionPointer >= 0 && this.instructionPointer < this.registry.length;
  }

  getUsingPositionMode(operandIndex: ParamIndex) {
    const position = this._registry[this.instructionPointer + operandIndex + 1]
    return this._registry[position] || 0;
  }

  getUsingRelativeMode(operandIndex: ParamIndex) {
    const position = this._registry[this.instructionPointer + operandIndex + 1] + this.relativeBase;
    return this._registry[position] || 0;
  }

  getUsingImmediateMode(operandIndex: ParamIndex) {
    return this._registry[this.instructionPointer + operandIndex + 1] || 0;
  }

  setValue(position: number, value: number) {
    this._registry[position] = value
  }

  halt() {
    this.instructionPointer = -1;
  }

  moveForward(number: number) {
    this.instructionPointer += number
  }

  setInstructionPointerTo(newPointer: number) {
    this.instructionPointer = newPointer;
  }

  get pointer() {
    return this.instructionPointer;
  }

  changeRelativeBase(relativeBase: number) {
    this.relativeBase += relativeBase;
  }
}

type ProgramProcessor = Generator<number[], number[], void>
type ProgramStep = IteratorResult<number[], number[]>

export const North = 1
export const South = 2
export const West = 3
export const East = 4

type Direction = 1 | 2 | 3 | 4;

class DronePosition {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  move(direction: Direction): DronePosition {
    switch (direction) {
      case North:
        return new DronePosition(this.x, this.y + 1);
      case South:
        return new DronePosition(this.x, this.y - 1);
      case West:
        return new DronePosition(this.x - 1, this.y);
      case East:
        return new DronePosition(this.x + 1, this.y);
    }
  }

  get allNeighbours():DronePosition[] {
    return [
      new DronePosition(this.x, this.y + 1),
      new DronePosition(this.x, this.y - 1),
      new DronePosition(this.x - 1, this.y),
      new DronePosition(this.x + 1, this.y),
    ]
  }

  toJson() {
    return JSON.stringify({x: this.x, y: this.y})
  }

  static fromJson(str: string) {
    return JSON.parse(str) as DronePosition;
  }
}

export class DroneIOHandler implements IOHandler {
  private dronePosition = new DronePosition(0, 0)
  private directionsToTry = [North, South, West, East];

  private droneDirection: Direction = North

  private oxygen?: DronePosition;

  private walls = new Set<string>();
  private path = new Set<string>();

  private backtrack: Direction[] = [];
  private backtracking = false;

  get foundOxygen() {
    return this.oxygen;
  }

  get directions() {
    return [...this.directionsToTry];
  }

  shortestPathToOxygen(): number {
    const checked = new Set<string>();
    const queue: [DronePosition, number][] = [];

    queue.push([new DronePosition(0, 0), 0]);
    while (queue.length) {
      const [position, distance] = queue.shift()!;
      if (position.x === this.oxygen!!.x && this.oxygen!!.y === position.y) {
        return distance;
      }

      for(const neighbour of position.allNeighbours) {
        const neighbourJson = neighbour.toJson();
        if(!checked.has(neighbourJson) && this.path.has(neighbourJson)) {
          queue.push([neighbour, distance + 1]);
          checked.add(neighbourJson);
        }
      }
    }

    return -1;
  }

  private isAlreadyVisited(move: Direction): boolean {
    const position = this.dronePosition.toJson() + ';' + move;
    return this.path.has(position)
  }


  private isWall(move: Direction): boolean {
    return this.walls.has(this.dronePosition.move(move).toJson());
  }

  position() {
    return {x: this.dronePosition.x, y: this.dronePosition.y}
  }

  private print() {
    const allWalls = Array.from(this.walls).map(w => DronePosition.fromJson(w))
    const minX = allWalls.map(p => p.x).reduce((a, b) => a < b ? a : b);
    const maxX = allWalls.map(p => p.x).reduce((a, b) => a > b ? a : b);
    const minY = allWalls.map(p => p.y).reduce((a, b) => a < b ? a : b);
    const maxY = allWalls.map(p => p.y).reduce((a, b) => a > b ? a : b);

    let result: string[] = [];
    for (let y = minY; y <= maxY; y++) {
      let line = '';
      for (let x = minX; x <= maxX; x++) {
        const isWall = this.walls.has(new DronePosition(x, y).toJson());
        if (x === 0 && y === 0) {
          line += 'X'
        } else if (this.oxygen && x === this.oxygen.x && y === this.oxygen.y) {
          line += 'O';
        } else {
          if (isWall) {
            line += '#';
          } else {
            line += ' ';
          }
        }
      }
      result = [line, ...result]
    }

    return '\n' + result.join('\n');
  }

  input(): number {
    let move = this.directionsToTry.shift();
    if (!move) {
      move = this.backtrack.pop()!!;
      this.backtracking = true;
      // console.log('BACK:', this.dronePosition, move);
    }

    if (!move) {
      console.log(this.print());
    }

    this.droneDirection = move!! as Direction;
    return this.droneDirection;
  }

  output(value: number): void {
    switch (value) {
      case 0:
        // console.log('WALL:', this.dronePosition, this.droneDirection);
        this.walls.add(this.dronePosition.move(this.droneDirection).toJson());
        break;
      case 1:
        this.dronePosition = this.dronePosition.move(this.droneDirection);
        this.path.add(this.dronePosition.toJson());
        this.directionsToTry = this.possibleDirections(this.oppositeDirection());
        // console.log('OK:', this.dronePosition, this.droneDirection);
        if (this.directionsToTry.length && !this.backtracking) {
          this.backtrack.push(this.oppositeDirection());
        } else {
          this.backtracking = false;
        }
        break;
      case 2:
        // console.log('OXYGEN:', this.dronePosition, this.droneDirection);
        this.dronePosition = this.dronePosition.move(this.droneDirection);
        this.directionsToTry = this.possibleDirections(this.oppositeDirection());
        this.path.add(this.dronePosition.toJson());
        this.oxygen = this.dronePosition;
    }
  }

  private possibleDirections(previousDirection: Direction | null = null): Direction[] {
    const allDirections: Direction[] = [North, East, South, West];
    if (previousDirection) {
      const possibleDirections = allDirections.filter(d => d !== previousDirection);
      return possibleDirections.filter(d => {
        const nextDronePosition = this.dronePosition.move(d).toJson();
        const isNotVisited = !this.path.has(nextDronePosition)
        const isNotWall = !this.walls.has(nextDronePosition);
        return isNotVisited && isNotWall;
      })
    } else {
      return allDirections;
    }
  }

  private oppositeDirection(): Direction {
    switch (this.droneDirection) {
      case North:
        return South;
      case South:
        return North;
      case West:
        return East;
      case East:
        return West;
    }
  }
}

export function part1(puzzle: number[]): number {
  const drone = new DroneIOHandler();
  const program = processor(puzzle, drone);
  executeProgram(program, drone);

  return drone.shortestPathToOxygen();
}

export function* processor(program: number[], io: IOHandler): Generator<number[], number[], void> {
  const registry = new Registry(program, io)

  while (true) {
    commandFactory(registry).execute(registry)
    if (registry.isRunning) {
      yield registry.registry
    } else {
      return registry.registry
    }
  }
}

export function executeProgram(program: ProgramProcessor, drone?: DroneIOHandler): number[] {
  let result: ProgramStep
  do {
    result = program.next();
  } while (result.done === false || (drone && !drone.foundOxygen))
  return result.value
}
