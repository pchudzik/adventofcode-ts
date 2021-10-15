function hasSixCharacters(pass: string) {
  return pass.length === 6;
}

function hasTwoTheSameAdjacentDigits(pass: string) {
  return [...pass].some(p => pass.includes(p + p))
}

function digitsNeverDecrease(pass: string) {
  for (let i = 0; i < pass.length - 1; i++) {
    let current = pass[i]
    let next = pass[i + 1]
    if (parseInt(current) > parseInt(next)) {
      return false
    }
  }

  return true;
}

function twoAdjacentMatchingDigitsAreNotPartOfLargerGroupOfMatchingDigits(pass: string) {
  function countCharacters(str: string, char: string) {
    return (str.match(new RegExp(char, 'g')) || []).length
  }

  const digitCount = [...pass].map(p => countCharacters(pass, p));

  if (digitCount.some((occurences) => occurences > 2)) {
    return digitCount.some((occurences) => occurences === 2)
  }
  return true
}

type Validator = (pass: string) => boolean

function isValidPassword(pass: string, validators: Validator[]) {
  return validators.every(v => v(pass))
}

const part1Validator = [hasSixCharacters, hasTwoTheSameAdjacentDigits, digitsNeverDecrease]
const part2Validator = [...part1Validator, twoAdjacentMatchingDigitsAreNotPartOfLargerGroupOfMatchingDigits]

export function part1IsValidPassword(pass: string) {
  return isValidPassword(pass, part1Validator)
}

export function part2IsValidPassword(pass: string) {
  return isValidPassword(pass, part2Validator)
}

export function* passwordFactory(min: number, max: number, passwordValidator: Validator): Generator<number, void, void> {
  for (let i = min; i <= max; i++) {
    if (passwordValidator('' + i)) {
      yield i;
    }
  }
}
