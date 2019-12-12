import Liquid from "./Liquid";

export default {
  water: new Liquid("water", "#596ab8", {
    heatCapacity: 0.4,
    effect: "wet"
  }),
  slag: new Liquid("slag", "#ffa166", {
    temperature: 1,
    viscosity: 0.8,
    effect: "melting",
    lightColor: "#f0511d"
  }),
  oil: new Liquid("oil", "#313131", {
    viscosity: 0.7,
    flammability: 1.2,
    explosiveness: 1.2,
    heatCapacity: 0.7,
    barColor: "#6b675",
    effect: "tarred"
  }),
  cryofluid: new Liquid("cryofluid", "#6ecdec", {
    heatCapacity: 0.9,
    temperature: 0.25,
    effect: "freezing",
    lightColor: "#00975"
  })
};
