# Architecture Migration Task List

Last updated: 2026-04-25
Owner: Codex + Marc
Branch policy: dedicated implementation branch, no direct commits to `main`
Primary scope: complete the remaining migration from the current hybrid runtime to the intended clean modular architecture

## Purpose

This file is the authoritative migration control document and session-to-session memory for the remaining runtime architecture work.

Goals:
- Keep runtime behavior parity while restructuring.
- Make core state the single source of truth.
- Keep systems modular, testable, and understandable.
- Reduce `src/main.js` to boot/wiring/orchestration instead of mixed ownership.

Non-goals:
- Full gameplay rewrite during migration.
- Visual redesign.
- Large feature additions unless needed to preserve behavior or unblock migration.

## Current Status

Important clarification:
- The time-wiring feature itself is largely implemented.
- The architecture migration is not complete.
- The runtime is currently hybrid.

Current hybrid structure:
- `src/main.js` still owns too much live runtime state, setup wiring, and domain orchestration.
- The old per-frame bridge layers are already removed from active runtime usage:
  - `src/core/frameSnapshot.js`
  - `src/core/runtimeParityAdapter.js`
- `runtimeCore.scheduler` systems are active and real.
- Core store updates now happen through commands, settings apply/bootstrap synchronization, and scheduler/system/runtime sync helpers.

Meaning:
- The newer core/scheduler path is active.
- The legacy runtime path is still the dominant owner in several domains.
- Migration is no longer about introducing the architecture foundation; it is about finishing ownership transfer and simplification.

## Target Architecture

Top-level module layout:
- `src/app/` bootstrap, mode bootstrap, dependency wiring
- `src/core/` app state, scheduler, commands, settings registry
- `src/render/` renderer, passes, GPU resources, render prep
- `src/sim/` time/weather/lighting/fog/cloud/water systems
- `src/gameplay/` entities, movement, pathfinding, map lifecycle, interaction runtime
- `src/ui/` bindings, panels, overlays, HUD, sync helpers
- `src/io/` map load/save and persistence adapters
- `src/workers/` worker wrappers and protocols

End-state rules:
- Core state is the authoritative runtime state model.
- Scheduler systems consume canonical state directly.
- UI controls emit commands; they are not runtime truth.
- Renderer consumes resolved state; it does not own gameplay/config state.
- `src/main.js` remains a thin composition layer:
  - bootstrapping
  - renderer setup
  - input binding
  - command dispatch
  - frame orchestration

## Progress Rules

Status markers:
- `[ ]` not started
- `[-]` in progress
- `[x]` done
- `[!]` blocked

Execution rules:
- Only one major migration phase should be in progress at once.
- Keep behavior stable while changing ownership.
- After each ownership move, remove the old read/write path instead of leaving duplicates behind.
- Do not mark migration complete until the remaining bridge-era ownership patterns are actually removed.

## Phase Overview

1. Architecture Baseline and Gap Mapping
2. Canonical State Contract Completion
3. Control/Input Ownership Migration
4. Simulation/System Ownership Migration
5. Render/Input Decoupling
6. Adapter Removal and Simplification
7. Verification and Documentation

## Detailed Task List

### Phase 1: Architecture Baseline and Gap Mapping

Dependencies: none

- [x] P1.1 Confirm current runtime is hybrid
  - [x] P1.1.1 Confirm `src/main.js` still owns live runtime state.
  - [x] P1.1.2 Confirm old bridge layers are no longer active runtime dependencies.
  - [x] P1.1.3 Confirm scheduler/core/store path is active but not yet sole owner.
- [x] P1.2 Capture migrated vs non-migrated ownership
  - [x] P1.2.1 Time routing foundation is in place.
  - [x] P1.2.2 Movement queue/tick execution is in place.
  - [x] P1.2.3 Render, DOM, and significant runtime state remain partly `main.js` owned.
- [x] P1.3 Create explicit ownership map for remaining migration
  - [x] P1.3.1 Remaining DOM-primary paths are mostly event-time editor/binding paths.
  - [x] P1.3.2 Several gameplay/runtime branches are still synchronized snapshots rather than sole authority.
  - [x] P1.3.3 Remaining duplicate ownership hotspots are explicit enough to sequence.

Exit criteria:
- Hybrid-state reality is documented.
- Remaining migration surface is explicit enough to sequence cleanly.

### Phase 2: Canonical State Contract Completion

Dependencies: Phase 1

- [-] P2.1 Make core state complete enough to become sole runtime authority
  - [x] P2.1.1 Audit missing authoritative state branches for render FX, pathfinding, swarm, interaction mode, camera, and map/session state.
  - [-] P2.1.2 Remove remaining dependence on reading those values primarily from DOM inputs.
  - [-] P2.1.3 Ensure defaults/serialize/apply paths align with canonical core state shape.
- [-] P2.2 Define stable command surface for all user-driven state changes
  - [-] P2.2.1 Route mutable UI-backed settings through commands.
  - [-] P2.2.2 Remove direct imperative state mutation where command routing should own behavior.
  - [-] P2.2.3 Ensure commands update both state and required side effects.
- [ ] P2.3 Clarify ownership boundaries
  - [ ] P2.3.1 Core store owns persistent/config/runtime gameplay state.
  - [ ] P2.3.2 Renderer consumes resolved state but does not own it.
  - [ ] P2.3.3 DOM reflects state and emits commands, but is not authoritative.

Exit criteria:
- Core state model is complete enough that runtime snapshots are no longer needed for missing branches.

### Phase 3: Control/Input Ownership Migration

Dependencies: Phase 2

- [-] P3.1 Convert DOM controls from source-of-truth to state views
  - [x] P3.1.1 Time controls (`cycleSpeed`, `simTickHours`, routing controls).
  - [-] P3.1.2 Pathfinding controls.
  - [-] P3.1.3 Fog/cloud/water/parallax/lighting controls.
  - [-] P3.1.4 Swarm controls.
- [-] P3.2 Remove direct DOM reads from runtime-hot paths
  - [-] P3.2.1 Eliminate per-frame settings reads that should come from core state.
  - [-] P3.2.2 Eliminate system logic that derives behavior from raw inputs instead of state.
  - [ ] P3.2.3 Keep only event-time UI reads inside bindings where unavoidable.
- [-] P3.3 Make UI update one-way
  - [-] P3.3.1 State change updates labels/inputs/UI.
  - [-] P3.3.2 User interaction dispatches command.
  - [-] P3.3.3 Remove implicit two-way parity behavior.

Exit criteria:
- Runtime logic no longer depends on DOM inputs as the primary state source.

### Phase 4: Simulation/System Ownership Migration

Dependencies: Phase 2, Phase 3

- [-] P4.1 Make scheduler/core systems read only canonical core state
  - [x] P4.1.1 Time system.
  - [x] P4.1.2 Lighting system.
  - [x] P4.1.3 Fog system.
  - [x] P4.1.4 Cloud system.
  - [x] P4.1.5 Water FX system.
  - [x] P4.1.6 Weather system.
  - [-] P4.1.7 Pathfinding/movement integration.
- [-] P4.2 Move remaining gameplay runtime ownership out of `main.js`
  - [-] P4.2.1 Player/gameplay state snapshots become authoritative state or clearly system-owned runtime.
  - [-] P4.2.2 Swarm settings/runtime ownership boundaries are explicit and non-duplicated.
  - [-] P4.2.3 Point-light runtime/store-sync ownership is explicit and non-duplicated.
  - [x] P4.2.4 Camera state ownership is explicit and does not bounce between runtime and core.
- [x] P4.3 Stop per-frame snapshot feeding
  - [x] P4.3.1 Replace snapshot-fed frame inputs with authoritative state access.
  - [x] P4.3.2 Ensure scheduler update context only carries transient frame values.
  - [x] P4.3.3 Delete remaining snapshot-only helper usage once no longer needed.

Exit criteria:
- Scheduler no longer depends on frame-by-frame mirrored runtime state.

### Phase 5: Render/Input Decoupling

Dependencies: Phase 4

- [-] P5.1 Make render preparation consume resolved state, not raw inputs
  - [-] P5.1.1 Uniform input construction reads from core/system state.
  - [-] P5.1.2 Frame render state construction reads from core/system state.
  - [-] P5.1.3 Overlay rendering reads canonical gameplay/render state.
- [-] P5.2 Remove ad hoc render-time settings assembly where possible
  - [ ] P5.2.1 Avoid recomputing settings snapshots from DOM every frame.
  - [-] P5.2.2 Keep only genuinely transient frame calculations in render loop.
- [-] P5.3 Reduce `main.js` to orchestration
  - [ ] P5.3.1 Keep boot/setup.
  - [ ] P5.3.2 Keep render loop orchestration.
  - [-] P5.3.3 Move remaining embedded runtime domain logic into modules.

Exit criteria:
- Render loop consumes canonical state with minimal reconstruction.

### Phase 6: Adapter Removal and Simplification

Dependencies: Phases 3, 4, 5

- [-] P6.1 Remove remaining runtime-to-core mirroring assumptions
  - [x] P6.1.1 Delete active `frameSnapshot` usage from runtime path.
  - [-] P6.1.2 Remove obsolete snapshot getters whose only role was frame mirroring.
- [-] P6.2 Remove remaining core-to-runtime parity assumptions
  - [x] P6.2.1 Delete active `runtimeParityAdapter` usage from runtime path.
  - [-] P6.2.2 Remove remaining DOM/runtime write-back assumptions.
- [-] P6.3 Simplify interfaces after bridge removal
  - [-] P6.3.1 Remove dead command/state plumbing that existed only for parity.
  - [-] P6.3.2 Remove duplicate state derivations, duplicate caches, and startup-sensitive compatibility shims where no longer needed.

Exit criteria:
- No active bridge-era ownership model remains.
- Core state is the one-way authoritative model.

### Phase 7: Verification and Documentation

Dependencies: Phase 6

- [ ] P7.1 Behavior verification
  - [ ] P7.1.1 Verify time routing behavior still matches current feature behavior.
  - [ ] P7.1.2 Verify movement queue behavior still matches shipped behavior.
  - [ ] P7.1.3 Verify swarm/cloud smoothing still behaves correctly.
  - [ ] P7.1.4 Verify map save/load still preserves settings.
- [ ] P7.2 Performance verification
  - [ ] P7.2.1 Confirm bridge-era churn is gone.
  - [ ] P7.2.2 Re-profile periodic hitching after simplification.
  - [ ] P7.2.3 Remove any remaining high-frequency DOM/state churn found during validation.
- [-] P7.3 Documentation updates
  - [-] P7.3.1 Update `README.md` to describe final runtime architecture and controls.
  - [-] P7.3.2 Update `AI_CONTEXT.md` to match final ownership model.
  - [ ] P7.3.3 Update `AGENTS.md` if workflow/runtime notes changed.
- [ ] P7.4 Task-list closure
  - [ ] P7.4.1 Replace hybrid-state note with final-state note.
  - [ ] P7.4.2 Mark migration complete only after the remaining ownership work is actually done.

Exit criteria:
- Behavior matches expectations.
- Performance is revalidated after simplification.
- Docs match the final architecture.

## Compatibility Checklist

- [x] Default map auto-load still works.
- [x] Manual map load (folder/path) still works.
- [x] Save/Load all JSON still works.
- [x] Day/night cycle and sliders remain functionally coherent.
- [x] Shadow pipeline works.
- [x] Point lights create/edit/delete/bake with worker fallback.
- [x] Pathfinding preview/click move mode still works.
- [x] Water FX controls still work with acceptable drift.
- [x] Dev tools visibility and interaction mode toggles remain functional.

## Completion Definition

Migration is only complete when all of the following are true:
- Core state is the authoritative runtime state model.
- Scheduler systems consume canonical state directly.
- Render loop does not rebuild core state from runtime snapshots each frame.
- DOM controls are not used as runtime truth.
- Bridge-era ownership assumptions are gone from active runtime paths.
- `src/main.js` is reduced to composition/orchestration rather than mixed ownership.

## Immediate Next Work

- [-] N1 Close remaining Phase 2 command-surface/state-contract work.
- [-] N2 Close explicit runtime ownership boundaries in Phase 4, especially swarm/player/point-light sync.
- [-] N3 Continue Phase 5 extraction and simplify `main.js` only when it improves ownership clarity, not line count alone.

## Session Log

Keep this section short. Detailed extraction history belongs in git log and code, not here.

- 2026-04-22:
  - Established the active migration plan around the hybrid runtime and the final state-driven architecture target.
- 2026-04-23:
  - Removed active reliance on the old bridge layers and moved a large amount of settings/binding/runtime composition out of `main.js`.
- 2026-04-24:
  - Fixed the camera-transform regression that broke terrain interaction and clarified swarm/player/point-light ownership in several hotspots.
- 2026-04-25:
  - Continued Phase 4/5 ownership work:
    - grouped store-sync and runtime-state access through focused facades/runtimes
    - hardened startup sequencing after lazy-facade TDZ regressions
    - `main.js` remains the largest integration surface, so migration is still incomplete
