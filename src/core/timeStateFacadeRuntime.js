export function createTimeStateFacadeRuntime(timeStateBindingRuntime) {
  return {
    getDefaultTimeRouting: () => timeStateBindingRuntime.getDefaultTimeRouting(),
    getConfiguredSimTickHours: () => timeStateBindingRuntime.getConfiguredSimTickHours(),
    getCurrentTimeRoutingFromStoreOrDefaults: () => timeStateBindingRuntime.getCurrentTimeRoutingFromStoreOrDefaults(),
    getConfiguredSimTickHoursFromStoreOrDefaults: () =>
      timeStateBindingRuntime.getConfiguredSimTickHoursFromStoreOrDefaults(),
    getInterpolatedRoutedTimeSec: (systemTiming) => timeStateBindingRuntime.getInterpolatedRoutedTimeSec(systemTiming),
  };
}
