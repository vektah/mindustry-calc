import { flattenInputs, Link, ProductionNode, solve, Template } from "./solver";
import * as util from "util";

const recipes: { [name: string]: Template } = {
  flour: { inputs: [], outputs: [{ item: "flour", count: 1 }] },
  advancedFlour: {
    inputs: [{ item: "water", count: 1 }],
    outputs: [{ item: "flour", count: 5 }]
  },
  water: { inputs: [], outputs: [{ item: "water", count: 1 }] },
  sugar: { inputs: [], outputs: [{ item: "sugar", count: 1 }] },
  bread: {
    inputs: [
      { item: "water", count: 2 },
      { item: "flour", count: 3 }
    ],
    outputs: [{ item: "bread", count: 1 }]
  },
  sweetBread: {
    inputs: [
      { item: "water", count: 1 },
      { item: "flour", count: 1 },
      { item: "sugar", count: 1 }
    ],
    outputs: [{ item: "bread", count: 2 }]
  }
};

const allRecipes = Object.values(recipes);

test("solve", () => {
  // add test for unproduceable items

  const results = solve(allRecipes, { item: "bread", count: 2 });
  expect(util.inspect(Array.from(results))).toEqual(`[
  1 water + 1 flour + 1 sugar -> 2 bread
    none -> 1 sugar
    none -> 1 flour
    none -> 1 water
  ,
  1 water + 1 flour + 1 sugar -> 2 bread
    none -> 1 sugar
    0.2 water -> 1 flour
      none -> 0.2 water
    none -> 1 water
  ,
  4 water + 6 flour -> 2 bread
    none -> 6 flour
    none -> 4 water
  ,
  4 water + 6 flour -> 2 bread
    1.2 water -> 6 flour
      none -> 1.2 water
    none -> 4 water
  
]`);
});

describe("ProductionNode", () => {
  it("can calculate required input amounts", () => {
    const node = new ProductionNode(recipes["bread"], [
      { item: "bread", count: 10 }
    ]);

    expect(node.requiredInputAmount("flour")).toBe(30);
    expect(node.requiredInputAmount("water")).toBe(20);
  });

  it("will request enough materials for all links", () => {
    const node = new ProductionNode(recipes["bread"], [
      { item: "bread", count: 10 },
      { item: "bread", count: 5 }
    ]);

    expect(node.requiredInputAmount("flour")).toBe(45);
    expect(node.requiredInputAmount("water")).toBe(30);
  });
});

test("flattenInputs", () => {
  const i1m1: Template = { outputs: [], inputs: [] };
  const i1m2: Template = { outputs: [], inputs: [] };
  const i2m1: Template = { outputs: [], inputs: [] };
  const i2m2: Template = { outputs: [], inputs: [] };
  const i3m1: Template = { outputs: [], inputs: [] };

  const out = flattenInputs([[i1m1, i1m2], [i2m1, i2m2], [i3m1]]);
  expect(out).toEqual([
    [i1m1, i2m1, i3m1],
    [i1m1, i2m2, i3m1],
    [i1m2, i2m1, i3m1],
    [i1m2, i2m2, i3m1]
  ]);
});

test("clone incomplete", () => {
  const bread = new ProductionNode(recipes["bread"], [
    { item: "bread", count: 2 }
  ]);

  const [newBread] = ProductionNode.clone([bread]);
  expect(util.inspect(bread)).toEqual(util.inspect(newBread));
});

test("clone", () => {
  const bread = new ProductionNode(recipes["bread"], [
    { item: "bread", count: 2 }
  ]);
  const water = new ProductionNode(recipes["water"], [
    { item: "water", count: 4 }
  ]);
  const flour = new ProductionNode(recipes["flour"], [
    { item: "flour", count: 6 }
  ]);

  bread.sources[0].destination = water;
  bread.sources[1].destination = flour;

  flour.destinations[0].destination = bread;
  water.destinations[0].destination = bread;

  const [newBread, newFlour, newWater] = ProductionNode.clone([
    bread,
    flour,
    water
  ]);

  expect(newBread.destinations[0].required).toEqual({
    item: "bread",
    count: 2
  });

  expect(newBread.sources[0].required).toEqual({
    item: "water",
    count: 4
  });

  expect(newBread.sources[1].required).toEqual({
    item: "flour",
    count: 6
  });

  expect(newFlour.destinations[0].required).toEqual({
    item: "flour",
    count: 6
  });
  expect(newWater.destinations[0].required).toEqual({
    item: "water",
    count: 4
  });

  expect(newBread.template).toBe(recipes["bread"]);
  expect(newBread.sources[0].destination.template).toBe(recipes["water"]);

  expect(newBread.sources[1].destination.template).toBe(recipes["flour"]);
  expect(
    newBread.sources[0].destination.destinations[0].destination.template
  ).toBe(recipes["bread"]);
  expect(
    newBread.sources[1].destination.destinations[0].destination.template
  ).toBe(recipes["bread"]);

  expect(newBread).not.toBe(bread);
});
