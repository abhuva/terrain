export function createPointLightFacadeRuntime(getPointLightRuntime) {
  return {
    getSelectedPointLight: () => getPointLightRuntime().getSelectedPointLight(),
    clearLightEditSelection: () => getPointLightRuntime().clearLightEditSelection(),
    setLightEditSelection: (light) => getPointLightRuntime().setLightEditSelection(light),
    clearPointLights: () => getPointLightRuntime().clearPointLights(),
    resetPointLightsSaveConfirmation: () => getPointLightRuntime().resetPointLightsSaveConfirmation(),
    armPointLightsSaveConfirmation: () => getPointLightRuntime().armPointLightsSaveConfirmation(),
    serializePointLights: () => getPointLightRuntime().serializePointLights(),
    applyLoadedPointLights: (rawData, sourceLabel, options = {}) =>
      getPointLightRuntime().applyLoadedPointLights(rawData, sourceLabel, options),
    savePointLightsJson: () => getPointLightRuntime().savePointLightsJson(),
    loadPointLightsFromAssetsOrPrompt: () => getPointLightRuntime().loadPointLightsFromAssetsOrPrompt(),
  };
}
