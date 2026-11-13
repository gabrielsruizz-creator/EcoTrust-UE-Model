import type { PerfilTributarioId } from '@/data/perfis-consumo';

/** Países da UE (ISO 3166-1). A Grécia é GR aqui; na TEDB e no IVA europeu ela aparece como EL. */
export type CodigoPais =
  | 'AT' | 'BE' | 'BG' | 'CY' | 'CZ' | 'DE' | 'DK' | 'EE' | 'ES' | 'FI' | 'FR' | 'GR' | 'HR' | 'HU'
  | 'IE' | 'IT' | 'LT' | 'LU' | 'LV' | 'MT' | 'NL' | 'PL' | 'PT' | 'RO' | 'SE' | 'SI' | 'SK';

export type CodigoMoeda = 'EUR' | 'CZK' | 'DKK' | 'HUF' | 'PLN' | 'RON' | 'SEK';

/**
 * Tipos de taxa de IVA, do mais alto ao mais baixo. Cada país usa só alguns:
 * - reduzida1 / reduzida2: até duas taxas reduzidas de no mínimo 5% (art. 98(1) da Diretiva IVA);
 * - superReduzida: abaixo de 5%; parking: taxa "de estacionamento" de no mínimo 12%;
 * - zero: isenção com direito a dedução (0%); isento: fora do IVA para o consumidor (0%), ex.: rendas.
 */
export type TipoTaxaIva = 'normal' | 'parking' | 'reduzida1' | 'reduzida2' | 'superReduzida' | 'zero' | 'isento';

/** Um valor de taxa e o período em que vale. `desde: null` = já valia antes do período que conferimos. */
export type Vigencia = { percentual: number; desde: string | null; ate?: string };

export type TabelaTaxas = Partial<Record<Exclude<TipoTaxaIva, 'zero' | 'isento'>, Vigencia[]>>;

export type Fonte = { titulo: string; url: string; consultadoEm: string };

/** Região com taxas próprias (ex.: Açores e Madeira). Código ISO 3166-2. */
export type RegiaoFiscal = {
  id: string;
  taxas: TabelaTaxas;
  fontes: Fonte[];
};

/**
 * Como estimar o IVA de um tipo de consumo (categoria do app) num país.
 * `tipo` é a taxa do que é mais típico na categoria; `faixa` mostra que alguns produtos da mesma
 * categoria pagam outra taxa (ex.: no supermercado, pão a 6% e detergente a 23%).
 * `base` diz de onde veio a regra (categoria da TEDB ou artigo da lei).
 */
export type RegraPerfil = {
  tipo: TipoTaxaIva;
  faixa?: [TipoTaxaIva, TipoTaxaIva];
  base: string;
  /** Ponto que ainda precisa de confirmação na legislação nacional */
  aConfirmar?: string;
};

export type PaisFiscal = {
  codigo: CodigoPais;
  taxas: TabelaTaxas;
  /** Regiões com taxas diferentes das do resto do país (vazio para a maioria) */
  regioes: RegiaoFiscal[];
  perfis: Record<PerfilTributarioId, RegraPerfil>;
  fontes: Fonte[];
};
