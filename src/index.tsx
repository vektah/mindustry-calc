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
          {Array.from(state.root.walk()).map(([a]) =>
            a.outputs.map(b => <Link link={b} />),
          )}
          {Array.from(state.root.walk()).map(([b]) => (
            <Block block={b} />
          ))}
        </div>
      )}
    </div>
  );
}

render(<App />, document.getElementById("app"));
