export function createPointLightEditorActionBindingRuntime(deps) {
  return {
    beginLightEdit: (light) => deps.pointLightEditorRuntime.beginLightEdit(light),
    applyDraftToSelectedPointLight: () => deps.pointLightEditorRuntime.applyDraftToSelectedPointLight(),
    rebakeIfPointLightLiveUpdateEnabled: () => deps.pointLightEditorRuntime.rebakeIfPointLightLiveUpdateEnabled(),
    findPointLightAtPixel: (pixelX, pixelY, radiusPx) =>
      deps.pointLightEditorRuntime.findPointLightAtPixel(pixelX, pixelY, radiusPx),
    createPointLight: (pixelX, pixelY) => deps.pointLightEditorRuntime.createPointLight(pixelX, pixelY),
  };
}
