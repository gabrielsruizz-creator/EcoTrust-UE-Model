import type { ptPT } from '@/i18n/catalogos/pt-PT';

/** Texto com plural: `one` e `other` sempre; polonês também usa `few` e `many`. */
export type TextoPlural = { one: string; few?: string; many?: string; other: string };

export type Texto = string | TextoPlural;

/** O catálogo em português de Portugal é a referência: todo idioma precisa ter as mesmas chaves. */
export type Chave = keyof typeof ptPT;

export type Catalogo = { [K in Chave]: (typeof ptPT)[K] extends string ? string : TextoPlural };

/** Valores para trocar no texto: "Olá, {nome}" + { nome: 'Ana' }. `n` também escolhe o plural. */
export type Parametros = Record<string, string | number>;
