import { createPointLightBakeRuntimeBinding } from "./pointLightBakeRuntimeBinding.js";

export function createPointLightBakeSetupRuntime(deps) {
  return createPointLightBakeRuntimeBinding({
    document: deps.document,
    windowEl: deps.windowEl,
    requestAnimationFrame: deps.requestAnimationFrame,
    createWorker: deps.createWorker,
    getMapSize: deps.getMapSize,
    pointLightBakeCanvas: deps.pointLightBakeCanvas,
    pointLightBakeCtx: deps.pointLightBakeCtx,
    pointLightTex: deps.pointLightTex,
    uploadImageToTexture: deps.uploadImageToTexture,
    requestOverlayDraw: deps.requestOverlayDraw,
    debounceMs: deps.debounceMs,
    pointLightBakeLiveScale: deps.pointLightBakeLiveScale,
    pointLightBlendExposure: deps.pointLightBlendExposure,
    isLiveUpdateEnabled: deps.isLiveUpdateEnabled,
    hasBakeInputs: deps.hasBakeInputs,
    getLights: deps.getLights,
    getHeightScaleValue: deps.getHeightScaleValue,
    getLightingSettings: deps.getLightingSettings,
    clamp: deps.clamp,
    defaultPointLightFlicker: deps.defaultPointLightFlicker,
    defaultPointLightFlickerSpeed: deps.defaultPointLightFlickerSpeed,
    sampleHeightAtMapPixel: deps.sampleHeightAtMapPixel,
    hasLineOfSightToLight: deps.hasLineOfSightToLight,
    sampleNormalAtMapPixel: deps.sampleNormalAtMapPixel,
    normalize3: deps.normalize3,
  });
}
