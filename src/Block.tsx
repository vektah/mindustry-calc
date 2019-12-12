import { ComponentChildren, h } from "preact";
import Draggable from "./useDraggable";
import { BlockState, view } from "./state";

type Parameters<T> = T extends (...args: infer T) => any ? T : never;

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

const Block = view(({ block }: { block: BlockState }) => {
  return (
    <Draggable className="block" pos={block.center}>
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
});
export default Block;
