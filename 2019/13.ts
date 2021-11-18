interface Operation {
  execute(computer: Computer): void
}

type ParamIndex = 0 | 1 | 2
const FirstParam: ParamIndex = 0
const SecondParam: ParamIndex = 1
const ThirdParam: ParamIndex = 2

type OperandType = '0' | '1' | '2';

interface OperandHandler {
  getValue(param: ParamIndex, computer: Computer): number

  setValue(param: ParamIndex, value: number, computer: Computer): void
}

const PositionModeOperationHandler: OperandHandler = {
  getValue(param, computer) {
    return computer.getUsingPositionMode(param)
  },
  setValue(param: ParamIndex, value, computer) {
    const resultIndex = computer.getUsingImmediateMode(param)
    computer.setValue(resultIndex, value)
  }
};
const ImmediateModeOperationHandler: OperandHandler = {
  getValue(param, computer) {
    return computer.getUsingImmediateMode(param)
  },
  setValue(param: ParamIndex, value: number, computer: Computer) {
    throw new Error('Set value not supported!');
  }
};
const RelativeModeOperationHandler: OperandHandler = {
  getValue(param, computer) {
    return computer.getUsingRelativeMode(param);
  },
  setValue(param: ParamIndex, value: number, computer: Computer): void {
    const position = computer.getUsingImmediateMode(param) + computer.relativeBase;
    computer.setValue(position, value);
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

  execute(computer: Computer) {
    const a = this.aHandler.getValue(FirstParam, computer)
    const b = this.bHandler.getValue(SecondParam, computer)
    this.resultHandler.setValue(ThirdParam, a + b, computer);
    computer.moveInstructionPointer(4)
  }
}

class ChangeRelativeBaseOperation implements Operation {
  private readonly aHandler: OperandHandler

  constructor(firstArg: OperandHandler) {
    this.aHandler = firstArg;
  }

  execute(computer: Computer): void {
    const relativeBase = this.aHandler.getValue(FirstParam, computer);
    computer.changeRelativeBase(relativeBase)
    computer.moveInstructionPointer(2);
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

  execute(computer: Computer) {
    const a = this.aHandler.getValue(FirstParam, computer)
    const b = this.bHandler.getValue(SecondParam, computer)
    this.resultHandler.setValue(ThirdParam, a * b, computer);
    computer.moveInstructionPointer(4)
  }
}

const HaltOperation: Operation = {
  execute: computer => {
    computer.halt()
  }
}

class InputOperation implements Operation {
  private readonly resultHandler: OperandHandler;

  constructor(resultHandler: OperandHandler) {
    this.resultHandler = resultHandler;
  }

  execute(computer: Computer) {
    const input = computer.input();
    this.resultHandler.setValue(FirstParam, input, computer)
    computer.moveInstructionPointer(2);
  }
}

class OutputOperation implements Operation {
  private readonly aHandler: OperandHandler

  constructor(firstArg: OperandHandler) {
    this.aHandler = firstArg;
  }

  execute(computer: Computer) {
    const value = this.aHandler.getValue(FirstParam, computer);
    computer.outputHandler(value)
    computer.moveInstructionPointer(2);
  }
}

class JumpIfTrueOperation implements Operation {
  private readonly aHandler: OperandHandler
  private readonly bHandler: OperandHandler

  constructor(firstArg: OperandHandler, secondArg: OperandHandler) {
    this.aHandler = firstArg;
    this.bHandler = secondArg;
  }

  execute(computer: Computer): void {
    const a = this.aHandler.getValue(FirstParam, computer)
    const b = this.bHandler.getValue(SecondParam, computer)
    if (a !== 0) {
      computer.setInstructionPointerTo(b)
    } else {
      computer.moveInstructionPointer(3);
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

  execute(computer: Computer): void {
    const a = this.aHandler.getValue(FirstParam, computer)
    const b = this.bHandler.getValue(SecondParam, computer)
    if (a === 0) {
      computer.setInstructionPointerTo(b)
    } else {
      computer.moveInstructionPointer(3);
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

  execute(computer: Computer): void {
    const a = this.aHandler.getValue(FirstParam, computer)
    const b = this.bHandler.getValue(SecondParam, computer)
    this.cHandler.setValue(ThirdParam, a < b ? 1 : 0, computer)
    computer.moveInstructionPointer(4);
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

  execute(computer: Computer): void {
    const a = this.aHandler.getValue(FirstParam, computer)
    const b = this.bHandler.getValue(SecondParam, computer)
    this.cHandler.setValue(ThirdParam, a === b ? 1 : 0, computer);
    computer.moveInstructionPointer(4);
  }
}

function commandFactory(computer: Computer): Operation {
  const currentCmd = computer.currentCmd;

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
    throw Error(`Unknown operation ${(currentCmd.command)}. Pointer: ${computer.pointer}, program: ${computer.program}`)
  }
  return cmd;
}

export type IOHandler = {
  input: () => number,
  output: (value: number) => void
}

type RobotDirection = 'U' | 'D' | 'L' | 'R';
type RobotPosition = { x: number, y: number }
type RobotOutputType = 'Color' | 'Direction';

const EmptyTile = 0
const WallTile = 1
const BlockTile = 2
const PaddleTile = 3
const BallTile = 4
type Tile = 0 | 1 | 2 | 3 | 4;

interface GameObject {
  x: number
  y: number
  tile: Tile
}

export class ScreenIOHandler implements IOHandler {
  private currentGameObject: GameObject = ScreenIOHandler.newGameObject();
  private static readonly xOutputState = 0;
  private static readonly yOutputState = 1;
  private static readonly tileOutputState = 2;
  private state = 0;
  currentScore = 0;

  private blocks: GameObject[] = []
  private walls: GameObject[] = []
  private paddlePosition:GameObject = {x:-1, y:-1, tile: PaddleTile}
  private ballPosition:GameObject ={x:-1, y:-1, tile: BallTile};

  input(): number {
    if(this.paddlePosition.x - this.ballPosition.x < 0) {
      return 1;
    } else if(this.paddlePosition.x - this.ballPosition.x > 0) {
      return -1;
    } else {
      return 0
    }
  }

  output(value: number): void {
    if (this.state == ScreenIOHandler.xOutputState) {
      this.currentGameObject.x = value;
      this.state = ScreenIOHandler.yOutputState;
    } else if (this.state == ScreenIOHandler.yOutputState) {
      this.currentGameObject.y = value;
      this.state = ScreenIOHandler.tileOutputState;
    } else if (this.state == ScreenIOHandler.tileOutputState) {
      if(this.currentGameObject.x === -1 && this.currentGameObject.y === 0) {
        this.currentScore = value;
        this.currentGameObject = ScreenIOHandler.newGameObject();
        this.state = ScreenIOHandler.xOutputState;
      } else {
        if(value === BlockTile) {
          this.currentGameObject.tile = value as Tile;
          this.blocks.push(this.currentGameObject)
        }  else if(value === WallTile) {
          this.currentGameObject.tile = value as Tile;
          this.walls.push(this.currentGameObject);
        } else if(value ===BallTile) {
          this.currentGameObject.tile = value as Tile;
          this.ballPosition = this.currentGameObject;
        } else if(value === PaddleTile){
          this.currentGameObject.tile = value as Tile;
          this.paddlePosition = this.currentGameObject;
        } else {
          this.currentScore = value;
        }
        this.state = ScreenIOHandler.xOutputState;
        this.currentGameObject = ScreenIOHandler.newGameObject()
      }
    }
  }

  private static newGameObject() {
    return {
      x: NaN,
      y: NaN,
      tile: EmptyTile
    } as GameObject;
  }

  get numberOfBlockTiles() {
    return this.blocks.filter(s => s.tile === BlockTile).length;
  }
}

class Computer {
  private _program: number[]
  private instructionPointer: number
  private io: IOHandler
  relativeBase = 0;

  constructor(program: number[], inputProvider: IOHandler, instructionPointer = 0) {
    this._program = program;
    this.instructionPointer = instructionPointer
    this.io = inputProvider
  }

  get currentCmd(): CommandType {
    const commandStr = (this._program[this.instructionPointer] + '').padStart(5, '0').split('');
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

  get program() {
    return [...this._program]
  }

  input() {
    return this.io.input();
  }

  outputHandler(val: number) {
    return this.io.output(val);
  }

  get isRunning() {
    return this.instructionPointer >= 0 && this.instructionPointer < this.program.length;
  }

  getUsingPositionMode(operandIndex: ParamIndex) {
    const position = this._program[this.instructionPointer + operandIndex + 1]
    return this._program[position] || 0;
  }

  getUsingRelativeMode(operandIndex: ParamIndex) {
    const position = this._program[this.instructionPointer + operandIndex + 1] + this.relativeBase;
    return this._program[position] || 0;
  }

  getUsingImmediateMode(operandIndex: ParamIndex) {
    return this._program[this.instructionPointer + operandIndex + 1] || 0;
  }

  setValue(position: number, value: number) {
    this._program[position] = value
  }

  halt() {
    this.instructionPointer = -1;
  }

  moveInstructionPointer(number: number) {
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

export function part1(puzzle: number[]) {
  const screen = new ScreenIOHandler()
  const program = processor(puzzle, screen);
  executeProgram(program);
  return screen.numberOfBlockTiles;
}

export function part2(puzzle: number[]) {
  const screen = new ScreenIOHandler();
  const program = processor(puzzle, screen);
  executeProgram(program);
  return screen.currentScore;
}

export function* processor(programInstructions: number[], io: IOHandler): ProgramProcessor {
  const program = new Computer(programInstructions, io)

  while (true) {
    commandFactory(program).execute(program)
    if (program.isRunning) {
      yield program.program
    } else {
      return program.program
    }
  }
}

export function executeProgram(program: ProgramProcessor): number[] {
  let result: ProgramStep
  do {
    result = program.next()
  } while (result.done === false)
  return result.value
}
