/**
 * Impostos do património informados pelo utilizador (os que não vêm nas despesas nem no salário):
 * imposto sobre o imóvel (ex.: IMI, IMU), sobre o veículo (ex.: IUC, bollo auto) e outros, por ano.
 * O imposto sobre o rendimento vem do perfil fiscal (src/data/renda), não daqui.
 * Guardados na tabela impostos_fixos (as colunas antigas de salário/INSS/IR deixam de ser usadas).
 */

import { buscarImpostosFixos, gravarImpostosFixos, removerImpostosFixos } from '@/repositories/impostos-fixos-repository';
import { t } from '@/i18n';
import { ErroValidacao } from '@/services/erros';
import type { ImpostosFixos } from '@/types/financas';

/** € 10 milhões: protege contra valores digitados por engano */
const MAX_VALOR_CENTAVOS = 1_000_000_000;

export function obterImpostosFixos(): ImpostosFixos | null {
  return buscarImpostosFixos();
}

function validarValor(valor: number) {
  if (!Number.isInteger(valor) || valor < 0 || valor > MAX_VALOR_CENTAVOS) {
    throw new ErroValidacao(t('patrimonio.erro.valor'));
  }
}

/** Imposto anual do imóvel, do veículo e outros impostos por mês. */
export function salvarPatrimonio(p: { imovelAnualCentavos: number; veiculoAnualCentavos: number; outrosMensalCentavos: number }) {
  validarValor(p.imovelAnualCentavos);
  validarValor(p.veiculoAnualCentavos);
  validarValor(p.outrosMensalCentavos);
  gravarImpostosFixos({
    salarioBrutoCentavos: null,
    dependentes: 0,
    inssCentavos: null,
    irCentavos: null,
    iptuAnualCentavos: p.imovelAnualCentavos,
    ipvaAnualCentavos: p.veiculoAnualCentavos,
    outrosMensalCentavos: p.outrosMensalCentavos,
  });
}

export function limparImpostosFixos() {
  removerImpostosFixos();
}
