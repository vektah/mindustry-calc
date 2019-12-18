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

  return [
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
    />,
    <div
      className="link-item"
      style={{
        top: (source.data.center.y + destination.data.center.y) / 2,
        left: (source.data.center.x + destination.data.center.x) / 2,
      }}
    >
      <img src={itemImage(required.item)} />
      <div className="link-text">{required.count.toFixed(1)}</div>
    </div>,
  ];
}
