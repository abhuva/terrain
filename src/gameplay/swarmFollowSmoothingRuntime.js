export function createSwarmFollowSmoothingRuntime(deps) {
  function resetSwarmFollowSpeedSmoothing() {
    deps.swarmFollowState.speedNormFiltered = null;
  }

  return {
    resetSwarmFollowSpeedSmoothing,
  };
}
