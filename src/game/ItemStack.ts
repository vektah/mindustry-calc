import { Item } from "./item";
import Items from "./Items";

export default class ItemStack {
  item: Item;
  count: number;

  constructor(item: Item, count: number) {
    this.item = item;
    this.count = count;
  }

  static with(...args: (Item | number)[]) {}
}
