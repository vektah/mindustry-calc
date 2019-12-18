import { h } from "preact";
import { Solution } from "./state";
import { itemImage } from "./images";

export interface Props {
  active: boolean;
  onClick: () => void;
  solution: Solution;
}

export default function ResultItem({ active, onClick, solution }: Props) {
  return (
    <div className="result-item " data-active={active} onClick={onClick}>
      <div className="result-item__heading">{solution.root.template.name}</div>
      <div className="result-item__inputs">
        {solution.baseInputs.map(i => (
          <div className="result-item__input">
            {i && i.count && i.count.toFixed(2)}{" "}
            <img
              className="result-item__input__image"
              src={itemImage(i.item)}
              title={i.item.name}
            />
          </div>
        ))}
      </div>
      <div className="result-item__power">
        {solution.totalPower > 0 && (
          <div>{solution.totalPower.toFixed(0)} ⚡ </div>
        )}
      </div>
    </div>
  );
}
