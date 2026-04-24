export function createMainFacadeRuntime(deps) {
  return {
    getBaseViewHalfExtents: () => deps.getCameraRuntimeBinding().getBaseViewHalfExtents(),
    getActiveCameraState: () => deps.getCameraRuntimeBinding().getActiveCameraState(),
    getViewHalfExtents: (zoomValue = null) => deps.getCameraRuntimeBinding().getViewHalfExtents(zoomValue),
    clientToNdc: (clientX, clientY) => deps.getCameraRuntimeBinding().clientToNdc(clientX, clientY),
    worldFromNdc: (ndc, zoomValue = null, pan = null) =>
      deps.getCameraRuntimeBinding().worldFromNdc(ndc, zoomValue, pan),
    worldToUv: (world) => deps.getCameraRuntimeBinding().worldToUv(world),
    uvToMapPixelIndex: (uv) => deps.getCameraRuntimeBinding().uvToMapPixelIndex(uv),
    mapPixelIndexToUv: (pixelX, pixelY) => deps.getCameraRuntimeBinding().mapPixelIndexToUv(pixelX, pixelY),
    mapPixelToWorld: (pixelX, pixelY) => deps.getCameraRuntimeBinding().mapPixelToWorld(pixelX, pixelY),
    mapCoordToWorld: (mapX, mapY) => deps.getCameraRuntimeBinding().mapCoordToWorld(mapX, mapY),
    worldToScreen: (world) => deps.getCameraRuntimeBinding().worldToScreen(world),
    setInteractionMode: (mode) => deps.interactionModeRuntime.setInteractionMode(mode),
    setPlayerPosition: (pixelX, pixelY) => deps.playerRuntimeBinding.setPlayerPosition(pixelX, pixelY),
    parseNpcPlayer: (rawData) => deps.parseNpcPlayerImpl(rawData),
    applyLoadedNpc: (rawData) => deps.applyLoadedNpcImpl(rawData),
    updateInfoPanel: () => deps.updateInfoPanelImpl(),
  };
}
