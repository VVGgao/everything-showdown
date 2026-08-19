export function groupEntriesByLabel<T extends { label?: string }>(entries: T[]): Array<{
  label: string;
  entries: T[];
}>;

export function groupEntriesByGroup<T extends { group?: string }>(entries: T[]): Array<{
  label: string;
  entries: T[];
}>;

export function groupEntriesByMember<T extends { member?: string; subtitle?: string }>(entries: T[]): Array<{
  label: string;
  entries: T[];
}>;
