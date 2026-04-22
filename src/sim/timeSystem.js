export function createTimeSystem(deps) {
  return {
    update(ctx) {
      const rawCycleSpeed = deps.clamp(Number(deps.cycleSpeedInput.value), 0, 1);
      const cycleSpeedHoursPerSec = Number.isFinite(rawCycleSpeed) ? rawCycleSpeed : 0;
      const frameTime = ctx && ctx.time ? ctx.time : null;
      const globalHoursAdvanced = frameTime && Number.isFinite(Number(frameTime.globalHoursAdvanced))
        ? Number(frameTime.globalHoursAdvanced)
        : 0;
      const cloudTimeSec = frameTime && frameTime.systems && frameTime.systems.clouds
        ? Number(frameTime.systems.clouds.timeSec)
        : 0;
      const waterTimeSec = frameTime && frameTime.systems && frameTime.systems.water
        ? Number(frameTime.systems.water.timeSec)
        : 0;
      const timeState = {
        cycleSpeedHoursPerSec,
        ...(frameTime || {}),
        cloudTimeSec: Number.isFinite(cloudTimeSec) ? cloudTimeSec : 0,
        waterTimeSec: Number.isFinite(waterTimeSec) ? waterTimeSec : 0,
      };
      deps.setTimeState(timeState);
      if (typeof deps.updateStoreTime === "function") {
        deps.updateStoreTime(timeState);
      }
      const scrubbing = deps.isCycleHourScrubbing();

      if (globalHoursAdvanced > 0 && !scrubbing) {
        deps.cycleState.hour = deps.wrapHour(deps.cycleState.hour + globalHoursAdvanced);
      }
      if (!scrubbing) {
        deps.setCycleHourSliderFromState();
      }
    },
  };
}
