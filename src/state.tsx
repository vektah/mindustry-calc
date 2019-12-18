import { useEffect, useState } from "preact/hooks";
import { h, RefObject } from "preact";
import { ProductionNode, solve } from "./solver/solver";
import Items from "./game/Items";
import producers from "./game/producers";
import ItemStack from "./game/ItemStack";
import GenericCrafter from "./game/GenericCrafter";
import Blocks from "./game/Blocks";
import { Item } from "./game/item";
import Liquids from "./game/Liquids";

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
  power: number;
  redraw(): void;
}

export interface Solution {
  root: ProductionNode<ViewData, GenericCrafter>;
  baseInputs: ItemStack[];
  totalPower: number;
}

export type SortBy = "min power" | "max power" | "scarcity";

function calcScarcity(items: ItemStack[]): number {
  let rareity = 0;
  for (const item of items) {
    rareity += itemScarcity(item.item);
  }
  return rareity;
}

function itemScarcity(item: Item): number {
  switch (item) {
    case Items.coal:
    case Items.copper:
    case Items.lead:
      return 1;

    case Liquids.water:
      return 0.01;
    case Items.sand:
      return 0.5;

    case Liquids.oil:
    case Items.titanium:
    case Items.thorium:
      return 10;

    default:
      return 2;
  }
}

export function useAppState() {
  const [target, setTarget] = useState<ItemStack>(
    new ItemStack(Items.graphite, 4),
  );

  const [sort, setSort] = useState<SortBy>("scarcity");

  function doSolve() {
    return Array.from(solve<ViewData, GenericCrafter>(producers, target));
  }

  const [tv, trigger] = useState(undefined);
  useEffect(() => {}, [tv]);

  const [results, setResults] = useState<Solution[]>(undefined);

  function sortFn(a: Solution, b: Solution) {
    switch (sort) {
      case "min power":
        return a.totalPower - b.totalPower;
      case "max power":
        return b.totalPower - a.totalPower;
      case "scarcity":
        return calcScarcity(a.baseInputs) - calcScarcity(b.baseInputs);
    }
  }

  useEffect(() => {
    const results = doSolve();

    let solutions: Solution[] = [];
    for (const result of results) {
      // lets try and lay things out so that force based graph algorithm can quickly converge
      const depthOffset = new Map<number, number>();
      let totalPower = 0;
      for (const [node, depth] of result.walk()) {
        totalPower += node.template.power;
        const x = depthOffset.get(depth) || 0;
        depthOffset.set(depth, x + 1);

        const multiplier = node.templateMultiplier();

        node.data = {
          center: new Point(x * 150 + 100, depth * 150 + 100),
          count: node.template.craftSeconds * multiplier,
          power: node.template.power * multiplier,
          ref: { current: undefined },
          redraw() {
            trigger(Math.random());
          },
        };
      }
      for (let i = 0; i < 200; i++) {
        forceLayout(result);
      }

      solutions.push({
        root: result,
        totalPower,
        baseInputs: result.calcBaseInputs(),
      });
    }

    solutions.sort(sortFn);

    setResults(solutions);
  }, [target]);

  useEffect(() => {
    if (!results) return;
    const newResults = [...results];

    newResults.sort(sortFn);
    setResults(newResults);
  }, [sort]);

  const [active, setActive] = useState<number>(0);

  useEffect(() => {
    if (!results) return;
  }, [active, results]);

  // useful when debugging force layout
  // useEffect(() => {
  //   const int = setInterval(() => {
  //     if (!results) return;
  //     forceLayout(results[active].root);
  //
  //     setResults([...results]);
  //   }, 100);
  //   return () => {
  //     clearInterval(int);
  //   };
  // }, [active]);

  return {
    sort,
    setSort,
    target,
    setTarget,
    results,
    setResults,
    active,
    setActive,
    root: results && results[active],
  };
}

window.blocks = Blocks;

export type AppState = ReturnType<typeof useAppState>;

function calcForce(a: Point, b: Point, f: (dist: number) => number) {
  const vector = a.sub(b);
  let correction = f(vector.mag());

  return vector.normThis().scaleThis(correction);
}

function forceLayout(root: ProductionNode<ViewData, GenericCrafter>) {
  const c1 = 100;
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

    const totalCorrection = new Point(0, 5);

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

    // forces to keep off the edge
    totalCorrection.addThis(
      calcForce(
        block.data.center,
        new Point(0, block.data.center.y),
        d => 5000 / (d * d * d),
      ),
    );

    totalCorrection.addThis(
      calcForce(
        block.data.center,
        new Point(block.data.center.x, 0),
        d => 5000 / (d * d * d),
      ),
    );

    block.data.center.addThis(totalCorrection);
  }
}
