export type ActiveMatch = {
  finished: false;
  round: string;
  roundNumber: number;
  matchNumber: number;
  pair: [string, string];
};

export type FinishedTournament = {
  finished: true;
  championId: string;
};

export function getCurrentMatch(
  entryIds: string[],
  winners: string[],
): ActiveMatch | FinishedTournament;

export function restoreOfficialTournament<T extends { id: string }>(options: {
  defaultEntries: T[];
  availableEntries: T[];
  savedBracket: unknown;
  savedWinners: unknown;
  expectedSize: number;
}): {
  entries: T[];
  winners: string[];
  restored: boolean;
};

export type CustomTournamentState = {
  pending: Array<string | null>;
  nextRound: string[];
  currentPair: [string, string] | null;
  roundNumber: number;
  championId?: string;
};

export function createCustomTournament(entryIds: string[]): CustomTournamentState;
export function advanceCustomTournament(
  state: CustomTournamentState,
  winnerId: string,
): CustomTournamentState;
