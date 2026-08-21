import LZString from "lz-string";

const competitionIds = new Set(["hiphop", "kpop", "games"]);
const ratingTierIds = new Set(["hang", "top", "human", "npc", "lame"]);

export function getShareImageCapture(renderedWidth) {
  return {
    width: 1080,
    height: 1350,
    scale: 1080 / renderedWidth,
    backgroundColor: "#080808",
  };
}

export function normalizeShareCanvas(sourceCanvas, createCanvas = () => document.createElement("canvas")) {
  const canvas = createCanvas();
  canvas.width = 1080;
  canvas.height = 1350;
  canvas.getContext("2d").drawImage(sourceCanvas, 0, 0, canvas.width, canvas.height);
  return canvas;
}

export function buildTournamentRounds(entryIds, winners) {
  const rounds = [[...entryIds]];
  let roundSize = entryIds.length / 2;
  let winnerOffset = 0;

  while (roundSize >= 1) {
    const round = winners.slice(winnerOffset, winnerOffset + roundSize);
    if (round.length !== roundSize) break;
    rounds.push(round);
    winnerOffset += roundSize;
    roundSize /= 2;
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
    if (result?.version !== 1 || !competitionIds.has(result.competitionId)) return null;
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
