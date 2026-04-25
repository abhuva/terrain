import { createSwarmRuntime } from "./swarmRuntime.js";

export function createSwarmRuntimeSetupRuntime(deps) {
  const swarmRuntime = createSwarmRuntime({
    store: deps.store,
    isSwarmEnabled: deps.isSwarmEnabled,
    getSwarmSettings: deps.getSwarmSettings,
    swarmState: deps.swarmState,
    swarmFollowState: deps.swarmFollowState,
    getSwarmFollowSnapshot: deps.getSwarmFollowSnapshot,
    setSwarmFollowEnabled: deps.setSwarmFollowEnabled,
    setSwarmFollowTargetType: deps.setSwarmFollowTargetType,
    setSwarmFollowAgentIndex: deps.setSwarmFollowAgentIndex,
    setSwarmFollowHawkIndex: deps.setSwarmFollowHawkIndex,
    swarmFollowTargetInput: deps.swarmFollowTargetInput,
    syncSwarmFollowTargetInput: deps.syncSwarmFollowTargetInput,
    resetSwarmFollowSpeedSmoothing: deps.resetSwarmFollowSpeedSmoothing,
    updateSwarmFollowButtonUi: deps.updateSwarmFollowButtonUi,
  });

  return {
    swarmRuntime,
    applySwarmFollowState: swarmRuntime.applySwarmFollowState,
    stopSwarmFollow: swarmRuntime.stopSwarmFollow,
    syncSwarmFollowToStore: swarmRuntime.syncSwarmFollowToStore,
    syncSwarmRuntimeStateToStore: swarmRuntime.syncSwarmRuntimeStateToStore,
    syncSwarmStateToStore: swarmRuntime.syncSwarmStateToStore,
  };
}
