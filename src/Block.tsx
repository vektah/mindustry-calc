import { ComponentChildren, h } from "preact";
import Draggable from "./Draggable";
import { ProductionNode } from "./solver/solver";
import { ViewData } from "./state";
import GenericCrafter from "./game/GenericCrafter";

const production = require("../public/mindustry/sprites/blocks/production/*.png");
const drills = require("../public/mindustry/sprites/blocks/drills/*.png");

function Label({ children }: { children?: ComponentChildren }) {
  return <div class="block-label">{children}</div>;
}

export default function Block({
  block,
}: {
  block: ProductionNode<ViewData, GenericCrafter>;
}) {
  const imageName = block.template.name;
  let img = imageName.startsWith("mine-")
    ? drills["blast-drill"]
    : production[imageName];

  return (
    <Draggable
      className="block"
      pos={block.data.center}
      setPos={(x, y) => {
        console.log("aa");
        block.data.center.x = x;
        block.data.center.y = y;
        block.data.redraw();
      }}
      ref={block.data.ref}
      style={{
        backgroundImage: `url(${img})`,
      }}
    >
      <Label>{block.template.name}</Label>
    </Draggable>
  );
}
