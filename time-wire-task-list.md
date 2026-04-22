
# Time Wire Task List

Last updated: 2026-04-22
Owner: Codex + Marc
Branch policy: dedicated implementation branch, no direct commits to `main`
Scope: wire fixed-step simulation timing into gameplay systems while preserving detached visual timing where intended

## Purpose

This file is the implementation control document and session-to-session memory for the simulation timing integration.

Goals:
- Introduce a fixed-step global simulation clock for gameplay/simulation systems.
- Bind movement, swarm, clouds, and later weather to explicit time routing.
- Keep water detached by default as a visual-only effect.
- Replace teleport movement with a queued action model driven by precomputed path costs.
- Make per-system detach/override behavior a consequence of architecture, not one-off wiring.

Non-goals:
- Rewind support.
- Full "state as pure function of time" architecture for all systems.
- Major renderer redesign beyond what timing separation requires.
- Sub-pixel walking interpolation in the first implementation.

## Progress Rules

Status markers:
- `[ ]` not started
- `[-]` in progress
- `[x]` done
- `[!]` blocked

Execution rules:
- Only one major phase in progress at once.
- Every completed subtask should add a short note in the `Session Log`.
- Prefer deterministic fixed-step updates for gameplay/simulation logic.
- Keep visual-only effects in renderer/frame-time paths when they are intentionally detached.
- Do not treat this document as authoritative proof of completion; always verify actual code state first.

## Timing Architecture (Reference)

Core direction:
- Gameplay/simulation systems use fixed-step simulation.
- Pause/unpause and speed control determine how many simulation ticks are processed.
- Rendering remains frame-rate driven and may use interpolation or detached visual timing where useful.

Base timing model:
- Base simulation tick: `0.01` hours.
- Runtime speed is expressed in hours per second.
- Faster runtime speed means more simulation ticks processed per real second.

Movement/action model:
- Entity actions are queued with precomputed timings/costs (from the pathfinding).
- Movement edge example:
  - tile cost `45`
  - edge duration `0.45` in-game hours
  - at `0.1 h/s`, edge duration is `4.5s` real-time

Design decisions:
- `Day Speed = 0` is the global pause.
- Rewind is explicitly out of scope.
- Gameplay systems should remain deterministic and history-aware.
- Renderer may still use time-driven visual-only effects outside the fixed-step loop.

Practical split:
- Fixed-step: movement, swarm, cloud timing, weather timing
- Detached visual time: water
- Candidate later review: point-light flicker should likely become visual-only after its rework

## Target Behavior (Reference)

Default routing:
- `movement`: global
- `swarm`: global
- `clouds`: global
- `weather`: global later
- `water`: detached

Expected behavior:
- `Day Speed = 0` freezes all global-bound systems.
- Higher `Day Speed` makes global-bound systems progress faster in real time.
- Detached systems continue using their own time controls.
- Clicking a new destination while moving cancels the current movement queue and replaces it.

## Phase Overview

1. Baseline & Timing Contract
2. Global Fixed-Step Clock Foundation
3. Movement Queue Extraction
4. Movement Execution Rewire
5. Swarm Time Routing
6. Cloud Time Routing
7. Water Detached Time Separation
8. Time Routing UI & Persistence
9. Hardening & Documentation

## Detailed Task List

### Phase 1: Baseline & Timing Contract

Dependencies: none

- [x] P1.1 Capture timing baseline and invariants
  - [x] P1.1.1 Record current time ownership points in code:
    - `cycleSpeed` / day-night progression
    - swarm update timing
    - cloud shader timing
    - water shader timing
    - pathfinding click-to-move teleport behavior
  - [x] P1.1.2 Record current JSON settings that will need timing/routing extension:
    - `lighting.json`
    - `clouds.json`
    - `waterfx.json`
    - `interaction.json`
    - `swarm.json`
  - [x] P1.1.3 Record current assumptions that must remain true after migration:
    - path preview remains intact
    - save/load compatibility remains intact
    - existing detached module controls still work
- [x] P1.2 Define fixed-step timing contract in code-facing terms
  - [x] P1.2.1 Confirm base sim tick constant location and naming.
  - [x] P1.2.2 Confirm runtime speed contract:
    - `hoursPerSecond`
    - `simTickHours`
    - `ticksToProcess`
  - [x] P1.2.3 Define which systems are fixed-step vs detached for the first pass.
- [x] P1.3 Add or update this task document as external memory
  - [x] P1.3.1 Keep explicit task IDs and dependencies current.
  - [x] P1.3.2 Add session notes whenever a task is completed.

Exit criteria:
- Fixed-step timing contract is explicit enough to implement without reinterpretation.
- First-pass system routing defaults are documented and stable.

### Phase 2: Global Fixed-Step Clock Foundation

Dependencies: Phase 1

- [x] P2.1 Extend core state for timing
  - [x] P2.1.1 Add simulation clock state in [src/core/state.js](C:/Users/Marc Bielert/Github/terrain/src/core/state.js).
  - [x] P2.1.2 Include:
    - fixed tick size in hours
    - accumulated partial tick remainder
    - ticks processed this frame
    - paused/global runtime speed
  - [x] P2.1.3 Add routing mode state for:
    - movement
    - swarm
    - clouds
    - water
    - weather placeholder
- [x] P2.2 Add global time router
  - [x] P2.2.1 Create `src/core/timeRouter.js`.
  - [x] P2.2.2 Expose helpers for:
    - fixed-step global tick processing
    - detached wall-clock time
    - effective time source lookup per subsystem
  - [x] P2.2.3 Make one source of truth for tick math:
    - `tickDelta = (hoursPerSecond * frameDtSec) / simTickHours`
- [x] P2.3 Integrate timing into scheduler context
  - [x] P2.3.1 Pass routed timing data through scheduler update context.
  - [x] P2.3.2 Ensure systems can query effective time without direct DOM reads.
  - [x] P2.3.3 Preserve current behavior until individual systems are switched over.
- [x] P2.4 Add command/state plumbing for routing and timing settings
  - [x] P2.4.1 Add commands for changing routing mode.
  - [x] P2.4.2 Add command/state plumbing for configurable map-level sim tick size.

Exit criteria:
- Global fixed-step clock exists in core state.
- Scheduler can provide routed time payloads.
- Tick math is centralized and inspectable.

### Phase 3: Movement Queue Extraction

Dependencies: Phase 2

- [x] P3.1 Define movement queue runtime model
  - [x] P3.1.1 Extend movement runtime state in [src/gameplay/movementSystem.js](C:/Users/Marc Bielert/Github/terrain/src/gameplay/movementSystem.js) or a dedicated helper module.
  - [x] P3.1.2 Add:
    - `queue`
    - `currentStepIndex`
    - `ticksRemaining`
    - `active`
    - optional route metadata for debug/status
- [x] P3.2 Convert path pixels into movement steps
  - [x] P3.2.1 Reuse the existing path extraction output.
  - [x] P3.2.2 Reuse `computeMoveStepCost(...)` from [src/main.js](C:/Users/Marc Bielert/Github/terrain/src/main.js).
  - [x] P3.2.3 Build step records with:
    - `fromX`, `fromY`
    - `toX`, `toY`
    - `cost`
    - `ticksRequired`
    - `hoursRequired = cost * simTickHours`
- [x] P3.3 Add movement queue lifecycle helpers
  - [x] P3.3.1 Add queue replacement helper.
  - [x] P3.3.2 Add queue cancel helper.
  - [x] P3.3.3 Add queue clear-on-invalid-state helper if needed.
- [x] P3.4 Mirror movement queue state into core gameplay state
  - [x] P3.4.1 Expose enough snapshot state for UI/debug text.
  - [x] P3.4.2 Keep runtime ownership clear so queue state does not drift from player position.

Exit criteria:
- A path can be converted into a deterministic movement queue.
- Each movement edge has precomputed cost and in-game duration.
- Queue lifecycle operations are explicit and testable.

### Phase 4: Movement Execution Rewire

Dependencies: Phase 3

- [x] P4.1 Execute movement using fixed simulation ticks
  - [x] P4.1.1 Consume global fixed-step timing in movement system.
  - [x] P4.1.2 Process movement using simulation ticks, not raw frame dt.
  - [x] P4.1.3 Support multiple completed edges in one frame if enough ticks are processed.
  - [x] P4.1.4 Preserve deterministic order when leftover ticks spill into the next edge.
- [x] P4.2 Replace teleport click behavior
  - [x] P4.2.1 Update pathfinding click handling in [src/gameplay/interactionCommands.js](C:/Users/Marc Bielert/Github/terrain/src/gameplay/interactionCommands.js).
  - [x] P4.2.2 In pathfinding mode:
    - compute path
    - leave active queue unchanged if path is invalid
    - cancel existing queue if valid replacement path exists
    - enqueue the new steps
  - [x] P4.2.3 Remove immediate position teleport in pathfinding mode.
- [x] P4.3 Keep first-pass walking simple and stable
  - [x] P4.3.1 Keep first implementation tile-step only.
  - [x] P4.3.2 Do not add interpolation until fixed-step queue semantics are stable.
- [x] P4.4 Add movement-facing status output
  - [x] P4.4.1 Show movement active/idle state.
  - [x] P4.4.2 Show queue length/current step cost/ticks remaining.

Exit criteria:
- Pathfinding mode no longer teleports the player.
- Movement progresses through queued steps using simulation ticks.
- `Day Speed = 0` freezes movement.
- Higher `Day Speed` reduces real-time duration while preserving in-game duration.

### Phase 5: Swarm Time Routing

Dependencies: Phase 2

- [x] P5.1 Audit swarm timing ownership
  - [x] P5.1.1 Identify current wall-clock dt assumptions in swarm update.
  - [x] P5.1.2 Identify where swarm speed multiplier is currently applied.
- [x] P5.2 Route swarm through fixed-step/global timing
  - [x] P5.2.1 Switch swarm update to routed timing source.
  - [x] P5.2.2 Preserve current `simulationSpeed` as a local multiplier after routing choice.
  - [x] P5.2.3 Default swarm routing to `global`.
- [x] P5.3 Add detached swarm mode
  - [x] P5.3.1 Ensure detached swarm continues independently when global time is paused.
  - [x] P5.3.2 Keep current detached controls behavior coherent.
- [-] P5.4 Expose swarm routing state
  - [ ] P5.4.1 Mirror swarm routing into core gameplay/sim state.
  - [x] P5.4.2 Add enough status/debug output for validation.

Exit criteria:
- Global swarm pauses and speeds up with global time.
- Detached swarm continues independently.
- Swarm speed multiplier does not double-apply incorrectly.

### Phase 6: Cloud Time Routing

Dependencies: Phase 2

- [x] P6.1 Audit cloud animation timing path
  - [x] P6.1.1 Identify all cloud shader uses of shared time uniforms.
  - [x] P6.1.2 Identify any shared time coupling with water or other effects.
- [x] P6.2 Route clouds to global simulation timing by default
  - [x] P6.2.1 Feed cloud animation from routed cloud time.
  - [x] P6.2.2 Preserve cloud speed sliders as local shaping controls.
  - [x] P6.2.3 Default routing to `global`.
- [x] P6.3 Add detached cloud mode
  - [x] P6.3.1 Ensure detached clouds continue when global time is paused.
  - [x] P6.3.2 Preserve manual testing value of existing cloud controls.
- [-] P6.4 Rebalance cloud defaults
  - [x] P6.4.1 Lower layer speed defaults from their current values.
  - [ ] P6.4.2 Validate that default motion looks slower and more plausible.

Exit criteria:
- Global clouds freeze at `Day Speed = 0`.
- Global clouds speed up with higher global time rate.
- Detached clouds remain independently controllable.
- Default cloud motion is slower than before.

### Phase 7: Water Detached Time Separation

Dependencies: Phase 2, Phase 6 if time uniforms need splitting

- [-] P7.1 Make water timing explicitly detached
  - [x] P7.1.1 Audit water animation timing usage.
  - [x] P7.1.2 Route water to detached time by default.
  - [ ] P7.1.3 Keep current visual behavior in detached mode.
- [x] P7.2 Separate shared timing paths if required
  - [x] P7.2.1 Split global and detached shader time uniforms if cloud/water currently share one path.
  - [x] P7.2.2 Ensure water timing does not change accidentally when cloud timing is rewired.
- [x] P7.3 Add optional water routing toggle
  - [x] P7.3.1 Allow later testing in global mode.
  - [x] P7.3.2 Keep default as detached.

Exit criteria:
- Water remains animated while global-bound systems are paused.
- Water time ownership is explicit in architecture, not implicit by legacy wiring.

### Phase 8: Time Routing UI & Persistence

Dependencies: Phases 2, 4, 5, 6, 7

- [x] P8.1 Add routing controls to UI
  - [x] P8.1.1 Add `Global/Detached` controls for swarm.
  - [x] P8.1.2 Add `Global/Detached` controls for clouds.
  - [x] P8.1.3 Add `Global/Detached` controls for water.
  - [x] P8.1.4 Keep movement implicitly global in first pass unless implementation proves a toggle is needed.
- [-] P8.2 Add timing debug/status UI
  - [x] P8.2.1 Show current movement queue/debug state.
  - [ ] P8.2.2 Show effective routing mode where useful.
  - [x] P8.2.3 Optionally show sim tick size for inspection.
- [x] P8.3 Persist timing settings
  - [x] P8.3.1 Add sim tick size to map settings.
  - [x] P8.3.2 Persist cloud routing in cloud settings.
  - [x] P8.3.3 Persist swarm routing in swarm settings.
  - [x] P8.3.4 Persist water routing in water settings.
  - [x] P8.3.5 Preserve backward compatibility when new keys are absent.
- [x] P8.4 Wire commands/settings contracts
  - [x] P8.4.1 Extend settings registry contracts.
  - [x] P8.4.2 Add command handlers for routing updates.
  - [x] P8.4.3 Keep core state as the source of truth.

Exit criteria:
- Routing choices are user-visible and persistent.
- Map-level simulation tick size is configurable via settings.
- Older map JSON still loads with safe defaults.

### Phase 9: Hardening & Documentation

Dependencies: Phases 2-8

- [-] P9.1 Add targeted test coverage
  - [x] P9.1.1 Test tick math and tick accumulation determinism.
  - [x] P9.1.2 Test movement queue cost-to-time conversion.
  - [x] P9.1.3 Test movement queue replacement/cancel behavior.
  - [ ] P9.1.4 Test routing defaults and missing-settings fallback behavior.
- [ ] P9.2 Run compatibility verification
  - [ ] P9.2.1 Verify path preview still works.
  - [ ] P9.2.2 Verify save/load of all existing settings still works.
  - [ ] P9.2.3 Verify global pause/speed behavior across movement, swarm, clouds, water.
- [ ] P9.3 Update docs
  - [ ] P9.3.1 Update [README.md](C:/Users/Marc Bielert/Github/terrain/README.md) timing and controls notes.
  - [ ] P9.3.2 Update [AI_CONTEXT.md](C:/Users/Marc Bielert/Github/terrain/AI_CONTEXT.md) with timing ownership and walking semantics.
  - [ ] P9.3.3 Update [AGENTS.md](C:/Users/Marc Bielert/Github/terrain/AGENTS.md) timing model and map-setting expectations.
- [ ] P9.4 Cleanup
  - [ ] P9.4.1 Remove obsolete teleport-only logic paths.
  - [ ] P9.4.2 Remove duplicate wall-clock timing reads for globally routed systems.

Exit criteria:
- Tests cover the highest-risk timing math and queue behavior.
- Docs match final behavior.
- No duplicate time ownership remains for converted systems.

## Dependency Map (High Level)

- Phase 1 -> Phase 2
- Phase 2 -> Phase 3, 5, 6, 7
- Phase 3 -> Phase 4
- Phase 4 + 5 + 6 + 7 -> Phase 8
- Phases 2-8 -> Phase 9

Critical path:
- P1 -> P2 -> P3 -> P4 -> P8 -> P9

## Compatibility Checklist (Must Pass Before Merge)

- [ ] `Day Speed = 0` freezes movement in global mode.
- [ ] `Day Speed = 0` freezes swarm in global mode.
- [ ] `Day Speed = 0` freezes clouds in global mode.
- [ ] `Day Speed = 0` does not freeze water in detached mode.
- [ ] Higher `Day Speed` speeds up movement in real time while preserving in-game duration.
- [ ] Higher `Day Speed` speeds up swarm in real time.
- [ ] Higher `Day Speed` speeds up clouds in real time.
- [x] Clicking a new destination while moving cancels the current route and replaces it.
- [x] Invalid/unreachable click does not discard an active valid queue unless intentionally changed later.
- [ ] Map save/load preserves new timing settings and older JSON still loads safely.
- [ ] Existing pathfinding preview still works.
- [ ] Existing swarm controls still work in detached mode.
- [ ] Existing water controls still work in detached mode.

## Testing Strategy (Pragmatic)

Mandatory:
- Deterministic tick math tests.
- Deterministic movement queue math tests.
- Manual compatibility checklist for pause/speed/routing.

Optional early, required before final completion:
- Focused visual checks for cloud and water timing separation.

## Suggested File Touch Map

- [src/core/state.js](C:/Users/Marc Bielert/Github/terrain/src/core/state.js)
- [src/core/scheduler.js](C:/Users/Marc Bielert/Github/terrain/src/core/scheduler.js)
- [src/core/frameSnapshot.js](C:/Users/Marc Bielert/Github/terrain/src/core/frameSnapshot.js)
- [src/core/registerMainCommands.js](C:/Users/Marc Bielert/Github/terrain/src/core/registerMainCommands.js)
- [src/core/runtimeParityAdapter.js](C:/Users/Marc Bielert/Github/terrain/src/core/runtimeParityAdapter.js)
- `src/core/timeRouter.js` new
- [src/gameplay/movementSystem.js](C:/Users/Marc Bielert/Github/terrain/src/gameplay/movementSystem.js)
- [src/gameplay/interactionCommands.js](C:/Users/Marc Bielert/Github/terrain/src/gameplay/interactionCommands.js)
- [src/sim/timeSystem.js](C:/Users/Marc Bielert/Github/terrain/src/sim/timeSystem.js)
- [src/sim/cloudSystem.js](C:/Users/Marc Bielert/Github/terrain/src/sim/cloudSystem.js)
- [src/sim/weatherSystem.js](C:/Users/Marc Bielert/Github/terrain/src/sim/weatherSystem.js)
- [src/render/frameRenderState.js](C:/Users/Marc Bielert/Github/terrain/src/render/frameRenderState.js)
- [src/render/uniformInputState.js](C:/Users/Marc Bielert/Github/terrain/src/render/uniformInputState.js)
- [src/main.js](C:/Users/Marc Bielert/Github/terrain/src/main.js)
- [index.html](C:/Users/Marc Bielert/Github/terrain/index.html)
- [README.md](C:/Users/Marc Bielert/Github/terrain/README.md)
- [AI_CONTEXT.md](C:/Users/Marc Bielert/Github/terrain/AI_CONTEXT.md)
- [AGENTS.md](C:/Users/Marc Bielert/Github/terrain/AGENTS.md)

## Open Questions

- [ ] OQ1 Decide whether first walking pass remains tile-step only or needs immediate interpolation.
- [ ] OQ2 Decide whether movement needs a user-facing routing toggle in the first implementation, or remains implicitly global.
- [ ] OQ3 Confirm when weather should join the routing system after the current pass.
- [ ] OQ4 Confirm point-light flicker should stay out of this task list until its separate visual rework.

Resolved notes:
- Sim tick size should be configurable via map settings.
- Weather is intended to join the routing model later.
- Point-light flicker is expected to become visual-only later, similar to water.

## Session Log

- 2026-04-22:
  - Created `time-wire-task-list.md` as the implementation planning document for fixed-step timing integration.
  - Revised the document to match the repository's migration-task style:
    - added status markers
    - added phase/task/subtask IDs
    - added dependency map
    - added compatibility checklist
    - added session log
  - Incorporated 2026-04-21 timing architecture notes:
    - fixed-step gameplay/simulation direction
    - `0.01h` base tick concept
    - queued action model
    - cost-to-hours movement example
    - rewind explicitly dropped
    - renderer vs fixed-step split
  - Updated the plan so map-level sim tick size is a task item under persistence/settings instead of an open-ended note.
  - Implementation started on branch `time-wiring`:
    - Added core fixed-step time router foundation (`src/core/timeRouter.js`) and wired frame-time routing into scheduler context.
    - Added routing/tick state to core time state and command plumbing for `simTickHours` + per-system routing.
    - Replaced pathfinding teleport with movement queue scheduling + fixed-tick execution semantics.
    - Added initial routing UI/persistence controls for swarm/cloud/water and sim tick.
    - Split cloud/water shader time inputs so cloud can follow routed global time while water remains detached by default.
    - Added targeted tests for time-router math and movement queue tick execution.
  - Updated task status markers across phases to reflect implemented vs pending work from code + tests.
  - Confirmed baseline global timing mapping stays in place for now (`0.08 h/s` reference).
