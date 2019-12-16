import { ComponentChildren, h } from "preact";
import Draggable from "./Draggable";
import { ProductionNode } from "./solver/solver";
import { ViewData } from "./state";
import GenericCrafter from "./game/GenericCrafter";
import { templateImage } from "./images";

function Label({ children }: { children?: ComponentChildren }) {
  return <div class="block-label">{children}</div>;
}

export default function Block({
  block,
}: {
  block: ProductionNode<ViewData, GenericCrafter>;
}) {
  return (
    <Draggable
      className="block"
      pos={block.data.center}
      setPos={(x, y) => {
        block.data.center.x = x;
        block.data.center.y = y;
        block.data.redraw();
      }}
      ref={block.data.ref}
      style={{
        backgroundImage: `url(${templateImage(block.template)})`,
      }}
    >
      <Label>{block.template.name}</Label>
    </Draggable>
  );
}
