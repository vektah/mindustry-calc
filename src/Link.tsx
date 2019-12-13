import { h } from "preact";
import { BlockState, view } from "./state";

const items = require("../public/mindustry/sprites/items/*.png");

function Link({ a, b }: { a: BlockState; b: BlockState }) {
  if (!a.ref.current || !b.ref.current) return;
  const dist = a.center.distanceTo(b.center);
  return (
    <div
      className="link"
      style={{
        width: dist,
        top: a.center.y,
        left: a.center.x,
        transform: `rotate(${b.center.angleTo(a.center)}rad)`
      }}
    >
      {a.recipe.outputs.map(output =>
        b.recipe.consumes.map(input => {
          if (output.item.name != input.item.name) {
            return null;
          }

          return (
            <div>
              <img
                className="link-item"
                src={items["item-" + input.item.name]}
              />
            </div>
          );
        })
      )}
    </div>
  );
}

export default view(Link);
