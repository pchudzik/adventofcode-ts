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
    const input = registry.input;
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
  input: number,
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

  get input() {
    return this.io.input;
  }

  get outputHandler() {
    return this.io.output;
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

export function executeProgram(program: ProgramProcessor): number[] {
  let result: ProgramStep
  do {
    result = program.next()
  } while (result.done === false)
  return result.value
}
