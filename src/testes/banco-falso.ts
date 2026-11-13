/**
 * Banco em memória para os testes: substitui os repositórios (que usam o SQLite do celular).
 * Cada arquivo de teste liga os mocks com `jest.mock('@/repositories/...', () => require(...))`
 * e preenche `banco` antes de cada caso.
 */

import { jest } from '@jest/globals';

import type { Categoria, ImpostosFixos, NotaSalva, PerfilFinanceiro, PerfilFiscal, Transacao } from '@/types/financas';

export const banco: {
  categorias: Categoria[];
  transacoes: Transacao[];
  notas: Map<number, NotaSalva>;
  fixos: ImpostosFixos | null;
  perfil: Pick<PerfilFinanceiro, 'rendaMensalCentavos'> | null;
  classificacoes: Map<string, string>;
  perfilFiscal: PerfilFiscal | null;
} = {
  categorias: [],
  transacoes: [],
  notas: new Map(),
  fixos: null,
  perfil: null,
  classificacoes: new Map(),
  perfilFiscal: null,
};

export function limparBanco() {
  banco.categorias = [];
  banco.transacoes = [];
  banco.notas = new Map();
  banco.fixos = null;
  banco.perfil = null;
  banco.classificacoes = new Map();
  banco.perfilFiscal = null;
  jest.requireActual<typeof import('@/data/database')>('@/data/database').notificarMudanca();
}

let proximoId = 1000;

/** Atalho para criar lançamentos nos testes. */
export function despesa(dados: Partial<Transacao> & Pick<Transacao, 'valorCentavos' | 'categoriaId' | 'data'>): Transacao {
  const categoria = banco.categorias.find((c) => c.id === dados.categoriaId);
  return {
    id: proximoId++,
    tipo: 'despesa',
    descricao: '',
    categoriaNome: categoria?.nome ?? '',
    recorrente: false,
    tributosCentavos: null,
    chaveNota: null,
    ...dados,
  };
}

export const categoriasRepository = {
  listarCategorias: (tipo?: string) => banco.categorias.filter((c) => !tipo || c.tipo === tipo),
  buscarCategoria: (id: number) => banco.categorias.find((c) => c.id === id) ?? null,
  criarCategoria: () => 0,
  definirPerfilTributario: () => {},
  contarTransacoesDaCategoria: () => 0,
  removerCategoria: () => {},
  renomearCategoria: () => {},
};

export const transacoesRepository = {
  listarTransacoes: (filtro: { mes?: string; tipo?: string } = {}) =>
    banco.transacoes.filter((t) => (!filtro.mes || t.data.startsWith(filtro.mes)) && (!filtro.tipo || t.tipo === filtro.tipo)),
  buscarTransacao: (id: number) => banco.transacoes.find((t) => t.id === id) ?? null,
  buscarTransacaoPorChaveNota: (chave: string) => banco.transacoes.find((t) => t.chaveNota === chave) ?? null,
  definirPaisDaCompra: (id: number, pais: string | null, regiao: string | null, origem: Transacao['origemPais']) => {
    const t = banco.transacoes.find((x) => x.id === id);
    if (t) Object.assign(t, { paisConsumo: pais, regiaoConsumo: pais ? regiao : null, origemPais: pais ? origem : null });
  },
};


export const impostosFixosRepository = {
  buscarImpostosFixos: () => banco.fixos,
  gravarImpostosFixos: (f: ImpostosFixos) => {
    banco.fixos = f;
  },
  removerImpostosFixos: () => {
    banco.fixos = null;
  },
};


export const perfilFinanceiroService = {
  obterPerfil: () => banco.perfil,
};

export const perfilFiscalRepository = {
  buscarPerfilFiscal: () => banco.perfilFiscal,
  gravarPerfilFiscal: (p: PerfilFiscal) => {
    banco.perfilFiscal = p;
  },
};
