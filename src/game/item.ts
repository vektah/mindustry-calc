import * as util from "util";

export class Item {
  name: string;
  color: string;

  constructor(name: string, color: string, opts: {}) {
    this.name = name;
    this.color = color;
  }

  [util.inspect.custom](depth: number, opts: any) {
    return this.name;
  }
}
