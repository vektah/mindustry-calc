import * as util from "util";

export interface Template {
  inputs: ItemCount[];
  outputs: ItemCount[];
}

export interface ItemCount {
  item: string;
  count: number;
}

export class ProductionNode {
  template: Template;
  sources?: Link[];
  destinations?: Link[];
  recursionDepth: number = 0;

  constructor(template: Template, targets: ItemCount[]) {
    this.template = template;
    this.destinations = targets.map(t => new Link(t));
    this.sources = this.template.inputs.map(i => {
      return new Link({
        item: i.item,
        count: this.requiredInputAmount(i.item)
      });
    });
  }

  addDestination(
    consumer: ProductionNode,
    consumerIndex: number,
    template: Template,
    targets: ItemCount[]
  ) {
    this.destinations.push(...targets.map(t => new Link(t, consumer)));

    consumer.sources[consumerIndex].destination = this;

    this.updateSourceRequirements();
  }

  updateSourceRequirements(maxDepth = 200) {
    if (maxDepth < 0) {
      return;
    }
    for (const s of this.sources) {
      const amount = this.requiredInputAmount(s.required.item);
      s.required.count = amount;
      if (s.destination) {
        for (const d of s.destination.destinations) {
          if (d.destination === this && d.required.item == s.required.item) {
            d.required.count = amount;
          }
        }
        s.destination.updateSourceRequirements(maxDepth - 1);
      }
    }
  }

  findUp(name: string): ProductionNode | undefined {
    if (this.template.outputs.find(f => f.item == name)) {
      return this;
    }

    for (const d of this.destinations) {
      if (!d.destination) continue;
      const found = d.destination.findUp(name);
      if (found) {
        return found;
      }
    }
  }

  find(template: Template): ProductionNode {
    for (const [node, depth] of this.walk()) {
      if (node.template === template) {
        return node;
      }
    }
  }

  requiredInputAmount(name: string): number {
    const total: { [item: string]: number } = {};

    for (const dest of this.destinations) {
      total[dest.required.item] = total[dest.required.item]
        ? total[dest.required.item] + dest.required.count
        : dest.required.count;
    }

    let maxMultipler = 0;
    for (const output of this.template.outputs) {
      const multiplier = total[output.item] / output.count;
      if (multiplier > maxMultipler) {
        maxMultipler = multiplier;
      }
    }

    const input = this.template.inputs.find(f => f.item == name);
    if (!input) return 0;
    return input.count * maxMultipler;
  }

  static clone(nodes: ProductionNode[]): ProductionNode[] {
    if (nodes.length == 0) {
      return [];
    }

    const seen = new Map<ProductionNode, ProductionNode>();
    const stack: ProductionNode[] = [nodes[0]];

    const newNode = new ProductionNode(
      nodes[0].template,
      nodes[0].destinations.map(d => d.required)
    );
    seen.set(nodes[0], newNode);

    while (stack.length) {
      const v = stack.pop();

      for (let i = 0; i < v.destinations.length; i++) {
        const old = v.destinations[i];
        if (!old.destination) continue;
        let neighbour = seen.get(old.destination);
        if (!neighbour) {
          neighbour = new ProductionNode(
            old.destination.template,
            old.destination.destinations.map(d => d.required)
          );
          stack.push(old.destination);
          seen.set(old.destination, neighbour);
        }
        seen.get(v).destinations[i].destination = neighbour;
      }

      for (let i = 0; i < v.sources.length; i++) {
        const old = v.sources[i];
        if (!old.destination) continue;
        let neighbour = seen.get(old.destination);
        if (!neighbour) {
          neighbour = new ProductionNode(
            old.destination.template,
            old.destination.destinations.map(d => d.required)
          );
          stack.push(old.destination);
          seen.set(old.destination, neighbour);
        }
        seen.get(v).sources[i].destination = neighbour;
      }
    }

    return nodes.map(n => seen.get(n));
  }

  *walk(): Generator<[ProductionNode, number]> {
    const seen = new Set<ProductionNode>();
    const unseen: [ProductionNode, number][] = [[this, 0]];
    seen.add(this);

    while (unseen.length > 0) {
      const [node, depth] = unseen.pop();
      seen.add(node);

      node.sources
        .filter(s => s.destination && !seen.has(s.destination))
        .map(s => {
          unseen.push([s.destination, depth + 1]);
          seen.add(s.destination);
        });

      node.destinations
        .filter(s => s.destination && !seen.has(s.destination))
        .map(s => {
          unseen.push([s.destination, depth - 1]);
          seen.add(s.destination);
        });

      yield [node, depth];
    }
  }

  [util.inspect.custom](depth: number, opts: any) {
    let min = 0;
    for (const [node, depth] of this.walk()) {
      if (depth < min) {
        min = depth;
      }
    }

    let out = "";
    for (const [node, depth] of this.walk()) {
      out += "  ".repeat(depth - min);

      out +=
        node.sources
          .map((i, n) => `${i.required.count} ${i.required.item}`)
          .join(" + ") || "none";

      out += " -> ";

      out += node.destinations
        .map(i => `${i.required.count} ${i.required.item}`)
        .join(" + ");

      out += "\n";
    }
    return out;
  }
}

export class Link {
  destination?: ProductionNode;
  required: ItemCount;

  constructor(required: ItemCount, destination?: ProductionNode) {
    this.destination = destination;
    this.required = required;
  }
}

export function* solve(
  producers: Template[],
  target: ItemCount
): Generator<ProductionNode> {
  const producerByInput = createProducerMap(producers);
  let solutions = producerByInput[target.item].map<ProductionNode[]>(
    template => {
      return [new ProductionNode(template, [target])];
    }
  );

  while (solutions.length > 0) {
    const incomplete = solutions.pop();

    while (incomplete.length > 0) {
      const peek = incomplete[incomplete.length - 1];
      const possibleWays = flattenInputs(
        peek.template.inputs.map(i => producerByInput[i.item])
      );

      if (possibleWays.length == 0) {
        const consumer = incomplete.pop();
        if (incomplete.length === 0) {
          yield consumer.findUp(target.item);
        }
        continue;
      }

      const clones = possibleWays.map((_, i) =>
        i === 0 ? incomplete : ProductionNode.clone(incomplete)
      );

      solutions.push(...clones.slice(1));

      for (let i = 0; i < possibleWays.length; i++) {
        const inputs = possibleWays[i];
        const incomplete = clones[i];
        const consumer = incomplete.pop();

        for (let j = 0; j < inputs.length; j++) {
          const inputTemplate = inputs[j];

          let producer = consumer.find(inputTemplate);
          if (producer) {
            producer.addDestination(
              consumer,
              j,
              inputTemplate,
              inputTemplate.outputs.map(t => ({
                item: t.item,
                count: consumer.requiredInputAmount(t.item)
              }))
            );
          } else {
            producer = new ProductionNode(
              inputTemplate,
              inputTemplate.outputs.map(t => ({
                item: t.item,
                count: consumer.requiredInputAmount(t.item)
              }))
            );
            consumer.sources[j].destination = producer;
            producer.destinations[0].destination = consumer;
            incomplete.push(producer);
          }
        }

        if (incomplete.length === 0) {
          yield consumer.findUp(target.item);
        }
      }
    }
  }
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
