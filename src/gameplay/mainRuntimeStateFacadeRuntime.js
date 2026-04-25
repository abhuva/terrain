export function createMainRuntimeStateFacadeRuntime(getMainRuntimeStateBinding) {
  return {
    syncMapStateToStore: (...args) => getMainRuntimeStateBinding().syncMapStateToStore(...args),
    syncPointLightsStateToStore: (...args) =>
      getMainRuntimeStateBinding().syncPointLightsStateToStore(...args),
    getCursorLightSnapshot: (...args) => getMainRuntimeStateBinding().getCursorLightSnapshot(...args),
    isPointLightLiveUpdateEnabled: (...args) =>
      getMainRuntimeStateBinding().isPointLightLiveUpdateEnabled(...args),
    isSwarmEnabled: (...args) => getMainRuntimeStateBinding().isSwarmEnabled(...args),
  };
}
