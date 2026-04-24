function normalizeFollowIndex(value) {
  return Number.isFinite(Number(value)) ? Math.round(Number(value)) : -1;
}

export function createSwarmFollowRuntimeState(deps) {
  function getSwarmFollowSnapshot() {
    return {
      enabled: Boolean(deps.swarmFollowState.enabled),
      targetType: deps.swarmFollowState.targetType === "hawk" ? "hawk" : "agent",
      agentIndex: normalizeFollowIndex(deps.swarmFollowState.agentIndex),
      hawkIndex: normalizeFollowIndex(deps.swarmFollowState.hawkIndex),
      speedNormFiltered: Number.isFinite(Number(deps.swarmFollowState.speedNormFiltered))
        ? Number(deps.swarmFollowState.speedNormFiltered)
        : null,
    };
  }

  function setSwarmFollowAgentIndex(value) {
    deps.swarmFollowState.agentIndex = normalizeFollowIndex(value);
  }

  function setSwarmFollowHawkIndex(value) {
    deps.swarmFollowState.hawkIndex = normalizeFollowIndex(value);
  }

  function setSwarmFollowSpeedNormFiltered(value) {
    deps.swarmFollowState.speedNormFiltered = Number.isFinite(Number(value)) ? Number(value) : null;
  }

  function getSwarmFollowSpeedNormFiltered() {
    return getSwarmFollowSnapshot().speedNormFiltered;
  }

  function resetSwarmFollowSpeedNormFiltered() {
    deps.swarmFollowState.speedNormFiltered = null;
  }

  return {
    getSwarmFollowSnapshot,
    setSwarmFollowAgentIndex,
    setSwarmFollowHawkIndex,
    getSwarmFollowSpeedNormFiltered,
    setSwarmFollowSpeedNormFiltered,
    resetSwarmFollowSpeedNormFiltered,
  };
}
