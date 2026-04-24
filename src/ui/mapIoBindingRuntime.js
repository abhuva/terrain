import { bindMapIoControls } from "./bindings/mapIoBinding.js";

export function bindMapIoRuntime(deps) {
  bindMapIoControls({
    mapPathInput: deps.mapPathInput,
    mapPathLoadBtn: deps.mapPathLoadBtn,
    mapFolderInput: deps.mapFolderInput,
    mapSaveAllBtn: deps.mapSaveAllBtn,
    normalizeMapFolderPath: deps.normalizeMapFolderPath,
    tauriInvoke: deps.tauriInvoke,
    pickMapFolderViaTauri: deps.pickMapFolderViaTauri,
    loadMapFromPath: deps.loadMapFromPath,
    loadMapFromFolderSelection: deps.loadMapFromFolderSelection,
    saveAllMapDataFiles: deps.saveAllMapDataFiles,
    setStatus: deps.setStatus,
  });
}
