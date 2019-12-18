import { h, render } from "preact";
import Block from "./Block";
import { useAppState } from "./state";
import Link from "./Link";
import Menu from "./Menu";

function App() {
  const state = useAppState();

  return (
    <div className="root">
      <Menu state={state} />
      {state.root && (
        <div className="graph">
          {Array.from(state.root.root.walk()).map(([a]) =>
            a.outputs.map(b => <Link link={b} />),
          )}
          {Array.from(state.root.root.walk()).map(([b]) => (
            <Block block={b} />
          ))}
        </div>
      )}
      <div className="hint-text">
        <p>Click a node for more details.</p>
        <p>Middle mouse to drag</p>
      </div>
    </div>
  );
}

render(<App />, document.getElementById("app"));
