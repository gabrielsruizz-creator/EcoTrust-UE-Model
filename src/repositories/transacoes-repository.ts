import { getBanco, notificarMudanca } from '@/data/database';
import { nomeDaCategoria } from '@/i18n/categorias';
import type { FiltroTransacoes, NovaTransacao, OrigemPais, TipoTransacao, Transacao } from '@/types/financas';

type LinhaTransacao = {
  id: number;
  tipo: TipoTransacao;
  valor_centavos: number;
  descricao: string;
  categoria_id: number;
  categoria_nome: string;
  categoria_chave: string | null;
  data: string;
  recorrente: number;
  tributos_centavos: number | null;
  chave_nota: string | null;
  dedutivel_ir: number | null;
  criado_em: string;
  pais_consumo: string | null;
  regiao_consumo: string | null;
  origem_pais: string | null;
};

const SELECT_TRANSACAO = `
  SELECT t.id, t.tipo, t.valor_centavos, t.descricao, t.categoria_id, c.nome AS categoria_nome, c.chave AS categoria_chave,
         t.data, t.recorrente, t.tributos_centavos, t.chave_nota, t.dedutivel_ir, t.criado_em,
         t.pais_consumo, t.regiao_consumo, t.origem_pais
  FROM transacoes t
  JOIN categorias c ON c.id = t.categoria_id`;

function paraTransacao(l: LinhaTransacao): Transacao {
  return {
    id: l.id,
    tipo: l.tipo,
    valorCentavos: l.valor_centavos,
    descricao: l.descricao,
    categoriaId: l.categoria_id,
    categoriaNome: nomeDaCategoria(l.categoria_nome, l.categoria_chave),
    data: l.data,
    recorrente: l.recorrente === 1,
    tributosCentavos: l.tributos_centavos,
    chaveNota: l.chave_nota,
    dedutivelIr: l.dedutivel_ir === null ? null : l.dedutivel_ir === 1,
    criadoEm: l.criado_em,
    paisConsumo: l.pais_consumo,
    regiaoConsumo: l.regiao_consumo,
    origemPais: l.origem_pais as OrigemPais | null,
  };
}

export function buscarTransacao(id: number): Transacao | null {
  const linha = getBanco().getFirstSync<LinhaTransacao>(`${SELECT_TRANSACAO} WHERE t.id = ?`, id);
  return linha ? paraTransacao(linha) : null;
}

/** Lista transações, das mais recentes para as mais antigas. */
export function listarTransacoes(filtro: FiltroTransacoes = {}): Transacao[] {
  const condicoes: string[] = [];
  const parametros: (string | number)[] = [];

  if (filtro.mes) {
    condicoes.push('t.data BETWEEN ? AND ?');
    parametros.push(`${filtro.mes}-01`, `${filtro.mes}-31`);
  }
  if (filtro.tipo) {
    condicoes.push('t.tipo = ?');
    parametros.push(filtro.tipo);
  }
  if (filtro.categoriaId !== undefined) {
    condicoes.push('t.categoria_id = ?');
    parametros.push(filtro.categoriaId);
  }

  const where = condicoes.length > 0 ? `WHERE ${condicoes.join(' AND ')}` : '';
  const linhas = getBanco().getAllSync<LinhaTransacao>(
    `${SELECT_TRANSACAO} ${where} ORDER BY t.data DESC, t.id DESC`,
    parametros,
  );
  return linhas.map(paraTransacao);
}

/** Soma de todas as receitas e despesas já registradas (sem filtro de data). */
export function somarTotaisGerais(): { receitasCentavos: number; despesasCentavos: number } {
  const linha = getBanco().getFirstSync<{ receitas: number | null; despesas: number | null }>(
    `SELECT
       SUM(CASE WHEN tipo = 'receita' THEN valor_centavos ELSE 0 END) AS receitas,
       SUM(CASE WHEN tipo = 'despesa' THEN valor_centavos ELSE 0 END) AS despesas
     FROM transacoes`,
  );
  return { receitasCentavos: linha?.receitas ?? 0, despesasCentavos: linha?.despesas ?? 0 };
}

/** Receitas e despesas registradas até uma data (inclusive), para o saldo acumulado de um mês passado. */
export function somarTotaisAte(data: string): { receitasCentavos: number; despesasCentavos: number } {
  const linha = getBanco().getFirstSync<{ receitas: number | null; despesas: number | null }>(
    `SELECT
       SUM(CASE WHEN tipo = 'receita' THEN valor_centavos ELSE 0 END) AS receitas,
       SUM(CASE WHEN tipo = 'despesa' THEN valor_centavos ELSE 0 END) AS despesas
     FROM transacoes WHERE data <= ?`,
    data,
  );
  return { receitasCentavos: linha?.receitas ?? 0, despesasCentavos: linha?.despesas ?? 0 };
}

/** Dias (AAAA-MM-DD) que têm pelo menos um lançamento, para marcar no calendário. */
export function listarDiasComLancamentos(): string[] {
  return getBanco()
    .getAllSync<{ data: string }>('SELECT DISTINCT data FROM transacoes ORDER BY data')
    .map((l) => l.data);
}

/** Lançamento que já usa esta chave de NFC-e (para não registrar a mesma nota duas vezes). */
export function buscarTransacaoPorChaveNota(chave: string): Transacao | null {
  const linha = getBanco().getFirstSync<LinhaTransacao>(`${SELECT_TRANSACAO} WHERE t.chave_nota = ?`, chave);
  return linha ? paraTransacao(linha) : null;
}

export function criarTransacao(nova: NovaTransacao): number {
  const resultado = getBanco().runSync(
    `INSERT INTO transacoes (tipo, valor_centavos, descricao, categoria_id, data, recorrente, tributos_centavos, chave_nota,
                             pais_consumo, regiao_consumo, origem_pais, criado_em)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    nova.tipo,
    nova.valorCentavos,
    nova.descricao,
    nova.categoriaId,
    nova.data,
    nova.recorrente ? 1 : 0,
    nova.tributosCentavos,
    nova.chaveNota,
    nova.paisConsumo ?? null,
    nova.regiaoConsumo ?? null,
    nova.origemPais ?? null,
    new Date().toISOString(),
  );
  notificarMudanca();
  return resultado.lastInsertRowId;
}

/** Retorna false se a transação não existe mais. */
export function atualizarTransacao(id: number, dados: NovaTransacao): boolean {
  const resultado = getBanco().runSync(
    `UPDATE transacoes
     SET tipo = ?, valor_centavos = ?, descricao = ?, categoria_id = ?, data = ?, recorrente = ?, tributos_centavos = ?, chave_nota = ?
     WHERE id = ?`,
    dados.tipo,
    dados.valorCentavos,
    dados.descricao,
    dados.categoriaId,
    dados.data,
    dados.recorrente ? 1 : 0,
    dados.tributosCentavos,
    dados.chaveNota,
    id,
  );
  notificarMudanca();
  return resultado.changes > 0;
}

/** Lançamentos de um período (AAAA-MM-DD, inclusive), do mais antigo ao mais novo. */
export function listarTransacoesEntre(inicio: string, fim: string, tipo: TipoTransacao): Transacao[] {
  return getBanco()
    .getAllSync<LinhaTransacao>(
      `${SELECT_TRANSACAO} WHERE t.data BETWEEN ? AND ? AND t.tipo = ? ORDER BY t.data, t.id`,
      inicio,
      fim,
      tipo,
    )
    .map(paraTransacao);
}

/**
 * Define onde a compra aconteceu. Fica fora de `atualizarTransacao` para editar um lançamento não apagar
 * o país identificado (por GPS ou recibo) quando o formulário não mexe nele.
 */
export function definirPaisDaCompra(id: number, pais: string | null, regiao: string | null, origem: OrigemPais | null) {
  getBanco().runSync(
    'UPDATE transacoes SET pais_consumo = ?, regiao_consumo = ?, origem_pais = ? WHERE id = ?',
    pais,
    pais ? regiao : null,
    pais ? origem : null,
    id,
  );
  notificarMudanca();
}

/** Marca (ou desmarca, ou volta ao automático com null) uma despesa como dedutível no IR. */
export function definirDedutivelIr(id: number, dedutivel: boolean | null) {
  getBanco().runSync('UPDATE transacoes SET dedutivel_ir = ? WHERE id = ?', dedutivel === null ? null : dedutivel ? 1 : 0, id);
  notificarMudanca();
}

export function removerTransacao(id: number) {
  getBanco().runSync('DELETE FROM transacoes WHERE id = ?', id);
  notificarMudanca();
}
