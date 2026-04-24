import {
  normalizeMapFolderPath as normalizeMapFolderPathUtil,
  isAbsoluteFsPath as isAbsoluteFsPathUtil,
  joinFsPath as joinFsPathUtil,
  buildMapAssetPath as buildMapAssetPathUtil,
  toAbsoluteFileUrl as toAbsoluteFileUrlUtil,
} from "./mapPathUtils.js";

export function createMapPathBindingRuntime(deps) {
  return {
    normalizeMapFolderPath: (path) => normalizeMapFolderPathUtil(path, deps.defaultMapFolder),
    isAbsoluteFsPath: (path) => isAbsoluteFsPathUtil(path),
    joinFsPath: (folder, fileName) => joinFsPathUtil(folder, fileName),
    buildMapAssetPath: (folder, fileName) => buildMapAssetPathUtil(folder, fileName),
    toAbsoluteFileUrl: (path) => toAbsoluteFileUrlUtil(path),
  };
}
