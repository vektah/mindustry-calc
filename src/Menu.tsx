import { ComponentChildren, h } from "preact";
import { state, view } from "./state";

function Menu() {
  return (
    <div className="menu">
      {state.results.map((s, index) => (
        <div
          className="menu-item"
          onClick={() => {
            state.setActive(index);
          }}
        >
          <h3>{s.outputs[0].required.item.name}</h3>
          {s.calcBaseInputs().map(i => (
            <div>
              {i.count.toFixed(2)} {i.item.name}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default view(Menu);
