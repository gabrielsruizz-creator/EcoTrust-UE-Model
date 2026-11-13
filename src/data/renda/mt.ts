/**
 * Malta — income tax e contribuições (Social Security Contributions), rendimentos de 2026.
 *
 * - Taxas: Income Tax Act (Cap. 123), art. 56(1), redação do Act III de 2026, aplicável "from the year of
 *   assessment 2027" — ou seja, aos rendimentos de 2026 (em Malta o imposto de um ano de avaliação incide
 *   sobre o ano anterior). Fonte: legislation.mt, versão consolidada de 10/03/2026.
 *   Cada tabela é "rendimento × taxa − valor a subtrair". Na tabela de pais com um filho (art. 56(1)(b)(iv)),
 *   a lei publicada subtrai € 10 270 no último escalão, o que cria um salto de € 5 aos € 60 000 (as outras
 *   tabelas não têm salto). Usamos o texto da lei e marcamos para conferir.
 * - Tabelas de pais (iv) e (v) exigem que o contribuinte ou o cônjuge seja nacional da UE/EEE (ou residente
 *   de longa duração); assumimos que sim e avisamos.
 * - Contribuições 2026 (Class 1: 10% do salário semanal, com teto; Class 2: 15% do rendimento líquido, com teto),
 *   segundo as tabelas do MTCA e do Departamento de Segurança Social, que bloqueiam acesso automático — A CONFIRMAR.
 *   O teto é maior para quem nasceu a partir de 1962.
 */

import { montarResultado, type AvisoRenda, type EntradaRenda, type ResultadoRenda, type SemRegras } from '@/data/renda/tipos';

/** [até (centavos), taxa %, valor a subtrair (centavos)] — imposto = rendimento × taxa − subtrair */
type TabelaMalta = [number, number, number][];

const tabela = (zero: number, l15: number, s15: number, s25: number, s35: number): TabelaMalta => [
  [zero, 0, 0],
  [l15, 15, s15],
  [6_000_000, 25, s25],
  [Infinity, 35, s35],
];

export const TABELAS_MALTA_2026 = {
  /** (a)(i) casados, declaração conjunta, sem filhos */
  casados: tabela(1_500_000, 2_300_000, 225_000, 455_000, 1_055_000),
  /** (a)(ii) casados com um filho */
  casadosUmFilho: tabela(1_750_000, 2_650_000, 262_500, 527_500, 1_127_500),
  /** (a)(iii) casados com dois ou mais filhos */
  casadosDoisFilhos: tabela(2_250_000, 3_200_000, 337_500, 657_500, 1_257_500),
  /** (b)(i) solteiros e cada cônjuge com declaração separada */
  solteiros: tabela(1_200_000, 1_600_000, 180_000, 340_000, 940_000),
  /** (b)(iv) pai/mãe com um filho */
  paisUmFilho: tabela(1_450_000, 2_100_000, 217_500, 427_500, 1_027_000),
  /** (b)(v) pai/mãe com dois ou mais filhos */
  paisDoisFilhos: tabela(1_850_000, 2_550_000, 277_500, 532_500, 1_132_500),
};

export function impostoMalta(rendimento: number, t: TabelaMalta): { imposto: number; taxa: number } {
  const [, taxa, subtrair] = t.find(([ate]) => rendimento <= ate)!;
  return { imposto: Math.max(0, (rendimento * taxa) / 100 - subtrair), taxa };
}

/** Tetos semanais de 2026 (A CONFIRMAR): nascidos até 1961 / a partir de 1962. */
const TETO_SEMANAL_CLASS1 = { ate1961: 4_904, desde1962: 5_593 };
const TETO_SEMANAL_CLASS2 = { ate1961: 7_356, desde1962: 8_389 };

export function calcularRendaMalta(e: EntradaRenda): ResultadoRenda | SemRegras {
  if (e.ano !== 2026) return { semRegras: 'ano' };
  const bruto = e.brutoAnualCentavos;
  const avisos: AvisoRenda[] = ['contribuicoes-a-confirmar'];

  const filhos = Math.max(0, e.dependentes);
  let t: TabelaMalta;
  if (e.declaracaoConjunta) {
    t = filhos === 0 ? TABELAS_MALTA_2026.casados : filhos === 1 ? TABELAS_MALTA_2026.casadosUmFilho : TABELAS_MALTA_2026.casadosDoisFilhos;
  } else {
    t = filhos === 0 ? TABELAS_MALTA_2026.solteiros : filhos === 1 ? TABELAS_MALTA_2026.paisUmFilho : TABELAS_MALTA_2026.paisDoisFilhos;
  }
  if (filhos > 0) avisos.push('nacionalidade-ue-presumida');
  if (t === TABELAS_MALTA_2026.paisUmFilho) avisos.push('tabela-a-confirmar');
  if (e.situacao === 'independente') avisos.push('despesas-profissionais-nao-incluidas');

  const geracao = e.anoNascimento != null && e.anoNascimento <= 1961 ? 'ate1961' : 'desde1962';
  const contribuicoes =
    e.situacao === 'dependente'
      ? Math.min((bruto * 10) / 100, TETO_SEMANAL_CLASS1[geracao] * 52)
      : Math.min((bruto * 15) / 100, TETO_SEMANAL_CLASS2[geracao] * 52);

  // Em Malta as contribuições não abatem o rendimento coletável.
  const { imposto, taxa } = impostoMalta(bruto, t);
  return montarResultado(bruto, imposto, contribuicoes, bruto, imposto > 0 ? taxa : null, avisos);
}
