import { DroneIOHandler, East, executeProgram, IOHandler, North, processor, South, West } from './15';
import { expect } from '@jest/globals';

describe('15.ts', () => {
  const noIO: IOHandler = {
    input: () => 0,
    output: (_: number) => ({})
  }

  function rememberEveryOutputIO(): [outputs: number[], io: IOHandler] {
    const outputs: number[] = []
    return [
      outputs, {
        input: () => 0,
        output: (val: number) => outputs.push(val)
      }
    ];
  }

  test('sample1', () => {
    //given
    const program = [1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50];
    const programProcessor = processor(program, noIO)

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
      const result = executeProgram(processor(input, noIO));

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

    executeProgram(processor([3, 0, 4, 0, 99], io));

    expect(output).toBe(10)
  });

  describe('operation modes', () => {
    it('works with mixed mode types', () => {
      //given
      const program = [1002, 4, 3, 4, 33];

      //when
      const result = executeProgram(processor(program, noIO));

      //then
      expect(result).toStrictEqual([1002, 4, 3, 4, 99])
    });

    describe('works with relative mode', () => {
      it('sample1', () => {
        const program = [109, 1, 204, -1, 1001, 100, 1, 100, 1008, 100, 16, 101, 1006, 101, 0, 99];
        const [outputs, ioHandler] = rememberEveryOutputIO();

        executeProgram(processor([...program], ioHandler));

        expect(outputs).toStrictEqual(program);
      });

      it('sample2', () => {
        const program = [1102, 34915192, 34915192, 7, 4, 7, 99, 0];
        const [outputs, ioHandler] = rememberEveryOutputIO();

        executeProgram(processor([...program], ioHandler));

        expect(outputs).toHaveLength(1);
        expect('' + outputs[0]).toHaveLength(16); //should output a 16-digit number.
      });

      it('sample3', () => {
        const program = [104, 1125899906842624, 99];
        const [outputs, ioHandler] = rememberEveryOutputIO();

        executeProgram(processor([...program], ioHandler));

        expect(outputs).toStrictEqual([1125899906842624]);
      });
    });
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
  })

  describe('drone handler', () => {
    xit('dron handler can backtrack itself to starting point', () => {
      /*
      ###
      # #
      # #
      #D#
       */
      const drone = new DroneIOHandler();

      //step 1
      expect(drone.input()).toBe(North);
      drone.output(1);
      expect(drone.position()).toStrictEqual({x: 0, y: 1})
      expect(drone.directions).toStrictEqual([North, East, West]);

      //step 2
      expect(drone.input()).toBe(North);
      drone.output(1);
      expect(drone.position()).toStrictEqual({x: 0, y: 2})
      expect(drone.directions).toStrictEqual([North, East, West]);

      //step 3 wall North
      expect(drone.input()).toBe(North);
      drone.output(0);
      expect(drone.position()).toStrictEqual({x: 0, y: 2})
      expect(drone.directions).toStrictEqual([East, West]);

      // step 4 wall East
      expect(drone.input()).toBe(East);
      drone.output(0);
      expect(drone.position()).toStrictEqual({x: 0, y: 2})
      expect(drone.directions).toStrictEqual([West]);

      // step 4 wall West
      expect(drone.input()).toBe(West);
      drone.output(0);
      expect(drone.position()).toStrictEqual({x: 0, y: 2})
      expect(drone.directions).toStrictEqual([]);

      //step 5 move back 1 South
      expect(drone.input()).toBe(South);
      drone.output(1);
      expect(drone.position()).toStrictEqual({x: 0, y: 1})
      expect(drone.directions).toStrictEqual([East, South, West]);

      // step 6 wall East
      expect(drone.input()).toBe(East);
      drone.output(0);
      expect(drone.position()).toStrictEqual({x: 0, y: 1})
      expect(drone.directions).toStrictEqual([South, West]);

      // step 7 wall West
      expect(drone.input()).toBe(West);
      drone.output(0);
      expect(drone.position()).toStrictEqual({x: 0, y: 1})
      expect(drone.directions).toStrictEqual([]);

      //step 8 move back 1 South
      expect(drone.input()).toBe(South);
      drone.output(1);
      expect(drone.position()).toStrictEqual({x: 0, y: 0})
      expect(drone.directions).toStrictEqual([East, South, West]);
    })
  });

  function executeWithInput(input: number, program: number[]): number {
    let output = -1
    const io: IOHandler = {
      input: () => input,
      output: (a: number) => {
        output = a
      }
    }

    executeProgram(processor(program, io));

    return output
  }
});
