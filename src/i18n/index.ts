/**
 * Traduções do app. Uso:
 * - em componentes React: `const t = useT()` (src/hooks/use-idioma.ts), para a tela trocar de idioma na hora;
 * - em services (textos de insights, análises...): `t('chave')` direto. Ao trocar o idioma, as preferências
 *   são salvas no banco, o que já faz os hooks de dados recalcularem.
 */

import { CATALOGOS } from '@/i18n/catalogos';
import { definicaoIdioma, IDIOMA_PADRAO, type Idioma } from '@/i18n/idiomas';
import { categoriaPlural } from '@/i18n/plurais';
import type { Chave, Parametros, Texto } from '@/i18n/tipos';

export type { Idioma } from '@/i18n/idiomas';
export type { Chave, Parametros } from '@/i18n/tipos';

export type Tradutor = (chave: Chave, parametros?: Parametros) => string;

let idiomaAtivo: Idioma = IDIOMA_PADRAO;
const ouvintes = new Set<() => void>();

export function idiomaAtual(): Idioma {
  return idiomaAtivo;
}

/** Convenção regional para Intl (números, moedas, datas). */
export function localeAtual(): string {
  return definicaoIdioma(idiomaAtivo).locale;
}

export function definirIdioma(idioma: Idioma) {
  if (idioma === idiomaAtivo) return;
  idiomaAtivo = idioma;
  ouvintes.forEach((ouvinte) => ouvinte());
}

export function assinarIdioma(ouvinte: () => void) {
  ouvintes.add(ouvinte);
  return () => {
    ouvintes.delete(ouvinte);
  };
}

function escolherTexto(idioma: Idioma, texto: Texto, parametros?: Parametros): string {
  if (typeof texto === 'string') return texto;
  const n = typeof parametros?.n === 'number' ? parametros.n : 0;
  return texto[categoriaPlural(idioma, n)] ?? texto.other;
}

function preencher(texto: string, parametros?: Parametros) {
  if (!parametros) return texto;
  return texto.replace(/\{(\w+)\}/g, (marcador, nome: string) =>
    nome in parametros ? String(parametros[nome]) : marcador,
  );
}

/** Texto de uma chave num idioma. Se faltar no catálogo (não deveria: o TypeScript confere), usa o inglês. */
export function traduzir(idioma: Idioma, chave: Chave, parametros?: Parametros): string {
  const texto = CATALOGOS[idioma][chave] ?? CATALOGOS[IDIOMA_PADRAO][chave] ?? chave;
  return preencher(escolherTexto(idioma, texto, parametros), parametros);
}

const tradutores = new Map<Idioma, Tradutor>();

/** Uma função de tradução por idioma (a identidade muda com o idioma, o que faz as telas renderizarem de novo). */
export function tradutorPara(idioma: Idioma): Tradutor {
  let tradutor = tradutores.get(idioma);
  if (!tradutor) {
    tradutor = (chave, parametros) => traduzir(idioma, chave, parametros);
    tradutores.set(idioma, tradutor);
  }
  return tradutor;
}

/** Tradução no idioma ativo (para services e funções fora do React). */
export const t: Tradutor = (chave, parametros) => traduzir(idiomaAtivo, chave, parametros);
