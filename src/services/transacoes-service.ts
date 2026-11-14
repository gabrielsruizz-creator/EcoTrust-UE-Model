/**
 * Regras para criar, editar e remover transações. As telas chamam este serviço, nunca o repositório direto.
 */

import { buscarCategoria } from '@/repositories/categorias-repository';
import {
  atualizarTransacao,
  buscarTransacao,
  buscarTransacaoPorChaveNota,
  criarTransacao,
  definirPaisDaCompra,
  listarDiasComLancamentos,
  listarTransacoes,
  removerTransacao,
} from '@/repositories/transacoes-repository';
import { paisUE } from '@/data/paises';
import { t } from '@/i18n';
import { chaveFaturaValida } from '@/services/fatura-pt-service';
import { ErroValidacao } from '@/services/erros';
import { regiaoValida } from '@/services/perfil-fiscal-service';
import type { FiltroTransacoes, NovaTransacao, Transacao } from '@/types/financas';
import { dataValida, formatarData, hoje } from '@/utils/datas';

const MAX_DESCRICAO = 120;
const DATA_MINIMA = '2000-01-01';
/** R$ 100 milhões: protege contra valores digitados por engano */
const MAX_VALOR_CENTAVOS = 10_000_000_000;

export function obterTransacoes(filtro: FiltroTransacoes = {}): Transacao[] {
  return listarTransacoes(filtro);
}

export function obterDiasComLancamentos(): Set<string> {
  return new Set(listarDiasComLancamentos());
}

/** Lançamento já registrado com esta nota fiscal (chave de acesso da NFC-e). */
export function obterTransacaoPorChaveNota(chave: string): Transacao | null {
  return buscarTransacaoPorChaveNota(chave);
}

export function obterTransacao(id: number): Transacao | null {
  return buscarTransacao(id);
}

/** Valida e normaliza os dados de um lançamento (usado ao criar e ao editar). */
function validarTransacao(dados: NovaTransacao, idAtual?: number): NovaTransacao {
  if (!Number.isInteger(dados.valorCentavos) || dados.valorCentavos <= 0) {
    throw new ErroValidacao(t('tx.e.maiorZero'));
  }
  if (dados.valorCentavos > MAX_VALOR_CENTAVOS) {
    throw new ErroValidacao(t('tx.e.alto'));
  }
  if (!dataValida(dados.data) || dados.data < DATA_MINIMA) {
    throw new ErroValidacao(t('tx.e.data'));
  }
  if (dados.data > hoje()) {
    throw new ErroValidacao(t('tx.e.futuro'));
  }

  const categoria = buscarCategoria(dados.categoriaId);
  if (!categoria || categoria.tipo !== dados.tipo) {
    throw new ErroValidacao(t('tx.e.categoria'));
  }
  // Zero não conta como valor informado: o Impostômetro estima pelos produtos ou pela categoria.
  const tributos = dados.tipo === 'despesa' && dados.tributosCentavos ? dados.tributosCentavos : null;
  if (tributos !== null && (!Number.isInteger(tributos) || tributos < 0)) {
    throw new ErroValidacao(t('tx.e.tributos'));
  }
  if (tributos !== null && tributos >= dados.valorCentavos) {
    throw new ErroValidacao(t('tx.e.tributosMaior'));
  }
  const chaveNota = dados.tipo === 'despesa' && dados.chaveNota ? dados.chaveNota.trim() : null;
  if (chaveNota && !chaveFaturaValida(chaveNota)) throw new ErroValidacao(t('fatura.e.chave'));
  if (chaveNota) {
    const existente = buscarTransacaoPorChaveNota(chaveNota);
    if (existente && existente.id !== idAtual) {
      throw new ErroValidacao(
        t('tx.e.notaRepetida', { data: formatarData(existente.data), descricao: existente.descricao || existente.categoriaNome }),
      );
    }
  }

  // País da compra (edição europeia): só despesas; null = país de residência.
  const paisConsumo = dados.tipo === 'despesa' ? (dados.paisConsumo ?? null) : null;
  if (paisConsumo !== null && !paisUE(paisConsumo)) throw new ErroValidacao(t('fiscal.erro.pais'));
  const regiaoConsumo = paisConsumo !== null ? (dados.regiaoConsumo ?? null) : null;
  if (regiaoConsumo !== null && paisConsumo !== null && !regiaoValida(paisConsumo, regiaoConsumo)) {
    throw new ErroValidacao(t('fiscal.erro.regiao'));
  }

  return {
    ...dados,
    paisConsumo,
    regiaoConsumo: paisConsumo !== null ? regiaoConsumo : null,
    origemPais: paisConsumo !== null ? (dados.origemPais ?? 'manual') : null,
    descricao: dados.descricao.trim().slice(0, MAX_DESCRICAO),
    // Por enquanto só despesas podem ser recorrentes (ex.: aluguel, assinaturas).
    recorrente: dados.tipo === 'despesa' && dados.recorrente,
    // Tributos da nota fiscal só fazem sentido em despesas.
    tributosCentavos: tributos,
    chaveNota,
  };
}

export function adicionarTransacao(nova: NovaTransacao): number {
  return criarTransacao(validarTransacao(nova));
}

export function editarTransacao(id: number, dados: NovaTransacao) {
  const validos = validarTransacao(dados, id);
  const atualizou = atualizarTransacao(id, validos);
  if (!atualizou) {
    throw new ErroValidacao(t('tx.e.naoExiste'));
  }
  // O país só muda quando o formulário o enviou (assim, editar não apaga um país vindo do GPS ou do recibo).
  if (dados.paisConsumo !== undefined) {
    definirPaisDaCompra(id, validos.paisConsumo ?? null, validos.regiaoConsumo ?? null, validos.origemPais ?? null);
  }
}

export function excluirTransacao(id: number) {
  removerTransacao(id);
}
