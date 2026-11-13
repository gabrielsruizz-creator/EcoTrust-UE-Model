/**
 * Portugal — IRS e Segurança Social do trabalhador, rendimentos de 2026 (tributação separada).
 *
 * Fontes (Portal das Finanças, consultadas em 13/11/2026):
 * - Taxas gerais: CIRS art. 68.º, redação do DL 212/2026 (efeitos desde 1/1/2026 para os rendimentos de 2026).
 * - Taxa adicional de solidariedade: CIRS art. 68.º-A (2,5% de 80 000 a 250 000 €; 5% acima).
 * - Dedução específica da categoria A: CIRS art. 25.º — 8,54 × IAS, ou as contribuições se forem maiores.
 * - IAS de 2026: € 537,13 (Portaria 480-A/2025/1).
 * - Mínimo de existência: CIRS art. 70.º (valor de referência = maior entre 12 880 € e 1,5 × 14 × IAS).
 *   O n.º 3 escreve "L = VR − (LDG/T1 × 3,60) + (Lim1/3,60)"; usamos a leitura em que as alíneas b) e c)
 *   do n.º 2 se encontram sem salto, L = VR − LDG/(T1 × 3,6) + Lim1/3,6 (os testes conferem a continuidade).
 * - Dependentes: CIRS art. 78.º-A (600 € cada, mais 126 € até 3 anos). Despesas gerais: art. 78.º-B (35%, até 250 €).
 * - Regime simplificado (independentes): CIRS art. 31.º (coeficiente 0,75 nas atividades da tabela do art. 151.º).
 * - Segurança Social: 11% a cargo do trabalhador por conta de outrem (guia prático do ISS, 2026).
 *   Independentes (Código dos Regimes Contributivos, versão consolidada de 9/12/2025, conferida no PDF do
 *   Diário da República enviado pelo utilizador): 21,4% (art. 168.º, n.º 1) sobre o rendimento relevante de
 *   70% da prestação de serviços (art. 162.º, n.º 1, a)); base mensal de 1/3 do trimestre, com máximo de
 *   12 × IAS por mês, e contribuição mínima de € 20 por mês (art. 163.º, n.os 1, 2 e 5).
 *   Não modelados: empresários em nome individual (25,2%), venda de bens (20%), contabilidade organizada,
 *   acumulação com trabalho por conta de outrem e isenção do primeiro ano.
 * Não incluídos ainda: IRS Jovem, tabelas regionais dos Açores e da Madeira, tributação conjunta.
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

export const IAS_2026 = 53_713;

export const ESCALOES_IRS_2026: Escaloes = [
  [834_200, 12.2],
  [1_258_700, 15.2],
  [1_783_800, 20.7],
  [2_308_900, 23.6],
  [2_939_700, 30.6],
  [4_309_000, 34.6],
  [4_656_600, 43.1],
  [8_663_400, 44.6],
  [Infinity, 48],
];

const ESCALOES_SOLIDARIEDADE: Escaloes = [
  [8_000_000, 0],
  [25_000_000, 2.5],
  [Infinity, 5],
];

/** 8,54 × IAS */
export const DEDUCAO_ESPECIFICA_2026 = Math.round(8.54 * IAS_2026);
const VALOR_REFERENCIA_MINIMO = Math.max(1_288_000, 1.5 * 14 * IAS_2026);
const LIMITE_DESPESAS_GERAIS = 25_000;
const PERCENTUAL_DESPESAS_GERAIS = 35;
const DEDUCAO_DEPENDENTE = 60_000;
const ACRESCIMO_ATE_3_ANOS = 12_600;
const TAXA_SS_DEPENDENTE = 11;
const TAXA_SS_INDEPENDENTE = 21.4;
const BASE_SS_INDEPENDENTE = 0.7;
const BASE_MAXIMA_MENSAL_INDEPENDENTE = 12 * IAS_2026;
const CONTRIBUICAO_MINIMA_MENSAL_INDEPENDENTE = 2_000;

/** Contribuição anual do trabalhador independente (prestação de serviços), mês a mês. */
export function contribuicaoIndependente(brutoAnual: number): number {
  if (brutoAnual <= 0) return CONTRIBUICAO_MINIMA_MENSAL_INDEPENDENTE * 12;
  const baseMensal = Math.min((brutoAnual * BASE_SS_INDEPENDENTE) / 12, BASE_MAXIMA_MENSAL_INDEPENDENTE);
  return Math.max((baseMensal * TAXA_SS_INDEPENDENTE) / 100, CONTRIBUICAO_MINIMA_MENSAL_INDEPENDENTE) * 12;
}
const COEFICIENTE_PROFISSIONAL = 0.75;

/**
 * Abatimento do mínimo de existência (CIRS art. 70.º, n.os 2 a 4), para um titular.
 * `bruto` = rendimentos brutos; `deducoes` = deduções específicas.
 */
export function abatimentoMinimoExistencia(bruto: number, deducoes: number): number {
  if (bruto > 2.2 * 14 * IAS_2026) return 0;
  const vr = VALOR_REFERENCIA_MINIMO;
  const [lim1, taxa1] = ESCALOES_IRS_2026[0];
  const t1 = taxa1 / 100;
  const ldgSobreT1 = LIMITE_DESPESAS_GERAIS / t1;
  const l = vr - ldgSobreT1 / 3.6 + lim1 / 3.6;
  let abatimento: number;
  if (bruto <= vr) abatimento = vr - (deducoes + ldgSobreT1);
  else if (bruto <= l) abatimento = vr - 2.6 * (bruto - vr) - (deducoes + ldgSobreT1);
  else abatimento = l - lim1 - 1.35 * (bruto - l) - deducoes;
  return Math.min(Math.max(0, abatimento), Math.max(0, bruto - deducoes));
}

export function calcularRendaPortugal(e: EntradaRenda): ResultadoRenda | SemRegras {
  if (e.ano !== 2026) return { semRegras: 'ano' };
  const bruto = e.brutoAnualCentavos;
  const avisos: AvisoRenda[] = [];

  let contribuicoes: number;
  let deducoesEspecificas: number;
  let tributavel: number;
  if (e.situacao === 'dependente') {
    contribuicoes = (bruto * TAXA_SS_DEPENDENTE) / 100;
    deducoesEspecificas = Math.min(bruto, Math.max(DEDUCAO_ESPECIFICA_2026, contribuicoes));
    tributavel = bruto - deducoesEspecificas;
  } else {
    contribuicoes = contribuicaoIndependente(bruto);
    avisos.push('despesas-profissionais-nao-incluidas');
    tributavel = bruto * COEFICIENTE_PROFISSIONAL;
    // A parte do rendimento que o coeficiente deixa de fora conta como dedução específica (art. 70.º, n.º 5, b)).
    deducoesEspecificas = bruto - tributavel;
  }

  const coletavel = Math.max(0, tributavel - abatimentoMinimoExistencia(bruto, deducoesEspecificas));
  const coleta = impostoPorEscaloes(coletavel, ESCALOES_IRS_2026) + impostoPorEscaloes(coletavel, ESCALOES_SOLIDARIEDADE);

  let despesasGerais = LIMITE_DESPESAS_GERAIS;
  if (e.despesasGeraisCentavos == null) avisos.push('despesas-gerais-presumidas');
  else despesasGerais = Math.min(LIMITE_DESPESAS_GERAIS, (e.despesasGeraisCentavos * PERCENTUAL_DESPESAS_GERAIS) / 100);
  const ate3 = Math.min(e.dependentesAte3Anos ?? 0, e.dependentes);
  const deducoesColeta = e.dependentes * DEDUCAO_DEPENDENTE + ate3 * ACRESCIMO_ATE_3_ANOS + despesasGerais;

  if (e.regiao === 'PT-20' || e.regiao === 'PT-30') avisos.push('regiao-usa-tabela-nacional');
  if (e.declaracaoConjunta) avisos.push('conjunta-nao-incluida');

  const imposto = Math.max(0, coleta - deducoesColeta);
  return montarResultado(bruto, imposto, contribuicoes, coletavel, imposto > 0 ? taxaMarginal(coletavel, ESCALOES_IRS_2026) : null, avisos);
}
