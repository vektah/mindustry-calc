import { Item } from "./item";
import Items from "./Items";

export default class ItemStack {
  item: Item;
  count: number;

  constructor(item: Item, count: number) {
    this.item = item;
    this.count = count;
  }

  static with(...args: (Item | number)[]) {
    let item: Item;
    let results: ItemStack[] = [];

    for (const arg of args) {
      if (arg instanceof Item) {
        item = arg;
      } else {
        results.push(new ItemStack(item, arg));
      }
    }
    return results;
  }
}
