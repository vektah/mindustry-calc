import Liquid from "./Liquid";
import ItemStack from "./ItemStack";

export default class LiquidStack extends ItemStack {
  constructor(liquid: Liquid, count: number) {
    super(liquid, count);
  }
}
