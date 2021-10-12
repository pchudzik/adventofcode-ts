const addOperation = (a: number, b: number) => a + b
const multiplyOperation = (a: number, b: number) => a * b

export class ProgramStep {
  public readonly isRunning: boolean
  public readonly currentPosition: number
  public readonly program: number[]

  constructor(isRunning: boolean, currentPosition: number, program: number[]) {
    this.isRunning = isRunning;
    this.currentPosition = currentPosition;
    this.program = program;
  }

  getOperation(): number {
    return this.program[this.currentPosition]
  }

  getA() {
    const aPosition = this.program[this.currentPosition + 1]
    return this.program[aPosition];
  }

  getB() {
    const bPosition = this.program[this.currentPosition + 2]
    return this.program[bPosition];
  }

  private getResultPosition() {
    return this.program[this.currentPosition + 3]
  }

  updateResult(result: number): ProgramStep {
    const processedProgram = [...this.program]
    processedProgram[this.getResultPosition()] = result

    return new ProgramStep(
      true,
      this.currentPosition + 4,
      processedProgram,
    );
  }

  finished(): ProgramStep {
    return new ProgramStep(
      false,
      this.currentPosition,
      [...this.program]
    );
  }
}

export function processProgram(program: ProgramStep): ProgramStep {
  const operation = getOperation()

  if (operation) {
    const a = program.getA()
    const b = program.getB();
    const result = operation(a, b)
    return program.updateResult(result);
  } else {
    return program.finished()
  }

  function getOperation(): ((a: number, b: number) => number) | undefined {
    switch (program.getOperation()) {
      case 1:
        return addOperation
      case 2:
        return multiplyOperation;
      case 99:
        return;
      default:
        throw Error(`Unknown operation ${(program.getOperation())}`)
    }
  }
}

export function computer(program: ProgramStep): ProgramStep {
  while (program.isRunning) {
    program = processProgram(program);
  }

  return program;
}
