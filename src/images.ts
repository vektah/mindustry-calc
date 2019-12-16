import { Item } from "./game/item";
import Liquid from "./game/Liquid";

const items = require("../public/mindustry/sprites/items/*.png");

export function itemImage(item: Item) {
  if (item instanceof Liquid) {
    return items["liquid-" + item.name];
  }
  return items["item-" + item.name];
}
