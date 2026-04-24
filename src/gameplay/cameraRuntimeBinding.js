import { createCameraViewRuntimeBinding } from "./cameraViewRuntimeBinding.js";
import {
  getBaseViewHalfExtents,
  getActiveCameraState,
  getViewHalfExtents,
  clientToNdc,
  worldFromNdc,
  worldToUv,
  uvToMapPixelIndex,
  mapPixelIndexToUv,
  mapPixelToWorld,
  mapCoordToWorld,
  worldToScreen,
} from "./cameraTransforms.js";

export function createCameraRuntimeBinding(deps) {
  const cameraViewRuntimeBinding = createCameraViewRuntimeBinding({
    dispatchCoreCommand: deps.dispatchCoreCommand,
    canvas: deps.canvas,
    splatSize: deps.splatSize,
  });

  function getMapAspectSafe() {
    return cameraViewRuntimeBinding.getMapAspect();
  }

  function getScreenAspectSafe() {
    return cameraViewRuntimeBinding.getScreenAspect();
  }

  function getActiveCameraStateSafe() {
    return getActiveCameraState({
      getCameraState: deps.getCameraState,
    });
  }

  function getBaseViewHalfExtentsSafe() {
    return getBaseViewHalfExtents({
      getScreenAspect: getScreenAspectSafe,
      getMapAspect: getMapAspectSafe,
    });
  }

  function getViewHalfExtentsSafe(zoomValue = null) {
    return getViewHalfExtents({
      zoomValue,
      getActiveCameraState: getActiveCameraStateSafe,
      getBaseViewHalfExtents: getBaseViewHalfExtentsSafe,
    });
  }

  return {
    resetCamera: () => cameraViewRuntimeBinding.resetCamera(),
    getScreenAspect: () => getScreenAspectSafe(),
    getMapAspect: () => getMapAspectSafe(),
    getBaseViewHalfExtents: () => getBaseViewHalfExtentsSafe(),
    getActiveCameraState: () => getActiveCameraStateSafe(),
    getViewHalfExtents: (zoomValue = null) => getViewHalfExtentsSafe(zoomValue),
    clientToNdc: (clientX, clientY) => clientToNdc({
      clientX,
      clientY,
      getCanvasRect: () => deps.canvas.getBoundingClientRect(),
    }),
    worldFromNdc: (ndc, zoomValue = null, pan = null) => worldFromNdc({
      ndc,
      zoomValue,
      pan,
      getActiveCameraState: getActiveCameraStateSafe,
      getViewHalfExtents: getViewHalfExtentsSafe,
    }),
    worldToUv: (world) => worldToUv({
      world,
      getMapAspect: getMapAspectSafe,
    }),
    uvToMapPixelIndex: (uv) => uvToMapPixelIndex({
      uv,
      clamp: deps.clamp,
      splatSize: deps.splatSize,
    }),
    mapPixelIndexToUv: (pixelX, pixelY) => mapPixelIndexToUv({
      pixelX,
      pixelY,
      splatSize: deps.splatSize,
    }),
    mapPixelToWorld: (pixelX, pixelY) => mapPixelToWorld({
      pixelX,
      pixelY,
      mapPixelIndexToUv: (x, y) => mapPixelIndexToUv({
        pixelX: x,
        pixelY: y,
        splatSize: deps.splatSize,
      }),
      getMapAspect: getMapAspectSafe,
    }),
    mapCoordToWorld: (mapX, mapY) => mapCoordToWorld({
      mapX,
      mapY,
      splatSize: deps.splatSize,
      getMapAspect: getMapAspectSafe,
    }),
    worldToScreen: (world) => worldToScreen({
      world,
      getActiveCameraState: getActiveCameraStateSafe,
      getViewHalfExtents: getViewHalfExtentsSafe,
      overlayCanvas: deps.overlayCanvas,
    }),
  };
}
