export function getCursorLightSnapshot(deps) {
  const cursorLightState = typeof deps.getCursorLightState === "function"
    ? deps.getCursorLightState()
    : deps.cursorLightState;
  const fallbackCursorLightState = cursorLightState || {
    enabled: false,
    useTerrainHeight: true,
    strength: 40,
    heightOffset: 25,
    colorHex: "#ff9b2f",
    showGizmo: false,
  };
  const coreCursorLight = deps.getCoreCursorLight();
  if (coreCursorLight && Number.isFinite(Number(coreCursorLight.strength))) {
    return {
      enabled: Boolean(coreCursorLight.enabled),
      useTerrainHeight: Boolean(coreCursorLight.useTerrainHeight),
      strength: Math.round(deps.clamp(Number(coreCursorLight.strength), 1, 200)),
      heightOffset: Math.round(deps.clamp(Number(coreCursorLight.heightOffset), 0, 120)),
      colorHex: typeof coreCursorLight.color === "string" ? coreCursorLight.color : fallbackCursorLightState.colorHex,
      showGizmo: Boolean(coreCursorLight.showGizmo),
    };
  }
  return {
    enabled: Boolean(fallbackCursorLightState.enabled),
    useTerrainHeight: Boolean(fallbackCursorLightState.useTerrainHeight),
    strength: Math.round(deps.clamp(Number(fallbackCursorLightState.strength), 1, 200)),
    heightOffset: Math.round(deps.clamp(Number(fallbackCursorLightState.heightOffset), 0, 120)),
    colorHex: typeof fallbackCursorLightState.colorHex === "string" ? fallbackCursorLightState.colorHex : "#ff9b2f",
    showGizmo: Boolean(fallbackCursorLightState.showGizmo),
  };
}

export function isPointLightLiveUpdateEnabled(deps) {
  const pointLightsState = deps.getCorePointLights();
  if (pointLightsState && typeof pointLightsState.liveUpdate === "boolean") {
    return pointLightsState.liveUpdate;
  }
  return false;
}
