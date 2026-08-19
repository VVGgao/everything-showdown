export function collectPoolEntries<T extends { id: string }>(
  pools: Array<{ id: string; entries: T[] }>,
  selectedIds: string[],
): T[];

export function drawEntries<T extends { id: string }>(
  entries: T[],
  count: number,
  random?: () => number,
): T[];

export function drawHeatBiasedEntries<T extends { id: string; heat?: number }>(
  entries: T[],
  count: number,
  random?: () => number,
): T[];

export function drawCrossPoolEntries<T extends { id: string }>(
  pools: Array<{ id: string; entries: T[] }>,
  selectedIds: string[],
  count: number,
  random?: () => number,
): T[];
