import { h } from "preact";
import { AppState } from "./state";
import ItemStack from "./game/ItemStack";
import { useEffect, useRef, useState } from "preact/hooks";
import Items from "./game/Items";
import Liquids from "./game/Liquids";
import { itemImage } from "./images";

export default function Menu({ state }: { state: AppState }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>();

  useEffect(() => {
    document.addEventListener("mousedown", e => {
      if (!menuRef.current || menuRef.current.contains(e.target)) return;

      setMenuOpen(false);
    });
  }, [menuRef.current]);

  return (
    <div className="menu">
      <div className="output-selector">
        <img
          onClick={() => setMenuOpen(true)}
          className="output-selector__item"
          src={itemImage(state.target.item)}
        />
        {menuOpen && (
          <div className="output-selector__menu" ref={menuRef}>
            {[...Object.values(Items), ...Object.values(Liquids)].map(i => (
              <img
                className="output-selector__menu__item"
                data-selected={i.name === state.target.item.name}
                onClick={() => {
                  state.setTarget(new ItemStack(i, state.target.count));
                  state.setActive(0);
                  setMenuOpen(false);
                }}
                src={itemImage(i)}
              />
            ))}
          </div>
        )}
        / sec:
        <input
          className="output-selector__count"
          value={state.target.count}
          onChange={e => {
            state.setTarget(
              new ItemStack(state.target.item, parseFloat(e.target.value)),
            );
          }}
        />
        <select
          value={state.sort}
          onChange={e => state.setSort(e.target.value)}
          className="output-selector__sort"
        >
          {["min power", "max power", "scarcity"].map(v => (
            <option selected={v == state.sort} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>
      {state.results &&
        state.results.map((s, index) => {
          return (
            <div
              className="menu-item "
              data-active={index == state.active}
              onClick={() => {
                state.setActive(index);
              }}
            >
              {s.baseInputs.map(i => (
                <div>
                  {i && i.count && i.count.toFixed(2)} {i.item.name}
                </div>
              ))}
              {s.totalPower > 0 && <div>{s.totalPower.toFixed(0)} power</div>}
            </div>
          );
        })}
    </div>
  );
}
