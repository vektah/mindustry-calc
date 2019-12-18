import { h, Fragment } from "preact";
import { AppState } from "./state";
import ItemStack from "./game/ItemStack";
import { useEffect, useRef, useState } from "preact/hooks";
import Items from "./game/Items";
import Liquids from "./game/Liquids";
import { itemImage } from "./images";
import { HamburgerButton } from "./HamburgerButton";
import ResultItem from "./ResultItem";

export default function Menu({ state }: { state: AppState }) {
  const [selectMaterialMenuOpen, setSelectMaterialMenuOpen] = useState(false);
  const [resultListMenuOpen, setResultListMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>();

  useEffect(() => {
    document.addEventListener("mousedown", e => {
      if (!menuRef.current || menuRef.current.contains(e.target)) return;

      setSelectMaterialMenuOpen(false);
    });
  }, [menuRef.current]);

  return (
    <Fragment>
      <div className="output-selector">
        <img
          onClick={() => {
            setSelectMaterialMenuOpen(true);
          }}
          className="output-selector__item"
          data-selected={selectMaterialMenuOpen}
          src={itemImage(state.target.item)}
        />
        {selectMaterialMenuOpen && (
          <div className="output-selector__menu" ref={menuRef}>
            {[...Object.values(Items), ...Object.values(Liquids)].map(i => (
              <img
                className="output-selector__menu__item"
                data-selected={i.name === state.target.item.name}
                onClick={() => {
                  state.setTarget(new ItemStack(i, state.target.count));
                  state.setActive(0);
                  setSelectMaterialMenuOpen(false);
                }}
                src={itemImage(i)}
              />
            ))}
          </div>
        )}
        <div className="output-selector__count">
          <input
            value={state.target.count}
            onChange={e => {
              state.setTarget(
                new ItemStack(state.target.item, parseFloat(e.target.value)),
              );
            }}
          />
          <div className="output-selector__count__suffix">/ sec</div>
        </div>
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
        <HamburgerButton
          isOpen={resultListMenuOpen}
          onClick={() => {
            setResultListMenuOpen(!resultListMenuOpen);
          }}
        />
      </div>
      <div className="result-list" data-is-open={resultListMenuOpen}>
        {state.results &&
          state.results.map((s, index) => (
            <ResultItem
              active={index === state.active}
              onClick={() => {
                state.setActive(index);
                setResultListMenuOpen(false);
              }}
              solution={s}
            />
          ))}
      </div>
    </Fragment>
  );
}
