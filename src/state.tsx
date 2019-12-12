import { observable, observe, unobserve } from "@nx-js/observer-util";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "preact/hooks";
import { memo } from "preact/compat";
import { FunctionalComponent } from "preact";

export class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class BlockState {
  center: Point;

  constructor(x: number, y: number) {
    this.center = new Point(x, y);
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

observe(() => {
  console.log("manual", state.blocks.length);
});

setTimeout(() => {
  state.blocks.push(observable(new BlockState(200, 200)));
}, 1000);

setTimeout(() => {
  state.blocks.push(observable(new BlockState(100, 100)));
}, 2000);
