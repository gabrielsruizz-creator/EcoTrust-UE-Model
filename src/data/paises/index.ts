/**
 * Regras fiscais por país. Cada país entra só depois de conferido com as fontes oficiais.
 * Ordem combinada com o utilizador: Portugal, Malta e Itália primeiro; depois os restantes.
 */

import { ITALIA } from '@/data/paises/it';
import { MALTA } from '@/data/paises/mt';
import { PORTUGAL } from '@/data/paises/pt';
import type { CodigoPais, PaisFiscal } from '@/data/paises/tipos';

export const PAISES_FISCAIS: Partial<Record<CodigoPais, PaisFiscal>> = {
  PT: PORTUGAL,
  MT: MALTA,
  IT: ITALIA,
};

export function paisFiscal(codigo: CodigoPais): PaisFiscal | null {
  return PAISES_FISCAIS[codigo] ?? null;
}

export * from '@/data/paises/tipos';
export { PAISES_UE, paisUE } from '@/data/paises/ue';
