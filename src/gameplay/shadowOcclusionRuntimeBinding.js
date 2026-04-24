import { createShadowOcclusion } from "./shadowOcclusion.js";

export function createShadowOcclusionRuntimeBinding(deps) {
  return createShadowOcclusion({
    getSplatSize: deps.getSplatSize,
    sampleHeightAtMapCoord: deps.sampleHeightAtMapCoord,
    sampleHeightAtMapPixel: deps.sampleHeightAtMapPixel,
    swarmZMax: deps.swarmZMax,
  });
}
