import { ComponentChildren, h } from "preact";
import Draggable from "./Draggable";
import { ProductionNode } from "./solver/solver";
import { ViewData } from "./state";
import GenericCrafter from "./game/GenericCrafter";
import { templateImage } from "./images";
import { useState } from "preact/hooks";

function Label({ children }: { children?: ComponentChildren }) {
  return <div class="block-label">{children}</div>;
}

export default function Block({
  block,
}: {
  block: ProductionNode<ViewData, GenericCrafter>;
}) {
  const [showDetails, setShowDetails] = useState(false);

  return [
    <Draggable
      className="block"
      onClick={() => {
        setShowDetails(!showDetails);
      }}
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
    </Draggable>,
    <div
      className="hover-card"
      data-show={showDetails}
      onClick={() => {
        setShowDetails(!showDetails);
      }}
      style={{ top: block.data.center.y - 32, left: block.data.center.x + 40 }}
    >
      <table>
        <tr>
          <td>basic</td>
          <td>{block.data.count.toFixed(2)}</td>
        </tr>
        <tr>
          <td>overdrive</td>
          <td>{(block.data.count / 1.5).toFixed(2)}</td>
        </tr>
        <tr>
          <td>od+phase</td>
          <td>{(block.data.count / 2.125).toFixed(2)}</td>
        </tr>
        <tr>
          <td>power</td>
          <td>{block.data.power.toFixed(0)}</td>
        </tr>
      </table>
    </div>,
  ];
}
