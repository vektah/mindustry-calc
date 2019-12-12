import { Item } from "./item";

export default {
  copper: new Item("copper", "#d99d73", {
    type: "material",
    hardness: 1,
    cost: 0.5,
    alwaysUnlocked: true
  }),
  lead: new Item("lead", "#8c7fa9", {
    type: "material",
    hardness: 1,
    cost: 0.7
  }),
  metaglass: new Item("metaglass", "#ebeef5", {
    type: "material",
    cost: 1.5
  }),
  graphite: new Item("graphite", "#b2c6d2", {
    type: "material",
    cost: 1
  }),
  sand: new Item("sand", "#f7cba4", {}),
  coal: new Item("coal", "#272727", {
    explosiveness: 0.2,
    flammability: 1,
    hardness: 2
  }),
  titanium: new Item("titanium", "#8da1e3", {
    type: "material",
    hardness: 3,
    cost: 1
  }),
  thorium: new Item("thorium", "#f9a3c7", {
    type: "material",
    explosiveness: 0.2,
    hardness: 4,
    radioactivity: 1,
    cost: 1.1
  }),
  scrap: new Item("scrap", "#777777", {}),
  silicon: new Item("silicon", "#53565c", {
    type: "material",
    cost: 0.8
  }),
  plastanium: new Item("plastanium", "#cbd97f", {
    type: "material",
    flammability: 0.1,
    explosiveness: 0.2,
    cost: 1.3
  }),
  phasefabric: new Item("phase-fabric", "#f4ba6e", {
    type: "material",
    cost: 1.3,
    radioactivity: 0.6
  }),
  surgealloy: new Item("surge-alloy", "#f3e979", {
    type: "material"
  }),
  sporePod: new Item("spore-pod", "#7457ce", {
    flammability: 1.15
  }),
  blastCompound: new Item("blast-compound", "#ff795e", {
    flammability: 0.4,
    explosiveness: 1.2
  }),
  pyratite: new Item("pyratite", "#ffaa5f", {
    flammability: 1.4,
    explosiveness: 0.4
  })
};
