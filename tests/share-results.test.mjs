import assert from "node:assert/strict";
import test from "node:test";

test("a completed tournament becomes a compact share result with every bracket round", async () => {
  const { buildTournamentRounds, createBracketShareResult, decodeShareResult, encodeShareResult } = await import("../app/share-results.js");
  const result = createBracketShareResult("hiphop", ["a", "b", "c", "d"], ["a", "d", "d"]);

  assert.deepEqual(buildTournamentRounds(result.entryIds, result.winners), [
    ["a", "b", "c", "d"],
    ["a", "d"],
    ["d"],
  ]);
  assert.deepEqual(decodeShareResult(encodeShareResult(result)), result);
});

test("a completed bracket splits into two full sides that converge on a centered champion", async () => {
  const { buildCenteredBracket } = await import("../app/share-results.js");

  assert.deepEqual(
    buildCenteredBracket?.(
      ["a", "b", "c", "d", "e", "f", "g", "h"],
      ["a", "c", "e", "g", "a", "g", "g"],
    ),
    {
      left: [
        { roundSize: 8, entries: ["a", "b", "c", "d"] },
        { roundSize: 4, entries: ["a", "c"] },
        { roundSize: 2, entries: ["a"] },
      ],
      champion: "g",
      right: [
        { roundSize: 2, entries: ["g"] },
        { roundSize: 4, entries: ["e", "g"] },
        { roundSize: 8, entries: ["e", "f", "g", "h"] },
      ],
    },
  );
});

test("an unfinished tournament cannot produce a share result", async () => {
  const { createBracketShareResult } = await import("../app/share-results.js");

  assert.throws(
    () => createBracketShareResult("games", ["a", "b", "c", "d"], ["a", "c"]),
    /完成全部对决/,
  );
});

test("a completed rating keeps its tier order and survives a share URL round trip", async () => {
  const { buildShareUrl, createRatingShareResult, readShareResultFromUrl } = await import("../app/share-results.js");
  const result = createRatingShareResult(
    "kpop",
    ["love-dive", "dash", "fearless"],
    { "love-dive": "hang", dash: "top", fearless: "lame" },
  );
  const url = buildShareUrl("https://everything-showdown.example/path?old=1#rating", result);

  assert.equal(url.startsWith("https://everything-showdown.example/path?share="), true);
  assert.deepEqual(readShareResultFromUrl(url), result);
});

test("an unrated song prevents a rating result from being shared", async () => {
  const { createRatingShareResult } = await import("../app/share-results.js");

  assert.throws(
    () => createRatingShareResult("hiphop", ["a", "b"], { a: "hang", b: "unrated" }),
    /完成全部锐评/,
  );
});

test("a share poster capture always exports one 1080 by 1350 image", async () => {
  const shareResults = await import("../app/share-results.js");

  assert.deepEqual(shareResults.getShareImageCapture?.(540), {
    width: 1080,
    height: 1350,
    scale: 2,
    backgroundColor: "#080808",
  });
});

test("a fractional capture is normalized to exact share-image pixel dimensions", async () => {
  const shareResults = await import("../app/share-results.js");
  const source = { width: 1080, height: 1349 };
  const drawCalls = [];
  const target = {
    width: 0,
    height: 0,
    getContext: () => ({ drawImage: (...args) => drawCalls.push(args) }),
  };

  const normalized = shareResults.normalizeShareCanvas?.(source, () => target);

  assert.equal(normalized?.width, 1080);
  assert.equal(normalized?.height, 1350);
  assert.deepEqual(drawCalls, [[source, 0, 0, 1080, 1350]]);
});
