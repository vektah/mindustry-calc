import { h } from "preact";
import { ViewData } from "./state";
import { Link as LinkData } from "./solver/solver";
import GenericCrafter from "./game/GenericCrafter";
import { itemImage } from "./images";

export default function Link({
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
      <img className="link-item" src={itemImage(required.item)} />
      <div>{required.count.toFixed(2)}</div>
    </div>
  );
}
