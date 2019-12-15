import GenericCrafter from "./GenericCrafter";
import Blocks from "./Blocks";
import Items from "./Items";
import ItemStack from "./ItemStack";

let producers: GenericCrafter[] = [];

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
  Items.titanium
].forEach(i =>
  producers.push(
    new GenericCrafter("mine-" + i.name, {
      outputItem: new ItemStack(i, 1)
    })
  )
);

export default producers;
