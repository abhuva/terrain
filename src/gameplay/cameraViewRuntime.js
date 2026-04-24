export function createCameraViewRuntime(deps) {
  function resetCamera() {
    deps.dispatchCoreCommand({ type: "core/camera/reset" });
  }

  function getScreenAspect() {
    return deps.canvas.width > 0 && deps.canvas.height > 0 ? deps.canvas.width / deps.canvas.height : 1;
  }

  function getMapAspect() {
    return deps.splatSize.width / deps.splatSize.height;
  }

  return {
    resetCamera,
    getScreenAspect,
    getMapAspect,
  };
}
