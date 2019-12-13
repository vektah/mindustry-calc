import ItemStack from "./ItemStack";
import { Item } from "./item";
import LiquidStack from "./LiquidStack";
import Liquid from "./Liquid";

export default class GenericCrafter {
  name: string;
  consumes: ItemStack[] = [];
  outputs: ItemStack[] = [];
  craftTime: number;

  constructor(name: string, opts: CrafterOptions) {
    this.name = name;

    if (opts.consumesItems) this.consumes.push(...opts.consumesItems);
    if (opts.consumesItem) this.consumes.push(makeStack(opts.consumesItem));

    if (opts.outputItems) this.outputs.push(...opts.outputsItems);
    if (opts.outputItem) this.outputs.push(makeStack(opts.outputItem));

    if (opts.consumesLiquids) this.consumes.push(...opts.consumesLiquids);
    if (opts.consumesLiquid) this.consumes.push(makeStack(opts.consumesLiquid));

    if (opts.outputLiquids) this.outputs.push(...opts.outputsLiquids);
    if (opts.outputLiquid) this.outputs.push(makeStack(opts.outputLiquid));

    this.craftTime = opts.craftTime / 60 || 80 / 60;
  }

  outputRate(opts: CraftingCalcOpts = {}): ItemStack[] {
    return this.outputs.map(this.calcrate(opts));
  }

  inputRate(opts: CraftingCalcOpts = {}): ItemStack[] {
    return this.consumes.map(this.calcrate(opts));
  }

  private calcrate({
    efficiency = 1,
    machines = 1,
    overdrive = "none"
  }: CraftingCalcOpts = {}) {
    return (i: ItemStack) =>
      new ItemStack(
        i.item,
        (i.count / this.craftTime) * machines * odRatio[overdrive] * efficiency
      );
  }
}

interface CraftingCalcOpts {
  efficiency?: number;
  machines?: number;
  overdrive?: "none" | "boost" | "phase";
}

const odRatio = {
  none: 1,
  boost: 1.5,
  phase: 2.25
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
  [key: string]: any;
}
