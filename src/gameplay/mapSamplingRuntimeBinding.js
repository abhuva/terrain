import { createMapSampling } from "./mapSampling.js";

export function createMapSamplingRuntimeBinding(deps) {
  return createMapSampling({
    clamp: deps.clamp,
    getSplatSize: deps.getSplatSize,
    getNormalsSize: deps.getNormalsSize,
    getHeightSize: deps.getHeightSize,
    getNormalsImageData: deps.getNormalsImageData,
    getHeightImageData: deps.getHeightImageData,
  });
}
