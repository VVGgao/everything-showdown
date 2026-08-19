/**
 * @template {{ id: string }} T
 * @param {{ id: string, entries: T[] }[]} pools
 * @param {string[]} selectedIds
 * @returns {T[]}
 */
export function collectPoolEntries(pools, selectedIds) {
  const selected = new Set(selectedIds);
  const unique = new Map();
  for (const pool of pools) {
    if (!selected.has(pool.id)) continue;
    for (const entry of pool.entries) unique.set(entry.id, entry);
  }
  return [...unique.values()];
}

/**
 * @template {{ id: string }} T
 * @param {T[]} entries
 * @param {number} count
 * @param {() => number} [random]
 * @returns {T[]}
 */
export function drawEntries(entries, count, random = Math.random) {
  const unique = [...new Map(entries.map((entry) => [entry.id, entry])).values()];
  if (unique.length < count) throw new Error(`至少需要 ${count} 首歌曲`);
  for (let index = unique.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [unique[index], unique[target]] = [unique[target], unique[index]];
  }
  return unique.slice(0, count);
}

/**
 * @template {{ id: string, heat?: number }} T
 * @param {T[]} entries
 * @param {number} count
 * @param {() => number} [random]
 * @returns {T[]}
 */
export function drawHeatBiasedEntries(entries, count, random = Math.random) {
  const unique = [...new Map(entries.map((entry) => [entry.id, entry])).values()];
  if (unique.length < count) throw new Error(`至少需要 ${count} 首歌曲`);
  return rankByHeat(unique, random).slice(-count).reverse();
}

/**
 * Draws a bracket whose adjacent first-round entries come from different pools
 * whenever the selected pool sizes make that possible.
 *
 * @template {{ id: string }} T
 * @param {{ id: string, entries: T[] }[]} pools
 * @param {string[]} selectedIds
 * @param {number} count
 * @param {() => number} [random]
 * @returns {T[]}
 */
export function drawCrossPoolEntries(pools, selectedIds, count, random = Math.random) {
  const selected = new Set(selectedIds);
  const seen = new Set();
  const buckets = pools
    .filter((pool) => selected.has(pool.id))
    .map((pool) => ({
      id: pool.id,
      entries: rankByHeat(pool.entries.filter((entry) => {
        if (seen.has(entry.id)) return false;
        seen.add(entry.id);
        return true;
      }), random),
    }))
    .filter((pool) => pool.entries.length > 0);

  const available = buckets.reduce((total, bucket) => total + bucket.entries.length, 0);
  if (available < count) throw new Error(`至少需要 ${count} 首歌曲`);

  const selectedBuckets = buckets.map((bucket) => ({ id: bucket.id, entries: [] }));
  for (let index = 0; index < count;) {
    let added = false;
    for (let bucketIndex = 0; bucketIndex < buckets.length && index < count; bucketIndex += 1) {
      const entry = buckets[bucketIndex].entries.pop();
      if (!entry) continue;
      selectedBuckets[bucketIndex].entries.push(entry);
      index += 1;
      added = true;
    }
    if (!added) break;
  }

  const pairs = [];
  while (selectedBuckets.some((bucket) => bucket.entries.length > 0)) {
    selectedBuckets.sort((left, right) => right.entries.length - left.entries.length);
    const first = selectedBuckets.find((bucket) => bucket.entries.length > 0);
    if (!first) break;
    const left = first.entries.pop();
    const second = selectedBuckets.find((bucket) => bucket.id !== first.id && bucket.entries.length > 0);
    const right = second ? second.entries.pop() : first.entries.pop();
    pairs.push(right ? [left, right] : [left]);
  }

  return pairs.flat();
}

function shuffle(items, random) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }
  return shuffled;
}

function rankByHeat(items, random) {
  const heats = items.map((entry) => Number.isFinite(entry.heat) ? entry.heat : 0);
  const minimum = Math.min(...heats);
  const maximum = Math.max(...heats);
  if (maximum === minimum) return shuffle(items, random);

  return items
    .map((entry, index) => ({
      entry,
      score: ((heats[index] - minimum) / (maximum - minimum)) * 0.8 + random() * 0.2,
    }))
    .sort((left, right) => left.score - right.score)
    .map(({ entry }) => entry);
}
