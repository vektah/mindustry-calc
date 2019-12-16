import { observable, observe, unobserve } from "@nx-js/observer-util";
import { useEffect, useMemo, useState } from "preact/hooks";
import { memo } from "preact/compat";
import { FunctionalComponent, h, RefObject } from "preact";
import { ProductionNode, solve } from "./solver/solver";
import Items from "./game/Items";
import producers, { beltThroughput } from "./game/producers";
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
  redraw(): void;
}

export function useAppState() {
  const [target, setTarget] = useState<ItemStack>(
    new ItemStack(Items.silicon, beltThroughput),
  );

  function doSolve() {
    return Array.from(solve<ViewData, GenericCrafter>(producers, target));
  }

  const [tv, trigger] = useState(undefined);
  useEffect(() => {}, [tv]);

  const [results, setResults] = useState<
    ProductionNode<ViewData, GenericCrafter>[]
  >(undefined);

  useEffect(() => {
    const results = doSolve();

    for (const result of results) {
      let maxDepth = 0;
      for (const [node, depth] of result.walk()) {
        if (depth > maxDepth) {
          maxDepth = depth;
        }
      }

      // lets try and lay things out so that force based graph algorithm can quickly converge
      const depthOffset = new Map<number, number>();
      for (const [node, depth] of result.walk()) {
        const y = depthOffset.get(depth) || 0;
        depthOffset.set(depth, y + 1);

        const multiplier = node.templateMultiplier();

        node.data = {
          center: new Point((maxDepth - depth) * 150 + 100, y * 150 + 100),
          count: node.template.craftTime * multiplier,
          ref: { current: undefined },
          redraw() {
            trigger(Math.random());
          },
        };
      }
      for (let i = 0; i < 100; i++) {
        forceLayout(result);
      }
    }

    setResults(results);
  }, [target]);

  const [active, setActive] = useState<number>(0);

  useEffect(() => {
    if (!results) return;
  }, [active, results]);

  return {
    target,
    setTarget,
    results,
    setResults,
    active,
    setActive,
    root: results && results[active],
  };
}

export type AppState = ReturnType<typeof useAppState>;

function calcForce(a: Point, b: Point, f: (dist: number) => number) {
  const vector = a.sub(b);
  let correction = f(vector.mag());

  return vector.normThis().scaleThis(correction);
}

function forceLayout(root: ProductionNode<ViewData, GenericCrafter>) {
  const c1 = 50;
  const c2 = 100;
  const c3 = 100000;

  let minX = 9999999;
  let minY = 9999999;
  for (const [block] of root.walk()) {
    if (block.data.center.x < minX) {
      minX = block.data.center.x;
    }
    if (block.data.center.y < minY) {
      minY = block.data.center.y;
    }
  }

  for (const [block] of root.walk()) {
    if (block === root) {
      block.data.center.x = block.data.center.x + (-minX + 100) / 10;
      block.data.center.y = block.data.center.y + (-minY + 100) / 10;
      continue;
    }
    if (block.data.center.x < 10) {
      block.data.center.x = 10;
    }
    if (block.data.center.y < 10) {
      block.data.center.y = 10;
    }

    const totalCorrection = new Point(-13, -6);

    for (const link of block.outputs) {
      if (!link.destination) continue;
      totalCorrection.addThis(
        calcForce(
          block.data.center,
          link.destination.data.center,
          d => c1 * Math.log(c2 / d),
        ),
      );
    }

    for (const link of block.inputs) {
      if (!link.source) continue;
      totalCorrection.addThis(
        calcForce(
          block.data.center,
          link.source.data.center,
          d => c1 * Math.log(c2 / d),
        ),
      );
    }

    for (const [other] of root.walk()) {
      if (block === other) continue;
      totalCorrection.addThis(
        calcForce(block.data.center, other.data.center, d => c3 / (d * d)),
      );
    }

    totalCorrection.addThis(
      calcForce(
        block.data.center,
        new Point(0, block.data.center.y),
        d => c3 / (d * d),
      ),
    );

    totalCorrection.addThis(
      calcForce(
        block.data.center,
        new Point(block.data.center.x, 0),
        d => c3 / (d * d),
      ),
    );

    block.data.center.addThis(totalCorrection);
  }
}
