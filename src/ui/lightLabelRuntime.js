export function createLightLabelRuntime(deps) {
  function updatePointLightStrengthLabel(value = null) {
    const nextValue = value == null
      ? Math.round(deps.clamp(Number(deps.pointLightStrengthInput.value), 1, 200))
      : Math.round(deps.clamp(Number(value), 1, 200));
    deps.pointLightStrengthValue.textContent = `${nextValue} px`;
  }

  function updatePointLightIntensityLabel(value = null) {
    const nextValue = value == null
      ? deps.clamp(Number(deps.pointLightIntensityInput.value), 0, 4)
      : deps.clamp(Number(value), 0, 4);
    deps.pointLightIntensityValue.textContent = `${nextValue.toFixed(2)}x`;
  }

  function updatePointLightHeightOffsetLabel(value = null) {
    const nextValue = value == null
      ? Math.round(deps.clamp(Number(deps.pointLightHeightOffsetInput.value), -120, 240))
      : Math.round(deps.clamp(Number(value), -120, 240));
    deps.pointLightHeightOffsetValue.textContent = `${nextValue} px`;
  }

  function updatePointLightFlickerLabel(value = null) {
    const nextValue = value == null
      ? deps.clamp(Number(deps.pointLightFlickerInput.value), 0, 1)
      : deps.clamp(Number(value), 0, 1);
    deps.pointLightFlickerValue.textContent = nextValue.toFixed(2);
  }

  function updatePointLightFlickerSpeedLabel(value = null) {
    const nextValue = value == null
      ? deps.clamp(Number(deps.pointLightFlickerSpeedInput.value), 0, 1)
      : deps.clamp(Number(value), 0, 1);
    deps.pointLightFlickerSpeedValue.textContent = nextValue.toFixed(2);
  }

  function updateCursorLightStrengthLabel() {
    const value = deps.getCursorLightSnapshot().strength;
    deps.cursorLightStrengthValue.textContent = `${value} px`;
  }

  function updateCursorLightHeightOffsetLabel() {
    const value = deps.getCursorLightSnapshot().heightOffset;
    deps.cursorLightHeightOffsetValue.textContent = `${value}`;
  }

  return {
    updatePointLightStrengthLabel,
    updatePointLightIntensityLabel,
    updatePointLightHeightOffsetLabel,
    updatePointLightFlickerLabel,
    updatePointLightFlickerSpeedLabel,
    updateCursorLightStrengthLabel,
    updateCursorLightHeightOffsetLabel,
  };
}
