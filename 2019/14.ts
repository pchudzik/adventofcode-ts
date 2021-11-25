interface Ingredient {
  chemicalName: string,
  amount: number
}

interface ChemicalReaction {
  outputIngredient: Ingredient
  inputIngredients: Ingredient[]
}

function parsePuzzle(puzzle: string) {
  function parseIngredient(str: string): Ingredient {
    const [amount, name] = str.trim().split(' ').map(s => s.trim());
    return {
      chemicalName: name.trim(),
      amount: parseInt(amount.trim())
    }
  }

  function parseChemicalReaction(reaction: string): ChemicalReaction {
    const [input, output] = reaction.split('=>')
      .map(s => s.trim())
    return {
      outputIngredient: parseIngredient(output),
      inputIngredients: input.split(',').map(parseIngredient)
    }
  }

  return puzzle.trim()
    .split('\n')
    .map(parseChemicalReaction)
}

const FUEL = 'FUEL'
const ORE = 'ORE'

function findChemical(chemicals: ChemicalReaction[], name: string) {
  return chemicals.find(ch => ch.outputIngredient.chemicalName === name)!!;
}

function findAmountOfOre(chemicals: ChemicalReaction[], outputChemical: ChemicalReaction, outputAmount: number) {
  const extraItems: Record<string, number> = chemicals
    .map(it => ({[it.outputIngredient.chemicalName]: 0}))
    .reduce((a, b) => ({...a, ...b}))

  function produceChemical(amount: number, recipe: ChemicalReaction): number {
    const extraAmount = extraItems[recipe.outputIngredient.chemicalName]
    const multiple = Math.ceil(Math.max(amount - extraAmount, 0) / recipe.outputIngredient.amount)
    const extra = (recipe.outputIngredient.amount * multiple) - (amount - extraAmount)
    extraItems[recipe.outputIngredient.chemicalName] = extra;
    return recipe.inputIngredients
      .map(ingr => {
        if (ingr.chemicalName === ORE) {
          return multiple * ingr.amount;
        } else {
          return produceChemical(multiple * ingr.amount, findChemical(chemicals, ingr.chemicalName));
        }
      })
      .reduce((a, b) => a + b);
  }

  return produceChemical(outputAmount, outputChemical);
}

export function part1(puzzle: string) {
  const reactions = parsePuzzle(puzzle);
  const fuel = findChemical(reactions, FUEL);
  return findAmountOfOre(reactions, fuel, 1);
}

export function part2(puzzle: string) {
  const cargoSize = 1000000000000;
  const reactions = parsePuzzle(puzzle);
  const fuel = findChemical(reactions, FUEL);

  let step = Math.floor(cargoSize / 2);
  let fuelAmount = Math.floor(cargoSize / 2);

  const guess: number[] = [];
  while (true) {
    const oreUsed = findAmountOfOre(reactions, fuel, fuelAmount)

    if (cargoSize - oreUsed > 0) {
      guess.push(fuelAmount);
    }

    if (step === 1) {
      return guess.pop()!!
    }

    step = Math.ceil(step / 2);
    if (oreUsed > cargoSize) {
      fuelAmount -= step;
    } else {
      fuelAmount += step;
    }
  }
}
