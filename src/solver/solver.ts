import { template } from "@babel/core";
import * as util from "util";

export interface Template {
  inputs: ItemCount[];
  outputs: ItemCount[];
  duration: number;
}

export interface ItemCount {
  item: string;
  count: number;
}

export class ProductionNode {
  template: Template;
  sources?: ProductionNode[] = [];
  destinations?: ProductionNode[] = [];

  constructor(template: Template) {
    this.template = template;
  }

  findUp(name: string): ProductionNode | undefined {
    if (this.template.outputs.find(f => f.item == name)) {
      return this;
    }

    for (const d of this.destinations) {
      const found = d.findUp(name);
      if (found) {
        return found;
      }
    }
  }

  [util.inspect.custom](depth: number, opts: any) {
    const inputs: string =
      this.template.inputs.map((i, n) => `${i.count} ${i.item}`).join(" + ") ||
      "none";

    const outputs = this.template.outputs
      .map(i => `${i.count} ${i.item}`)
      .join(" + ");

    var sourceRecipes: string = this.sources
      .map(s => s[util.inspect.custom](depth + 1, opts))
      .join("\n" + "  ".repeat(depth));

    if (sourceRecipes)
      sourceRecipes = "\n" + "  ".repeat(depth) + sourceRecipes;

    return `${inputs} = ${outputs}${sourceRecipes}`;
  }
}

export function clone(node: ProductionNode): ProductionNode {
  const seen = new Map<ProductionNode, ProductionNode>();
  const stack: ProductionNode[] = [node];

  const newNode = new ProductionNode(node.template);
  seen.set(node, newNode);

  while (stack.length) {
    const v = stack.pop();

    for (const old of v.destinations) {
      let neighbour = seen.get(old);
      if (!neighbour) {
        neighbour = new ProductionNode(old.template);
        stack.push(old);
        seen.set(old, neighbour);
      }

      seen.get(v).destinations.push(neighbour);
    }

    for (const old of v.sources) {
      let neighbour = seen.get(old);
      if (!neighbour) {
        neighbour = new ProductionNode(old.template);
        stack.push(old);
        seen.set(old, neighbour);
      }

      seen.get(v).sources.push(neighbour);
    }
  }
  return newNode;
}

export function solve(
  producers: Template[],
  target: ItemCount
): ProductionNode[] {
  const producerByInput = createProducerMap(producers);
  let incomplete = producerByInput[target.item].map(
    template => new ProductionNode(template)
  );
  let results = new Set<ProductionNode>();

  // let results: ProductionNode[] = [...incomplete];

  while (incomplete.length > 0) {
    const node = incomplete.shift();
    results.delete(node);
    const inputs = flattenInputs(
      node.template.inputs.map(i => producerByInput[i.item])
    );

    for (let i = 0; i < inputs.length; i++) {
      const way = inputs[i];
      let graph = clone(node);
      results.add(graph.findUp(target.item));

      for (const input of way) {
        const newNode = new ProductionNode(input);
        graph.sources.push(newNode);
        newNode.destinations.push(graph);
        incomplete.push(newNode);
      }
    }
  }
  return Array.from(results);
}

// takes an array in the form
// using notation i1m2 to denote input 1 for method 2
// [
//   [i1m1, i1m2],
//   [i2m1, i2m2],
//   [i3m1],
// ]
//
// and turns it into
// [
//   [i1m1, i2m1, i3m1],
//   [i1m1, i2m2, i3m1],
//   [i1m2, i2m1, i3m1],
//   [i1m2, i2m2, i3m1],
// ]
export function flattenInputs(inputs: Template[][]): Template[][] {
  if (inputs.length == 0) return [];
  if (inputs.length == 1) {
    if (!inputs[0]) {
      return [];
    }
    return inputs[0].map(way => [way]);
  }

  let results: Template[][] = [];
  for (let way of inputs[0]) {
    for (let rest of flattenInputs(inputs.slice(1))) {
      results.push([way, ...rest]);
    }
  }
  return results;
}

function createProducerMap(
  producers: Template[]
): { [item: string]: Template[] } {
  let producerByInput: { [item: string]: Template[] } = {};

  for (const block of producers) {
    for (const out of block.outputs) {
      if (!producerByInput[out.item]) {
        producerByInput[out.item] = [];
      }

      producerByInput[out.item].push(block);
    }
  }
  return producerByInput;
}
