/**
 * Impostos especiais sobre combustíveis rodoviários (por 1000 litros) e preço médio de venda com impostos.
 * Fonte: Comissão Europeia, Weekly Oil Bulletin (energy.ec.europa.eu) — "Duties and taxes" e
 * "Weekly prices with taxes" de 9/11/2026, consultados em 13/11/2026. Cópia em fontes/oil-bulletin/.
 *
 * Como o app só sabe quanto a pessoa gastou (não quantos litros), o imposto especial é estimado como a parte
 * que ele representa no preço médio de venda: (imposto especial + outros impostos indiretos) / preço.
 * Em Portugal, "outros" são os outros impostos indiretos que o Oil Bulletin lista à parte do ISP.
 * Os valores mudam com frequência (Portugal ajusta o ISP quase todas as semanas): atualizar com o boletim.
 */

import type { CodigoPais } from '@/data/paises/tipos';

export type TipoCombustivel = 'gasolina' | 'gasoleo';

export type ImpostoCombustivel = {
  impostoEspecialPor1000L: number;
  impostoEspecialDesde: string;
  outrosPor1000L: number;
  precoComImpostosPor1000L: number;
};

export const DATA_PRECOS_COMBUSTIVEL = '2026-11-09';

export const COMBUSTIVEL: Partial<Record<CodigoPais, Record<TipoCombustivel, ImpostoCombustivel>>> = {
  PT: {
    gasolina: { impostoEspecialPor1000L: 458.38, impostoEspecialDesde: '2026-11-09', outrosPor1000L: 153.1, precoComImpostosPor1000L: 1922 },
    gasoleo: { impostoEspecialPor1000L: 269.59, impostoEspecialDesde: '2026-11-09', outrosPor1000L: 166.79, precoComImpostosPor1000L: 2135 },
  },
  MT: {
    gasolina: { impostoEspecialPor1000L: 549.38, impostoEspecialDesde: '2016-01-01', outrosPor1000L: 0, precoComImpostosPor1000L: 1340 },
    gasoleo: { impostoEspecialPor1000L: 472.4, impostoEspecialDesde: '2016-01-01', outrosPor1000L: 0, precoComImpostosPor1000L: 1210 },
  },
  IT: {
    gasolina: { impostoEspecialPor1000L: 672.9, impostoEspecialDesde: '2026-10-28', outrosPor1000L: 0, precoComImpostosPor1000L: 1995.43 },
    gasoleo: { impostoEspecialPor1000L: 622.9, impostoEspecialDesde: '2026-10-28', outrosPor1000L: 0, precoComImpostosPor1000L: 2218.39 },
  },
};

/** Parte do preço de venda que é imposto especial (+ outros indiretos), em %. null sem dados. */
export function percentualEspecialCombustivel(pais: CodigoPais, tipo: TipoCombustivel): number | null {
  const c = COMBUSTIVEL[pais]?.[tipo];
  if (!c) return null;
  return ((c.impostoEspecialPor1000L + c.outrosPor1000L) / c.precoComImpostosPor1000L) * 100;
}
