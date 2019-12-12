import Liquid from "./Liquid";

export default class LiquidStack {
  liquid: Liquid;
  count: number;

  constructor(liquid: Liquid, count: number) {
    this.liquid = liquid;
    this.count = count;
  }

  static with(...args: (Liquid | number)[]) {}
}
