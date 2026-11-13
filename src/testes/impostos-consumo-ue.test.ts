import { describe, expect, it } from '@jest/globals';

import boletim from '../../fontes/oil-bulletin/2026-11-09-PT-MT-IT.json';
import { COMBUSTIVEL, DATA_PRECOS_COMBUSTIVEL, percentualEspecialCombustivel } from '@/data/paises/combustivel';
import type { CodigoPais } from '@/data/paises';
import { estimarImpostosDaCompra } from '@/services/impostos-consumo-ue-service';

describe('combustível confere com o Weekly Oil Bulletin', () => {
  it('mesma data de preços da cópia guardada', () => {
    expect(DATA_PRECOS_COMBUSTIVEL).toBe(boletim.precosEm);
  });

  it.each(['PT', 'MT', 'IT'] as const)('%s: imposto especial, outros e preço iguais ao boletim', (pais) => {
    for (const tipo of ['gasolina', 'gasoleo'] as const) {
      const fonte = boletim.paises[pais][tipo];
      expect(COMBUSTIVEL[pais as CodigoPais]?.[tipo]).toEqual({
        impostoEspecialPor1000L: fonte.impostoEspecialPor1000L,
        impostoEspecialDesde: fonte.impostoEspecialDesde,
        outrosPor1000L: fonte.outrosPor1000L,
        precoComImpostosPor1000L: fonte.precoComImpostosPor1000L,
      });
    }
  });

  it('parte do preço da gasolina que é imposto especial', () => {
    expect(percentualEspecialCombustivel('PT', 'gasolina')).toBeCloseTo(31.81, 2);
    expect(percentualEspecialCombustivel('MT', 'gasolina')).toBeCloseTo(41.0, 2);
    expect(percentualEspecialCombustivel('IT', 'gasolina')).toBeCloseTo(33.72, 2);
    expect(percentualEspecialCombustivel('DE', 'gasolina')).toBeNull();
  });
});

describe('impostos de uma compra', () => {
  it('€ 50 de gasolina em Portugal: IVA 23% + ISP e outros', () => {
    const r = estimarImpostosDaCompra(5_000, { pais: 'PT' }, 'combustivel', '2026-11-10')!;
    expect(Math.round(r.ivaCentavos)).toBe(935);
    expect(Math.round(r.especiaisCentavos)).toBe(1_591);
    expect(r.percentual).toBeCloseTo(50.5, 0);
    expect(r.avisos).toEqual([]);
  });

  it('o mesmo abastecimento paga mais imposto em Malta e menos de IVA', () => {
    const pt = estimarImpostosDaCompra(5_000, { pais: 'PT' }, 'combustivel', '2026-11-10')!;
    const mt = estimarImpostosDaCompra(5_000, { pais: 'MT' }, 'combustivel', '2026-11-10')!;
    expect(mt.taxaIva).toBe(18);
    expect(mt.ivaCentavos).toBeLessThan(pt.ivaCentavos);
    expect(mt.especiaisCentavos).toBeGreaterThan(pt.especiaisCentavos);
  });

  it('gasóleo usa a sua própria parte do preço', () => {
    const r = estimarImpostosDaCompra(10_000, { pais: 'IT' }, 'combustivel', '2026-11-10', { combustivel: 'gasoleo' })!;
    expect(Math.round(r.especiaisCentavos)).toBe(Math.round((10_000 * 622.9) / 2218.39));
  });

  it('álcool e tabaco: só o IVA, com aviso de imposto especial não incluído', () => {
    const r = estimarImpostosDaCompra(2_000, { pais: 'IT' }, 'bebidas', '2026-11-10')!;
    expect(r.especiaisCentavos).toBe(0);
    expect(r.avisos).toContain('especial-alcool-tabaco-nao-incluido');
  });

  it('restaurante: só IVA, sem avisos', () => {
    const r = estimarImpostosDaCompra(5_000, { pais: 'PT' }, 'restaurante', '2026-11-10')!;
    expect(Math.round(r.totalCentavos)).toBe(575);
    expect(r.avisos).toEqual([]);
  });

  it('país ainda sem regras: null, nada inventado', () => {
    expect(estimarImpostosDaCompra(5_000, { pais: 'FR' }, 'restaurante', '2026-11-10')).toBeNull();
  });
});
