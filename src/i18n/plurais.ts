/**
 * Regras de plural (CLDR, só números inteiros, que é o que o app conta).
 * Feitas à mão porque o motor JavaScript do app (Hermes) não tem Intl.PluralRules.
 */

import type { Idioma } from '@/i18n/idiomas';

export type CategoriaPlural = 'one' | 'few' | 'many' | 'other';

export function categoriaPlural(idioma: Idioma, n: number): CategoriaPlural {
  const i = Math.abs(Math.trunc(n));
  if (!Number.isInteger(n)) return 'other';
  switch (idioma) {
    case 'fr':
      // Francês: 0 e 1 são singular ("0 transaction").
      return i === 0 || i === 1 ? 'one' : 'other';
    case 'pl': {
      if (i === 1) return 'one';
      const d = i % 10;
      const c = i % 100;
      if (d >= 2 && d <= 4 && !(c >= 12 && c <= 14)) return 'few';
      return 'many';
    }
    default:
      return i === 1 ? 'one' : 'other';
  }
}
