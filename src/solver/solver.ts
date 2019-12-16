import * as util from "util";

export interface Template {
  inputs: ItemCount[];
  outputs: ItemCount[];
}

export interface ItemCount {
  item: any;
  count: number;
}

export class ProductionNode<DataType, TemplateType extends Template> {
  template: TemplateType;
  inputs?: Link<DataType, TemplateType>[];
  outputs?: Link<DataType, TemplateType>[] = [];
  data?: DataType;

  constructor(template: TemplateType) {
    this.template = template;

    this.inputs = this.template.inputs.map(i => {
      const link = new Link<DataType, TemplateType>({
        item: i.item,
        count: 0,
      });
      link.destination = this;
      return link;
    });
  }

  calcBaseInputs() {
    const inputs = new Map<any, ItemCount>();

    for (const [node, depth] of this.walk()) {
      for (const input of node.inputs) {
        if (input.source) continue;

        const existing = inputs.get(input.required.item);
        if (existing) {
          existing.count += input.required.count;
        } else {
          inputs.set(input.required.item, { ...input.required });
        }
      }
      if (node.inputs.length == 0) {
        for (const output of node.outputs) {
          const existing = inputs.get(output.required.item);
          if (existing) {
            existing.count += output.required.count;
          } else {
            inputs.set(output.required.item, { ...output.required });
          }
        }
      }
    }

    return Array.from(inputs.values());
  }

  linkTo(
    target: ItemCount,
    destination?: ProductionNode<DataType, TemplateType>,
  ) {
    const link = new Link<DataType, TemplateType>(target);
    link.source = this;
    link.destination = destination;

    this.outputs.push(link);
    if (destination) {
      const inputId = destination.template.inputs.findIndex(
        i => i.item == target.item,
      );
      destination.inputs[inputId] = link;
    }

    this.updateSourceRequirements();
  }

  accepts(item: any) {
    for (const input of this.template.inputs) {
      if (input.item == item) {
        return true;
      }
    }
    return false;
  }

  private updateSourceRequirements(maxDepth = 200) {
    if (maxDepth < 0) {
      return;
    }
    for (const input of this.inputs) {
      const amount = this.requiredInputAmount(input.required.item);
      input.required.count = amount;
      if (input.source) {
        input.source.updateSourceRequirements(maxDepth - 1);
      }
    }
  }

  find(template: Template): ProductionNode<DataType, TemplateType> {
    for (const [node, depth] of this.walk()) {
      if (node.template === template) {
        return node;
      }
    }
  }

  templateMultiplier() {
    const total: { [item: string]: number } = {};

    for (const dest of this.outputs) {
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
    return maxMultipler;
  }

  requiredInputAmount(name: string): number {
    const templateMultiplier = this.templateMultiplier();

    const input = this.template.inputs.find(f => f.item == name);
    if (!input) return 0;
    return input.count * templateMultiplier;
  }

  static clone<DataType, TemplateType extends Template>(
    nodes: ProductionNode<DataType, TemplateType>[],
  ): ProductionNode<DataType, TemplateType>[] {
    if (nodes.length == 0) {
      return [];
    }

    const seen = new Map<
      ProductionNode<DataType, TemplateType>,
      ProductionNode<DataType, TemplateType>
    >();
    const stack: ProductionNode<DataType, TemplateType>[] = [nodes[0]];

    const newNode = new ProductionNode<DataType, TemplateType>(
      nodes[0].template,
    );
    seen.set(nodes[0], newNode);

    while (stack.length) {
      const v = stack.pop();

      for (let i = 0; i < v.outputs.length; i++) {
        const old = v.outputs[i];
        let neighbour: ProductionNode<DataType, TemplateType>;
        if (old.destination) {
          neighbour = seen.get(old.destination);
          if (!neighbour) {
            neighbour = new ProductionNode(old.destination.template);
            stack.push(old.destination);
            seen.set(old.destination, neighbour);
          }
        }
        seen.get(v).linkTo(old.required, neighbour);
      }

      for (let i = 0; i < v.inputs.length; i++) {
        const old = v.inputs[i];
        if (!old.source) continue;
        let neighbour = seen.get(old.source);
        if (!neighbour) {
          neighbour = new ProductionNode(old.source.template);
          stack.push(old.source);
          seen.set(old.source, neighbour);
        }
      }
    }

    return nodes.map(n => seen.get(n));
  }

  *walk(): Generator<[ProductionNode<DataType, TemplateType>, number]> {
    const seen = new Set<ProductionNode<DataType, TemplateType>>();
    const unseen: [ProductionNode<DataType, TemplateType>, number][] = [
      [this, 0],
    ];
    seen.add(this);

    while (unseen.length > 0) {
      const [node, depth] = unseen.pop();
      seen.add(node);

      node.inputs
        .filter(s => s.source && !seen.has(s.source))
        .map(s => {
          unseen.push([s.source, depth + 1]);
          seen.add(s.source);
        });

      node.outputs
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
        node.inputs
          .map((i, n) => `${i.required.count} ${util.inspect(i.required.item)}`)
          .join(" + ") || "none";

      out += " -> ";

      out += node.outputs
        .map(i => `${i.required.count} ${util.inspect(i.required.item)}`)
        .join(" + ");

      out += "\n";
    }
    return out;
  }
}

export class Link<DataType, TemplateType extends Template> {
  source?: ProductionNode<DataType, TemplateType>;
  destination?: ProductionNode<DataType, TemplateType>;
  required: ItemCount;

  constructor(required: ItemCount) {
    this.required = required;
  }
}

export function* solve<DataType, TemplateType extends Template>(
  producers: TemplateType[],
  target: ItemCount,
): Generator<ProductionNode<DataType, TemplateType>> {
  if (!target || !target.item) {
    throw new Error("target must be defined");
  }
  const producerByInput = createProducerMap(producers);
  let solutions = producerByInput
    .get(target.item)
    .map<ProductionNode<DataType, TemplateType>[]>(template => {
      const result = new ProductionNode<DataType, TemplateType>(template);
      result.linkTo(target);
      return [result, result];
    });

  while (solutions.length > 0) {
    const incomplete = solutions.pop();

    while (incomplete.length > 0) {
      if (incomplete.length === 1) {
        yield incomplete[0];
        break;
      }
      const peek = incomplete[incomplete.length - 1];
      const possibleWays = flattenInputs(
        peek.template.inputs.map(i => producerByInput.get(i.item)),
      );

      if (possibleWays.length == 0) {
        incomplete.pop();
        continue;
      }

      const clones = possibleWays.map((_, i) =>
        i === 0 ? incomplete : ProductionNode.clone(incomplete),
      );

      solutions.push(...clones.slice(1));

      for (let i = 0; i < possibleWays.length; i++) {
        const inputs = possibleWays[i];
        const incomplete = clones[i];
        const consumer = incomplete.pop();

        for (let j = 0; j < inputs.length; j++) {
          const inputTemplate = inputs[j];

          let producer = consumer.find(inputTemplate);
          if (!producer) {
            producer = new ProductionNode<DataType, TemplateType>(
              inputTemplate,
            );
            incomplete.push(producer);
          }

          for (const output of inputTemplate.outputs) {
            if (consumer.accepts(output.item)) {
              producer.linkTo(
                {
                  item: output.item,
                  count: consumer.requiredInputAmount(output.item),
                },
                consumer,
              );
            }
          }
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
export function flattenInputs<T extends Template>(inputs: T[][]): T[][] {
  if (inputs.length == 0) return [];
  if (inputs.length == 1) {
    if (!inputs[0]) {
      return [];
    }
    return inputs[0].map(way => [way]);
  }

  let results: T[][] = [];
  for (let way of inputs[0]) {
    for (let rest of flattenInputs<T>(inputs.slice(1))) {
      results.push([way, ...rest]);
    }
  }
  return results;
}

function createProducerMap<T extends Template>(producers: T[]) {
  const producerByInput = new Map<any, T[]>();

  for (const block of producers) {
    for (const out of block.outputs) {
      let producers = producerByInput.get(out.item);
      if (!producers) {
        producers = [];
        producerByInput.set(out.item, producers);
      }

      producers.push(block);
    }
  }
  return producerByInput;
}
