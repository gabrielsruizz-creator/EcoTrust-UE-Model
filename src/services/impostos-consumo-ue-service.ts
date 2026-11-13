/**
 * Impostos sobre o consumo de uma compra na UE: IVA + impostos especiais (quando dá para estimar).
 * Tudo pelo país onde a compra aconteceu (país de consumo).
 *
 * - IVA: taxa do tipo de consumo (iva-service).
 * - Combustível: imposto especial como parte do preço médio de venda (Weekly Oil Bulletin).
 *   O IVA incide sobre o preço já com o imposto especial, então as duas partes do preço somam-se.
 * - Álcool e tabaco: o imposto especial é fixo por unidade (por maço, por litro de álcool), e o app só sabe o
 *   valor gasto. Não estimamos para não inventar um preço médio: fica o aviso. Entram quando houver a
 *   quantidade comprada (leitura do recibo).
 */

import type { PerfilTributarioId } from '@/data/perfis-consumo';
import { percentualEspecialCombustivel, type TipoCombustivel } from '@/data/paises/combustivel';
import { estimarTaxaDoPerfil, ivaContidoNoPreco, type LocalCompra } from '@/services/iva-service';

export type AvisoConsumo = 'especial-alcool-tabaco-nao-incluido' | 'pais-sem-regras' | 'regra-a-confirmar';

export type ImpostosDaCompra = {
  ivaCentavos: number;
  especiaisCentavos: number;
  totalCentavos: number;
  /** Parte do valor pago que é imposto, em % */
  percentual: number;
  taxaIva: number;
  avisos: AvisoConsumo[];
};

export type OpcoesCompra = { combustivel?: TipoCombustivel };

/** Impostos contidos numa compra (centavos fracionados, sem arredondar: quem soma arredonda no fim). */
export function estimarImpostosDaCompra(
  valorCentavos: number,
  local: LocalCompra,
  perfil: PerfilTributarioId,
  data: string,
  opcoes: OpcoesCompra = {},
): ImpostosDaCompra | null {
  const iva = estimarTaxaDoPerfil(local, perfil, data);
  if (!iva) return null;
  const avisos: AvisoConsumo[] = [];
  const ivaCentavos = ivaContidoNoPreco(valorCentavos, iva.percentual);

  let especiaisCentavos = 0;
  if (perfil === 'combustivel') {
    const pct = percentualEspecialCombustivel(local.pais, opcoes.combustivel ?? 'gasolina');
    if (pct === null) avisos.push('regra-a-confirmar');
    else especiaisCentavos = (valorCentavos * pct) / 100;
  } else if (perfil === 'bebidas') {
    avisos.push('especial-alcool-tabaco-nao-incluido');
  } else if (iva.aConfirmar) {
    avisos.push('regra-a-confirmar');
  }

  const totalCentavos = ivaCentavos + especiaisCentavos;
  return {
    ivaCentavos,
    especiaisCentavos,
    totalCentavos,
    percentual: valorCentavos > 0 ? (totalCentavos / valorCentavos) * 100 : 0,
    taxaIva: iva.percentual,
    avisos,
  };
}
