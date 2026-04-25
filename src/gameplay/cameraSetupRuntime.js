import { createCameraRuntimeBinding } from "./cameraRuntimeBinding.js";

export function createCameraSetupRuntime(deps) {
  return createCameraRuntimeBinding({
    dispatchCoreCommand: deps.dispatchCoreCommand,
    canvas: deps.canvas,
    overlayCanvas: deps.overlayCanvas,
    splatSize: deps.splatSize,
    clamp: deps.clamp,
    getCameraState: deps.getCameraState,
  });
}
