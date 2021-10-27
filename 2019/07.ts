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
    const input = registry.input();
    if (typeof (input) === 'undefined' || !registry.isRunning) {
      return;
    }
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
    throw new Error(`Unknown operation ${(currentCmd.command)}. Pointer: ${processor.pointer}, registry: ${processor.registry}`)
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
  io: IOHandler

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

  input() {
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

type GeneratorProgramProcessor = Generator<number[], number[], void>
type ProgramStep = IteratorResult<number[], number[]>

export function* generatorProcessor(program: number[], io: IOHandler): GeneratorProgramProcessor {
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

export function executeProgram(program: GeneratorProgramProcessor): number[] {
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

export function findMaxThrustersSignal(program: number[]): number {
  function executeWithInputSequence(program: number[], inputSequence: number[]): number {
    let thruster = new MultiInputIO([],);
    for (const thrusterIndex of [0, 1, 2, 3, 4]) {
      thruster = new MultiInputIO([inputSequence[thrusterIndex], thruster.result || 0])
      executeProgram(generatorProcessor([...program], thruster))
    }

    return thruster.result!;
  }

  return permute([0, 1, 2, 3, 4])
    .map(s => executeWithInputSequence([...program], s))
    .reduce((a, b) => a > b ? a : b);
}

class ProgramCoordinator {
  private programs: Registry[]
  lastOutput: number = NaN;

  constructor(programs: Registry[]) {
    this.programs = programs;
  }

  get currentProgramIo(): FeedbackLoopIo {
    return this.programs[0].io as FeedbackLoopIo
  }

  get nextProgramIo(): FeedbackLoopIo {
    return this.programs[1].io as FeedbackLoopIo;
  }

  switchToNextProgram() {
    const currentProgram = this.programs.shift()!
    this.programs.push(currentProgram);
  }

  runProgram() {
    const registry = this.programs[0]
    while (registry.isRunning) {
      commandFactory(registry).execute(registry)
    }
  }

  get anyRunning() {
    return this.programs.some(p => p.isRunning);
  }
}

class FeedbackLoopIo implements IOHandler {
  name: string
  programCoordinator: ProgramCoordinator | undefined
  private inputs: number[]

  constructor(name: string, inputs: number[]) {
    this.name = name;
    this.inputs = inputs
  }

  pushInput(val: number): void {
    this.inputs.push(val);
  }

  input(): number {
    while (this.inputs.length === 0 && this.programCoordinator!.anyRunning) {
      this.programCoordinator!.switchToNextProgram()
      this.programCoordinator!.runProgram()
    }

    return this.inputs.shift()!;
  }

  output(value: number): void {
    this.programCoordinator!.nextProgramIo.pushInput(value)
    this.programCoordinator!.lastOutput = value;
  }
}

export function findMaxThrustersSignalAmplified(program: number[]): number {
  function findMaxThrustersSignalAmplifiedUsingSequence(program: number[], inputSequence: number[]): number {
    function createThruster(name: string, program: number[], startingInput: number[]): [Registry, FeedbackLoopIo] {
      const io = new FeedbackLoopIo(name, startingInput);
      const registry = new Registry([...program], io);
      return [registry, io];
    }

    const aProgram = createThruster('A', program, [inputSequence[0], 0])
    const bProgram = createThruster('B', program, [inputSequence[1]])
    const cProgram = createThruster('C', program, [inputSequence[2]])
    const dProgram = createThruster('D', program, [inputSequence[3]])
    const eProgram = createThruster('E', program, [inputSequence[4]])

    const allPrograms = [aProgram, bProgram, cProgram, dProgram, eProgram]

    const coordinator = new ProgramCoordinator(allPrograms.map(p => p[0]));
    allPrograms.map(p => p[1]).forEach(io => io.programCoordinator = coordinator);
    coordinator.runProgram();

    return coordinator.lastOutput;
  }

  return permute([5, 6, 7, 8, 9])
    .map(s => findMaxThrustersSignalAmplifiedUsingSequence([...program], s))
    .reduce((a, b) => a > b ? a : b);
}

