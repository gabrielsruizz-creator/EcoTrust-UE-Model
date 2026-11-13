import { afterAll, describe, expect, it } from '@jest/globals';

import { definirIdioma } from '@/i18n';
import { diasDaSemana, formatarData, lerDataDigitada, montarGradeDoMes, tempoRelativo } from '@/utils/datas';
import { centavosParaTexto, formatarCentavos, lerValorEmCentavos, separadorDecimal, simboloMoeda } from '@/utils/moeda';

/** O Intl usa espaços especiais (não separáveis); para comparar, viram espaço normal. */
const normal = (s: string) => s.replace(/[  ]/g, ' ');

afterAll(() => definirIdioma('en'));

describe('dinheiro no formato de cada idioma', () => {
  it.each([
    ['pt-PT', '1234,56 €'],
    ['en', '€1,234.56'],
    ['de', '1.234,56 €'],
    ['fr', '1 234,56 €'],
    ['nl', '€ 1.234,56'],
  ] as const)('%s → %s', (idioma, esperado) => {
    definirIdioma(idioma);
    expect(normal(formatarCentavos(123_456))).toBe(esperado);
  });

  it('moedas fora do euro', () => {
    definirIdioma('pl');
    expect(normal(formatarCentavos(123_456, 'PLN'))).toBe('1234,56 zł');
    expect(simboloMoeda('PLN')).toBe('zł');
  });

  it('separador decimal e texto do campo seguem o idioma', () => {
    definirIdioma('en');
    expect(separadorDecimal()).toBe('.');
    expect(centavosParaTexto(4_290)).toBe('42.90');
    definirIdioma('it');
    expect(separadorDecimal()).toBe(',');
    expect(centavosParaTexto(4_290)).toBe('42,90');
    expect(centavosParaTexto(450_000)).toBe('4500');
  });
});

describe('leitura do valor digitado (qualquer formato europeu ou inglês)', () => {
  it.each([
    ['1.234,56', 123_456],
    ['1 234,56', 123_456],
    ['1,234.56', 123_456],
    ['12,5', 1_250],
    ['12.50', 1_250],
    ['4.500', 450_000],
    ['1,234', 123_400],
    ['42', 4_200],
    ['€ 42,90', 4_290],
    ['42,90 €', 4_290],
    ['1.234.567', 123_456_700],
  ])('"%s" → %i', (texto, centavos) => {
    expect(lerValorEmCentavos(texto)).toBe(centavos);
  });

  it.each(['', 'abc', '0', '-5', '1.2345', '1.23.4', '12,345,6'])('"%s" é inválido', (texto) => {
    expect(lerValorEmCentavos(texto)).toBeNull();
  });

  it('zero só quando permitido', () => {
    expect(lerValorEmCentavos('0', true)).toBe(0);
  });
});

describe('datas', () => {
  it.each([
    ['pt-PT', '06/10/2026'],
    ['de', '06.10.2026'],
    ['nl', '06-10-2026'],
    ['pl', '06.10.2026'],
  ] as const)('%s → %s', (idioma, esperado) => {
    definirIdioma(idioma);
    expect(formatarData('2026-10-06')).toBe(esperado);
  });

  it('lê datas digitadas com /, . ou -', () => {
    expect(lerDataDigitada('06/10/2026')).toBe('2026-10-06');
    expect(lerDataDigitada('06.10.2026')).toBe('2026-10-06');
    expect(lerDataDigitada('06-10-2026')).toBe('2026-10-06');
    expect(lerDataDigitada('31.02.2026')).toBeNull();
  });

  it('a semana começa à segunda-feira', () => {
    // 1/10/2026 é uma quinta-feira: 3 células vazias antes (seg, ter, qua)
    expect(montarGradeDoMes('2026-10')[0]).toEqual([null, null, null, '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04']);
    definirIdioma('de');
    expect(diasDaSemana().map((d) => d.curto)).toEqual(['M', 'D', 'M', 'D', 'F', 'S', 'S']);
    expect(diasDaSemana()[0].nome).toBe('Montag');
  });

  it('tempo relativo traduzido', () => {
    const agora = new Date(2026, 10, 13, 12, 0);
    definirIdioma('fr');
    expect(tempoRelativo(new Date(2026, 10, 13, 11, 55).toISOString(), agora)).toBe('il y a 5 min');
    definirIdioma('pl');
    expect(tempoRelativo(new Date(2026, 10, 10, 12, 0).toISOString(), agora)).toBe('3 dni temu');
    definirIdioma('pt-PT');
    expect(tempoRelativo(new Date(2026, 10, 12, 12, 0).toISOString(), agora)).toBe('ontem');
  });
});
