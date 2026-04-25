export function createMapLifecycleFacadeRuntime(getMapLifecycleRuntime) {
  return {
    setCurrentMapFolderPath: (nextPath) => getMapLifecycleRuntime().setCurrentMapFolderPath(nextPath),
    applyDefaultMapSettings: () => getMapLifecycleRuntime().applyDefaultMapSettings(),
    resetMapRuntimeStateAfterImages: () => getMapLifecycleRuntime().resetMapRuntimeStateAfterImages(),
    applyMapSizeChangeIfNeeded: (changed) => getMapLifecycleRuntime().applyMapSizeChangeIfNeeded(changed),
    createMapDataFileTexts: () => getMapLifecycleRuntime().createMapDataFileTexts(),
    downloadTextFile: (fileName, text) => getMapLifecycleRuntime().downloadTextFile(fileName, text),
    saveAllMapDataFiles: () => getMapLifecycleRuntime().saveAllMapDataFiles(),
    loadMapFromPath: (mapFolderPath) => getMapLifecycleRuntime().loadMapFromPath(mapFolderPath),
    loadMapFromFolderSelection: (fileList) => getMapLifecycleRuntime().loadMapFromFolderSelection(fileList),
    tryAutoLoadDefaultMap: () => getMapLifecycleRuntime().tryAutoLoadDefaultMap(),
    getCurrentMapFolderPath: () => getMapLifecycleRuntime().getCurrentMapFolderPath(),
  };
}
