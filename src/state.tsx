import { observable, observe, unobserve } from "@nx-js/observer-util";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "preact/hooks";
import { memo } from "preact/compat";
import { FunctionalComponent, Ref, RefObject } from "preact";
import items from "./game/Items";

export class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  distanceTo(b: Point): number {
    const x = this.x - b.x;
    const y = this.y - b.y;
    return Math.sqrt(x * x + y * y);
  }

  angleTo(b: Point): number {
    return Math.atan2(this.y - b.y, this.x - b.x);
  }
}

let lastId = 0;

export class BlockState {
  id: number;
  center: Point;
  outputs: BlockState[] = [];
  ref: RefObject<HTMLDivElement> = { current: undefined };

  constructor(x: number, y: number) {
    this.id = ++lastId;
    this.center = new Point(x, y);
  }

  linkTo(b: BlockState) {
    this.outputs.push(b);
  }
}

export class State {
  blocks: BlockState[] = [];
}

export function view<T>(Comp: FunctionalComponent<T>): FunctionalComponent<T> {
  let ReactiveComp;

  // use a hook based reactive wrapper when we can
  ReactiveComp = memo(props => {
    // use a dummy setState to update the component
    const [, setState] = useState(undefined);

    // create a memoized reactive wrapper of the original component (render)
    // at the very first run of the component function
    const render = useMemo(
      () =>
        observe(Comp, {
          scheduler: () => setState({}),
          lazy: true
        }),
      // Adding the original Comp here is necessary to make React Hot Reload work
      // it does not affect behavior otherwise
      [Comp]
    );

    // cleanup the reactive connections after the very last render of the component
    useEffect(() => {
      return () => unobserve(render);
    }, []);

    // run the reactive render instead of the original one
    return render(props as any);
  });

  ReactiveComp.displayName = Comp.displayName + "View";
  // static props are inherited by class components,
  // but have to be copied for function components
  for (let key of Object.keys(Comp)) {
    ReactiveComp[key] = Comp[key];
  }

  return ReactiveComp;
}

export const state = observable(new State());

const a = new BlockState(250, 200);
const b = new BlockState(50, 100);
const c = new BlockState(450, 100);

state.blocks.push(a, b, c);

a.linkTo(b);
c.linkTo(a);
a.linkTo(c);
setTimeout(() => {}, 1000);

setTimeout(() => {}, 2000);
