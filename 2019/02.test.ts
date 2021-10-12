import { computer, processProgram, ProgramStep } from './02';

describe('02.ts', () => {
  test('sample1', () => {
    //given
    const program = [1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50];
    let step0 = new ProgramStep(true, 0, program);

    //when
    const step1 = processProgram(step0);

    //then
    expect(step1.program).toStrictEqual([1, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50]);

    //when
    const step2 = processProgram(step1);

    //then
    expect(step2.program).toStrictEqual([3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50]);

    //then
    const step3 = processProgram(step2);

    //then
    expect(step3.program).toStrictEqual([3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50]);
    expect(step3.isRunning).toBe(false);
  });

  [
    [[1, 0, 0, 0, 99], [2, 0, 0, 0, 99]],
    [[2, 3, 0, 3, 99], [2, 3, 0, 6, 99]],
    [[2, 4, 4, 5, 99, 0], [2, 4, 4, 5, 99, 9801]],
    [[1, 1, 1, 4, 99, 5, 6, 0, 99], [30, 1, 1, 4, 2, 5, 6, 0, 99]]
  ].forEach(([input, output]) => {
    test('computer', () => {
      //when
      const result = computer(new ProgramStep(true, 0, input));

      //then
      expect(result.program).toStrictEqual(output);
    });
  });
});
