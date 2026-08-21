import assert from "node:assert/strict";
import test from "node:test";
import { planMobilePageSwitch } from "../app/mobile-page-scroll.js";

test("mobile page switching remembers and restores each page scroll position", () => {
  const firstSwitch = planMobilePageSwitch("battle", "stats", 860, {});

  assert.deepEqual(firstSwitch, {
    changed: true,
    positions: { battle: 860 },
    targetScrollY: 0,
  });

  const returnSwitch = planMobilePageSwitch("stats", "battle", 420, firstSwitch.positions);

  assert.deepEqual(returnSwitch, {
    changed: true,
    positions: { battle: 860, stats: 420 },
    targetScrollY: 860,
  });
});

test("tapping the active mobile page leaves its scroll position untouched", () => {
  const positions = { battle: 860 };

  assert.deepEqual(planMobilePageSwitch("battle", "battle", 900, positions), {
    changed: false,
    positions,
    targetScrollY: 900,
  });
});
