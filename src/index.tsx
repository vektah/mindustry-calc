import { h, render } from "preact";
import Block from "./Block";
import { state, view } from "./state";
import Link from "./Link";

const App = view(() => {
  return (
    <div className="root">
      {state.blocks.map(a => a.outputs.map(b => <Link link={b} />))}
      {state.blocks.map(b => (
        <Block block={b} />
      ))}
    </div>
  );
});

render(<App />, document.getElementById("app"));
