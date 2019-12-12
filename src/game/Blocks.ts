import { Item } from "./item";
import Items from "./Items";
import GenericCrafter from "./GenericCrafter";
import GenericSmelter from "./GenericSmelter";
import LiquidConverter from "./GenericSmelter";
import Separator from "./GenericSmelter";
import ItemStack from "./ItemStack";
import Liquids from "./Liquids";
import LiquidStack from "./LiquidStack";
export default {
  graphitePress: new GenericCrafter("graphite-press", {
    requirements: [
      "crafting",
      ItemStack.with(Items.copper, 75, Items.lead, 30)
    ],

    craftEffect: "pulverizeMedium",
    outputItem: new ItemStack(Items.graphite, 1),
    craftTime: 90,
    size: 2,
    hasItems: true,

    consumesItem: [Items.coal, 2]
  }),
  multiPress: new GenericCrafter("multi-press", {
    requirements: [
      "crafting",
      ItemStack.with(
        Items.titanium,
        100,
        Items.silicon,
        25,
        Items.lead,
        100,
        Items.graphite,
        50
      )
    ],

    craftEffect: "pulverizeMedium",
    outputItem: new ItemStack(Items.graphite, 2),
    craftTime: 30,
    size: 3,
    hasItems: true,
    hasLiquids: true,
    hasPower: true,

    consumesPower: [1.8],

    consumesItem: [Items.coal, 3],

    consumesLiquid: [Liquids.water, 0.1]
  }),
  siliconSmelter: new GenericSmelter("silicon-smelter", {
    requirements: [
      "crafting",
      ItemStack.with(Items.copper, 30, Items.lead, 25)
    ],

    craftEffect: "smeltsmoke",
    outputItem: new ItemStack(Items.silicon, 1),
    craftTime: 40,
    size: 2,
    hasPower: true,
    hasLiquids: false,
    flameColor: "#ffef99",

    consumesItems: [new ItemStack(Items.coal, 1), new ItemStack(Items.sand, 2)],

    consumesPower: [0.5]
  }),
  kiln: new GenericSmelter("kiln", {
    requirements: [
      "crafting",
      ItemStack.with(Items.copper, 60, Items.graphite, 30, Items.lead, 30)
    ],

    craftEffect: "smeltsmoke",
    outputItem: new ItemStack(Items.metaglass, 1),
    craftTime: 30,
    size: 2,
    hasPower: true,
    hasItems: true,
    flameColor: "#ffc099",

    consumesItems: [new ItemStack(Items.lead, 1), new ItemStack(Items.sand, 1)],

    consumesPower: [0.6]
  }),
  plastaniumCompressor: new GenericCrafter("plastanium-compressor", {
    requirements: [
      "crafting",
      ItemStack.with(
        Items.silicon,
        80,
        Items.lead,
        115,
        Items.graphite,
        60,
        Items.titanium,
        80
      )
    ],

    hasItems: true,
    liquidCapacity: 60,
    craftTime: 60,
    outputItem: new ItemStack(Items.plastanium, 1),
    size: 2,
    health: 320,
    hasPower: true,
    hasLiquids: true,
    craftEffect: "formsmoke",
    updateEffect: "plasticburn",

    consumesLiquid: [Liquids.oil, 0.25],

    consumesPower: [3],

    consumesItem: [Items.titanium, 2]
  }),
  phaseWeaver: new GenericCrafter("phase-weaver", {
    requirements: [
      "crafting",
      ItemStack.with(Items.silicon, 130, Items.lead, 120, Items.thorium, 75)
    ],

    craftEffect: "smeltsmoke",
    outputItem: new ItemStack(Items.phasefabric, 1),
    craftTime: 120,
    size: 2,
    hasPower: true,

    consumesItems: [
      new ItemStack(Items.thorium, 4),
      new ItemStack(Items.sand, 10)
    ],

    consumesPower: [5],

    itemCapacity: 20
  }),
  surgeSmelter: new GenericSmelter("alloy-smelter", {
    requirements: [
      "crafting",
      ItemStack.with(Items.silicon, 80, Items.lead, 80, Items.thorium, 70)
    ],

    craftEffect: "smeltsmoke",
    outputItem: new ItemStack(Items.surgealloy, 1),
    craftTime: 75,
    size: 3,
    hasPower: true,

    consumesPower: [4],

    consumesItems: [
      new ItemStack(Items.copper, 3),
      new ItemStack(Items.lead, 4),
      new ItemStack(Items.titanium, 2),
      new ItemStack(Items.silicon, 3)
    ]
  }),
  cryofluidMixer: new LiquidConverter("cryofluidmixer", {
    requirements: [
      "crafting",
      ItemStack.with(Items.lead, 65, Items.silicon, 40, Items.titanium, 60)
    ],

    outputLiquid: new LiquidStack(Liquids.cryofluid, 0.2),
    craftTime: 120,
    size: 2,
    hasPower: true,
    hasItems: true,
    hasLiquids: true,
    rotate: false,
    solid: true,
    outputsLiquid: true,

    consumesPower: [1],

    consumesItem: [Items.titanium],

    consumesLiquid: [Liquids.water, 0.2]
  }),
  blastMixer: new GenericCrafter("blast-mixer", {
    requirements: [
      "crafting",
      ItemStack.with(Items.lead, 30, Items.titanium, 20)
    ],

    hasItems: true,
    hasPower: true,
    outputItem: new ItemStack(Items.blastCompound, 1),
    size: 2,

    consumesItems: [
      new ItemStack(Items.pyratite, 1),
      new ItemStack(Items.sporePod, 1)
    ],

    consumesPower: [0.4]
  }),
  pyratiteMixer: new GenericSmelter("pyratite-mixer", {
    requirements: [
      "crafting",
      ItemStack.with(Items.copper, 50, Items.lead, 25)
    ],

    flameColor: "clear",
    hasItems: true,
    hasPower: true,
    outputItem: new ItemStack(Items.pyratite, 1),

    size: 2,

    consumesPower: [0.2],

    consumesItems: [
      new ItemStack(Items.coal, 1),
      new ItemStack(Items.lead, 2),
      new ItemStack(Items.sand, 2)
    ]
  }),
  melter: new GenericCrafter("melter", {
    requirements: [
      "crafting",
      ItemStack.with(Items.copper, 30, Items.lead, 35, Items.graphite, 45)
    ],

    health: 200,
    outputLiquid: new LiquidStack(Liquids.slag, 2),
    craftTime: 10,
    hasLiquids: true,
    hasPower: true,

    consumesPower: [1],

    consumesItem: [Items.scrap, 1]
  }),
  separator: new Separator("separator", {
    requirements: [
      "crafting",
      ItemStack.with(Items.copper, 30, Items.titanium, 25)
    ],

    results: ItemStack.with(
      Items.copper,
      5,
      Items.lead,
      3,
      Items.graphite,
      2,
      Items.titanium,
      2
    ),
    hasPower: true,
    craftTime: 35,
    spinnerLength: 1.5,
    spinnerRadius: 3.5,
    spinnerThickness: 1.5,
    spinnerSpeed: 3,
    size: 2,

    consumesPower: [1],

    consumesLiquid: [Liquids.slag, 0.07]
  }),
  sporePress: new GenericCrafter("spore-press", {
    requirements: [
      "crafting",
      ItemStack.with(Items.lead, 35, Items.silicon, 30)
    ],

    liquidCapacity: 60,
    craftTime: 20,
    outputLiquid: new LiquidStack(Liquids.oil, 6),
    size: 2,
    health: 320,
    hasLiquids: true,
    hasPower: true,
    craftEffect: "none",

    consumesItem: [Items.sporePod, 1],

    consumesPower: [0.6]
  }),
  pulverizer: new GenericCrafter("pulverizer", {
    requirements: [
      "crafting",
      ItemStack.with(Items.copper, 30, Items.lead, 25)
    ],

    outputItem: new ItemStack(Items.sand, 1),
    craftEffect: "pulverize",
    craftTime: 40,
    updateEffect: "pulverizeSmall",
    hasItems: true,
    hasPower: true,

    consumesItem: [Items.scrap, 1],

    consumesPower: [0.5]
  }),
  coalCentrifuge: new GenericCrafter("coal-centrifuge", {
    requirements: [
      "crafting",
      ItemStack.with(Items.titanium, 20, Items.graphite, 40, Items.lead, 30)
    ],

    craftEffect: "smeltsmoke",
    outputItem: new ItemStack(Items.coal, 1),
    craftTime: 30,
    size: 2,
    hasPower: true,
    hasItems: true,
    hasLiquids: true,

    consumesLiquid: [Liquids.oil, 0.09],

    consumesPower: [0.5]
  })
};
