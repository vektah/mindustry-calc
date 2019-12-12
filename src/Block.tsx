import { ComponentChildren, h } from "preact";
import Draggable from "./useDraggable";
import { BlockState, view } from "./state";

function Outputs({ children }: { children?: ComponentChildren }) {
  return <div class="block-outputs">{children}</div>;
}

function Label({ children }: { children?: ComponentChildren }) {
  return <div class="block-label">{children}</div>;
}

function Inputs({ children }: { children?: ComponentChildren }) {
  return <div class="block-inputs">{children}</div>;
}

function Node({ children }: { children?: ComponentChildren }) {
  return <div class="block-node">{children}</div>;
}

function Block({ block }: { block: BlockState }) {
  return (
    <Draggable className="block" pos={block.center} ref={block.ref}>
      <Outputs>
        <Node />
      </Outputs>
      <Label>Silicon Mine</Label>
      <Inputs>
        <Node />
        <Node />
      </Inputs>
    </Draggable>
  );
}
export default view(Block);
