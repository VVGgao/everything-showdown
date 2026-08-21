/** @param {number} entrants */
function getRoundLabel(entrants) {
  if (entrants === 2) return "总决赛";
  if (entrants === 4) return "半决赛";
  if (entrants === 8) return "八强赛";
  return `${entrants}强赛`;
}

/**
 * Returns the next match in a power-of-two single-elimination bracket.
 * Winners are stored chronologically, round by round.
 *
 * @param {string[]} entryIds
 * @param {string[]} winners
 */
export function getCurrentMatch(entryIds, winners) {
  const totalMatches = entryIds.length - 1;
  if (winners.length >= totalMatches) {
    return { finished: true, championId: winners[totalMatches - 1] };
  }

  let roundNumber = 1;
  let matchesInRound = entryIds.length / 2;
  let completedBeforeRound = 0;

  while (winners.length >= completedBeforeRound + matchesInRound) {
    completedBeforeRound += matchesInRound;
    matchesInRound /= 2;
    roundNumber += 1;
  }

  const matchIndex = winners.length - completedBeforeRound;
  const pair = roundNumber === 1
    ? [entryIds[matchIndex * 2], entryIds[matchIndex * 2 + 1]]
    : (() => {
        const previousRoundStart = completedBeforeRound - matchesInRound * 2;
        return [
          winners[previousRoundStart + matchIndex * 2],
          winners[previousRoundStart + matchIndex * 2 + 1],
        ];
      })();

  return {
    finished: false,
    round: getRoundLabel(matchesInRound * 2),
    roundNumber,
    matchNumber: matchIndex + 1,
    pair,
  };
}

export function restoreOfficialTournament({ defaultEntries, availableEntries, savedBracket, savedWinners, expectedSize }) {
  const entriesById = new Map(availableEntries.map((entry) => [entry.id, entry]));
  const bracketIds = Array.isArray(savedBracket) ? savedBracket : [];
  const entries = bracketIds.length === 0
    ? defaultEntries
    : bracketIds.map((id) => entriesById.get(id)).filter(Boolean);
  if (entries.length !== expectedSize || (bracketIds.length > 0 && new Set(bracketIds).size !== expectedSize)) {
    return { entries: defaultEntries, winners: [], restored: false };
  }

  const entryIds = entries.map((entry) => entry.id);
  const winners = [];
  for (const winnerId of Array.isArray(savedWinners) ? savedWinners.slice(0, expectedSize - 1) : []) {
    const match = getCurrentMatch(entryIds, winners);
    if (match.finished || !match.pair.includes(winnerId)) break;
    winners.push(winnerId);
  }

  return { entries, winners, restored: true };
}

/**
 * @typedef {{
 *   pending: Array<string | null>,
 *   nextRound: string[],
 *   currentPair: [string, string] | null,
 *   roundNumber: number,
 *   championId?: string
 * }} CustomTournamentState
 */

/**
 * @param {Array<string | null>} pending
 * @param {string[]} nextRound
 * @param {number} roundNumber
 * @returns {CustomTournamentState}
 */
function prepareCustomMatch(pending, nextRound, roundNumber) {
  const remaining = [...pending];
  const advanced = [...nextRound];

  while (remaining.length) {
    const left = remaining.shift() ?? null;
    const right = remaining.shift() ?? null;
    if (left && right) {
      return { pending: remaining, nextRound: advanced, currentPair: [left, right], roundNumber };
    }
    if (left || right) advanced.push(left ?? right);
  }

  if (advanced.length === 1) {
    return { pending: [], nextRound: [], currentPair: null, roundNumber, championId: advanced[0] };
  }

  return prepareCustomMatch(advanced, [], roundNumber + 1);
}

/**
 * @param {string[]} entryIds
 * @returns {CustomTournamentState}
 */
export function createCustomTournament(entryIds) {
  const unique = [...new Set(entryIds.filter(Boolean))].slice(0, 32);
  if (unique.length < 2) throw new Error("至少需要 2 个参赛项");
  let bracketSize = 2;
  while (bracketSize < unique.length) bracketSize *= 2;
  return prepareCustomMatch([...unique, ...Array(bracketSize - unique.length).fill(null)], [], 1);
}

/**
 * @param {CustomTournamentState} state
 * @param {string} winnerId
 * @returns {CustomTournamentState}
 */
export function advanceCustomTournament(state, winnerId) {
  if (!state.currentPair?.includes(winnerId)) throw new Error("胜者必须来自当前对决");
  return prepareCustomMatch(state.pending, [...state.nextRound, winnerId], state.roundNumber);
}
