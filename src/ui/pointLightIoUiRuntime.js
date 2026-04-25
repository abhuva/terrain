export function createPointLightIoUiRuntime(deps) {
  return {
    clearPointLightsLoadInput: () => {
      deps.pointLightsLoadInput.value = "";
    },
    openPointLightsLoadInput: () => {
      deps.pointLightsLoadInput.click();
    },
    setSaveButtonText: (text) => {
      deps.pointLightsSaveAllBtn.textContent = text;
    },
  };
}
