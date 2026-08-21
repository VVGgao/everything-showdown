import assert from "node:assert/strict";
import test from "node:test";
import {
  advanceCustomTournament,
  createCustomTournament,
  getCurrentMatch,
} from "../app/tournament.js";

const ids = ["a", "b", "c", "d", "e", "f", "g", "h"];
const ids32 = Array.from({ length: 32 }, (_, index) => `entry-${index + 1}`);
const ids64 = Array.from({ length: 64 }, (_, index) => `entry-${index + 1}`);

test("eight entries start with the first quarterfinal", () => {
  assert.deepEqual(getCurrentMatch(ids, []), {
    finished: false,
    round: "八强赛",
    roundNumber: 1,
    matchNumber: 1,
    pair: ["a", "b"],
  });
});

test("quarterfinal winners feed the two semifinals", () => {
  assert.deepEqual(getCurrentMatch(ids, ["a", "c", "e", "g"]), {
    finished: false,
    round: "半决赛",
    roundNumber: 2,
    matchNumber: 1,
    pair: ["a", "c"],
  });
});

test("seven selections produce one champion", () => {
  assert.deepEqual(getCurrentMatch(ids, ["a", "c", "e", "g", "a", "e", "e"]), {
    finished: true,
    championId: "e",
  });
});

test("32 entries start in the round of 32", () => {
  assert.deepEqual(getCurrentMatch(ids32, []), {
    finished: false,
    round: "32强赛",
    roundNumber: 1,
    matchNumber: 1,
    pair: ["entry-1", "entry-2"],
  });
});

test("16 round-of-32 winners feed the round of 16", () => {
  const firstRoundWinners = ids32.filter((_, index) => index % 2 === 0);
  assert.deepEqual(getCurrentMatch(ids32, firstRoundWinners), {
    finished: false,
    round: "16强赛",
    roundNumber: 2,
    matchNumber: 1,
    pair: ["entry-1", "entry-3"],
  });
});

test("31 selections produce the 32-entry champion", () => {
  const winners = [];
  while (winners.length < 31) {
    const match = getCurrentMatch(ids32, winners);
    assert.equal(match.finished, false);
    winners.push(match.pair[0]);
  }

  assert.deepEqual(getCurrentMatch(ids32, winners), {
    finished: true,
    championId: "entry-1",
  });
});

test("63 selections produce the 64-entry champion", () => {
  const winners = [];
  while (winners.length < 63) {
    const match = getCurrentMatch(ids64, winners);
    assert.equal(match.finished, false);
    winners.push(match.pair[0]);
  }

  assert.deepEqual(getCurrentMatch(ids64, winners), {
    finished: true,
    championId: "entry-1",
  });
});

test("custom tournament advances an odd entry through a bye", () => {
  const initial = createCustomTournament(["a", "b", "c"]);
  assert.deepEqual(initial.currentPair, ["a", "b"]);

  const final = advanceCustomTournament(
    advanceCustomTournament(initial, "a"),
    "c",
  );
  assert.equal(final.championId, "c");
});

test("custom tournament rejects fewer than two entries", () => {
  assert.throws(() => createCustomTournament(["a"]), /至少需要 2 个参赛项/);
});

test("custom tournament accepts 32 entries and finishes after 31 picks", () => {
  let state = createCustomTournament(ids32);
  let picks = 0;

  while (state.currentPair) {
    state = advanceCustomTournament(state, state.currentPair[0]);
    picks += 1;
  }

  assert.equal(picks, 31);
  assert.equal(state.championId, "entry-1");
});

test("old progress is ignored when its saved bracket is not the current 32-entry bracket", async () => {
  const tournament = await import("../app/tournament.js");
  const defaultEntries = Array.from({ length: 32 }, (_, index) => ({ id: `new-${index + 1}` }));
  const oldEntries = Array.from({ length: 16 }, (_, index) => ({ id: `old-${index + 1}` }));

  assert.deepEqual(tournament.restoreOfficialTournament?.({
    defaultEntries,
    availableEntries: [...defaultEntries, ...oldEntries],
    savedBracket: oldEntries.map((entry) => entry.id),
    savedWinners: oldEntries.slice(0, 8).map((entry) => entry.id),
    expectedSize: 32,
  }), { entries: defaultEntries, winners: [], restored: false });
});
