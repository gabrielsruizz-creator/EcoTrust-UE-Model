/**
 * IVA europeu: taxa em vigor numa data, imposto contido no preço e estimativa por tipo de consumo.
 *
 * O preço pago ao consumidor já inclui o IVA, então o imposto é preço × taxa / (100 + taxa)
 * (€ 123 com IVA de 23% = € 23 de imposto). Os valores ficam em centavos "quebrados" e só são
 * arredondados no fim, como no Impostômetro.
 *
 * A taxa aplicável é a do país onde a compra aconteceu (país de consumo), não a do país de residência.
 */

import type { PerfilTributarioId } from '@/data/perfis-consumo';
import { paisFiscal, type CodigoPais, type PaisFiscal, type TabelaTaxas, type TipoTaxaIva, type Vigencia } from '@/data/paises';

export type LocalCompra = {
  pais: CodigoPais;
  /** Região com IVA próprio (ISO 3166-2, ex.: 'PT-20' Açores). null = resto do país */
  regiao?: string | null;
};

function vigenciaEm(vigencias: Vigencia[] | undefined, data: string): Vigencia | null {
  return (
    vigencias?.find((v) => (v.desde === null || v.desde <= data) && (v.ate === undefined || data <= v.ate)) ?? null
  );
}

function tabelaDoLocal(pais: PaisFiscal, regiao: string | null | undefined): TabelaTaxas {
  return (regiao && pais.regioes.find((r) => r.id === regiao)?.taxas) || pais.taxas;
}

/** Percentual de um tipo de taxa num local e numa data (AAAA-MM-DD). null se o país não usa esse tipo. */
export function taxaIvaEm(local: LocalCompra, tipo: TipoTaxaIva, data: string): number | null {
  if (tipo === 'zero' || tipo === 'isento') return 0;
  const pais = paisFiscal(local.pais);
  if (!pais) return null;
  return vigenciaEm(tabelaDoLocal(pais, local.regiao)[tipo], data)?.percentual ?? null;
}

/** IVA contido num preço com imposto (centavos fracionados, sem arredondar). */
export function ivaContidoNoPreco(precoCentavos: number, percentual: number): number {
  if (percentual <= 0) return 0;
  return (precoCentavos * percentual) / (100 + percentual);
}

export type EstimativaIva = {
  tipo: TipoTaxaIva;
  percentual: number;
  /** Menor e maior taxa que produtos desta categoria podem pagar no país */
  faixa: { minimo: number; maximo: number } | null;
  base: string;
  aConfirmar: string | null;
};

/** Taxa de IVA estimada para um tipo de consumo num local e data. null se o país ainda não tem regras. */
export function estimarTaxaDoPerfil(
  local: LocalCompra,
  perfil: PerfilTributarioId,
  data: string,
): EstimativaIva | null {
  const pais = paisFiscal(local.pais);
  const regra = pais?.perfis[perfil];
  if (!regra) return null;
  const percentual = taxaIvaEm(local, regra.tipo, data);
  if (percentual === null) return null;
  const minimo = regra.faixa ? taxaIvaEm(local, regra.faixa[0], data) : null;
  const maximo = regra.faixa ? taxaIvaEm(local, regra.faixa[1], data) : null;
  return {
    tipo: regra.tipo,
    percentual,
    faixa: minimo !== null && maximo !== null ? { minimo, maximo } : null,
    base: regra.base,
    aConfirmar: regra.aConfirmar ?? null,
  };
}
