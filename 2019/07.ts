interface Operation {
  execute(registry: Registry): void
}

type ParamIndex = 0 | 1 | 2
const FirstParam: ParamIndex = 0
const SecondParam: ParamIndex = 1
const ThirdParam: ParamIndex = 2

type OperandType = '0' | '1';
type OperandHandler = (param: ParamIndex, registry: Registry) => number
const PositionModeOperationHandler: OperandHandler = (param, registry) => registry.getValue(param);
const ImmediateModeOperationHandler: OperandHandler = (param, registry) => registry.getAtIndex(param);

type Command = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 99
type CommandType = {
  command: Command
  firstArg: OperandHandler | null,
  secondArg: OperandHandler | null,
  thirdArg: OperandHandler | null,
}

class AddOperation implements Operation {
  private readonly aHandler: OperandHandler
  private readonly bHandler: OperandHandler

  constructor(firstArg: OperandHandler, secondArg: OperandHandler) {
    this.aHandler = firstArg;
    this.bHandler = secondArg;
  }

  execute(registry: Registry) {
    const a = this.aHandler(FirstParam, registry)
    const b = this.bHandler(SecondParam, registry)
    const resultIndex = registry.getAtIndex(ThirdParam)
    registry.setValue(resultIndex, a + b)
    registry.moveForward(4)
  }
}

class MultiplyOperation implements Operation {
  private readonly aHandler: OperandHandler
  private readonly bHandler: OperandHandler

  constructor(firstArg: OperandHandler, secondArg: OperandHandler) {
    this.aHandler = firstArg;
    this.bHandler = secondArg;
  }

  execute(registry: Registry) {
    const a = this.aHandler(FirstParam, registry)
    const b = this.bHandler(SecondParam, registry)
    const resultIndex = registry.getAtIndex(ThirdParam)
    registry.setValue(resultIndex, a * b)
    registry.moveForward(4)
  }
}

const HaltOperation: Operation = {
  execute: registry => {
    registry.halt()
  }
}

const InputOperation: Operation = {
  execute(registry) {
    const input = registry.input;
    const inputRegistry = registry.getAtIndex(FirstParam);
    registry.setValue(inputRegistry, input);
    registry.moveForward(2);
  }
}

class OutputOperation implements Operation {
  private readonly aHandler: OperandHandler

  constructor(firstArg: OperandHandler) {
    this.aHandler = firstArg;
  }

  execute(registry: Registry) {
    const value = this.aHandler(FirstParam, registry);
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
    const a = this.aHandler(FirstParam, registry)
    const b = this.bHandler(SecondParam, registry)
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
    const a = this.aHandler(FirstParam, registry)
    const b = this.bHandler(SecondParam, registry)
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
    const a = this.aHandler(FirstParam, registry)
    const b = this.bHandler(SecondParam, registry)
    const c = this.cHandler(ThirdParam, registry)
    if (a < b) {
      registry.setValue(c, 1)
    } else {
      registry.setValue(c, 0)
    }

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
    const a = this.aHandler(FirstParam, registry)
    const b = this.bHandler(SecondParam, registry)
    const c = this.cHandler(ThirdParam, registry);
    if (a === b) {
      registry.setValue(c, 1)
    } else {
      registry.setValue(c, 0)
    }
    registry.moveForward(4);
  }
}

function commandFactory(processor: Registry): Operation {
  const currentCmd = processor.currentCmd;

  const commands: Record<Command, Operation> = {
    1: new AddOperation(currentCmd.firstArg!, currentCmd.secondArg!),
    2: new MultiplyOperation(currentCmd.firstArg!, currentCmd.secondArg!),
    3: InputOperation,
    4: new OutputOperation(currentCmd.firstArg!),
    5: new JumpIfTrueOperation(currentCmd.firstArg!, currentCmd.secondArg!),
    6: new JumpIfFalseOperation(currentCmd.firstArg!, currentCmd.secondArg!),
    7: new LessThanOperation(currentCmd.firstArg!, currentCmd.secondArg!, currentCmd.thirdArg!),
    8: new EqualsOperation(currentCmd.firstArg!, currentCmd.secondArg!, currentCmd.thirdArg!),
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
      '1': ImmediateModeOperationHandler
    }
    const firstArg = operandSelector[commandStr[2] as OperandType]
    const secondArg = operandSelector[commandStr[1] as OperandType]
    const thirdArg = ImmediateModeOperationHandler
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
    return this.io.input();
  }

  outputHandler(val: number) {
    return this.io.output(val);
  }

  get isRunning() {
    return this.instructionPointer >= 0 && this.instructionPointer < this.registry.length;
  }

  getValue(operandIndex: ParamIndex) {
    const position = this._registry[this.instructionPointer + operandIndex + 1]
    return this._registry[position];
  }

  getAtIndex(operandIndex: ParamIndex) {
    return this._registry[this.instructionPointer + operandIndex + 1]
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

export function permute(permutation: number[]) {
  const length = permutation.length
  const result = [permutation.slice()]
  const c = new Array(length).fill(0)
  let i = 1
  let k: number;
  let p: number;

  while (i < length) {
    if (c[i] < i) {
      k = i % 2 && c[i];
      p = permutation[i];
      permutation[i] = permutation[k];
      permutation[k] = p;
      ++c[i];
      i = 1;
      result.push(permutation.slice());
    } else {
      c[i] = 0;
      ++i;
    }
  }
  return result;
}

class MultiInputIO implements IOHandler {
  private readonly inputs: number[]
  result: number | undefined;

  constructor(inputs: number[], result: number = 0) {
    this.inputs = inputs
    this.result = result
  }

  input(): number {
    return this.inputs.shift()!;
  }

  output(value: number): void {
    if (value || value === 0) {
      this.result = value
    }
  }
}

function executeWithInputSequence(program: number[], inputSequence: number[]): number {
  let thruster = new MultiInputIO([],);
  for (const thrusterIndex of [0, 1, 2, 3, 4]) {
    thruster = new MultiInputIO([inputSequence[thrusterIndex], thruster.result || 0])
    executeProgram(processor([...program], thruster))
  }

  return thruster.result!;
}

export function findMaxThrustersSignal(program: number[]): number {
  const sequences = permute([0, 1, 2, 3, 4]);
  return sequences
    .map(s => executeWithInputSequence([...program], s))
    .reduce((a, b) => a > b ? a : b);
}
