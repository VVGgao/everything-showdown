import assert from "node:assert/strict";
import test from "node:test";
import { collectPoolEntries, drawCrossPoolEntries, drawEntries, drawHeatBiasedEntries } from "../app/music-draw.js";

const pools = [
  { id: "a", entries: [{ id: "one" }, { id: "shared" }] },
  { id: "b", entries: [{ id: "shared" }, { id: "two" }] },
  { id: "c", entries: [{ id: "three" }] },
];

test("selected music pools merge songs without duplicate entry IDs", () => {
  assert.deepEqual(collectPoolEntries(pools, ["a", "b"]).map((entry) => entry.id), ["one", "shared", "two"]);
});

test("64-song draw returns 64 unique entries using the supplied randomness", () => {
  const entries = Array.from({ length: 70 }, (_, index) => ({ id: `song-${index + 1}` }));
  const draw = drawEntries(entries, 64, () => 0);

  assert.equal(draw.length, 64);
  assert.equal(new Set(draw.map((entry) => entry.id)).size, 64);
  assert.deepEqual(draw.slice(0, 3).map((entry) => entry.id), ["song-2", "song-3", "song-4"]);
});

test("draw rejects a pool that cannot fill the requested bracket", () => {
  assert.throws(() => drawEntries([{ id: "only" }], 64, () => 0.5), /至少需要 64 首/);
});

test("heat-biased draw favors hot songs while retaining a random component", () => {
  const entries = [
    ...Array.from({ length: 10 }, (_, index) => ({ id: `hot-${index}`, heat: 100 })),
    ...Array.from({ length: 10 }, (_, index) => ({ id: `cold-${index}`, heat: 1 })),
  ];
  let calls = 0;
  const draw = drawHeatBiasedEntries(entries, 10, () => calls++ < 10 ? 0 : 1);

  assert.equal(draw.length, 10);
  assert.ok(draw.every((entry) => entry.heat === 100));
});

test("selected-label draw makes every first-round pair cross-label", () => {
  const labelPools = ["red", "blue", "gold"].map((id) => ({
    id,
    entries: Array.from({ length: 30 }, (_, index) => ({ id: `${id}-${index + 1}`, poolId: id })),
  }));
  const draw = drawCrossPoolEntries(labelPools, ["red", "blue", "gold"], 64, () => 0.4);

  assert.equal(draw.length, 64);
  for (let index = 0; index < draw.length; index += 2) {
    assert.notEqual(draw[index].poolId, draw[index + 1].poolId);
  }
});

test("selected-label draw applies the heat preference before cross-label pairing", () => {
  const labelPools = ["red", "blue"].map((id) => ({
    id,
    entries: [
      ...Array.from({ length: 32 }, (_, index) => ({ id: `${id}-hot-${index}`, poolId: id, heat: 100 })),
      ...Array.from({ length: 8 }, (_, index) => ({ id: `${id}-cold-${index}`, poolId: id, heat: 1 })),
    ],
  }));
  const draw = drawCrossPoolEntries(labelPools, ["red", "blue"], 64, () => 0);

  assert.ok(draw.every((entry) => entry.heat === 100));
  for (let index = 0; index < draw.length; index += 2) {
    assert.notEqual(draw[index].poolId, draw[index + 1].poolId);
  }
});

test("imbalanced selections minimize unavoidable same-label first-round pairs", () => {
  const labelPools = [
    { id: "small", entries: Array.from({ length: 29 }, (_, index) => ({ id: `small-${index}` })) },
    { id: "large", entries: Array.from({ length: 35 }, (_, index) => ({ id: `large-${index}` })) },
  ];

  const draw = drawCrossPoolEntries(labelPools, ["small", "large"], 64, () => 0.2);
  const sameLabelPairs = Array.from({ length: 32 }, (_, index) => draw.slice(index * 2, index * 2 + 2))
    .filter(([left, right]) => left.id.split("-")[0] === right.id.split("-")[0]);

  assert.equal(sameLabelPairs.length, 3);
});
