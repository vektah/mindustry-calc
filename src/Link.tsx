import { h } from "preact";
import { BlockState, view } from "./state";

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
    />
  );
}

export default view(Link);
