import LZString from "lz-string";

const competitionIds = new Set(["hiphop", "kpop", "games"]);
const ratingTierIds = new Set(["hang", "top", "human", "npc", "lame"]);

export function buildTournamentRounds(entryIds, winners) {
  const rounds = [[...entryIds]];
  let currentRound = [...entryIds];
  let winnerOffset = 0;

  while (currentRound.length > 1) {
    const nextRound = [];
    for (let index = 0; index < currentRound.length; index += 2) {
      const left = currentRound[index];
      const right = currentRound[index + 1];
      if (!right) {
        nextRound.push(left);
        continue;
      }

      const winner = winners[winnerOffset];
      if (!winner || (winner !== left && winner !== right)) return rounds;
      nextRound.push(winner);
      winnerOffset += 1;
    }
    rounds.push(nextRound);
    currentRound = nextRound;
  }

  return rounds;
}

export function buildCenteredBracket(entryIds, winners) {
  const rounds = buildTournamentRounds(entryIds, winners);
  const sideRounds = rounds.slice(0, -1).map((round) => ({
    roundSize: round.length,
    left: round.slice(0, round.length / 2),
    right: round.slice(round.length / 2),
  }));

  return {
    left: sideRounds.map(({ roundSize, left }) => ({ roundSize, entries: left })),
    champion: rounds.at(-1)?.[0],
    right: sideRounds.reverse().map(({ roundSize, right }) => ({ roundSize, entries: right })),
  };
}

export function createBracketShareResult(competitionId, entryIds, winners) {
  if (!competitionIds.has(competitionId) || entryIds.length < 2 || winners.length !== entryIds.length - 1) {
    throw new Error("完成全部对决后才能分享结果");
  }

  return { version: 1, type: "bracket", competitionId, entryIds: [...entryIds], winners: [...winners] };
}

export function createCustomBracketShareResult(title, entryIds, winners) {
  const cleanTitle = title.trim() || "我的巅峰对决";
  const cleanEntries = entryIds.map((entry) => entry.trim()).filter(Boolean);
  const completedRounds = buildTournamentRounds(cleanEntries, winners);
  if (
    cleanEntries.length < 2
    || cleanEntries.length > 32
    || new Set(cleanEntries).size !== cleanEntries.length
    || winners.length !== cleanEntries.length - 1
    || completedRounds.at(-1)?.length !== 1
  ) {
    throw new Error("完成全部自定义对决后才能分享结果");
  }

  return { version: 1, type: "custom-bracket", title: cleanTitle, entryIds: cleanEntries, winners: [...winners] };
}

export function createRatingShareResult(competitionId, songIds, placements) {
  const items = songIds.map((id) => [id, placements[id]]);
  if (!competitionIds.has(competitionId) || items.some(([, tierId]) => !ratingTierIds.has(tierId))) {
    throw new Error("完成全部锐评后才能分享结果");
  }

  return { version: 1, type: "rating", competitionId, items };
}

export function encodeShareResult(result) {
  return LZString.compressToEncodedURIComponent(JSON.stringify(result));
}

export function decodeShareResult(value) {
  try {
    const result = JSON.parse(LZString.decompressFromEncodedURIComponent(value));
    if (result?.version !== 1) return null;
    if (result.type === "custom-bracket" && typeof result.title === "string" && Array.isArray(result.entryIds) && Array.isArray(result.winners)) return result;
    if (!competitionIds.has(result.competitionId)) return null;
    if (result.type === "bracket" && Array.isArray(result.entryIds) && Array.isArray(result.winners)) return result;
    if (result.type === "rating" && Array.isArray(result.items)) return result;
    return null;
  } catch {
    return null;
  }
}

export function buildShareUrl(baseUrl, result) {
  const url = new URL(baseUrl);
  url.search = new URLSearchParams({ share: encodeShareResult(result) }).toString();
  url.hash = "";
  return url.toString();
}

export function readShareResultFromUrl(url) {
  const encoded = new URL(url).searchParams.get("share");
  return encoded ? decodeShareResult(encoded) : null;
}
