export function createRuntimeSyncFacadeRuntime(deps) {
  return {
    syncMapStateToStore: (...args) => deps.getMainRuntimeStateFacade().syncMapStateToStore(...args),
    syncPointLightsStateToStore: (...args) =>
      deps.getMainRuntimeStateFacade().syncPointLightsStateToStore(...args),
    syncPlayerStateToStore: (...args) => deps.getPlayerRuntimeBinding().syncPlayerStateToStore(...args),
    syncSwarmFollowToStore: (...args) => deps.getSwarmRuntimeSetupRuntime().syncSwarmFollowToStore(...args),
    syncSwarmRuntimeStateToStore: (...args) =>
      deps.getSwarmRuntimeSetupRuntime().syncSwarmRuntimeStateToStore(...args),
    syncSwarmStateToStore: (...args) => deps.getSwarmRuntimeSetupRuntime().syncSwarmStateToStore(...args),
    getMovementStateSnapshot: () => deps.getMovementSystem().getSnapshot(),
    replaceMovementQueue: (pathPixels) => deps.getMovementSystem().replaceQueue(pathPixels, deps.resolveSimTickHours()),
    cancelMovementQueue: () => deps.getMovementSystem().cancelQueue(),
  };
}
