export function drawRatingEntries(entries, count = 10, random = Math.random) {
  if (entries.length < count) throw new Error(`锐评歌池至少需要 ${count} 首歌曲`);
  const shuffled = [...entries];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled.slice(0, count);
}

export function placeRatingEntry(placements, entryId, tierId) {
  return { ...placements, [entryId]: tierId };
}
