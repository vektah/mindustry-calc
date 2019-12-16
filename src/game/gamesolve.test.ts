import { solve } from "../solver/solver";
import Items from "./Items";
import ItemStack from "./ItemStack";
import producers from "./producers";

test("solve real graph", () => {
  const silicon = Array.from(
    solve(producers, new ItemStack(Items.silicon, 10)),
  );
  console.log(silicon);
  console.log(silicon[0].calcBaseInputs());

  const graphite = Array.from(
    solve(producers, new ItemStack(Items.graphite, 100)),
  );
  console.log(graphite);
  console.log(graphite[0].calcBaseInputs());
  console.log(graphite[0].calcBaseInputs());
  console.log(graphite[0].calcBaseInputs());
});
