import ItemStack from "./ItemStack";
import { Item } from "./item";
import LiquidStack from "./LiquidStack";
import Liquid from "./Liquid";

export default class GenericCrafter {
  name: string;
  inputs: ItemStack[] = [];
  outputs: ItemStack[] = [];
  craftSeconds: number;
  craftTicks: number;
  power: number = 0;

  constructor(name: string, opts: CrafterOptions) {
    this.name = name;

    if (opts.consumesItems) this.inputs.push(...opts.consumesItems);
    if (opts.consumesItem) this.inputs.push(makeStack(opts.consumesItem));

    if (opts.outputItems) this.outputs = opts.outputsItems;
    if (opts.outputItem) this.outputs = [makeStack(opts.outputItem)];

    if (opts.consumesLiquids) this.inputs.push(...opts.consumesLiquids);
    if (opts.consumesLiquid) this.inputs.push(makeStack(opts.consumesLiquid));

    if (opts.outputLiquids) this.outputs = opts.outputsLiquids;
    if (opts.outputLiquid) this.outputs = [makeStack(opts.outputLiquid)];

    if (opts.result) {
      this.outputs.push(new LiquidStack(opts.result, opts.pumpAmount || 1));
    }

    this.craftTicks = opts.craftTime || 80;
    this.craftSeconds = this.craftTicks / 60;

    if (opts.consumesPower) {
      this.power = opts.consumesPower[0] * this.craftTicks;
    }

    // Some liquids are in per tick values, we need to normalize based on craft time.
    for (const input of this.inputs) {
      if (input.item instanceof Liquid && input.count < 1) {
        input.count *= this.craftTicks;
      }
    }
    for (const output of this.outputs) {
      if (output.item instanceof Liquid && output.count < 1) {
        output.count *= this.craftTicks;
      }
    }
  }

  outputRate(opts: CraftingCalcOpts = {}): ItemStack[] {
    return this.outputs.map(this.calcrate(opts));
  }

  inputRate(opts: CraftingCalcOpts = {}): ItemStack[] {
    return this.inputs.map(this.calcrate(opts));
  }

  private calcrate({
    efficiency = 1,
    machines = 1,
    overdrive = "none",
  }: CraftingCalcOpts = {}) {
    return (i: ItemStack) =>
      new ItemStack(
        i.item,
        (i.count / this.craftSeconds) *
          machines *
          odRatio[overdrive] *
          efficiency,
      );
  }
}
export class LiquidCrafter extends GenericCrafter {}
export class Drill extends GenericCrafter {}
export class GenericSmelter extends GenericCrafter {}
export class Cultivator extends GenericCrafter {}
export class LiquidConverter extends LiquidCrafter {}
export class Separator extends GenericCrafter {}
export class SolidPump extends LiquidCrafter {}
export class Fracker extends SolidPump {}
export class Pump extends LiquidCrafter {}

interface CraftingCalcOpts {
  efficiency?: number;
  machines?: number;
  overdrive?: "none" | "boost" | "phase";
}

const odRatio = {
  none: 1,
  boost: 1.5,
  phase: 2.25,
};

function makeStack(i: itemLike): ItemStack {
  if (i instanceof ItemStack) {
    return i;
  } else {
    return new ItemStack(i[0], i[1] || 1);
  }
}

type itemLike = [Item, number?] | ItemStack;
type liquidLike = [Liquid, number?] | LiquidStack;

export interface CrafterOptions {
  consumesItems?: ItemStack[];
  consumesItem?: itemLike;
  outputItems?: ItemStack[];
  outputItem?: itemLike;
  consumesLiquids?: LiquidStack[];
  consumesLiquid?: liquidLike;
  outputLiquids?: LiquidStack[];
  outputLiquid?: liquidLike;
  craftTime?: number;
  pumpAmount?: number;
  result?: Liquid;
  consumesPower?: [number];
  [key: string]: any;
}
