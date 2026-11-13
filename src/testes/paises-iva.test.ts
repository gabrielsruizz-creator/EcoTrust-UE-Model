import { describe, expect, it } from '@jest/globals';

import tedb from '../../fontes/tedb/iva-PT-MT-IT.json';
import { PAISES_FISCAIS, PAISES_UE, type CodigoPais } from '@/data/paises';
import { estimarTaxaDoPerfil, ivaContidoNoPreco, taxaIvaEm } from '@/services/iva-service';

/** Data da cópia da TEDB guardada em fontes/tedb */
const DATA_TEDB = tedb.situacaoEm;

type RegistroTedb = (typeof tedb.registros)[number];

function registrosDoPais(pais: string): RegistroTedb[] {
  return tedb.registros.filter((r) => r.pais === pais);
}

describe('os 27 países da UE', () => {
  it('tem 27 países, sem repetir', () => {
    expect(new Set(PAISES_UE.map((p) => p.codigo)).size).toBe(27);
  });

  it('21 usam o euro em 2026 (com a Bulgária) e 6 têm moeda própria', () => {
    expect(PAISES_UE.filter((p) => p.moeda === 'EUR')).toHaveLength(21);
    expect(PAISES_UE.find((p) => p.codigo === 'BG')?.moeda).toBe('EUR');
    const outras = Object.fromEntries(PAISES_UE.filter((p) => p.moeda !== 'EUR').map((p) => [p.codigo, p.moeda]));
    expect(outras).toEqual({ CZ: 'CZK', DK: 'DKK', HU: 'HUF', PL: 'PLN', RO: 'RON', SE: 'SEK' });
  });
});

describe('taxas conferem com a TEDB (Comissão Europeia)', () => {
  const paises = Object.keys(PAISES_FISCAIS) as CodigoPais[];

  it.each(paises)('%s: taxa normal igual à da TEDB', (codigo) => {
    const normal = registrosDoPais(codigo).find((r) => r.tipo === 'STANDARD');
    expect(taxaIvaEm({ pais: codigo }, 'normal', DATA_TEDB)).toBe(normal?.percentual);
  });

  it.each(paises)('%s: toda taxa nacional em vigor existe na TEDB', (codigo) => {
    const daTedb = new Set(registrosDoPais(codigo).filter((r) => r.categoria !== 'REGION').map((r) => r.percentual));
    const pais = PAISES_FISCAIS[codigo]!;
    for (const tipo of Object.keys(pais.taxas) as (keyof typeof pais.taxas)[]) {
      const percentual = taxaIvaEm({ pais: codigo }, tipo, DATA_TEDB);
      expect([tipo, percentual !== null && daTedb.has(percentual)]).toEqual([tipo, true]);
    }
  });

  it('Açores e Madeira: taxa normal regional igual à da TEDB', () => {
    const regioes = registrosDoPais('PT').filter((r) => r.categoria === 'REGION');
    const daTedb = (nome: string) => regioes.find((r) => r.comentario?.includes(nome))?.percentual;
    expect(taxaIvaEm({ pais: 'PT', regiao: 'PT-20' }, 'normal', DATA_TEDB)).toBe(daTedb('Azores'));
    expect(taxaIvaEm({ pais: 'PT', regiao: 'PT-30' }, 'normal', DATA_TEDB)).toBe(daTedb('Madeira'));
  });
});

describe('taxas por região e por data', () => {
  it('Portugal continental, Açores e Madeira', () => {
    expect(taxaIvaEm({ pais: 'PT' }, 'reduzida2', '2026-05-01')).toBe(6);
    expect(taxaIvaEm({ pais: 'PT', regiao: 'PT-20' }, 'reduzida1', '2026-05-01')).toBe(9);
    expect(taxaIvaEm({ pais: 'PT', regiao: 'PT-30' }, 'reduzida1', '2026-05-01')).toBe(12);
  });

  it('Madeira: reduzida de 5% até 30/9/2024 e de 4% a partir de 1/10/2024', () => {
    expect(taxaIvaEm({ pais: 'PT', regiao: 'PT-30' }, 'reduzida2', '2024-09-30')).toBe(5);
    expect(taxaIvaEm({ pais: 'PT', regiao: 'PT-30' }, 'reduzida2', '2024-10-01')).toBe(4);
  });

  it('Açores: taxas atuais só desde 1/7/2021 (antes disso não registramos)', () => {
    expect(taxaIvaEm({ pais: 'PT', regiao: 'PT-20' }, 'normal', '2021-07-01')).toBe(16);
    expect(taxaIvaEm({ pais: 'PT', regiao: 'PT-20' }, 'normal', '2021-06-30')).toBeNull();
  });

  it('tipo que o país não usa e país ainda sem regras dão null', () => {
    expect(taxaIvaEm({ pais: 'PT' }, 'superReduzida', '2026-05-01')).toBeNull();
    expect(taxaIvaEm({ pais: 'DE' }, 'normal', '2026-05-01')).toBeNull();
  });
});

describe('IVA contido no preço', () => {
  it('€ 123 com 23% têm € 23 de IVA', () => {
    expect(Math.round(ivaContidoNoPreco(12_300, 23))).toBe(2_300);
  });

  it('€ 11 com 10% têm € 1 de IVA; isento não tem IVA', () => {
    expect(Math.round(ivaContidoNoPreco(1_100, 10))).toBe(100);
    expect(ivaContidoNoPreco(5_000, 0)).toBe(0);
  });
});

describe('estimativa por tipo de consumo', () => {
  it('restaurante: 13% em Portugal, 12% na Madeira, 10% em Itália, 18% em Malta', () => {
    expect(estimarTaxaDoPerfil({ pais: 'PT' }, 'restaurante', '2026-05-01')?.percentual).toBe(13);
    expect(estimarTaxaDoPerfil({ pais: 'PT', regiao: 'PT-30' }, 'restaurante', '2026-05-01')?.percentual).toBe(12);
    expect(estimarTaxaDoPerfil({ pais: 'IT' }, 'restaurante', '2026-05-01')?.percentual).toBe(10);
    expect(estimarTaxaDoPerfil({ pais: 'MT' }, 'restaurante', '2026-05-01')?.percentual).toBe(18);
  });

  it('supermercado mostra a faixa de taxas possíveis', () => {
    expect(estimarTaxaDoPerfil({ pais: 'PT' }, 'supermercado', '2026-05-01')?.faixa).toEqual({ minimo: 6, maximo: 23 });
    expect(estimarTaxaDoPerfil({ pais: 'IT' }, 'supermercado', '2026-05-01')?.faixa).toEqual({ minimo: 4, maximo: 22 });
    expect(estimarTaxaDoPerfil({ pais: 'MT' }, 'supermercado', '2026-05-01')?.faixa).toEqual({ minimo: 0, maximo: 18 });
  });

  it('renda de casa é isenta nos três países', () => {
    for (const pais of ['PT', 'MT', 'IT'] as const) {
      expect(estimarTaxaDoPerfil({ pais }, 'moradia', '2026-05-01')?.percentual).toBe(0);
    }
  });

  it('todo tipo de consumo tem uma taxa válida em todos os países com regras', () => {
    for (const [codigo, pais] of Object.entries(PAISES_FISCAIS)) {
      for (const perfil of Object.keys(pais!.perfis) as (keyof typeof pais.perfis)[]) {
        const estimativa = estimarTaxaDoPerfil({ pais: codigo as CodigoPais }, perfil, DATA_TEDB);
        expect([codigo, perfil, estimativa !== null]).toEqual([codigo, perfil, true]);
        if (pais!.perfis[perfil].faixa) expect([codigo, perfil, estimativa?.faixa !== null]).toEqual([codigo, perfil, true]);
      }
    }
  });

  it('país de consumo, não de residência: o mesmo jantar paga a taxa de onde foi comido', () => {
    const lisboa = estimarTaxaDoPerfil({ pais: 'PT' }, 'restaurante', '2026-05-01')!;
    const roma = estimarTaxaDoPerfil({ pais: 'IT' }, 'restaurante', '2026-05-01')!;
    expect(Math.round(ivaContidoNoPreco(5_000, lisboa.percentual))).toBe(575);
    expect(Math.round(ivaContidoNoPreco(5_000, roma.percentual))).toBe(455);
  });
});
