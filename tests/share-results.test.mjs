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
