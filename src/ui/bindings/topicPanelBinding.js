export function bindTopicPanelControls(deps) {
  const topicButtons = deps.topicButtons;
  const canIterateButtons = topicButtons && typeof topicButtons[Symbol.iterator] === "function";
  if (canIterateButtons) {
    for (const btn of topicButtons) {
      if (!btn || typeof btn.addEventListener !== "function") {
        continue;
      }
      btn.addEventListener("click", () => {
        const topic = btn.dataset.topic || "";
        if (typeof deps.canUseTopic === "function" && !deps.canUseTopic(topic)) {
          if (typeof deps.setStatus === "function") {
            deps.setStatus(`'${topic}' panel is unavailable in current runtime mode.`);
          }
          return;
        }
        const isAlreadyActive = btn.classList.contains("active");
        if (typeof deps.setActiveTopic === "function") {
          deps.setActiveTopic(isAlreadyActive ? "" : topic);
        }
      });
    }
  }

  if (deps.topicPanelCloseBtn && typeof deps.topicPanelCloseBtn.addEventListener === "function") {
    deps.topicPanelCloseBtn.addEventListener("click", () => {
      if (typeof deps.setActiveTopic === "function") {
        deps.setActiveTopic("");
      }
    });
  }

  if (deps.windowEl && typeof deps.windowEl.addEventListener === "function") {
    deps.windowEl.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && typeof deps.setActiveTopic === "function") {
        deps.setActiveTopic("");
      }
    });
  }
}
