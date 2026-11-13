import { describe, expect, it } from '@jest/globals';

import { calcularImpostosDaRenda, impostoPorEscaloes, temRegras, type EntradaRenda, type ResultadoRenda } from '@/data/renda';
import { contribuicaoInps, detracaoTrabalho, ESCALOES_IRPEF_2026, sommaEsente } from '@/data/renda/it';
import { contribuicaoClass1, contribuicaoClass2, impostoMalta, TABELAS_MALTA_2026 } from '@/data/renda/mt';
import { abatimentoMinimoExistencia, contribuicaoIndependente, DEDUCAO_ESPECIFICA_2026, ESCALOES_IRS_2026 } from '@/data/renda/pt';
import type { CodigoPais } from '@/data/paises';

const base: EntradaRenda = { ano: 2026, brutoAnualCentavos: 0, situacao: 'dependente', dependentes: 0 };

function calcular(pais: CodigoPais, mudanca: Partial<EntradaRenda>): ResultadoRenda {
  const r = calcularImpostosDaRenda(pais, { ...base, ...mudanca });
  if (!temRegras(r)) throw new Error(`sem regras: ${r.semRegras}`);
  return r;
}

describe('Portugal — IRS 2026', () => {
  it('a tabela do art. 68.º reproduz a taxa média (coluna B) publicada', () => {
    const colunaB: [number, number][] = [
      [1_258_700, 13.212],
      [1_783_800, 15.416],
      [2_308_900, 17.277],
      [2_939_700, 20.136],
      [4_309_000, 24.732],
      [4_656_600, 26.103],
      [8_663_400, 34.658],
    ];
    for (const [limite, media] of colunaB) {
      expect((impostoPorEscaloes(limite, ESCALOES_IRS_2026) / limite) * 100).toBeCloseTo(media, 3);
    }
  });

  it('dedução específica = 8,54 × IAS (€ 537,13) = € 4 587,09', () => {
    expect(DEDUCAO_ESPECIFICA_2026).toBe(458_709);
  });

  it('quem ganha o valor de referência do mínimo de existência (€ 12 880) não paga IRS', () => {
    const r = calcular('PT', { brutoAnualCentavos: 1_288_000 });
    expect(r.impostoCentavos).toBe(0);
    expect(r.contribuicoesCentavos).toBe(141_680);
  });

  it('o abatimento do mínimo de existência não dá saltos (art. 70.º)', () => {
    let anterior = abatimentoMinimoExistencia(1_100_000, DEDUCAO_ESPECIFICA_2026);
    for (let bruto = 1_100_100; bruto <= 1_800_000; bruto += 100) {
      const atual = abatimentoMinimoExistencia(bruto, DEDUCAO_ESPECIFICA_2026);
      expect(Math.abs(atual - anterior)).toBeLessThanOrEqual(2.6 * 100 + 1);
      anterior = atual;
    }
    expect(abatimentoMinimoExistencia(1_700_000, DEDUCAO_ESPECIFICA_2026)).toBe(0);
  });

  it('€ 30 000 brutos, por conta de outrem, sem dependentes', () => {
    // coletável 30 000 − 4 587,09 = 25 412,91 → coleta 4 700,27 − despesas gerais 250 = 4 450,27
    const r = calcular('PT', { brutoAnualCentavos: 3_000_000 });
    expect(r.baseTributavelCentavos).toBe(2_541_291);
    expect(r.impostoCentavos).toBe(445_027);
    expect(r.contribuicoesCentavos).toBe(330_000);
    expect(r.taxaMarginal).toBe(30.6);
    expect(r.avisos).toContain('despesas-gerais-presumidas');
  });

  it('dependentes descontam € 600 cada, mais € 126 até 3 anos', () => {
    const r = calcular('PT', { brutoAnualCentavos: 3_000_000, dependentes: 2, dependentesAte3Anos: 1 });
    expect(r.impostoCentavos).toBe(445_027 - 132_600);
  });

  it('taxa adicional de solidariedade acima de € 80 000 de coletável', () => {
    const semSolidariedade = impostoPorEscaloes(10_000_000, ESCALOES_IRS_2026);
    const bruto = 10_000_000 + DEDUCAO_ESPECIFICA_2026;
    const r = calcular('PT', { brutoAnualCentavos: bruto, despesasGeraisCentavos: 0 });
    // contribuições (11%) passam a dedução específica, por serem maiores que 8,54 × IAS
    const coletavel = bruto - bruto * 0.11;
    expect(r.impostoCentavos).toBe(
      Math.round(impostoPorEscaloes(coletavel, ESCALOES_IRS_2026) + (coletavel - 8_000_000) * 0.025),
    );
    expect(semSolidariedade).toBeGreaterThan(0);
  });

  it('independentes: 21,4% sobre 70% dos serviços, com mínimo de € 20/mês e teto de 12 × IAS', () => {
    // € 30 000 → base mensal € 1 750 → € 374,50/mês
    expect(contribuicaoIndependente(3_000_000)).toBeCloseTo(37_450 * 12, 6);
    expect(contribuicaoIndependente(100_000)).toBe(2_000 * 12);
    expect(contribuicaoIndependente(50_000_000)).toBeCloseTo(((12 * 53_713 * 21.4) / 100) * 12, 6);
    const r = calcular('PT', { brutoAnualCentavos: 3_000_000, situacao: 'independente' });
    expect(r.contribuicoesCentavos).toBe(449_400);
    expect(r.avisos).not.toContain('contribuicoes-a-confirmar');
  });

  it('Açores e Madeira avisam que ainda usam a tabela nacional', () => {
    expect(calcular('PT', { brutoAnualCentavos: 3_000_000, regiao: 'PT-20' }).avisos).toContain('regiao-usa-tabela-nacional');
  });
});

describe('Malta — income tax 2026 (ano de avaliação 2027)', () => {
  it('solteiro com € 30 000: 25% − € 3 400 = € 4 100; contribuições no teto semanal', () => {
    const r = calcular('MT', { brutoAnualCentavos: 3_000_000 });
    expect(r.impostoCentavos).toBe(410_000);
    expect(r.contribuicoesCentavos).toBe(5_593 * 52);
  });

  it('casados com dois filhos e € 30 000: 15% − € 3 375 = € 1 125', () => {
    expect(calcular('MT', { brutoAnualCentavos: 3_000_000, declaracaoConjunta: true, dependentes: 2 }).impostoCentavos).toBe(112_500);
  });

  it('até € 12 000 o solteiro não paga imposto', () => {
    expect(calcular('MT', { brutoAnualCentavos: 1_200_000 }).impostoCentavos).toBe(0);
  });

  it('as tabelas não dão saltos entre escalões (exceto o ponto a conferir na de pais com 1 filho)', () => {
    for (const [nome, t] of Object.entries(TABELAS_MALTA_2026)) {
      for (const [limite] of t.slice(0, -1)) {
        const salto = impostoMalta(limite + 1, t).imposto - impostoMalta(limite, t).imposto;
        const esperado = nome === 'paisUmFilho' && limite === 6_000_000 ? 500 : 0;
        expect([nome, limite, Math.round(salto)]).toEqual([nome, limite, esperado]);
      }
    }
  });

  it('Class 1: salário baixo paga € 22,94 fixos por semana; no meio, 10%', () => {
    expect(contribuicaoClass1(1_000_000, 'desde1962')).toBe(2_294 * 52);
    // € 20 000/ano = € 384,62/semana → € 38,46
    expect(contribuicaoClass1(2_000_000, 'desde1962')).toBe(3_846 * 52);
    expect(calcular('MT', { brutoAnualCentavos: 2_000_000 }).avisos).not.toContain('contribuicoes-a-confirmar');
  });

  it('Category B: quem escolhe pagar 10% (benefícios pro-rata) paga 10% em vez do fixo', () => {
    // € 10 000/ano = € 192,31/semana → € 19,23 em vez de € 22,94
    expect(contribuicaoClass1(1_000_000, 'desde1962', true)).toBe(1_923 * 52);
    expect(calcular('MT', { brutoAnualCentavos: 1_000_000, contribuicaoProporcional: true }).contribuicoesCentavos).toBe(1_923 * 52);
    // acima da Category B a escolha não muda nada
    expect(contribuicaoClass1(2_000_000, 'desde1962', true)).toBe(contribuicaoClass1(2_000_000, 'desde1962'));
  });

  it('Class 2 (independentes): fixo SA até € 12 543,72, 15% depois e teto por geração', () => {
    expect(contribuicaoClass2(90_000, 'desde1962')).toBe(0);
    expect(contribuicaoClass2(1_000_000, 'desde1962')).toBe(3_618 * 52);
    // € 20 000 líquidos → € 57,69/semana
    expect(contribuicaoClass2(2_000_000, 'desde1962')).toBe(5_769 * 52);
    expect(contribuicaoClass2(4_000_000, 'desde1962')).toBe(8_389 * 52);
    expect(contribuicaoClass2(4_000_000, 'ate1961')).toBe(7_356 * 52);
    // a tabela fecha sem salto: no limite de SA, 15% dá os mesmos € 36,18
    expect(Math.round((1_254_373 * 0.15) / 52)).toBe(3_618);
    const r = calcular('MT', { brutoAnualCentavos: 2_000_000, situacao: 'independente' });
    expect(r.contribuicoesCentavos).toBe(5_769 * 52);
    expect(r.avisos).not.toContain('contribuicoes-a-confirmar');
  });

  it('nascidos até 1961 têm teto de contribuições menor', () => {
    expect(calcular('MT', { brutoAnualCentavos: 5_000_000, anoNascimento: 1960 }).contribuicoesCentavos).toBe(4_904 * 52);
  });
});

describe('Itália — IRPEF 2026', () => {
  it('escalões 23% / 33% / 43%', () => {
    expect(impostoPorEscaloes(5_000_000, ESCALOES_IRPEF_2026)).toBe(2_800_000 * 0.23 + 2_200_000 * 0.33);
  });

  it('€ 30 000 brutos: INPS 9,19%, detrações do trabalho e ulteriore detrazione', () => {
    // rendimento 27 243 → bruto 6 265,89 − (1 910 + 1 190 × 0,0582 + 65 + 1 000) = 3 221,63
    const r = calcular('IT', { brutoAnualCentavos: 3_000_000 });
    expect(r.contribuicoesCentavos).toBe(275_700);
    expect(r.impostoCentavos).toBe(322_163);
    expect(r.bonusCentavos).toBe(0);
  });

  it('€ 16 000 brutos: detração cheia e "somma esente" de 5,3%', () => {
    const r = calcular('IT', { brutoAnualCentavos: 1_600_000 });
    expect(r.impostoCentavos).toBe(138_681);
    expect(r.bonusCentavos).toBe(77_007);
  });

  it('rendimentos baixos não pagam IRPEF e recebem 7,1%', () => {
    const r = calcular('IT', { brutoAnualCentavos: 800_000 });
    expect(r.impostoCentavos).toBe(0);
    expect(r.bonusCentavos).toBe(51_580);
  });

  it('INPS: mais 1% sobre o que passar de € 56 224 (Circolare 6/2026)', () => {
    expect(contribuicaoInps(5_622_400)).toBeCloseTo(5_622_400 * 0.0919, 6);
    expect(contribuicaoInps(7_000_000)).toBeCloseTo(7_000_000 * 0.0919 + 1_377_600 * 0.01, 6);
    expect(calcular('IT', { brutoAnualCentavos: 3_000_000 }).avisos).toContain('contribuicoes-variam-setor');
  });

  it('detração do trabalho: € 1 955 até € 15 000 e zero acima de € 50 000', () => {
    expect(detracaoTrabalho(1_500_000)).toBe(195_500);
    expect(detracaoTrabalho(5_000_001)).toBe(0);
    expect(sommaEsente(2_000_001, 2_000_001)).toBe(0);
  });

  it('independentes ainda não têm regras', () => {
    expect(calcularImpostosDaRenda('IT', { ...base, situacao: 'independente', brutoAnualCentavos: 3_000_000 })).toEqual({
      semRegras: 'situacao',
    });
  });
});

describe('residência fiscal', () => {
  it('o mesmo salário paga impostos diferentes conforme o país de residência', () => {
    const pt = calcular('PT', { brutoAnualCentavos: 3_000_000 });
    const mt = calcular('MT', { brutoAnualCentavos: 3_000_000 });
    const it_ = calcular('IT', { brutoAnualCentavos: 3_000_000 });
    expect(new Set([pt.impostoCentavos, mt.impostoCentavos, it_.impostoCentavos]).size).toBe(3);
  });

  it('país sem regras e ano sem tabela são avisados, não inventados', () => {
    expect(calcularImpostosDaRenda('DE', { ...base, brutoAnualCentavos: 3_000_000 })).toEqual({ semRegras: 'pais' });
    expect(calcularImpostosDaRenda('PT', { ...base, ano: 2025, brutoAnualCentavos: 3_000_000 })).toEqual({ semRegras: 'ano' });
  });
});
