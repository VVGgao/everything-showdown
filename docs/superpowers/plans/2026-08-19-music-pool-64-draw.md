# Music Pool 64 Draw Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let users combine music labels/groups or the full division, draw 64 real songs, and play a 63-match tournament.

**Architecture:** A generated static catalog supplies music pools and NetEase cover URLs. Pure draw helpers select and deduplicate entries; the existing page owns the selected pool state, active 64-song bracket, progress persistence, and UI.

**Tech Stack:** TypeScript, React, Node test runner, vinext, NetEase-compatible music API.

**Spec:** `docs/superpowers/specs/2026-08-19-music-pool-64-draw-design.md`

## Global Constraints

- Keep the site local and unpublished.
- Do not change the games division or custom tournament limits.
- Do not invent songs; preserve source metadata and NetEase cover URLs.
- A 64-song bracket always has 63 user selections.

---

### Task 1: Pool draw behavior

**Files:**
- Create: `app/music-draw.js`
- Create: `app/music-draw.d.ts`
- Create: `tests/music-draw.test.mjs`

**Interfaces:**
- Produces: `collectPoolEntries(pools, selectedIds)` and `drawEntries(entries, count, random)`.

- [ ] Write failing tests for merging selected pools, ID deduplication, deterministic 64-song drawing, and insufficient pools.
- [ ] Run `node --test tests/music-draw.test.mjs` and confirm missing exports fail.
- [ ] Implement only the two pure helpers.
- [ ] Run the focused test and confirm it passes.

### Task 2: Static music catalog

**Files:**
- Create: `work/build-music-catalog.mjs`
- Create: `app/music-catalog.json`
- Create: `app/music-catalog.d.ts`
- Test: `tests/music-catalog.test.mjs`

**Interfaces:**
- Produces: hip-hop and K-pop pools with `id`, `name`, `label`, and `entries` arrays using the existing Entry shape plus `cover`.

- [ ] Write a failing catalog contract test requiring both divisions, unique IDs, at least 64 entries per division, and cover URLs.
- [ ] Run the focused test and confirm the missing catalog fails.
- [ ] Implement the generator with curated search terms, artist filtering, normalization, and checkpoint output.
- [ ] Run the generator, inspect pool counts, and run the catalog test.

### Task 3: 64-song arena state and controls

**Files:**
- Modify: `app/competition-data.ts`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: the catalog and draw helpers from Tasks 1–2.
- Produces: `MusicPoolSelector` and a dynamic arena whose bracket entries are persisted by division.

- [ ] Add failing rendered-output assertions for “组建 64 强”, multi-pool selection, selected-pool draw, and full-division draw.
- [ ] Run the rendered test and confirm those controls are absent.
- [ ] Add `cover?: string` and route every artwork through a local-or-catalog cover helper.
- [ ] Add selected pool state, persisted bracket IDs, reset-on-draw behavior, and 64-entry progress.
- [ ] Build the restrained editorial selector UI with disabled-state guidance and mobile layout.
- [ ] Run focused and full tests.

### Task 4: Final verification

**Files:**
- Modify only files required by failing verification.

**Interfaces:**
- Consumes the completed feature.
- Produces a verified local Demo.

- [ ] Run `npm test` and confirm all tests pass.
- [ ] Run `git diff --check`.
- [ ] Request the local root page and confirm a successful response.
- [ ] Confirm music divisions can each supply 64 unique songs and games still has 32 entries.

