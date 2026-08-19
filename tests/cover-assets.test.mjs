import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("official cover manifest records NetEase music art and official game imagery", async () => {
  const manifest = JSON.parse(await readFile(new URL("../public/covers/manifest.json", import.meta.url), "utf8"));
  const music = manifest.filter((entry) => entry.category === "hiphop" || entry.category === "kpop");
  const games = manifest.filter((entry) => entry.category === "games");

  assert.equal(manifest.length, 96);
  assert.equal(music.length, 64);
  assert.equal(games.length, 32);
  assert.ok(music.every((entry) => entry.provider === "netease" && /^https?:\/\/.*music\.126\.net\//.test(entry.source)));
  assert.ok(games.every((entry) => ["steam", "official"].includes(entry.provider) && /^https?:\/\//.test(entry.source)));
});
