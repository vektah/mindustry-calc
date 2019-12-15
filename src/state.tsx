import { observable, observe, unobserve } from "@nx-js/observer-util";
import { useEffect, useMemo, useState } from "preact/hooks";
import { memo } from "preact/compat";
import { FunctionalComponent, h, RefObject } from "preact";
import GenericCrafter from "./game/GenericCrafter";
import { ProductionNode, solve } from "./solver/solver";
import Items from "./game/Items";
import producers from "./game/producers";
import ItemStack from "./game/ItemStack";

export class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  distanceTo(b: Point): number {
    const x = this.x - b.x;
    const y = this.y - b.y;
    return Math.sqrt(x * x + y * y);
  }

  angleTo(b: Point): number {
    return Math.atan2(this.y - b.y, this.x - b.x);
  }
}

let lastId = 0;

export interface Link {
  source: BlockState;
  dest: BlockState;
  item: ItemStack;
}

export class BlockState {
  id: number;
  center: Point;
  outputs: Link[] = [];
  inputs: Link[] = [];
  ref: RefObject<HTMLDivElement> = { current: undefined };
  recipe: GenericCrafter;
  count = 1;

  constructor(x: number, y: number, recipe: GenericCrafter) {
    this.id = ++lastId;
    this.center = new Point(x, y);
    this.recipe = recipe;
  }

  linkTo(b: BlockState) {
    const output = this.recipe.outputRate({ machines: this.count });
    const inputs = b.recipe.inputRate({ machines: b.count });

    inputs.forEach(input => {
      if (output[0].item.name != input.item.name) {
        return;
      }

      this.outputs.push({
        source: this,
        dest: b,
        item: output[0]
      });

      b.inputs.push({
        source: this,
        dest: b,
        item: output[0]
      });
    });
  }
}

export class State {
  blocks: BlockState[] = [];
}

export function view<T>(Comp: FunctionalComponent<T>): FunctionalComponent<T> {
  let ReactiveComp;

  // use a hook based reactive wrapper when we can
  ReactiveComp = memo(props => {
    // use a dummy setState to update the component
    const [, setState] = useState(undefined);

    // create a memoized reactive wrapper of the original component (render)
    // at the very first run of the component function
    const render = useMemo(
      () =>
        observe(Comp, {
          scheduler: () => setState({}),
          lazy: true
        }),
      // Adding the original Comp here is necessary to make React Hot Reload work
      // it does not affect behavior otherwise
      [Comp]
    );

    // cleanup the reactive connections after the very last render of the component
    useEffect(() => {
      return () => unobserve(render);
    }, []);

    // run the reactive render instead of the original one
    return render(props as any);
  });

  ReactiveComp.displayName = Comp.displayName + "View";
  // static props are inherited by class components,
  // but have to be copied for function components
  for (let key of Object.keys(Comp)) {
    ReactiveComp[key] = Comp[key];
  }

  return ReactiveComp;
}

export const state = observable(new State());

const result = Array.from(solve(producers, new ItemStack(Items.silicon, 10)));

const nodes = new Map<ProductionNode, BlockState>();

for (const [node, depth] of result[0].walk()) {
  const block = new BlockState(50, 50, node.template as GenericCrafter);
  nodes.set(node, block);
  for (const outputs of node.destinations) {
    if (!node.destinations || !nodes.get(outputs.destination)) continue;
    block.linkTo(nodes.get(outputs.destination));
  }
  state.blocks.push(block);
}
