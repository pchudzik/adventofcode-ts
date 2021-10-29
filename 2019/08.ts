type Layer = Array<Array<Color>>
type DigitsCount = Record<number, number>;

const BlackColor = 0
const WhiteColor = 1
const TransparentColor = 2;

type White = 0
type Black = 1
type Transparent = 2;
type Color = White | Black | Transparent;

export function partitionToLayers<T>(array: Color[], width: number, height: number): Layer[] {
  const result: Layer[] = [];
  let currentLayer: Layer = [];
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

export function flatten(layer: Layer): Color[] {
  let result: Color[] = []
  for (const l of layer) {
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

export function printImage(layers: Layer[]): string[] {
  function printSinglePixel(pixelsInLayer: Color[]): number {
    const result = pixelsInLayer.find(p => [WhiteColor, BlackColor].includes(p));
    if (typeof result === 'undefined') {
      return TransparentColor
    }
    return result;
  }

  const width = layers[0][0].length;
  const height = layers[0].length;

  const result: string[] = []
  for (let h = 0; h < height; h++) {

    let row: string[] = [];
    for (let w = 0; w < width; w++) {

      const pixels = layers.map(l => l[h][w])
      const x = printSinglePixel(pixels);
      row.push(x.toString());
    }
    result.push(row.join(''));
    row = [];
  }

  return result;
}

export function prettyPrint(img: string[]): string {
  return img
    .map(r => r
      .replace(new RegExp('' + WhiteColor, 'g'), 'X')
      .replace(new RegExp('' + TransparentColor, 'g'), '')
      .replace(new RegExp('' + BlackColor, 'g'), ' '))
    .join('\n');
}

export function parseImage(str: string): Color[] {
  return str.split('').map(s => parseInt(s) as Color);
}

export function calculateChecksum(input: Color[], width: number, heigth: 6): number {
  const partitioned = partitionToLayers(input, width, heigth);
  const flattened = partitioned.map(flatten);
  const digitsCountByRow = flattened.map(countDigits);
  const rowWithFewestZeros = digitsCountByRow.reduce((a, b) => a[0] < b[0] ? a : b);

  return rowWithFewestZeros[1] * rowWithFewestZeros[2];
}
