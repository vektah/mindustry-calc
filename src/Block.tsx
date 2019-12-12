import { ComponentChildren, h } from "preact";
import Draggable from "./useDraggable";
import { BlockState, view } from "./state";

function Label({ children }: { children?: ComponentChildren }) {
  return <div class="block-label">{children}</div>;
}

function Block({ block }: { block: BlockState }) {
  return (
    <Draggable className="block" pos={block.center} ref={block.ref}>
      <Label>Silicon Mine</Label>
    </Draggable>
  );
}
export default view(Block);
