import { useEffect, useRef } from "preact/hooks";
import { h, ComponentChildren } from "preact";
import { JSXInternal } from "preact/src/jsx";
import { Point } from "./state";

export default function Draggable({
  children,
  style,
  pos,
  setPos,
  ...props
}: JSXInternal.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
  pos: Point;
  setPos: (x: number, y: number) => void;
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
      onMouseDown={e => {
        if (e.which !== 2) return;
        e.preventDefault();
        const startX = e.clientX - pos.x;
        const startY = e.clientY - pos.y;

        mouseMove.current = e => {
          e.preventDefault();
          setPos(e.clientX - startX, e.clientY - startY);
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
