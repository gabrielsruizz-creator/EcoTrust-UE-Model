/**
 * Itália — IRPEF e contribuições do trabalhador dependente, rendimentos de 2026.
 *
 * - Escalões: Testo unico imposte sui redditi (D.Lgs. 117/2026), art. 11: 23% até 28 000 €, 33% até 50 000 €
 *   (redução da Lei 199/2025, orçamento de 2026), 43% acima.
 * - Detrações do trabalho dependente: mesmo TU, art. 13, n.os 1, 2 e 10 (inclui a "ulteriore detrazione"
 *   da Lei 207/2024 entre 20 000 e 40 000 €). Detrações limitadas ao imposto bruto (art. 11, n.º 4).
 * - "Somma che non concorre alla formazione del reddito" até 20 000 € de rendimento total: 7,1% / 5,3% / 4,8%
 *   do rendimento de trabalho (Lei 207/2024, art. 1.º, n.º 4; Circolare 4/E/2025 da Agenzia delle Entrate).
 * - INPS a cargo do trabalhador: 9,19% (taxa mais comum do FPLD; varia com o setor) — A CONFIRMAR na
 *   Circolare INPS 6/2026. As contribuições abatem o rendimento.
 * Não incluídos ainda: addizionali regionale e comunale (variam por região e município), filhos (desde 2022
 * cobertos pelo Assegno Unico, fora do IRPEF), mecanismo para rendimentos acima de 200 000 € (Lei 199/2025),
 * trabalhadores independentes (regime forfettario/ordinario).
 */

import {
  impostoPorEscaloes,
  montarResultado,
  taxaMarginal,
  type AvisoRenda,
  type EntradaRenda,
  type Escaloes,
  type ResultadoRenda,
  type SemRegras,
} from '@/data/renda/tipos';

export const ESCALOES_IRPEF_2026: Escaloes = [
  [2_800_000, 23],
  [5_000_000, 33],
  [Infinity, 43],
];

const TAXA_INPS_DEPENDENTE = 9.19;

/** Rácios da lei com 4 casas decimais (TU art. 13, n.º 8). */
const racio = (valor: number) => Math.floor(valor * 10_000) / 10_000;

/** Detração do trabalho dependente (TU art. 13, n.os 1 e 2), em centavos. `r` = rendimento total. */
export function detracaoTrabalho(r: number): number {
  let d = 0;
  if (r <= 1_500_000) d = 195_500;
  else if (r <= 2_800_000) d = 191_000 + 119_000 * racio((2_800_000 - r) / 1_300_000);
  else if (r <= 5_000_000) d = 191_000 * racio((5_000_000 - r) / 2_200_000);
  if (r > 2_500_000 && r <= 3_500_000) d += 6_500;
  return d;
}

/** "Ulteriore detrazione" (TU art. 13, n.º 10). */
export function ulteriorDetracao(r: number): number {
  if (r <= 2_000_000 || r > 4_000_000) return 0;
  if (r <= 3_200_000) return 100_000;
  return 100_000 * racio((4_000_000 - r) / 800_000);
}

/** Valor isento pago com o salário a quem ganha até 20 000 € (Lei 207/2024, art. 1.º, n.º 4). */
export function sommaEsente(rendimentoTrabalho: number, rendimentoTotal: number): number {
  if (rendimentoTotal > 2_000_000) return 0;
  const pct = rendimentoTrabalho <= 850_000 ? 7.1 : rendimentoTrabalho <= 1_500_000 ? 5.3 : 4.8;
  return (rendimentoTrabalho * pct) / 100;
}

export function calcularRendaItalia(e: EntradaRenda): ResultadoRenda | SemRegras {
  if (e.ano !== 2026) return { semRegras: 'ano' };
  if (e.situacao !== 'dependente') return { semRegras: 'situacao' };
  const bruto = e.brutoAnualCentavos;
  const avisos: AvisoRenda[] = ['contribuicoes-a-confirmar', 'adicionais-locais-nao-incluidos'];
  if (bruto > 20_000_000) avisos.push('alto-rendimento-simplificado');

  const contribuicoes = (bruto * TAXA_INPS_DEPENDENTE) / 100;
  const rendimento = bruto - contribuicoes;
  const lorda = impostoPorEscaloes(rendimento, ESCALOES_IRPEF_2026);
  const detracoes = detracaoTrabalho(rendimento) + ulteriorDetracao(rendimento);
  const imposto = Math.max(0, lorda - detracoes);
  const bonus = sommaEsente(rendimento, rendimento);

  return montarResultado(bruto, imposto, contribuicoes, rendimento, imposto > 0 ? taxaMarginal(rendimento, ESCALOES_IRPEF_2026) : null, avisos, bonus);
}
