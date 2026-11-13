/**
 * Impostômetro da edição europeia: quanto do dinheiro gasto (e ganho) no mês foi para impostos.
 *
 * - Consumo: cada despesa usa o país onde aconteceu (país de consumo), ou o de residência se não foi indicado.
 *   Tributos do recibo (quando informados e > 0) contam como IDENTIFICADOS; o resto é ESTIMADO pelo tipo de
 *   consumo. Os dois totais ficam sempre separados.
 * - Despesas num país ainda sem regras não são estimadas (nada de inventar): entram em `semRegras`.
 * - Rendimento: imposto e contribuições pelo país de RESIDÊNCIA FISCAL, a partir do rendimento bruto anual
 *   do perfil fiscal, divididos por 12.
 * - Património: imóvel, veículo e outros impostos informados pelo utilizador (anuais divididos por 12).
 * Cálculos em centavos fracionados, arredondados só no fim.
 */

import type { PerfilTributarioId } from '@/data/perfis-consumo';
import type { CodigoPais } from '@/data/paises';
import { calcularImpostosDaRenda, temRegras, type AvisoRenda } from '@/data/renda';
import { listarCategorias } from '@/repositories/categorias-repository';
import { listarTransacoes } from '@/repositories/transacoes-repository';
import { perfilTributarioDaCategoria } from '@/services/categorias-service';
import { estimarImpostosDaCompra, type AvisoConsumo } from '@/services/impostos-consumo-ue-service';
import type { ResumoImpostosInsight } from '@/services/insights-service';
import { obterImpostosFixos } from '@/services/impostos-renda-service';
import { obterPerfilFiscal } from '@/services/perfil-fiscal-service';
import type { ImpostosFixos, PerfilFiscal, Transacao } from '@/types/financas';
import { mesAtual, somarMeses } from '@/utils/datas';
import { variacaoPercentual } from '@/utils/percentual';

export type OrigemImpostoUE = 'identificado' | 'estimado' | 'semRegras';

/** Origem do imposto nas listas: 'nota' = identificado no recibo. */
export type OrigemImposto = 'nota' | 'estimado';

export type ImpostoDaDespesaUE = {
  origem: OrigemImpostoUE;
  pais: string;
  regiao: string | null;
  ivaCentavos: number;
  especiaisCentavos: number;
  totalCentavos: number;
  avisos: AvisoConsumo[];
};

export type RendaDoMesUE = {
  brutoCentavos: number;
  impostoCentavos: number;
  contribuicoesCentavos: number;
  bonusCentavos: number;
  avisos: AvisoRenda[];
};

export type ImpostometroUE = {
  mes: string;
  residencia: string | null;
  gastosCentavos: number;
  /** Impostos de consumo vindos do recibo */
  identificadosCentavos: number;
  /** Impostos de consumo estimados pelo tipo de consumo e país */
  estimadosCentavos: number;
  ivaCentavos: number;
  especiaisCentavos: number;
  /** Despesas em países que o app ainda não cobre (não estimadas) */
  semRegras: { despesas: number; gastoCentavos: number };
  /** Rendimento do trabalho (null sem perfil fiscal, sem rendimento ou sem regras para o país/ano) */
  renda: RendaDoMesUE | null;
  motivoSemRenda: 'sem-perfil' | 'sem-rendimento' | 'pais' | 'ano' | 'situacao' | null;
  /** Imóvel + veículo + outros (informados pelo utilizador) */
  patrimonioCentavos: number;
  cargaTotalCentavos: number;
  percentualDosGastos: number | null;
  percentualDaRenda: number | null;
  diasTrabalhados: number | null;
  diasNoMes: number;
  porPais: { pais: string; gastoCentavos: number; impostosCentavos: number; despesas: number }[];
  porCategoria: { categoriaId: number; categoria: string; gastoCentavos: number; impostosCentavos: number; carga: number }[];
  maioresLancamentos: { transacao: Transacao; impostos: ImpostoDaDespesaUE }[];
  despesas: number;
  despesasIdentificadas: number;
  despesasNoEstrangeiro: number;
  avisos: (AvisoConsumo | AvisoRenda)[];
  cargaMesAnteriorCentavos: number;
  variacao: number | null;
  acumuladoAnoCentavos: number;
  liberdade: { percentual: number; dias: number; data: string } | null;
};

const MAX_LANCAMENTOS = 5;
const umaCasa = (n: number) => Math.round(n * 10) / 10;

/** "Dia da Libertação de Impostos": até que dia do ano o rendimento foi só para pagar impostos. */
export function calcularDiaDaLiberdade(ano: number, cargaAno: number, rendaAno: number) {
  if (rendaAno <= 0 || cargaAno <= 0) return null;
  const diasNoAno = new Date(ano, 1, 29).getMonth() === 1 ? 366 : 365;
  const percentual = Math.min(1, cargaAno / rendaAno);
  const dias = Math.round(percentual * diasNoAno);
  const d = new Date(ano, 0, 1 + dias);
  const data = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return { percentual: umaCasa(percentual * 100), dias, data };
}

/** Imposto de uma despesa (sem arredondar), pelo país onde a compra aconteceu. */
export function impostoDaDespesa(t: Transacao, perfil: PerfilTributarioId, fiscal: PerfilFiscal): ImpostoDaDespesaUE {
  const pais = t.paisConsumo ?? fiscal.paisResidencia;
  const regiao = t.paisConsumo ? (t.regiaoConsumo ?? null) : (t.regiaoConsumo ?? fiscal.regiaoResidencia);
  const base = { pais, regiao, ivaCentavos: 0, especiaisCentavos: 0, totalCentavos: 0, avisos: [] as AvisoConsumo[] };

  // Valor 0 no recibo não é real (a loja não informou): estima como se não tivesse.
  if (t.tributosCentavos !== null && t.tributosCentavos > 0) {
    return { ...base, origem: 'identificado', ivaCentavos: t.tributosCentavos, totalCentavos: t.tributosCentavos };
  }
  const estimativa = estimarImpostosDaCompra(t.valorCentavos, { pais: pais as CodigoPais, regiao }, perfil, t.data, {
    combustivel: fiscal.combustivel,
  });
  if (!estimativa) return { ...base, origem: 'semRegras' };
  return {
    ...base,
    origem: 'estimado',
    ivaCentavos: estimativa.ivaCentavos,
    especiaisCentavos: estimativa.especiaisCentavos,
    totalCentavos: estimativa.totalCentavos,
    avisos: estimativa.avisos,
  };
}

/** Imposto sobre o rendimento de um mês (1/12 do anual), pelo país de residência. */
export function rendaDoMes(
  fiscal: PerfilFiscal | null,
  ano: number,
): { renda: RendaDoMesUE | null; motivo: ImpostometroUE['motivoSemRenda'] } {
  if (!fiscal) return { renda: null, motivo: 'sem-perfil' };
  if (!fiscal.brutoAnualCentavos) return { renda: null, motivo: 'sem-rendimento' };
  const r = calcularImpostosDaRenda(fiscal.paisResidencia as CodigoPais, {
    ano,
    brutoAnualCentavos: fiscal.brutoAnualCentavos,
    situacao: fiscal.situacao,
    dependentes: fiscal.dependentes,
    dependentesAte3Anos: fiscal.dependentesAte3Anos,
    declaracaoConjunta: fiscal.declaracaoConjunta,
    regiao: fiscal.regiaoResidencia,
    contribuicaoProporcional: fiscal.contribuicaoProporcional,
  });
  if (!temRegras(r)) return { renda: null, motivo: r.semRegras };
  return {
    renda: {
      brutoCentavos: fiscal.brutoAnualCentavos / 12,
      impostoCentavos: r.impostoCentavos / 12,
      contribuicoesCentavos: r.contribuicoesCentavos / 12,
      bonusCentavos: r.bonusCentavos / 12,
      avisos: r.avisos,
    },
    motivo: null,
  };
}

function patrimonioDoMes(f: ImpostosFixos | null) {
  if (!f) return 0;
  return f.ipvaAnualCentavos / 12 + f.iptuAnualCentavos / 12 + f.outrosMensalCentavos;
}

export type EntradaImpostometroUE = {
  mes: string;
  transacoes: Transacao[];
  /** Tipo de consumo de cada categoria de despesa */
  perfis: Map<number, PerfilTributarioId>;
  fiscal: PerfilFiscal | null;
  fixos?: ImpostosFixos | null;
  cargaMesAnteriorCentavos?: number;
  acumuladoAnoCentavos?: number;
  rendaAnoCentavos?: number;
};

/** Cálculo puro do Impostômetro europeu de um mês. */
export function calcularImpostometroUE(e: EntradaImpostometroUE): ImpostometroUE {
  const [ano, numeroMes] = e.mes.split('-').map(Number);
  const diasNoMes = new Date(ano, numeroMes, 0).getDate();
  const { renda, motivo } = rendaDoMes(e.fiscal, ano);
  const patrimonio = patrimonioDoMes(e.fixos ?? null);
  const avisos = new Set<AvisoConsumo | AvisoRenda>(renda?.avisos ?? []);

  let gastos = 0;
  let identificados = 0;
  let estimados = 0;
  let iva = 0;
  let especiais = 0;
  let despesas = 0;
  let despesasIdentificadas = 0;
  let despesasNoEstrangeiro = 0;
  const semRegras = { despesas: 0, gastoCentavos: 0 };
  const porPais = new Map<string, { pais: string; gasto: number; impostos: number; despesas: number }>();
  const porCategoria = new Map<number, { categoriaId: number; categoria: string; gasto: number; impostos: number }>();
  const lancamentos: ImpostometroUE['maioresLancamentos'] = [];

  for (const t of e.transacoes) {
    if (t.tipo !== 'despesa') continue;
    despesas++;
    gastos += t.valorCentavos;
    if (!e.fiscal) {
      semRegras.despesas++;
      semRegras.gastoCentavos += t.valorCentavos;
      continue;
    }
    const imp = impostoDaDespesa(t, e.perfis.get(t.categoriaId) ?? 'geral', e.fiscal);
    imp.avisos.forEach((a) => avisos.add(a));
    if (imp.pais !== e.fiscal.paisResidencia) despesasNoEstrangeiro++;

    if (imp.origem === 'semRegras') {
      semRegras.despesas++;
      semRegras.gastoCentavos += t.valorCentavos;
    } else if (imp.origem === 'identificado') {
      identificados += imp.totalCentavos;
      despesasIdentificadas++;
    } else {
      estimados += imp.totalCentavos;
    }
    iva += imp.ivaCentavos;
    especiais += imp.especiaisCentavos;

    const p = porPais.get(imp.pais) ?? { pais: imp.pais, gasto: 0, impostos: 0, despesas: 0 };
    p.gasto += t.valorCentavos;
    p.impostos += imp.totalCentavos;
    p.despesas++;
    porPais.set(imp.pais, p);

    const c = porCategoria.get(t.categoriaId) ?? { categoriaId: t.categoriaId, categoria: t.categoriaNome, gasto: 0, impostos: 0 };
    c.gasto += t.valorCentavos;
    c.impostos += imp.totalCentavos;
    porCategoria.set(t.categoriaId, c);

    if (imp.totalCentavos > 0) lancamentos.push({ transacao: t, impostos: imp });
  }

  const consumo = identificados + estimados;
  const carga = consumo + (renda ? renda.impostoCentavos + renda.contribuicoesCentavos : 0) + patrimonio;
  const rendaBruta = renda?.brutoCentavos ?? null;
  const pct = (parte: number, todo: number) => (todo > 0 ? umaCasa((parte / todo) * 100) : 0);
  const arred = (n: number) => Math.round(n);

  return {
    mes: e.mes,
    residencia: e.fiscal?.paisResidencia ?? null,
    gastosCentavos: gastos,
    identificadosCentavos: arred(identificados),
    estimadosCentavos: arred(estimados),
    ivaCentavos: arred(iva),
    especiaisCentavos: arred(especiais),
    semRegras,
    renda: renda && {
      brutoCentavos: arred(renda.brutoCentavos),
      impostoCentavos: arred(renda.impostoCentavos),
      contribuicoesCentavos: arred(renda.contribuicoesCentavos),
      bonusCentavos: arred(renda.bonusCentavos),
      avisos: renda.avisos,
    },
    motivoSemRenda: motivo,
    patrimonioCentavos: arred(patrimonio),
    cargaTotalCentavos: arred(carga),
    percentualDosGastos: gastos - semRegras.gastoCentavos > 0 ? pct(consumo, gastos - semRegras.gastoCentavos) : null,
    percentualDaRenda: rendaBruta ? pct(carga, rendaBruta) : null,
    diasTrabalhados: rendaBruta ? umaCasa((carga / rendaBruta) * diasNoMes) : null,
    diasNoMes,
    porPais: [...porPais.values()]
      .map((p) => ({ pais: p.pais, gastoCentavos: p.gasto, impostosCentavos: arred(p.impostos), despesas: p.despesas }))
      .sort((a, b) => b.impostosCentavos - a.impostosCentavos),
    porCategoria: [...porCategoria.values()]
      .map((c) => ({
        categoriaId: c.categoriaId,
        categoria: c.categoria,
        gastoCentavos: c.gasto,
        impostosCentavos: arred(c.impostos),
        carga: pct(c.impostos, c.gasto),
      }))
      .sort((a, b) => b.impostosCentavos - a.impostosCentavos),
    maioresLancamentos: lancamentos
      .sort((a, b) => b.impostos.totalCentavos - a.impostos.totalCentavos)
      .slice(0, MAX_LANCAMENTOS)
      .map((l) => ({
        transacao: l.transacao,
        impostos: {
          ...l.impostos,
          ivaCentavos: arred(l.impostos.ivaCentavos),
          especiaisCentavos: arred(l.impostos.especiaisCentavos),
          totalCentavos: arred(l.impostos.totalCentavos),
        },
      })),
    despesas,
    despesasIdentificadas,
    despesasNoEstrangeiro,
    avisos: [...avisos],
    cargaMesAnteriorCentavos: arred(e.cargaMesAnteriorCentavos ?? 0),
    variacao: variacaoPercentual(arred(carga), arred(e.cargaMesAnteriorCentavos ?? 0)),
    acumuladoAnoCentavos: arred(e.acumuladoAnoCentavos ?? 0),
    liberdade: calcularDiaDaLiberdade(ano, e.acumuladoAnoCentavos ?? 0, e.rendaAnoCentavos ?? 0),
  };
}

function perfisDasCategorias() {
  return new Map(listarCategorias('despesa').map((c) => [c.id, perfilTributarioDaCategoria(c)]));
}

/** Carga e rendimento de um mês já fechado. Meses sem nenhum lançamento (e futuros) não contam. */
function totalDoMes(mes: string, base: Omit<EntradaImpostometroUE, 'mes' | 'transacoes'>) {
  const transacoes = listarTransacoes({ mes });
  if (mes > mesAtual() || (transacoes.length === 0 && mes !== mesAtual())) return { carga: 0, renda: 0 };
  const r = calcularImpostometroUE({ ...base, mes, transacoes });
  return { carga: r.cargaTotalCentavos, renda: r.renda?.brutoCentavos ?? 0 };
}

export function obterImpostometroUE(mes: string): ImpostometroUE {
  const base = { perfis: perfisDasCategorias(), fiscal: obterPerfilFiscal(), fixos: obterImpostosFixos() };
  let acumulado = 0;
  let rendaAno = 0;
  for (let m = mes; m.slice(0, 4) === mes.slice(0, 4); m = somarMeses(m, -1)) {
    const doMes = totalDoMes(m, base);
    acumulado += doMes.carga;
    rendaAno += doMes.renda;
  }
  return calcularImpostometroUE({
    ...base,
    mes,
    transacoes: listarTransacoes({ mes }),
    cargaMesAnteriorCentavos: totalDoMes(somarMeses(mes, -1), base).carga,
    acumuladoAnoCentavos: acumulado,
    rendaAnoCentavos: rendaAno,
  });
}

/**
 * Imposto de cada despesa de um mês, pelo id do lançamento (lista de Transações e Início).
 * A origem usa os nomes das telas: 'nota' = identificado no recibo; despesas sem regras ficam de fora.
 */
export function obterImpostosDosLancamentosUE(mes: string): Map<number, { centavos: number; origem: OrigemImposto }> {
  const fiscal = obterPerfilFiscal();
  const resultado = new Map<number, { centavos: number; origem: OrigemImposto }>();
  if (!fiscal) return resultado;
  const perfis = perfisDasCategorias();
  for (const t of listarTransacoes({ mes, tipo: 'despesa' })) {
    const imp = impostoDaDespesa(t, perfis.get(t.categoriaId) ?? 'geral', fiscal);
    if (imp.origem === 'semRegras') continue;
    resultado.set(t.id, { centavos: Math.round(imp.totalCentavos), origem: imp.origem === 'identificado' ? 'nota' : 'estimado' });
  }
  return resultado;
}

/** Carga total dos últimos meses (do mais antigo ao atual), para o minigráfico do Início. */
export function obterHistoricoImpostosUE(mes: string, meses = 6): { mes: string; centavos: number }[] {
  const base = { perfis: perfisDasCategorias(), fiscal: obterPerfilFiscal(), fixos: obterImpostosFixos() };
  const lista: { mes: string; centavos: number }[] = [];
  for (let i = meses - 1; i >= 0; i--) {
    const m = somarMeses(mes, -i);
    lista.push({ mes: m, centavos: totalDoMes(m, base).carga });
  }
  return lista;
}

/** Impostos de uma despesa (null para receitas ou sem perfil fiscal), já arredondados. */
export function obterImpostosDoLancamentoUE(t: Transacao | null): (ImpostoDaDespesaUE & { percentual: number }) | null {
  const fiscal = obterPerfilFiscal();
  if (!t || t.tipo !== 'despesa' || !fiscal) return null;
  const perfil = perfisDasCategorias().get(t.categoriaId) ?? 'geral';
  const imp = impostoDaDespesa(t, perfil, fiscal);
  return {
    ...imp,
    ivaCentavos: Math.round(imp.ivaCentavos),
    especiaisCentavos: Math.round(imp.especiaisCentavos),
    totalCentavos: Math.round(imp.totalCentavos),
    percentual: t.valorCentavos > 0 ? umaCasa((imp.totalCentavos / t.valorCentavos) * 100) : 0,
  };
}

/** Resumo leve para os insights do Início (só o consumo do mês). null sem despesas estimáveis. */
export function obterResumoImpostosUE(mes: string): ResumoImpostosInsight | null {
  const imp = calcularImpostometroUE({
    mes,
    transacoes: listarTransacoes({ mes, tipo: 'despesa' }),
    perfis: perfisDasCategorias(),
    fiscal: obterPerfilFiscal(),
  });
  if (imp.percentualDosGastos === null) return null;
  const maior = imp.porCategoria[0];
  return {
    impostosCentavos: imp.identificadosCentavos + imp.estimadosCentavos,
    percentualDosGastos: imp.percentualDosGastos,
    maiorCategoria: maior && maior.impostosCentavos > 0 ? { nome: maior.categoria, impostosCentavos: maior.impostosCentavos } : null,
  };
}
