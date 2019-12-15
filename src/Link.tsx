import { h } from "preact";
import { view, ViewData } from "./state";
import { Link as LinkData } from "./solver/solver";
import GenericCrafter from "./game/GenericCrafter";

const items = require("../public/mindustry/sprites/items/*.png");

function Link({
  link: { source, destination, required },
}: {
  link: LinkData<ViewData, GenericCrafter>;
}) {
  if (!destination) {
    return null;
  }
  const dist = source.data.center.distanceTo(destination.data.center);

  return (
    <div
      className="link"
      style={{
        width: dist,
        top: source.data.center.y,
        left: source.data.center.x,
        transform: `rotate(${destination.data.center.angleTo(
          source.data.center,
        )}rad)`,
      }}
    >
      <div>
        <img className="link-item" src={items["item-" + required.item.name]} />
        <div>{required.count.toFixed(2)}</div>
      </div>
    </div>
  );
}

export default view(Link);
