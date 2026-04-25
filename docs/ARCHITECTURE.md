# Architecture Map

This project is mid-migration from a monolithic `src/main.js` runtime
toward modular systems. The current shape is:

- `src/main.js`: top-level composition/orchestration entry point
- `src/app/`: app-layer dependency shaping and bootstrap assembly
- `src/core/`: store, scheduler, commands, settings contracts
- `src/render/`: render resources, precompute, passes, frame assembly
- `src/gameplay/`: gameplay/runtime ownership modules
- `src/ui/`: DOM binding, panel reflection, overlay/UI helpers
- `src/sim/`: time/lighting/fog/cloud/water/weather systems and helpers

## Runtime Core

- `src/core/state.js`: single runtime state store.
- `src/core/scheduler.js`: ordered system update pipeline.
- `src/core/commands.js`: typed command bus.
- `src/core/registerMainCommands.js`: composition root for command handlers.
- `src/core/modeCapabilities.js`: `dev` / `gameplay` / `hybrid`
  capability contract.
- `src/core/settingsRegistry.js`: subsystem settings contract registry.
- `src/core/mainSettingsContracts.js`: project settings contracts and defaults.
- `src/core/frameSnapshot.js`: per-frame store snapshot updates
  from runtime values.

## App Layer

- `src/app/*`: app-level assembly helpers that shape dependency objects
  for larger setup/runtime entry points.
- This layer exists to keep bootstrap wiring out of `src/main.js`
  without pushing app composition concerns down into gameplay/render/ui
  owner modules.

## Render

- `src/render/renderer.js`: pass registration + execution facade.
- `src/render/resources.js`: render resource helpers and metadata hooks.
- `src/render/passes/*`: shadow/blur/main terrain/point-light usage
  pass modules.
- `src/render/precompute/*`: map-space precompute adapters
  (flow map, point-light bake).
- `src/render/frameRenderState.js`: render DTO assembly from core
  state + frame inputs.
- `src/render/uniformInputState.js`: uniform input object assembly.

## Simulation

- `src/sim/timeSystem.js`
- `src/sim/lightingSystem.js`
- `src/sim/fogSystem.js`
- `src/sim/cloudSystem.js`
- `src/sim/waterFxSystem.js`
- `src/sim/weatherSystem.js` (architecture scaffold;
  no visible weather feature yet)

## Gameplay

- `src/gameplay/entityStore.js`: lightweight entity storage scaffold.
- `src/gameplay/pathfindingSystem.js`: scheduler adapter for
  pathfinding runtime state.
- `src/gameplay/movementSystem.js`: scheduler adapter for
  player/entity movement state.
- `src/gameplay/mainRuntimeStateBinding.js`: store-backed runtime-state
  ownership for map/pathfinding/cursor-light/point-light/swarm sync.
- `src/gameplay/swarmRuntime.js`: swarm runtime/store sync and follow-state
  ownership.
- `src/gameplay/interactionCommands.js`:
  interaction/pathfinding command routing.

## UI

- `src/ui/bindings/*`: panel/input listeners split by topic.
- `src/ui/overlays/overlayHooks.js`: frame hooks that separate
  gameplay updates from overlay draw gating.
- `src/ui/swarmUiRuntimeBinding.js`: swarm UI reflection/input sync
  composed from current runtime owners.

## Current Migration Status

- Render and UI listener extraction: largely complete.
- App-layer bootstrap/dependency shaping in `src/app/`: established.
- Mode capability gating: implemented.
- Weather/settings architecture groundwork: implemented.
- Gameplay foundation extraction: established with direct-owner runtimes
  replacing many bridge-era facades/wrappers.
- JS verification: current Node test suite passes (`tests/*.test.js`).
- Remaining high-value work: runtime smoke testing in browser/Tauri,
  then targeted follow-up only if smoke testing exposes ownership or
  startup-order issues.
