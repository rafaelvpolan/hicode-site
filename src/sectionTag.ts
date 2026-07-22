export function sectionTag(prefix: string, index: number): string {
  return `${prefix}_${String(index + 1).padStart(2, '0')}`
}
