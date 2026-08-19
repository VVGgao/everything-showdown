import assert from "node:assert/strict";
import test from "node:test";
import { groupEntriesByGroup, groupEntriesByLabel, groupEntriesByMember } from "../app/roster.js";

test("music roster groups entries by label and sorts larger groups first", () => {
  const groups = groupEntriesByLabel([
    { id: "a", label: "SM", title: "A" },
    { id: "b", label: "JYP", title: "B" },
    { id: "c", label: "SM", title: "C" },
  ]);

  assert.deepEqual(groups, [
    { label: "SM", entries: [{ id: "a", label: "SM", title: "A" }, { id: "c", label: "SM", title: "C" }] },
    { label: "JYP", entries: [{ id: "b", label: "JYP", title: "B" }] },
  ]);
});

test("K-pop roster groups songs by act and keeps the company as metadata", () => {
  const groups = groupEntriesByGroup([
    { id: "a", group: "BLACKPINK", label: "YG", title: "A" },
    { id: "b", group: "BTS", label: "BIGHIT", title: "B" },
    { id: "c", group: "BLACKPINK", label: "YG", title: "C" },
  ]);

  assert.deepEqual(groups.map((group) => [group.label, group.entries.length]), [
    ["BLACKPINK", 2],
    ["BTS", 1],
  ]);
});

test("hip-hop label sections subdivide songs by individual member", () => {
  const members = groupEntriesByMember([
    { id: "a", member: "Asen", title: "A" },
    { id: "b", member: "THOME", title: "B" },
    { id: "c", member: "Asen", title: "C" },
  ]);

  assert.deepEqual(members.map((group) => [group.label, group.entries.length]), [
    ["Asen", 2],
    ["THOME", 1],
  ]);
});
