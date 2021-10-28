type Layer<T> = Array<Array<T>>
type DigitsCount = Record<number, number>;

export function partitionToLayers<T>(array: T[], width: number, height: number): Layer<T>[] {
  const result: Layer<T>[] = [];
  let currentLayer: Layer<T> = [];
  for (let i = 0; i < array.length; i += width) {
    const end = Math.min(i + width, array.length);
    currentLayer.push([...array.slice(i, end)]);

    if (currentLayer.length == height) {
      result.push(currentLayer);
      currentLayer = [];
    }
  }
  return result;
}

export function flatten<T>(layer: Layer<T>): T[] {
  let result:T[] = []
  for(const l of layer) {
    result = [...result, ...l];
  }
  return result;
}

export function countDigits(array: number[]): DigitsCount {
  const result: DigitsCount = {};
  for (const number of array) {
    const currentCount = result[number] || 0;
    result[number] = currentCount + 1;
  }

  for (let i = 0; i < 3; i++) {
    if (!result[i]) {
      result[i] = 0;
    }
  }

  return result;
}

export function calculateChecksum(input: number[]): number {
  const partitioned = partitionToLayers(input, 25, 6);
  const flattened = partitioned.map(flatten);
  const digitsCountByRow = flattened.map(countDigits);
  const rowWithFewestZeros = digitsCountByRow.reduce((a, b) => a[0] < b[0] ? a : b);

  return rowWithFewestZeros[1] * rowWithFewestZeros[2];
}
