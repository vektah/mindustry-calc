import { ComponentChildren, h } from "preact";
import Draggable from "./useDraggable";
import { BlockState, view } from "./state";

const images = require("../public/mindustry/sprites/blocks/production/*.png");

function Label({ children }: { children?: ComponentChildren }) {
  return <div class="block-label">{children}</div>;
}

console.log(images);

function Block({ block }: { block: BlockState }) {
  return (
    <Draggable
      className="block"
      pos={block.center}
      ref={block.ref}
      style={{
        backgroundImage: `url(${images[block.recipe.name]})`
      }}
    >
      <Label>{block.recipe.name}</Label>
    </Draggable>
  );
}
export default view(Block);
