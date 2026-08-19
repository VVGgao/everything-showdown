import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const catalogPath = new URL("../app/music-catalog.json", import.meta.url);
const normalize = (value) => value.toLowerCase().replaceAll(/\([^)]*\)|\[[^\]]*\]|[^\p{L}\p{N}]+/gu, "");
const matchesArtist = (actual, expected) => {
  const left = normalize(actual);
  const right = normalize(expected);
  return left === right || left.includes(right) || right.includes(left);
};

test("each music division catalog can supply a unique 64-song bracket", async () => {
  const catalog = JSON.parse(await readFile(catalogPath, "utf8"));

  for (const division of ["hiphop", "kpop"]) {
    const pools = catalog[division];
    assert.ok(Array.isArray(pools) && pools.length >= 2, `${division} needs selectable pools`);
    const entries = pools.flatMap((pool) => pool.entries);
    assert.ok(entries.length >= 64, `${division} needs at least 64 catalog songs`);
    assert.equal(new Set(entries.map((entry) => entry.id)).size, entries.length, `${division} song IDs must be unique`);
    assert.ok(entries.every((entry) => entry.title && entry.subtitle && entry.cover), `${division} entries need song, artist, and cover`);
    assert.ok(entries.every((entry) => /^https:\/\//.test(entry.playUrl)), `${division} entries need an exact HTTPS playback page`);
    assert.ok(entries.filter((entry) => entry.previewUrl).length >= 10, `${division} needs official preview clips for popular songs`);
    assert.ok(pools.every((pool) => pool.entries.length >= 32), `${division} pools need at least 32 official songs`);
    for (const pool of pools) {
      assert.equal(
        new Set(pool.entries.map((entry) => normalize(entry.title))).size,
        pool.entries.length,
        `${division} / ${pool.name} must not duplicate the same normalized title across apps`,
      );
      assert.ok(
        pool.entries.every((entry) => matchesArtist(entry.subtitle.split(" · ")[0], division === "hiphop" ? entry.member : pool.name)),
        `${division} / ${pool.name} must only count songs led by its own act`,
      );
    }
  }

  assert.ok(catalog.hiphop.some((pool) => pool.id === "digi-ghetto"), "hiphop catalog needs DIGI GHETTO");
  assert.ok(catalog.hiphop.some((pool) => pool.id === "five-group"), "hiphop catalog needs 五人组");
  assert.ok(catalog.hiphop.flatMap((pool) => pool.entries).every((entry) => entry.member), "hiphop songs need individual member ownership");
  const fiveGroup = catalog.hiphop.find((pool) => pool.id === "five-group");
  assert.ok(
    fiveGroup.entries.every((entry) => !["ljz329", "Drunker"].includes(entry.member)),
    "五人组 must not include songs assigned to ljz329 or Drunker",
  );
  for (const poolId of ["nmixx", "le-sserafim", "ive"]) {
    assert.ok(catalog.kpop.some((pool) => pool.id === poolId), `kpop catalog needs ${poolId}`);
  }
});
