type Planet = {
  name: string,
  parent: Planet | null,
  children: Planet[]
}

class PlanetSystem {
  private readonly planetsByName: Record<string, Planet> = {}

  constructor(planets: Planet[]) {
    this.planetsByName = planets
      .reduce(
        (system, planet) => ({...system, [planet.name]: planet}),
        {} as Record<string, Planet>
      );
  }

  countOrbits(planetName: string): number {
    let count = 0;
    let planet = this.planetsByName[planetName]
    while (planet.parent !== null) {
      count++;
      planet = planet.parent;
    }

    return count;
  }

  countAllOrbits(): number {
    return Object
      .keys(this.planetsByName)
      .reduce((count, planetName) => count + this.countOrbits(planetName), 0);
  }

  countOrbitJumps(from: string, to: string): number {
    const fromParent = this.planetsByName[from].parent!;
    const toParent = this.planetsByName[to].parent!;

    return PlanetSystem.countShortestDistance(fromParent, toParent);
  }

  private static countShortestDistance(startNode: Planet, endNode: Planet): number {
    const visited = new Set<Planet>([startNode]);
    type BFSNode = {
      node: Planet,
      distance: number;
    }
    const queue: BFSNode[] = [{node: startNode, distance: 0}]

    while (queue.length > 0) {
      const {node, distance} = queue.shift()!
      if (node == endNode) {
        return distance;
      }

      for (let neighbour of [...node.children, node.parent]) {
        if (neighbour && !visited.has(neighbour)) {
          queue.push({node: neighbour, distance: distance + 1})
          visited.add(neighbour);
        }
      }
    }

    return -1;
  }
}

export function parsePlanets(input: string[]): PlanetSystem {
  const cache: Record<string, Planet> = {}
  for (const planetString of input) {
    const [planetName, childName] = planetString.split(')')
    let parent = cache[planetName]
    let child = cache[childName]
    if (!parent) {
      parent = {
        name: planetName,
        parent: null,
        children: []
      }
      cache[planetName] = parent;
    }

    if (!child) {
      child = {
        name: childName,
        parent: parent,
        children: []
      }
      cache[childName] = child;
    }

    child.parent = parent;
    parent.children.push(child);
  }

  return new PlanetSystem(Object.values(cache));
}

