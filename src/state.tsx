import { observable, observe, unobserve } from "@nx-js/observer-util";
import { useEffect, useMemo, useState } from "preact/hooks";
import { memo } from "preact/compat";
import { FunctionalComponent, h, RefObject } from "preact";
import { ProductionNode, solve } from "./solver/solver";
import Items from "./game/Items";
import producers from "./game/producers";
import ItemStack from "./game/ItemStack";
import GenericCrafter from "./game/GenericCrafter";

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

export interface ViewData {
  center: Point;
  ref: RefObject<HTMLDivElement>;
  count: number;
}

export class State {
  blocks: ProductionNode<ViewData, GenericCrafter>[] = [];
}

export function view<T>(Comp: FunctionalComponent<T>): FunctionalComponent<T> {
  let ReactiveComp;

  ReactiveComp = memo(props => {
    // use a dummy setState to update the component
    const [, setState] = useState(undefined);

    // create a memoized reactive wrapper of the original component (render)
    // at the very first run of the component function
    const render = useMemo(
      () =>
        observe(Comp, {
          scheduler: () => setState({}),
          lazy: true,
        }),
      // Adding the original Comp here is necessary to make React Hot Reload work
      // it does not affect behavior otherwise
      [Comp],
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
    // @ts-ignore
    ReactiveComp[key] = Comp[key];
  }

  return ReactiveComp;
}

export const state = observable(new State());

const result = Array.from(
  solve<ViewData, GenericCrafter>(producers, new ItemStack(Items.silicon, 10)),
);

for (const [node, depth] of result[0].walk()) {
  node.data = {
    center: new Point(0, 0),
    count: 1,
    ref: { current: undefined },
  };
  state.blocks.push(node);
}

function forceLayout() {
  for (const block of state.blocks) {
  }
}
