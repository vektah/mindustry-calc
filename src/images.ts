import { Item } from "./game/item";
import Liquid from "./game/Liquid";
import GenericCrafter from "./game/GenericCrafter";

const items = require("../public/mindustry/sprites/items/*.png");
const production = require("../public/mindustry/sprites/blocks/production/*.png");
const drills = require("../public/mindustry/sprites/blocks/drills/*.png");
const liquid = require("../public/mindustry/sprites/blocks/liquid/*.png");

export function itemImage(item: Item) {
  if (item instanceof Liquid) {
    return items["liquid-" + item.name];
  }
  return items["item-" + item.name];
}

export function templateImage(template: GenericCrafter) {
  if (template.name.startsWith("mine-")) {
    return drills["blast-drill"];
  }
  if (template.name.startsWith("pump-")) {
    return liquid["rotary-pump"];
  }
  const drill = drills[template.name];
  if (drill) {
    return drill;
  }
  return production[template.name];
}
