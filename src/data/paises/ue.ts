/**
 * Os 27 países da União Europeia e a moeda de cada um.
 * Zona do euro em 2026: 21 países. A Bulgária adotou o euro em 1/1/2026 e a Croácia em 1/1/2023.
 * Fora do euro: Chéquia (CZK), Dinamarca (DKK), Hungria (HUF), Polónia (PLN), Roménia (RON) e Suécia (SEK).
 * Conferir de novo na data de lançamento: https://european-union.europa.eu/institutions-law-budget/euro/countries-using-euro_en
 */

import type { CodigoMoeda, CodigoPais } from '@/data/paises/tipos';

export type PaisUE = {
  codigo: CodigoPais;
  moeda: CodigoMoeda;
  /** Quando passou a usar o euro, se foi recente (para converter lançamentos antigos corretamente) */
  euroDesde?: string;
  /** Código na TEDB e no IVA europeu, quando é diferente do ISO */
  codigoIva?: string;
};

export const PAISES_UE: PaisUE[] = [
  { codigo: 'AT', moeda: 'EUR' },
  { codigo: 'BE', moeda: 'EUR' },
  { codigo: 'BG', moeda: 'EUR', euroDesde: '2026-01-01' },
  { codigo: 'CY', moeda: 'EUR' },
  { codigo: 'CZ', moeda: 'CZK' },
  { codigo: 'DE', moeda: 'EUR' },
  { codigo: 'DK', moeda: 'DKK' },
  { codigo: 'EE', moeda: 'EUR' },
  { codigo: 'ES', moeda: 'EUR' },
  { codigo: 'FI', moeda: 'EUR' },
  { codigo: 'FR', moeda: 'EUR' },
  { codigo: 'GR', moeda: 'EUR', codigoIva: 'EL' },
  { codigo: 'HR', moeda: 'EUR', euroDesde: '2023-01-01' },
  { codigo: 'HU', moeda: 'HUF' },
  { codigo: 'IE', moeda: 'EUR' },
  { codigo: 'IT', moeda: 'EUR' },
  { codigo: 'LT', moeda: 'EUR' },
  { codigo: 'LU', moeda: 'EUR' },
  { codigo: 'LV', moeda: 'EUR' },
  { codigo: 'MT', moeda: 'EUR' },
  { codigo: 'NL', moeda: 'EUR' },
  { codigo: 'PL', moeda: 'PLN' },
  { codigo: 'PT', moeda: 'EUR' },
  { codigo: 'RO', moeda: 'RON' },
  { codigo: 'SE', moeda: 'SEK' },
  { codigo: 'SI', moeda: 'EUR' },
  { codigo: 'SK', moeda: 'EUR' },
];

export function paisUE(codigo: string): PaisUE | null {
  return PAISES_UE.find((p) => p.codigo === codigo) ?? null;
}
