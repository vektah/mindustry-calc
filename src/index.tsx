import { h, render } from "preact";
import Block from "./Block";
import { state, view } from "./state";

const App = view(() => {
  return (
    <div className="root">
      {state.blocks.map(b => (
        <Block block={b} />
      ))}
    </div>
  );
});

render(<App />, document.getElementById("app"));
