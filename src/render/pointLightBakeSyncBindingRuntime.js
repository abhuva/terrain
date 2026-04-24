import { createPointLightBakeSync } from "./pointLightBakeSync.js";

export function createPointLightBakeSyncBindingRuntime(deps) {
  let pointLightBakeSyncRuntime = null;

  function getPointLightBakeSyncRuntime() {
    if (pointLightBakeSyncRuntime) return pointLightBakeSyncRuntime;
    pointLightBakeSyncRuntime = createPointLightBakeSync({
      getFullBakeSize: deps.getFullBakeSize,
      pointLightBakeLiveScale: deps.pointLightBakeLiveScale,
      getLightingSettings: deps.getLightingSettings,
      getLights: deps.getLights,
      clamp: deps.clamp,
      defaultPointLightFlicker: deps.defaultPointLightFlicker,
      defaultPointLightFlickerSpeed: deps.defaultPointLightFlickerSpeed,
      sampleHeightAtMapPixel: deps.sampleHeightAtMapPixel,
      hasLineOfSightToLight: deps.hasLineOfSightToLight,
      sampleNormalAtMapPixel: deps.sampleNormalAtMapPixel,
      normalize3: deps.normalize3,
      pointLightBlendExposure: deps.pointLightBlendExposure,
      applyPointLightBakeRgba: deps.applyPointLightBakeRgba,
    });
    return pointLightBakeSyncRuntime;
  }

  function bakePointLightsTextureSync(useReducedResolution = false) {
    getPointLightBakeSyncRuntime().bakePointLightsTextureSync(useReducedResolution);
  }

  return {
    getPointLightBakeSyncRuntime,
    bakePointLightsTextureSync,
  };
}
