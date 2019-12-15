import { solve } from "../solver/solver";
import Items from "./Items";
import ItemStack from "./ItemStack";
import producers from "./producers";

test("solve real graph", () => {
  console.log(Array.from(solve(producers, new ItemStack(Items.silicon, 10))));
});
