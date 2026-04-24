import { createMapBootstrapRuntime } from "./mapBootstrapRuntime.js";

export function createMapBootstrapBindingRuntime(deps) {
  return createMapBootstrapRuntime({
    defaultMapFolderCandidates: deps.defaultMapFolderCandidates,
    loadMapFromPath: deps.loadMapFromPath,
    setStatus: deps.setStatus,
  });
}
