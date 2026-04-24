import { bindPointLightWorker } from "../core/pointLightWorkerBinding.js";
import { createPointLightBakeCanvasRuntime } from "./pointLightBakeCanvasRuntime.js";
import { createPointLightBakeSyncBindingRuntime } from "./pointLightBakeSyncBindingRuntime.js";
import { createPointLightBakeBindingRuntime } from "./pointLightBakeBindingRuntime.js";
import { createPointLightBakeRuntime } from "./pointLightBakeRuntime.js";

export function createPointLightBakeRuntimeBinding(deps) {
  const pointLightBakeTempCanvas = deps.document.createElement("canvas");
  const pointLightBakeTempCtx = pointLightBakeTempCanvas.getContext("2d");

  const pointLightBakeCanvasRuntime = createPointLightBakeCanvasRuntime({
    getMapSize: deps.getMapSize,
    pointLightBakeCanvas: deps.pointLightBakeCanvas,
    pointLightBakeCtx: deps.pointLightBakeCtx,
    pointLightBakeTempCanvas,
    pointLightBakeTempCtx,
    pointLightTex: deps.pointLightTex,
    uploadImageToTexture: deps.uploadImageToTexture,
    requestOverlayDraw: deps.requestOverlayDraw,
  });

  function getFullBakeSize() {
    return {
      width: deps.pointLightBakeCanvas.width,
      height: deps.pointLightBakeCanvas.height,
    };
  }

  function applyPointLightBakeRgba(rgba, sourceWidth, sourceHeight) {
    pointLightBakeCanvasRuntime.applyPointLightBakeRgba(rgba, sourceWidth, sourceHeight);
  }

  let pointLightBakeSyncBindingRuntime = null;
  function getPointLightBakeSyncBindingRuntime() {
    if (pointLightBakeSyncBindingRuntime) return pointLightBakeSyncBindingRuntime;
    pointLightBakeSyncBindingRuntime = createPointLightBakeSyncBindingRuntime({
      getFullBakeSize,
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
      applyPointLightBakeRgba,
    });
    return pointLightBakeSyncBindingRuntime;
  }

  function bakePointLightsTextureSync(useReducedResolution = false) {
    getPointLightBakeSyncBindingRuntime().bakePointLightsTextureSync(useReducedResolution);
  }

  const pointLightBakeRuntime = createPointLightBakeRuntime({
    windowEl: deps.windowEl,
    requestAnimationFrame: deps.requestAnimationFrame,
    createWorker: deps.createWorker,
    bindPointLightWorker,
    debounceMs: deps.debounceMs,
    liveScale: deps.pointLightBakeLiveScale,
    blendExposure: deps.pointLightBlendExposure,
    isLiveUpdateEnabled: deps.isLiveUpdateEnabled,
    ensureBakeSize: () => pointLightBakeCanvasRuntime.ensurePointLightBakeSize(),
    hasBakeInputs: deps.hasBakeInputs,
    bakeSync: (useReducedResolution) => bakePointLightsTextureSync(useReducedResolution),
    getFullBakeSize,
    getLights: deps.getLights,
    getHeightScaleValue: deps.getHeightScaleValue,
    bakePointLightsTextureSync,
    applyPointLightBakeRgba,
  });

  const pointLightBakeBindingRuntime = createPointLightBakeBindingRuntime({
    pointLightBakeCanvasRuntime,
    pointLightBakeRuntime,
  });

  return {
    getWorker: () => pointLightBakeRuntime.getWorker(),
    ensurePointLightBakeSize: () => pointLightBakeBindingRuntime.ensurePointLightBakeSize(),
    applyPointLightBakeRgba: (rgba, sourceWidth, sourceHeight) =>
      pointLightBakeBindingRuntime.applyPointLightBakeRgba(rgba, sourceWidth, sourceHeight),
    schedulePointLightBake: () => pointLightBakeBindingRuntime.schedulePointLightBake(),
    bakePointLightsTexture: () => pointLightBakeBindingRuntime.bakePointLightsTexture(),
    getPointLightBakeSyncRuntime: () => getPointLightBakeSyncBindingRuntime().getPointLightBakeSyncRuntime(),
    bakePointLightsTextureSync,
  };
}
