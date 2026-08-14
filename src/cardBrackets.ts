export type CardVariant = 'default' | 'star'

export function showBrackets(variant: CardVariant, bracketed: boolean): boolean {
  return variant === 'default' && bracketed
}
