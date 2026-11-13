/**
 * Perfil fiscal (edição europeia): residência fiscal, região, situação profissional e rendimento anual.
 * Também define onde aconteceu cada compra — o país de consumo é guardado em cada lançamento, separado da
 * residência (uma pessoa que vive em Portugal e janta em Roma paga o IVA italiano nesse jantar).
 */

import { paisUE } from '@/data/paises';
import { buscarPerfilFiscal, gravarPerfilFiscal } from '@/repositories/perfil-fiscal-repository';
import { definirPaisDaCompra } from '@/repositories/transacoes-repository';
import { t } from '@/i18n';
import { ErroValidacao } from '@/services/erros';
import type { OrigemPais, PerfilFiscal } from '@/types/financas';

/** Regiões com IVA (ou IRS) próprio, por país. As outras regiões usam as regras do país. */
export const REGIOES_FISCAIS: Record<string, string[]> = {
  PT: ['PT-20', 'PT-30'],
};

const MAX_DEPENDENTES = 20;
/** € 10 milhões por ano: protege contra valores digitados por engano */
const MAX_BRUTO_ANUAL = 1_000_000_000;

export function obterPerfilFiscal(): PerfilFiscal | null {
  return buscarPerfilFiscal();
}

export function regiaoValida(pais: string, regiao: string | null) {
  return regiao === null || (REGIOES_FISCAIS[pais] ?? []).includes(regiao);
}

export function validarPerfilFiscal(p: PerfilFiscal): PerfilFiscal {
  if (!paisUE(p.paisResidencia)) throw new ErroValidacao(t('fiscal.erro.pais'));
  if (!regiaoValida(p.paisResidencia, p.regiaoResidencia)) throw new ErroValidacao(t('fiscal.erro.regiao'));
  if (p.situacao !== 'dependente' && p.situacao !== 'independente') throw new ErroValidacao(t('fiscal.erro.situacao'));
  if (
    p.brutoAnualCentavos !== null &&
    (!Number.isInteger(p.brutoAnualCentavos) || p.brutoAnualCentavos < 0 || p.brutoAnualCentavos > MAX_BRUTO_ANUAL)
  ) {
    throw new ErroValidacao(t('fiscal.erro.rendimento'));
  }
  for (const n of [p.dependentes, p.dependentesAte3Anos]) {
    if (!Number.isInteger(n) || n < 0 || n > MAX_DEPENDENTES) throw new ErroValidacao(t('fiscal.erro.dependentes'));
  }
  if (p.dependentesAte3Anos > p.dependentes) throw new ErroValidacao(t('fiscal.erro.dependentes'));
  if (p.combustivel !== 'gasolina' && p.combustivel !== 'gasoleo') throw new ErroValidacao(t('fiscal.erro.combustivel'));
  return p;
}

export function salvarPerfilFiscal(p: PerfilFiscal) {
  gravarPerfilFiscal(validarPerfilFiscal(p));
}

/** Onde aconteceu uma compra. `pais = null` volta ao país de residência. */
export function definirOndeFoiACompra(
  transacaoId: number,
  pais: string | null,
  regiao: string | null = null,
  origem: OrigemPais = 'manual',
) {
  if (pais !== null && !paisUE(pais)) throw new ErroValidacao(t('fiscal.erro.pais'));
  if (pais !== null && !regiaoValida(pais, regiao)) throw new ErroValidacao(t('fiscal.erro.regiao'));
  definirPaisDaCompra(transacaoId, pais, regiao, origem);
}
