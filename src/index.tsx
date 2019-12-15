import { h, render } from "preact";
import Block from "./Block";
import { state, view } from "./state";
import Link from "./Link";
import Menu from "./Menu";

const App = view(() => {
  return (
    <div className="root">
      <Menu />
      <div className="graph">
        {state.blocks.map(a => a.outputs.map(b => <Link link={b} />))}
        {state.blocks.map(b => (
          <Block block={b} />
        ))}
      </div>
    </div>
  );
});

render(<App />, document.getElementById("app"));
