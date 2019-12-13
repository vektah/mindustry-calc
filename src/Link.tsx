import { h } from "preact";
import { Link, view } from "./state";

const items = require("../public/mindustry/sprites/items/*.png");

function Link({ link: { source, dest, item } }: { link: Link }) {
  const dist = source.center.distanceTo(dest.center);

  return (
    <div
      className="link"
      style={{
        width: dist,
        top: source.center.y,
        left: source.center.x,
        transform: `rotate(${dest.center.angleTo(source.center)}rad)`
      }}
    >
      <div>
        <img className="link-item" src={items["item-" + item.item.name]} />
        <div>{((item.count / item.count) * 100).toFixed(0)}%</div>
      </div>
    </div>
  );
}

export default view(Link);
