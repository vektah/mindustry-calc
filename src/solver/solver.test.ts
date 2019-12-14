import {
  clone,
  flattenInputs,
  ProductionNode,
  solve,
  Template
} from "./solver";
import * as util from "util";

test("solve", () => {
  // add test for unproduceable items
  const producers: Template[] = [
    { inputs: [], outputs: [{ item: "flour", count: 1 }], duration: 30 },
    {
      inputs: [{ item: "water", count: 1 }],
      outputs: [{ item: "flour", count: 5 }],
      duration: 30
    },
    { inputs: [], outputs: [{ item: "water", count: 1 }], duration: 30 },
    { inputs: [], outputs: [{ item: "sugar", count: 1 }], duration: 30 },
    {
      inputs: [
        { item: "water", count: 1 },
        { item: "flour", count: 1 }
      ],
      outputs: [{ item: "bread", count: 1 }],
      duration: 30
    },
    {
      inputs: [
        { item: "water", count: 1 },
        { item: "flour", count: 1 },
        { item: "sugar", count: 1 }
      ],
      outputs: [{ item: "bread", count: 2 }],
      duration: 30
    }
  ];

  const results = solve(producers, { item: "bread", count: 2 });
  console.log(results);
});

test("flattenInputs", () => {
  const i1m1: Template = { outputs: [], inputs: [], duration: 101 };
  const i1m2: Template = { outputs: [], inputs: [], duration: 102 };
  const i2m1: Template = { outputs: [], inputs: [], duration: 201 };
  const i2m2: Template = { outputs: [], inputs: [], duration: 202 };
  const i3m1: Template = { outputs: [], inputs: [], duration: 301 };

  const out = flattenInputs([[i1m1, i1m2], [i2m1, i2m2], [i3m1]]);
  expect(out).toEqual([
    [i1m1, i2m1, i3m1],
    [i1m1, i2m2, i3m1],
    [i1m2, i2m1, i3m1],
    [i1m2, i2m2, i3m1]
  ]);
});

test("clone", () => {
  const aT: Template = { inputs: [], outputs: [], duration: 1 };
  const bT: Template = { inputs: [], outputs: [], duration: 2 };
  const cT: Template = { inputs: [], outputs: [], duration: 3 };

  const a = new ProductionNode(aT);
  const b = new ProductionNode(bT);
  const c = new ProductionNode(cT);

  a.destinations.push(b);
  b.sources.push(a);

  b.destinations.push(c);
  c.sources.push(b);

  c.destinations.push(a);
  a.sources.push(c);

  const newGraph = clone(a);
  expect(newGraph.template.duration).toBe(1);
  expect(newGraph.destinations[0].template.duration).toBe(2);
  expect(newGraph.destinations[0].destinations[0].template.duration).toBe(3);
  expect(newGraph.sources[0].template.duration).toBe(3);
  expect(newGraph.sources[0].sources[0].template.duration).toBe(2);

  expect(newGraph).not.toBe(a);
});

// takes an array in the form
// using notation i[1]m[2] to denote input 1 for method 2
// [
//   [i[1]m[1], i[1]m[2]],
//   [i[2]m[1], i[2]m[2]],
//   [i[3]m[1]],
// ]
//
// and turns it into
// [
//   [i[1]m[1], i[2]m[1], i[3]m[1]]
//   [i[1]m[1], i[2]m[2], i[3]m[1]]
//   [i[1]m[2], i[2]m[1], i[3]m[1]]
//   [i[1]m[2], i[2]m[2], i[3]m[1]]
// ]
