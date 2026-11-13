/**
 * Nomes das categorias padrão no idioma escolhido. As categorias do app têm uma chave estável
 * (categorias.chave, migração v17); as criadas pelo utilizador mostram o nome que ele escreveu.
 */

import { t, type Chave } from '@/i18n';
import { CATALOGOS } from '@/i18n/catalogos';

export const CHAVES_CATEGORIAS = [
  'supermercado',
  'alimentacao',
  'transporte',
  'combustivel',
  'moradia',
  'contas',
  'telecom',
  'saude',
  'educacao',
  'lazer',
  'compras',
  'assinaturas',
  'viagens',
  'outros',
  'salario',
  'freelance',
  'investimentos',
] as const;

export type ChaveCategoria = (typeof CHAVES_CATEGORIAS)[number];

function ehChaveCategoria(chave: string): chave is ChaveCategoria {
  return (CHAVES_CATEGORIAS as readonly string[]).includes(chave);
}

export function nomeDaCategoria(nome: string, chave: string | null | undefined): string {
  return chave && ehChaveCategoria(chave) ? t(`categoria.${chave}` as Chave) : nome;
}

/** Nomes antigos (português do Brasil, gravados pelas migrações) → chave. */
const NOMES_ANTIGOS: Record<string, ChaveCategoria> = {
  supermercado: 'supermercado',
  alimentacao: 'alimentacao',
  transporte: 'transporte',
  combustivel: 'combustivel',
  moradia: 'moradia',
  'contas da casa': 'contas',
  'telefone e internet': 'telecom',
  saude: 'saude',
  educacao: 'educacao',
  lazer: 'lazer',
  compras: 'compras',
  assinaturas: 'assinaturas',
  viagens: 'viagens',
  outros: 'outros',
  salario: 'salario',
  freelance: 'freelance',
  investimentos: 'investimentos',
};

export function normalizarTexto(texto: string) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

let porNome: Map<string, ChaveCategoria> | null = null;

/** Chave de uma categoria padrão pelo nome mostrado em qualquer dos idiomas (ou o nome antigo). */
export function chaveDaCategoriaPorNome(nome: string): ChaveCategoria | null {
  if (!porNome) {
    porNome = new Map(Object.entries(NOMES_ANTIGOS));
    for (const catalogo of Object.values(CATALOGOS)) {
      for (const chave of CHAVES_CATEGORIAS) {
        const texto = (catalogo as Record<string, unknown>)[`categoria.${chave}`];
        if (typeof texto === 'string' && !porNome.has(normalizarTexto(texto))) porNome.set(normalizarTexto(texto), chave);
      }
    }
  }
  return porNome.get(normalizarTexto(nome)) ?? null;
}

/** Categorias padrão onde normalmente dá para cortar (lazer, compras, subscrições, viagens). */
export const CATEGORIAS_NAO_ESSENCIAIS: readonly ChaveCategoria[] = ['lazer', 'compras', 'assinaturas', 'viagens'];

/** Categorias padrão de gastos essenciais (não entram na sugestão de onde reduzir). */
export const CATEGORIAS_ESSENCIAIS: readonly ChaveCategoria[] = ['moradia', 'contas', 'saude', 'educacao', 'supermercado'];

export function categoriaNaoEssencial(nome: string) {
  const chave = chaveDaCategoriaPorNome(nome);
  return chave !== null && CATEGORIAS_NAO_ESSENCIAIS.includes(chave);
}

export function categoriaEssencial(nome: string) {
  const chave = chaveDaCategoriaPorNome(nome);
  return chave !== null && CATEGORIAS_ESSENCIAIS.includes(chave);
}

let termosReserva: string[] | null = null;

/**
 * A meta é o fundo de emergência? Reconhece o nome em qualquer idioma (o que a conversa de
 * boas-vindas cria) e as metas antigas com "reserva" no nome.
 */
export function ehMetaDeReserva(nome: string) {
  if (!termosReserva) {
    const termos = new Set(['reserva', 'emergen']);
    for (const catalogo of Object.values(CATALOGOS)) {
      for (const chave of ['chat.sonho.reserva', 'sit.reserva']) {
        const texto = (catalogo as Record<string, unknown>)[chave];
        if (typeof texto === 'string') termos.add(normalizarTexto(texto));
      }
    }
    termosReserva = [...termos];
  }
  const alvo = normalizarTexto(nome);
  return termosReserva.some((termo) => alvo.includes(termo));
}
