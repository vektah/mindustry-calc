import Items from "./Items";
import Blocks from "./Blocks";
import ItemStack from "./ItemStack";
import LiquidStack from "./LiquidStack";
import Liquids from "./Liquids";

describe("generic crafter", () => {
  describe("outputs", () => {
    it("can calculate base rates", () => {
      expect(Blocks.graphitePress.outputRate()).toEqual([
        new ItemStack(Items.graphite, 0.6666666666666666)
      ]);

      expect(Blocks.multiPress.outputRate()).toEqual([
        new ItemStack(Items.graphite, 4.0)
      ]);
      expect(Blocks.siliconSmelter.outputRate()).toEqual([
        new ItemStack(Items.silicon, 1.5)
      ]);
    });

    it("can calculate output rates with multiple machines", () => {
      expect(Blocks.kiln.outputRate({ machines: 3 })).toEqual([
        new ItemStack(Items.metaglass, 6.0)
      ]);
    });

    it("can calculate output rates with overdrive", () => {
      expect(
        Blocks.plastaniumCompressor.outputRate({ overdrive: "boost" })
      ).toEqual([new ItemStack(Items.plastanium, 1.5)]);
    });

    it("can calculate output rates with overdrive boosted with phase", () => {
      expect(Blocks.phaseWeaver.outputRate({ overdrive: "phase" })).toEqual([
        new ItemStack(Items.phasefabric, 1.125)
      ]);
    });

    it("can calculate output rates with lowered efficiency", () => {
      expect(Blocks.cryofluidMixer.outputRate({ efficiency: 0.5 })).toEqual([
        new LiquidStack(Liquids.cryofluid, 0.05)
      ]);
    });
  });
});
