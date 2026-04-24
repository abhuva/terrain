import { createMapIoHelpers } from "./mapIoHelpers.js";

export function createMapIoHelpersRuntime(deps) {
  const mapIoHelpers = createMapIoHelpers({
    tauriInvoke: deps.tauriInvoke,
    isAbsoluteFsPath: deps.isAbsoluteFsPath,
    invokeTauri: deps.invokeTauri,
    toAbsoluteFileUrl: deps.toAbsoluteFileUrl,
  });
  return {
    tryLoadJsonFromUrl: (path) => mapIoHelpers.tryLoadJsonFromUrl(path),
  };
}
