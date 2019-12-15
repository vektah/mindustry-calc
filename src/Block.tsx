import { ComponentChildren, h } from "preact";
import Draggable from "./useDraggable";
import { ProductionNode } from "./solver/solver";
import { view, ViewData } from "./state";
import GenericCrafter from "./game/GenericCrafter";

const images = require("../public/mindustry/sprites/blocks/production/*.png");

function Label({ children }: { children?: ComponentChildren }) {
  return <div class="block-label">{children}</div>;
}

console.log(images);

function Block({ block }: { block: ProductionNode<ViewData, GenericCrafter> }) {
  return (
    <Draggable
      className="block"
      pos={block.data.center}
      ref={block.data.ref}
      style={{
        backgroundImage: `url(${images[block.template.name]})`,
      }}
    >
      <Label>{block.template.name}</Label>
    </Draggable>
  );
}
export default view(Block);
