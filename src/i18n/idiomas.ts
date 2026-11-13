/**
 * Idiomas da edição europeia. O idioma é independente do país de residência e da moeda.
 * `locale` é a convenção usada para formatar números e datas quando o país não diz outra coisa
 * (inglês usa as convenções da Irlanda: euro, dia/mês/ano).
 * Para incluir um idioma: adicionar aqui, criar o catálogo em `catalogos/` e registrar em `catalogos/index.ts`.
 */

export type Idioma = 'en' | 'pt-PT' | 'es' | 'fr' | 'de' | 'it' | 'nl' | 'pl';

export type DefinicaoIdioma = {
  id: Idioma;
  /** Nome no próprio idioma (como aparece no seletor) */
  nomeNativo: string;
  locale: string;
};

export const IDIOMAS: DefinicaoIdioma[] = [
  { id: 'en', nomeNativo: 'English', locale: 'en-IE' },
  { id: 'pt-PT', nomeNativo: 'Português (Portugal)', locale: 'pt-PT' },
  { id: 'es', nomeNativo: 'Español', locale: 'es-ES' },
  { id: 'fr', nomeNativo: 'Français', locale: 'fr-FR' },
  { id: 'de', nomeNativo: 'Deutsch', locale: 'de-DE' },
  { id: 'it', nomeNativo: 'Italiano', locale: 'it-IT' },
  { id: 'nl', nomeNativo: 'Nederlands', locale: 'nl-NL' },
  { id: 'pl', nomeNativo: 'Polski', locale: 'pl-PL' },
];

/** Quando o idioma do aparelho não é um dos suportados. */
export const IDIOMA_PADRAO: Idioma = 'en';

export function ehIdioma(valor: unknown): valor is Idioma {
  return IDIOMAS.some((i) => i.id === valor);
}

export function definicaoIdioma(id: Idioma): DefinicaoIdioma {
  return IDIOMAS.find((i) => i.id === id)!;
}

/**
 * Escolhe o idioma a partir da lista de preferências do aparelho (tags BCP 47, em ordem).
 * Qualquer português vira pt-PT: a edição europeia não usa o português do Brasil.
 */
export function escolherIdioma(tagsDoAparelho: string[]): Idioma {
  for (const tag of tagsDoAparelho) {
    const codigo = tag.toLowerCase().split(/[-_]/)[0];
    if (codigo === 'pt') return 'pt-PT';
    const encontrado = IDIOMAS.find((i) => i.id === codigo);
    if (encontrado) return encontrado.id;
  }
  return IDIOMA_PADRAO;
}
