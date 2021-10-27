import {
  executeProgram,
  findMaxThrustersSignal,
  findMaxThrustersSignalAmplified,
  generatorProcessor,
  IOHandler,
  permute
} from './07';

describe('07.ts', () => {
  const noIO: IOHandler = {
    input: () => 0,
    output: (_: number) => ({})
  }

  test('sample1', () => {
    //given
    const program = [1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50];
    const programProcessor = generatorProcessor(program, noIO)

    //when
    const step1 = programProcessor.next()

    //then
    expect(step1.value).toStrictEqual([1, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50]);

    //when
    const step2 = programProcessor.next();

    //then
    expect(step2.value).toStrictEqual([3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50]);

    //then
    const step3 = programProcessor.next();

    //then
    expect(step3.value).toStrictEqual([3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50]);
    expect(step3.done).toBe(true);
  });

  [
    [[1, 0, 0, 0, 99], [2, 0, 0, 0, 99]],
    [[2, 3, 0, 3, 99], [2, 3, 0, 6, 99]],
    [[2, 4, 4, 5, 99, 0], [2, 4, 4, 5, 99, 9801]],
    [[1, 1, 1, 4, 99, 5, 6, 0, 99], [30, 1, 1, 4, 2, 5, 6, 0, 99]]
  ].forEach(([input, output]) => {
    test('computer', () => {
      //when
      const result = executeProgram(generatorProcessor(input, noIO));

      //then
      expect(result).toStrictEqual(output);
    });
  });

  it('works with io', () => {
    let output = -1
    const io: IOHandler = {
      input: () => 10,
      output: (a: number) => {
        output = a
      }
    }

    executeProgram(generatorProcessor([3, 0, 4, 0, 99], io));

    expect(output).toBe(10)
  });

  it('works with mixed mode types', () => {
    //given
    const program = [1002, 4, 3, 4, 33];

    //when
    const result = executeProgram(generatorProcessor(program, noIO));

    //then
    expect(result).toStrictEqual([1002, 4, 3, 4, 99])
  });

  describe('jumps', () => {
    it('test 1', () => {
      expect(
        executeWithInput(8, [3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8])
      ).toBe(1);

      expect(
        executeWithInput(9, [3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8])
      ).toBe(0)
    });

    it('test 2', () => {
      expect(
        executeWithInput(7, [3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8])
      ).toBe(1)
      expect(
        executeWithInput(8, [3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8])
      ).toBe(0)
    });

    it('test 3', () => {
      expect(
        executeWithInput(8, [3, 3, 1108, -1, 8, 3, 4, 3, 99])
      ).toBe(1)

      expect(
        executeWithInput(7, [3, 3, 1108, -1, 8, 3, 4, 3, 99])
      ).toBe(0)
    });

    it('test 4', () => {
      expect(
        executeWithInput(8, [3, 3, 1107, -1, 8, 3, 4, 3, 99])
      ).toBe(0);
      expect(
        executeWithInput(7, [3, 3, 1107, -1, 8, 3, 4, 3, 99])
      ).toBe(1);
    })

    it('test big', () => {
      expect(
        executeWithInput(
          7,
          [3, 21, 1008, 21, 8, 20, 1005, 20, 22, 107, 8, 21, 20, 1006, 20, 31, 1106, 0, 36, 98, 0, 0, 1002, 21, 125, 20, 4, 20, 1105, 1, 46, 104, 999, 1105, 1, 46, 1101, 1000, 1, 20, 4, 20, 1105, 1, 46, 98, 99])
      ).toBe(999);
      expect(
        executeWithInput(
          8,
          [3, 21, 1008, 21, 8, 20, 1005, 20, 22, 107, 8, 21, 20, 1006, 20, 31, 1106, 0, 36, 98, 0, 0, 1002, 21, 125, 20, 4, 20, 1105, 1, 46, 104, 999, 1105, 1, 46, 1101, 1000, 1, 20, 4, 20, 1105, 1, 46, 98, 99])
      ).toBe(1000);
      expect(
        executeWithInput(
          9,
          [3, 21, 1008, 21, 8, 20, 1005, 20, 22, 107, 8, 21, 20, 1006, 20, 31, 1106, 0, 36, 98, 0, 0, 1002, 21, 125, 20, 4, 20, 1105, 1, 46, 104, 999, 1105, 1, 46, 1101, 1000, 1, 20, 4, 20, 1105, 1, 46, 98, 99])
      ).toBe(1001);
    });
  });

  it('generates permutations', () => {
    const result = permute([1, 2, 3]).map(a => a.join(''));
    expect(result).toHaveLength(6);
    expect(result).toContain('123');
    expect(result).toContain('213');
    expect(result).toContain('312');
    expect(result).toContain('132');
    expect(result).toContain('231');
    expect(result).toContain('321');
  });

  describe('amplifiers', () => {
    it('sample 1', () => {
      const program = [3, 15, 3, 16, 1002, 16, 10, 16, 1, 16, 15, 15, 4, 15, 99, 0, 0];

      const result = findMaxThrustersSignal(program);

      expect(result).toBe(43210);
    });

    it('sample 2', () => {
      const program = [3, 23, 3, 24, 1002, 24, 10, 24, 1002, 23, -1, 23, 101, 5, 23, 23, 1, 24, 23, 23, 4, 23, 99, 0, 0];

      const result = findMaxThrustersSignal(program);

      expect(result).toBe(54321);
    });

    it('sample 3', () => {
      const program = [3, 31, 3, 32, 1002, 32, 10, 32, 1001, 31, -2, 31, 1007, 31, 0, 33, 1002, 33, 7, 33, 1, 33, 31, 31, 1, 32, 31, 31, 4, 31, 99, 0, 0, 0];

      const result = findMaxThrustersSignal(program);

      expect(result).toBe(65210);
    });
  });

  describe('amplifiers with feedback loop', () => {
    it('sample 1', () => {
      const program = [3, 26, 1001, 26, -4, 26, 3, 27, 1002, 27, 2, 27, 1, 27, 26, 27, 4, 27, 1001, 28, -1, 28, 1005, 28, 6, 99, 0, 0, 5];

      const result = findMaxThrustersSignalAmplified(program)

      expect(result).toBe(139629729);
    });

    it('sample 2', () => {
      const program = [3, 52, 1001, 52, -5, 52, 3, 53, 1, 52, 56, 54, 1007, 54, 5, 55, 1005, 55, 26, 1001, 54, -5, 54, 1105, 1, 12, 1, 53, 54, 53, 1008, 54, 0, 55, 1001, 55, 1, 55, 2, 53, 55, 53, 4, 53, 1001, 56, -1, 56, 1005, 56, 6, 99, 0, 0, 0, 0, 10];

      const result = findMaxThrustersSignalAmplified(program)

      expect(result).toBe(18216);
    });
  });

  function executeWithInput(input: number, program: number[]): number {
    let output = -1
    const io: IOHandler = {
      input: () => input,
      output: (a: number) => {
        output = a
      }
    }

    executeProgram(generatorProcessor(program, io));

    return output
  }
});
