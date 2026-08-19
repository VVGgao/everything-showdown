import assert from "node:assert/strict";
import test from "node:test";
import { drawRatingEntries, placeRatingEntry } from "../app/song-rating.js";

test("rating draw returns ten unique songs", () => {
  const entries = Array.from({ length: 20 }, (_, index) => ({ id: `song-${index + 1}` }));
  const draw = drawRatingEntries(entries, 10, () => 0.25);

  assert.equal(draw.length, 10);
  assert.equal(new Set(draw.map((entry) => entry.id)).size, 10);
});

test("rating draw rejects a catalog with fewer than ten songs", () => {
  assert.throws(() => drawRatingEntries([{ id: "only" }], 10), /至少需要 10 首/);
});

test("placing a song changes only that song's tier", () => {
  const current = { one: "unrated", two: "hang" };
  const next = placeRatingEntry(current, "one", "top");

  assert.deepEqual(next, { one: "top", two: "hang" });
  assert.deepEqual(current, { one: "unrated", two: "hang" });
});
