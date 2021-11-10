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

export class RobotIOHandler implements IOHandler {
  private robotPosition: RobotPosition = {x: 0, y: 0};
  private robotDirection: RobotDirection = 'U';

  private whitePaintedPanels: string[] = [];
  private blackPaintedPanels: string[] = [];
  private paintedPanels = new Set<string>();
  private currentRobotOutput: RobotOutputType = 'Color';

  constructor(startingPanelColor: number = 0) {
    if (startingPanelColor === 1) {
      this.whitePaintedPanels.push(this.positionString());
    } else {
      this.blackPaintedPanels.push(this.positionString());
    }
  }

  input() {
    const position = this.positionString();
    if (this.whitePaintedPanels.includes(position)) {
      return 1;
    } else {
      return 0;
    }
  }

  output(value: number): void {
    switch (this.currentRobotOutput) {
      case 'Color':
        this.currentRobotOutput = 'Direction';
        const position = this.positionString();
        if (value === 0) {
          this.blackPaintedPanels.push(position)
          this.whitePaintedPanels = this.whitePaintedPanels.filter(p => p !== position)
        } else {
          this.whitePaintedPanels.push(this.positionString());
          this.blackPaintedPanels = this.blackPaintedPanels.filter(p => p !== position)
        }
        this.paintedPanels.add(position);
        break
      case 'Direction':
        this.currentRobotOutput = 'Color';
        if (value === 0) {
          this.turnLeftAndMove();
        } else {
          this.turnRightAndMove();
        }
        break
    }
  }

  private positionString() {
    return `${this.robotPosition.x},${this.robotPosition.y}`
  }

  private turnLeftAndMove() {
    const moves: Record<RobotDirection, RobotDirection> = {
      'U': 'L',
      'L': 'D',
      'D': 'R',
      'R': 'U'
    }
    this.robotDirection = moves[this.robotDirection];
    this.doMove();
  }

  private turnRightAndMove() {
    const moves: Record<RobotDirection, RobotDirection> = {
      'U': 'R',
      'R': 'D',
      'D': 'L',
      'L': 'U'
    }
    this.robotDirection = moves[this.robotDirection];
    this.doMove();
  }

  private doMove() {
    if (this.robotDirection === 'D') {
      this.robotPosition = {x: this.robotPosition.x, y: this.robotPosition.y - 1};
    } else if (this.robotDirection === 'U') {
      this.robotPosition = {x: this.robotPosition.x, y: this.robotPosition.y + 1};
    } else if (this.robotDirection === 'R') {
      this.robotPosition = {x: this.robotPosition.x + 1, y: this.robotPosition.y};
    } else if (this.robotDirection === 'L') {
      this.robotPosition = {x: this.robotPosition.x - 1, y: this.robotPosition.y};
    }
  }

  get totalPaintedPanels() {
    return this.paintedPanels.size;
  }

  private positionFromString(str: string): RobotPosition {
    const [x, y] = str.split(',').map(p => parseInt(p));
    return {x, y}
  }

  printHaul() {
    const allPaintedPanels = Array.from(this.paintedPanels).map(this.positionFromString)
    const minX = allPaintedPanels.map(p => p.x).reduce((a, b) => a < b ? a : b);
    const maxX = allPaintedPanels.map(p => p.x).reduce((a, b) => a > b ? a : b);
    const minY = allPaintedPanels.map(p => p.y).reduce((a, b) => a < b ? a : b);
    const maxY = allPaintedPanels.map(p => p.y).reduce((a, b) => a > b ? a : b);

    let result:string[] = [];
    for (let y = minY; y <= maxY; y++) {
      let line = '';
      for (let x = minX; x <= maxX; x++) {
        const isWhite = this.whitePaintedPanels.includes(`${x},${y}`);
        if(isWhite) {
          line += '#';
        } else {
          line += ' ';
        }
      }
      result = [line, ...result]
    }

    return '\n'+result.join("\n");
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
  const robot = new RobotIOHandler()
  const program = processor(puzzle, robot);
  executeProgram(program);
  return robot.totalPaintedPanels
}

export function part2(puzzle: number[]) {
  const robot = new RobotIOHandler(1);
  const program = processor(puzzle, robot);
  executeProgram(program);
  return robot.printHaul()
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
