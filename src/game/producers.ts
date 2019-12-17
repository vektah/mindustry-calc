import GenericCrafter from "./GenericCrafter";
import Blocks from "./Blocks";
import Items from "./Items";
import ItemStack from "./ItemStack";
import Liquids from "./Liquids";

let producers: GenericCrafter[] = [];

export const beltThroughput = 4.37;

for (const name of Object.keys(Blocks)) {
  // @ts-ignore
  const block = Blocks[name];

  if (block instanceof GenericCrafter && block.outputs) {
    producers.push(block);
  }
}

[
  Items.coal,
  Items.copper,
  Items.lead,
  Items.sand,
  Items.scrap,
  Items.thorium,
  Items.titanium,
].forEach(i =>
  producers.push(
    new GenericCrafter("mine-" + i.name, {
      outputItem: new ItemStack(i, 1),
    }),
  ),
);

[Liquids.water, Liquids.oil].forEach(i =>
  producers.push(
    new GenericCrafter("pump-" + i.name, {
      outputItem: new ItemStack(i, 0.8),
    }),
  ),
);

export default producers;
