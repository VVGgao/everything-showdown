/**
 * @template {{ label?: string }} T
 * @param {T[]} entries
 * @returns {{ label: string, entries: T[] }[]}
 */
export function groupEntriesByLabel(entries) {
  const groups = new Map();
  for (const entry of entries) {
    const label = entry.label || "独立发行";
    groups.set(label, [...(groups.get(label) ?? []), entry]);
  }
  return [...groups.entries()]
    .map(([label, groupedEntries]) => ({ label, entries: groupedEntries }))
    .sort((left, right) => right.entries.length - left.entries.length || left.label.localeCompare(right.label));
}

/**
 * @template {{ group?: string }} T
 * @param {T[]} entries
 * @returns {{ label: string, entries: T[] }[]}
 */
export function groupEntriesByGroup(entries) {
  const groups = new Map();
  for (const entry of entries) {
    const group = entry.group || "Solo";
    groups.set(group, [...(groups.get(group) ?? []), entry]);
  }
  return [...groups.entries()]
    .map(([label, groupedEntries]) => ({ label, entries: groupedEntries }))
    .sort((left, right) => right.entries.length - left.entries.length || left.label.localeCompare(right.label));
}

/**
 * @template {{ member?: string, subtitle?: string }} T
 * @param {T[]} entries
 * @returns {{ label: string, entries: T[] }[]}
 */
export function groupEntriesByMember(entries) {
  const groups = new Map();
  for (const entry of entries) {
    const member = entry.member || entry.subtitle || "未分类艺人";
    groups.set(member, [...(groups.get(member) ?? []), entry]);
  }
  return [...groups.entries()]
    .map(([label, groupedEntries]) => ({ label, entries: groupedEntries }))
    .sort((left, right) => right.entries.length - left.entries.length || left.label.localeCompare(right.label));
}
