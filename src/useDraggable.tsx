import { useEffect, useRef } from "preact/hooks";
import { h, ComponentChildren } from "preact";
import { JSXInternal } from "preact/src/jsx";
import { Point, view } from "./state";

function Draggable({
  children,
  style,
  pos,
  ...props
}: JSXInternal.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
  pos: Point;
}) {
  const mouseMove = useRef(e => {});

  const mouseUp = useRef(e => {});

  useEffect(() => {
    return () => {
      window.removeEventListener("mousemove", mouseMove.current);
      window.removeEventListener("mouseup", mouseUp.current);
    };
  }, []);

  return (
    <div
      style={{ left: pos.x, top: pos.y, ...(style as object) }}
      onmousedown={e => {
        e.preventDefault();
        const startX = e.clientX - pos.x;
        const startY = e.clientY - pos.y;

        mouseMove.current = e => {
          e.preventDefault();
          pos.x = e.clientX - startX;
          pos.y = e.clientY - startY;
        };

        mouseUp.current = e => {
          window.removeEventListener("mousemove", mouseMove.current);
          window.removeEventListener("mouseup", mouseUp.current);
          mouseMove.current = undefined;
          mouseMove.current = undefined;
        };

        window.addEventListener("mousemove", mouseMove.current);
        window.addEventListener("mouseup", mouseUp.current);
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export default view(Draggable);
