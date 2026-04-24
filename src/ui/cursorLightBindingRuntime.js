import { bindCursorLightControls } from "./bindings/cursorLightBinding.js";

export function bindCursorLightRuntime(deps) {
  bindCursorLightControls({
    cursorLightModeToggle: deps.cursorLightModeToggle,
    cursorLightFollowHeightToggle: deps.cursorLightFollowHeightToggle,
    cursorLightColorInput: deps.cursorLightColorInput,
    cursorLightStrengthInput: deps.cursorLightStrengthInput,
    cursorLightHeightOffsetInput: deps.cursorLightHeightOffsetInput,
    cursorLightGizmoToggle: deps.cursorLightGizmoToggle,
    dispatchCoreCommand: deps.dispatchCoreCommand,
    setStatus: deps.setStatus,
  });
}
