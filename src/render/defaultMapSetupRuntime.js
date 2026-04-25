import { createDefaultMapImageRuntime } from "./defaultMapImageRuntime.js";

export function initializeDefaultMapSetupRuntime(deps) {
  createDefaultMapImageRuntime({
    createFlatNormalImage: deps.createFlatNormalImage,
    createFlatHeightImage: deps.createFlatHeightImage,
    createFlatSlopeImage: deps.createFlatSlopeImage,
    createFlatWaterImage: deps.createFlatWaterImage,
    createFallbackSplat: deps.createFallbackSplat,
    uploadImageToTexture: deps.uploadImageToTexture,
    normalsTex: deps.normalsTex,
    heightTex: deps.heightTex,
    splatTex: deps.splatTex,
    waterTex: deps.waterTex,
    setSplatSizeFromImage: deps.setSplatSizeFromImage,
    setHeightSizeFromImage: deps.setHeightSizeFromImage,
    setNormalsSizeFromImage: deps.setNormalsSizeFromImage,
    extractImageData: deps.extractImageData,
    rebuildFlowMapTexture: deps.rebuildFlowMapTexture,
    syncPointLightWorkerMapData: deps.syncPointLightWorkerMapData,
    setNormalsImageData: deps.setNormalsImageData,
    setHeightImageData: deps.setHeightImageData,
    setSlopeImageData: deps.setSlopeImageData,
    setWaterImageData: deps.setWaterImageData,
  }).initializeDefaultMapImages();
}
