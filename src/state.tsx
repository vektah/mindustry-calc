import { observable, observe, unobserve } from "@nx-js/observer-util";
import { useEffect, useMemo, useState } from "preact/hooks";
import { memo } from "preact/compat";
import { FunctionalComponent, h, RefObject } from "preact";
import { ProductionNode, solve } from "./solver/solver";
import Items from "./game/Items";
import producers from "./game/producers";
import ItemStack from "./game/ItemStack";
import GenericCrafter from "./game/GenericCrafter";
import Blocks from "./game/Blocks";

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

  mag(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  angleTo(b: Point): number {
    return Math.atan2(this.y - b.y, this.x - b.x);
  }

  addThis(other: Point) {
    this.x += other.x;
    this.y += other.y;
  }

  sub(other: Point) {
    return new Point(this.x - other.x, this.y - other.y);
  }

  normThis() {
    const dist = this.mag();
    this.x /= dist;
    this.y /= dist;
    return this;
  }

  scaleThis(n: number) {
    this.x *= n;
    this.y *= n;
    return this;
  }
}

export interface ViewData {
  center: Point;
  ref: RefObject<HTMLDivElement>;
  count: number;
}

export class State {
  blocks: ProductionNode<ViewData, GenericCrafter>[] = [];
  results: ProductionNode<ViewData, GenericCrafter>[] = [];

  solve() {
    this.results = Array.from(
      solve<ViewData, GenericCrafter>(
        producers,
        new ItemStack(Items.surgealloy, 10),
      ),
    );

    this.setActive(0);
    // setInterval(forceLayout, 30);
  }

  setActive(n: number) {
    this.blocks = [];
    for (const [node, depth] of state.results[n].walk()) {
      node.data = {
        center: new Point(Math.random() * 500 + 100, Math.random() * 500 + 100),
        count: 1,
        ref: { current: undefined },
      };
      state.blocks.push(node);
    }

    for (let i = 0; i < 500; i++) {
      this.forceLayout();
    }
  }

  calcForce(a: Point, b: Point, f: (dist: number) => number) {
    const vector = a.sub(b);
    let correction = f(vector.mag());

    return vector.normThis().scaleThis(correction);
  }

  forceLayout() {
    // setInterval(forceLayout, 100);
    const c1 = 50;
    const c2 = 100;
    const c3 = 100000;

    let minX = 9999999;
    let minY = 9999999;
    for (const block of state.blocks) {
      if (block.data.center.x < minX) {
        minX = block.data.center.x;
      }
      if (block.data.center.y < minY) {
        minY = block.data.center.y;
      }
    }

    for (const block of state.blocks) {
      if (block == state.blocks[0]) {
        block.data.center.x = block.data.center.x + (-minX + 100) / 10;
        block.data.center.y = block.data.center.y + (-minY + 100) / 10;
        continue;
      }

      const totalCorrection = new Point(-20, 0);

      for (const link of block.outputs) {
        if (!link.destination) continue;
        totalCorrection.addThis(
          this.calcForce(
            block.data.center,
            link.destination.data.center,
            d => c1 * Math.log(c2 / d),
          ),
        );
      }

      for (const other of state.blocks) {
        if (block === other) continue;
        totalCorrection.addThis(
          this.calcForce(
            block.data.center,
            other.data.center,
            d => c3 / (d * d),
          ),
        );
      }
      block.data.center.addThis(totalCorrection);
    }
  }
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
state.solve();

window.Blocks = Blocks;
window.state = state;
