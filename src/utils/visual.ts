/**
 * Identidade visual de categorias e metas: ícone e índice de cor (na paleta SeriesColors).
 * A cor é estável: a mesma categoria tem sempre a mesma cor em todas as telas.
 */

import type { NomeIcone } from '@/components/icone';
import { chaveDaCategoriaPorNome } from '@/i18n/categorias';

/** Por chave da categoria padrão (src/i18n/categorias.ts). */
const POR_CHAVE: Record<string, { icone: NomeIcone; cor: number }> = {
  supermercado: { icone: 'supermercado', cor: 2 },
  alimentacao: { icone: 'alimentacao', cor: 7 },
  combustivel: { icone: 'combustivel', cor: 3 },
  contas: { icone: 'contas', cor: 3 },
  telecom: { icone: 'telefone', cor: 4 },
  transporte: { icone: 'transporte', cor: 0 },
  moradia: { icone: 'moradia', cor: 2 },
  saude: { icone: 'saude', cor: 4 },
  educacao: { icone: 'educacao', cor: 6 },
  lazer: { icone: 'lazer', cor: 3 },
  compras: { icone: 'compras', cor: 1 },
  assinaturas: { icone: 'assinaturas', cor: 6 },
  viagens: { icone: 'viagem', cor: 0 },
  outros: { icone: 'outros', cor: 5 },
  salario: { icone: 'salario', cor: 2 },
  freelance: { icone: 'freelance', cor: 0 },
  investimentos: { icone: 'investimentos', cor: 6 },
};

/** "Alimentação" → "alimentacao" */
export function normalizar(texto: string) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

/** Ícone e cor de uma categoria. As padrão são reconhecidas pelo nome em qualquer idioma. */
export function visualCategoria(nome: string, id: number): { icone: NomeIcone; cor: number } {
  const chave = chaveDaCategoriaPorNome(nome);
  return (chave && POR_CHAVE[chave]) || { icone: 'etiqueta', cor: Math.abs(id) % 8 };
}

const METAS: [RegExp, NomeIcone][] = [
  [/reserva|emergencia/, 'escudo'],
  [/viagem|ferias|viajar/, 'viagem'],
  [/carro|moto|veiculo/, 'transporte'],
  [/casa|apartamento|imovel|reforma/, 'moradia'],
  [/estudo|curso|faculdade|educacao/, 'educacao'],
  [/divida|quitar/, 'carteira'],
  [/investi|aposentadoria/, 'investimentos'],
];

export function iconeMeta(nome: string): NomeIcone {
  const n = normalizar(nome);
  return METAS.find(([padrao]) => padrao.test(n))?.[1] ?? 'metas';
}
