import ItemStack from "./ItemStack";
import { Item } from "./item";
import LiquidStack from "./LiquidStack";
import Liquid from "./Liquid";

export default class GenericCrafter {
  name: string;
  inputs: ItemStack[] = [];
  outputs: ItemStack[] = [];
  craftTime: number;

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

    this.craftTime = opts.craftTime / 60 || 80 / 60;
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
