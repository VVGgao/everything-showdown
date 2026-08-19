import assert from "node:assert/strict";
import test from "node:test";
import { isPrimaryArtist, rankOfficialTracks } from "../work/catalog-ranking.mjs";

test("primary-artist matching excludes songs where the selected act is only a guest", () => {
  assert.equal(isPrimaryArtist({ artist: ["Target", "Guest"] }, "Target"), true);
  assert.equal(isPrimaryArtist({ artist: ["Other", "Target"] }, "Target"), false);
  assert.equal(isPrimaryArtist({ artist: ["BTS (防弹少年团)"] }, "BTS"), true);
});

test("cross-app ranking merges duplicate songs and prefers the NetEase record", () => {
  const ranked = rankOfficialTracks([
    [
      { id: "n-hit", name: "The Hit", artist: ["Target"], source: "netease", pic_id: "n-pic" },
      { id: "n-guest", name: "Guest Song", artist: ["Other", "Target"], source: "netease", pic_id: "guest" },
    ],
    [
      { id: "k-hit", name: "The Hit", artist: ["Target Official"], source: "kuwo", pic_id: "k-pic" },
      { id: "k-deep", name: "Deep Cut", artist: ["Target"], source: "kuwo", pic_id: "deep" },
    ],
    [
      { id: "a-hit", name: "The Hit", artist: ["Target"], source: "apple", previewUrl: "https://audio.example/hit.m4a", playUrl: "https://music.apple.com/hit" },
    ],
  ], "Target");

  assert.deepEqual(ranked.map((candidate) => candidate.result.name), ["The Hit", "Deep Cut"]);
  assert.equal(ranked[0].result.source, "netease");
  assert.equal(ranked[0].sourceCount, 3);
  assert.equal(ranked[0].previewUrl, "https://audio.example/hit.m4a");
  assert.equal(ranked[0].playUrl, "https://music.apple.com/hit");
});
