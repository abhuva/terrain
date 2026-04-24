
# Architecture Migration Task List

Last updated: 2026-04-22
Owner: Codex + Marc
Branch policy: dedicated migration branch, no direct commits to `main`
Scope: migrate prototype to clean/modular architecture without losing current behavior

## Purpose

This file is the migration control document and external memory for session-to-session continuity.

Active migration tracking now lives in 	ime-wire-task-list.md.
Use this file only as the historical architecture-plan snapshot.

Goals:
- Keep runtime behavior parity while restructuring.
- Make systems modular, testable, and moddable.
- Support future growth (weather simulation, gameplay loops, entities, crafting, survival).
- Prioritize architecture stability over pixel-exact visual matching to the prototype.

Non-goals:
- Full gameplay rewrite during architecture migration.
- Visual redesign.
- Large shader feature additions unless needed for parity.

## Progress Rules

Status markers:
- `[ ]` not started
- `[-]` in progress
- `[x]` done
- `[!]` blocked

Execution rules:
- Only one major phase in progress at once.
- Every completed subtask must include a short note in the "Session Log" section.
- No new feature work until Phase 5 is complete (except migration-critical fixes).
- Visual output drift is acceptable during migration when behavior/contracts remain intact.

## Target Architecture (Reference)

Top-level module layout:
- `src/app/` bootstrap, mode bootstrap, dependency wiring
- `src/core/` app state, scheduler, events/commands, settings registry
- `src/render/` renderer + render passes + GPU resource manager
- `src/sim/` simulation systems (time/weather/lighting/fog/cloud/water drivers)
- `src/gameplay/` entities, movement, pathfinding, activities
- `src/ui/` panel bindings, HUD, overlays, debug tooling
- `src/io/` map load/save, json persistence adapters (browser + tauri)
- `src/workers/` worker wrappers and protocols

Core contracts:
- State-driven runtime (UI writes commands, systems update state, renderer consumes state).
- Ordered scheduler update pipeline.
- Render pass interfaces with explicit inputs/outputs.
- Versioned settings schema + validation per subsystem.
- Mode capabilities: `dev`, `gameplay`, `hybrid`.

## Phase Overview

1. Baseline & Safety Nets
2. Core Runtime Foundation
3. Render Pipeline Extraction
4. UI Decoupling & Mode Capabilities
5. Simulation Systemization
6. Gameplay Foundation Extraction
7. Hardening & Documentation

## Detailed Task List

### Phase 1: Baseline & Safety Nets

Dependencies: none

- [x] P1.1 Capture minimal behavioral baseline
  - [x] P1.1.1 Record core workflows only (map load, render loop health, LM/PF toggles, save/load settings).
  - [x] P1.1.2 Capture optional reference screenshots only for severe-regression triage (not pixel-match gating).
  - [x] P1.1.3 Record lightweight perf notes (rough fps + expensive operations timing notes).
- [x] P1.2 Add migration guard checks
  - [x] P1.2.1 Add lightweight smoke script/checklist doc for behavioral verification (`SMOKE_CHECKLIST.md`).
  - [x] P1.2.2 Add "acceptable changes" list with architecture-first rules (visual changes allowed unless usability/regression impact).
- [x] P1.3 Branch setup and migration discipline
  - [x] P1.3.1 Confirm dedicated migration branch.
  - [x] P1.3.2 Define commit cadence (small logical commits, no mega dump).

Exit criteria:
- Minimal baseline notes captured and referenced.
- Smoke checklist exists and is runnable manually.

### Phase 2: Core Runtime Foundation

Dependencies: Phase 1

- [x] P2.1 Create core folders and initial modules
  - [x] P2.1.1 Add `src/core/state.js` (single source of truth).
  - [x] P2.1.2 Add `src/core/scheduler.js` (ordered system update pipeline).
  - [x] P2.1.3 Add `src/core/commands.js` (UI intent -> state mutation API).
  - [x] P2.1.4 Add `src/core/settingsRegistry.js`.
- [x] P2.2 Move global mutable runtime data into state store
  - [x] P2.2.1 Camera/time/mode state.
  - [x] P2.2.2 Map metadata and loaded resources metadata.
  - [x] P2.2.3 Simulation knobs + gameplay runtime state.
- [x] P2.3 Integrate scheduler into main loop without changing visuals
  - [x] P2.3.1 `update(dt)` pipeline inserted before render.
  - [x] P2.3.2 Maintain existing behavior parity through adapters.

Exit criteria:
- App runs with centralized state + scheduler.
- No direct feature logic required to read/write random globals outside state modules.

### Phase 3: Render Pipeline Extraction

Dependencies: Phase 2

- [x] P3.1 Build render module skeleton
  - [x] P3.1.1 Add `src/render/renderer.js`.
  - [x] P3.1.2 Add `src/render/resources.js` (textures/FBO/program handles).
  - [x] P3.1.3 Add pass interface contract and registration.
- [x] P3.2 Extract existing passes
  - [x] P3.2.1 Shadow pass extraction.
  - [x] P3.2.2 Blur pass extraction.
  - [x] P3.2.3 Main terrain pass extraction.
  - [x] P3.2.4 Point light texture usage path extraction.
- [x] P3.3 Extract map-space precompute jobs
  - [x] P3.3.1 Flow map generation module.
  - [x] P3.3.2 Point-light bake orchestration module (worker + fallback).
- [x] P3.4 Define render input DTO
  - [x] P3.4.1 `FrameRenderState` object from core state.
  - [x] P3.4.2 Remove direct DOM reads from render upload path.

Exit criteria:
- Main render loop calls renderer API, not inline GL blocks.
- Pass boundaries are explicit and testable in isolation.

### Phase 4: UI Decoupling & Mode Capabilities

Dependencies: Phase 2 (can overlap partially with Phase 3)

- [x] P4.1 Extract panel bindings
  - [x] P4.1.1 `src/ui/bindings/waterPanel.js`
  - [x] P4.1.2 `src/ui/bindings/cloudPanel.js`
  - [x] P4.1.3 `src/ui/bindings/lightingPanel.js`
  - [x] P4.1.4 `src/ui/bindings/pathPanel.js`
  - [x] P4.1.5 `src/ui/bindings/loadMapPanel.js`
- [x] P4.2 Replace direct mutation with command dispatch
  - [x] P4.2.1 UI controls dispatch typed commands.
  - [x] P4.2.2 Command handlers mutate core state.
- [x] P4.3 Mode capability layer
  - [x] P4.3.1 Define capabilities for `dev`, `gameplay`, `hybrid`.
  - [x] P4.3.2 Gate controls/overlays/actions by capability set.

Exit criteria:
- UI logic lives in UI modules, not in renderer/sim modules.
- Modes switch behavior through capability config instead of hard forks.

### Phase 5: Simulation Systemization

Dependencies: Phase 2, strongly benefits from Phase 4

- [x] P5.1 Extract existing time/light/fog/cloud/water drivers into systems
  - [x] P5.1.1 `timeSystem`
  - [x] P5.1.2 `lightingSystem`
  - [x] P5.1.3 `cloudSystem`
  - [x] P5.1.4 `fogSystem`
  - [x] P5.1.5 `waterFxSystem`
- [x] P5.2 Weather architecture groundwork
  - [x] P5.2.1 Add weather state contract in core state.
  - [x] P5.2.2 Add placeholder weather field resource hooks (no full feature yet).
  - [x] P5.2.3 Add global wind contract (`dir`, `speed`) and local modulation placeholder.
- [x] P5.3 Settings schema normalization
  - [x] P5.3.1 Move subsystem defaults/validate/serialize/apply into settings registry.
  - [x] P5.3.2 Preserve compatibility with existing json keys.

Exit criteria:
- Simulation logic is scheduler-driven and independent of DOM.
- Subsystem settings are centrally managed and versionable.

### Phase 6: Gameplay Foundation Extraction

Dependencies: Phase 2, Phase 4

- [x] P6.1 Entity/gameplay core
  - [x] P6.1.1 `entityStore` scaffold.
  - [x] P6.1.2 Player state migration into entity model.
- [x] P6.2 Extract path and movement logic
  - [x] P6.2.1 pathfinding system module.
  - [x] P6.2.2 movement system module.
  - [x] P6.2.3 interaction mode command routing.
- [x] P6.3 Preserve overlays and editor tooling in hybrid mode
  - [x] P6.3.1 Overlay rendering hooks separated from gameplay state updates.

Exit criteria:
- Gameplay loops can evolve without touching render core.
- Dev tooling remains available via hybrid mode.

### Phase 7: Hardening & Documentation

Dependencies: Phases 3-6

- [x] P7.1 Test suite (targeted, high ROI)
  - [x] P7.1.1 Settings roundtrip tests (serialize/apply/default compatibility).
  - [x] P7.1.2 Deterministic simulation tests (time/weather/path cost core math).
  - [x] P7.1.3 Mode capability tests (dev/gameplay/hybrid gating).
  - [x] P7.1.4 Minimal visual regression snapshots/checklist.
- [x] P7.2 Docs updates
  - [x] P7.2.1 Update `README.md` architecture and run notes.
  - [x] P7.2.2 Update `AI_CONTEXT.md` architecture map and subsystem contracts.
  - [x] P7.2.3 Add module map doc (`docs/ARCHITECTURE.md` optional).
- [x] P7.3 Cleanup
  - [x] P7.3.1 Remove dead code paths and transitional adapters.
  - [x] P7.3.2 Verify no duplicate sources of truth remain.

Exit criteria:
- Parity checklist passes.
- Core tests pass.
- Docs reflect new architecture.

## Dependency Map (High Level)

- Phase 1 -> Phase 2
- Phase 2 -> Phase 3, 4, 5, 6
- Phase 3 + 4 + 5 -> Phase 7
- Phase 6 -> Phase 7

Critical path:
- P1 -> P2 -> P3 -> P5 -> P7

## Compatibility Checklist (Must Pass Before Merge)

- [x] Default map auto-load still works.
- [x] Manual map load (folder/path) still works.
- [x] Save/Load all JSON still works (pointlights, lighting, parallax, interaction, fog, clouds, waterfx, npc).
- [x] Day/night cycle and sliders remain functionally coherent (exact visual matching not required).
- [x] Shadow pipeline works (including blur).
- [x] Point lights create/edit/delete/bake with worker fallback.
- [x] Pathfinding preview/click move mode still works.
- [x] Water FX controls still work (including downhill invert/boost/tint), with acceptable visual drift.
- [x] Dev tools visibility and interaction mode toggles remain functional.

## Testing Strategy (Pragmatic)

Mandatory:
- Settings roundtrip tests for each subsystem.
- Deterministic math tests for core sim helpers.
- Manual behavioral compatibility checklist.

Optional early, required before final merge:
- Screenshot comparison harness for 5-10 canonical scenes (diagnostic only, not strict gate).

## Session Log

Use this section to keep continuity across refreshes.

- 2026-04-21:
  - Created the original architecture migration plan and phase breakdown.
- 2026-04-22:
  - Landed the major architecture migration foundation work across core state/scheduler/commands, renderer extraction, systemization, and mode-capability wiring.
  - This file ceased to be the best source of current migration status once time-wiring became the active implementation track.
- 2026-04-24:
  - Terrain interaction regression fixed during the ongoing time-wiring migration.
  - Use `time-wire-task-list.md` for active handoff, remaining work, and current migration status.
