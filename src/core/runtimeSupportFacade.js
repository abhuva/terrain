import { createRenderSupportRuntime } from "../render/renderSupportRuntime.js";
import { createMapSupportRuntime } from "../gameplay/mapSupportRuntime.js";

export function createRuntimeSupportFacade(deps) {
  let renderSupportRuntime = null;
  let mapSupportRuntime = null;

  function getRenderSupportRuntime() {
    if (renderSupportRuntime) {
      return renderSupportRuntime;
    }
    renderSupportRuntime = createRenderSupportRuntime({
      gl: deps.gl,
      getFlowMapTex: deps.getFlowMapTex,
      clamp: deps.clamp,
      rebuildFlowMapTexturePrecompute: deps.rebuildFlowMapTexturePrecompute,
      getHeightImageData: deps.getHeightImageData,
      getHeightSize: deps.getHeightSize,
      getWaterSettings: deps.getWaterSettings,
      getShadowSize: deps.getShadowSize,
      getShadowRawTex: deps.getShadowRawTex,
      getShadowBlurTex: deps.getShadowBlurTex,
      getShadowRawFbo: deps.getShadowRawFbo,
      getShadowBlurFbo: deps.getShadowBlurFbo,
      getShadowProgram: deps.getShadowProgram,
      getShadowUniforms: deps.getShadowUniforms,
      getHeightTex: deps.getHeightTex,
      getLightingSettings: deps.getLightingSettings,
      getShadowMapScale: deps.getShadowMapScale,
      getCloudNoiseTex: deps.getCloudNoiseTex,
      createCloudNoiseImageRender: deps.createCloudNoiseImageRender,
      uploadCloudNoiseTextureRender: deps.uploadCloudNoiseTextureRender,
    });
    return renderSupportRuntime;
  }

  function getMapSupportRuntime() {
    if (mapSupportRuntime) {
      return mapSupportRuntime;
    }
    mapSupportRuntime = createMapSupportRuntime({
      defaultMapFolder: deps.defaultMapFolder,
      windowEl: deps.windowEl,
      splatSize: deps.getSplatSizeObject(),
      normalsSize: deps.getNormalsSizeObject(),
      heightSize: deps.getHeightSizeObject(),
      splatTex: deps.getSplatTex(),
      normalsTex: deps.getNormalsTex(),
      heightTex: deps.getHeightTexObject(),
      waterTex: deps.getWaterTex(),
      uploadImageToTexture: (tex, image) => getRenderSupportRuntime().uploadImageToTexture(tex, image),
      applyMapSizeChangeIfNeeded: (...args) => deps.getApplyMapSizeChangeIfNeeded()(...args),
      resetCamera: () => deps.getResetCamera()(),
      extractImageData: (...args) => deps.getExtractImageData()(...args),
      rebuildFlowMapTexture: () => getRenderSupportRuntime().rebuildFlowMapTexture(),
      syncMapStateToStore: () => deps.getSyncMapStateToStore()(),
      getPointLightBakeWorker: () => deps.getPointLightBakeWorker(),
      getNormalsImageData: deps.getNormalsImageData,
      getHeightImageData: deps.getHeightImageData,
      setNormalsImageData: deps.setNormalsImageData,
      setHeightImageData: deps.setHeightImageData,
      setSlopeImageData: deps.setSlopeImageData,
      setWaterImageData: deps.setWaterImageData,
      clamp: deps.clamp,
      getSplatSize: deps.getSplatSize,
      getNormalsSize: deps.getNormalsSize,
      getHeightSize: deps.getHeightSize,
      swarmZMax: deps.swarmZMax,
    });
    return mapSupportRuntime;
  }

  return {
    createShader: (type, src) => getRenderSupportRuntime().createShader(type, src),
    createProgram: (vsSrc, fsSrc) => getRenderSupportRuntime().createProgram(vsSrc, fsSrc),
    createTexture: () => getRenderSupportRuntime().createTexture(),
    createLinearTexture: () => getRenderSupportRuntime().createLinearTexture(),
    uploadImageToTexture: (tex, image) => getRenderSupportRuntime().uploadImageToTexture(tex, image),
    rebuildFlowMapTexture: () => getRenderSupportRuntime().rebuildFlowMapTexture(),
    ensureShadowTargets: () => getRenderSupportRuntime().ensureShadowTargets(),
    renderShadowPipeline: (params) => getRenderSupportRuntime().renderShadowPipeline(params),
    createCloudNoiseImage: (size = 128) => getRenderSupportRuntime().createCloudNoiseImage(size),
    uploadCloudNoiseTexture: () => getRenderSupportRuntime().uploadCloudNoiseTexture(),
    normalizeMapFolderPath: (path) => getMapSupportRuntime().normalizeMapFolderPath(path),
    tauriInvoke: (...args) => getMapSupportRuntime().tauriInvoke(...args),
    isAbsoluteFsPath: (path) => getMapSupportRuntime().isAbsoluteFsPath(path),
    joinFsPath: (folder, fileName) => getMapSupportRuntime().joinFsPath(folder, fileName),
    buildMapAssetPath: (folder, fileName) => getMapSupportRuntime().buildMapAssetPath(folder, fileName),
    invokeTauri: (command, args) => getMapSupportRuntime().invokeTauri(command, args),
    toAbsoluteFileUrl: (path) => getMapSupportRuntime().toAbsoluteFileUrl(path),
    pickMapFolderViaTauri: () => getMapSupportRuntime().pickMapFolderViaTauri(),
    validateMapFolderViaTauri: (folderPath) => getMapSupportRuntime().validateMapFolderViaTauri(folderPath),
    applyMapImages: (splatImage, normalsImage, heightImage, slopeImage, waterImage) =>
      getMapSupportRuntime().applyMapImages(splatImage, normalsImage, heightImage, slopeImage, waterImage),
    syncPointLightWorkerMapData: () => getMapSupportRuntime().syncPointLightWorkerMapData(),
    getFileFromFolderSelection: (files, fileName) => getMapSupportRuntime().getFileFromFolderSelection(files, fileName),
    tryLoadJsonFromUrl: (path) => getMapSupportRuntime().tryLoadJsonFromUrl(path),
    loadImageFromUrl: (url) => getRenderSupportRuntime().loadImageFromUrl(url),
    loadImageFromFile: (file) => getRenderSupportRuntime().loadImageFromFile(file),
    getMapImageRuntime: () => getMapSupportRuntime().getMapImageRuntime(),
    normalize3: (x, y, z) => getMapSupportRuntime().normalize3(x, y, z),
    sampleNormalAtMapPixel: (pixelX, pixelY) => getMapSupportRuntime().sampleNormalAtMapPixel(pixelX, pixelY),
    sampleHeightAtMapPixel: (pixelX, pixelY) => getMapSupportRuntime().sampleHeightAtMapPixel(pixelX, pixelY),
    sampleHeightAtMapCoord: (mapX, mapY) => getMapSupportRuntime().sampleHeightAtMapCoord(mapX, mapY),
    computeSwarmDirectionalShadow: (mapX, mapY, sourceHeight, lightDir, blockedShadowFactor) =>
      getMapSupportRuntime().computeSwarmDirectionalShadow(mapX, mapY, sourceHeight, lightDir, blockedShadowFactor),
    hasLineOfSightToLight: (surfaceX, surfaceY, surfaceH, lightX, lightY, lightH, heightScaleValue) =>
      getMapSupportRuntime().hasLineOfSightToLight(
        surfaceX,
        surfaceY,
        surfaceH,
        lightX,
        lightY,
        lightH,
        heightScaleValue,
      ),
  };
}
