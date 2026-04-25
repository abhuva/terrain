export function createPointLightBakeFacadeRuntime(getPointLightBakeRuntimeBinding) {
  return {
    ensurePointLightBakeSize: () => getPointLightBakeRuntimeBinding().ensurePointLightBakeSize(),
    applyPointLightBakeRgba: (rgba, sourceWidth, sourceHeight) =>
      getPointLightBakeRuntimeBinding().applyPointLightBakeRgba(rgba, sourceWidth, sourceHeight),
    schedulePointLightBake: () => getPointLightBakeRuntimeBinding().schedulePointLightBake(),
    bakePointLightsTexture: () => getPointLightBakeRuntimeBinding().bakePointLightsTexture(),
    getPointLightBakeSyncRuntime: () => getPointLightBakeRuntimeBinding().getPointLightBakeSyncRuntime(),
    bakePointLightsTextureSync: (useReducedResolution = false) =>
      getPointLightBakeRuntimeBinding().bakePointLightsTextureSync(useReducedResolution),
  };
}
