import { h, render } from "preact";
import Block from "./Block";
import { state, view } from "./state";
import Link from "./Link";

const App = view(() => {
  return (
    <div className="root">
      {state.blocks.map(b => (
        <Block block={b} />
      ))}

      {state.blocks.map(a => a.outputs.map(b => <Link a={a} b={b} />))}
    </div>
  );
});

render(<App />, document.getElementById("app"));
