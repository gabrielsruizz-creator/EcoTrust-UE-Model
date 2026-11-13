/**
 * EcoTrust IA (primeira versão): análise da vida financeira baseada em regras.
 * Não usa modelo de IA: lê os números do usuário e transforma em observações claras.
 * `gerarAnalise` é puro (fácil de testar e de evoluir); `obterAnalise` busca os dados no banco.
 */

import { t } from '@/i18n';
import { categoriaEssencial, ehMetaDeReserva } from '@/i18n/categorias';
import { obterPerfilFinanceiro } from '@/repositories/perfil-financeiro-repository';
import { listarTransacoes } from '@/repositories/transacoes-repository';
import { obterMetas, textoRitmo } from '@/services/metas-service';
import { obterOrcamentos, type ResumoOrcamentos } from '@/services/orcamento-service';
import { obterResumoDoMes } from '@/services/resumo-service';
import type { PerfilFinanceiro, ProgressoMeta, ResumoMes } from '@/types/financas';
import { hoje, nomeDoMesSemAno, somarMeses } from '@/utils/datas';
import { formatarCentavos } from '@/utils/moeda';

/** Diferença mínima (em cêntimos) para comentar a variação de uma categoria: 100 na moeda principal */
const VARIACAO_MINIMA_CENTAVOS = 10_000;
/** E também pelo menos 15% de variação */
const VARIACAO_MINIMA_PERCENTUAL = 0.15;
/** A projeção do mês só aparece a partir deste dia (antes disso é muito incerta) */
const DIA_MINIMO_PROJECAO = 5;

export type TemaInsight = 'renda' | 'gastos' | 'orcamento' | 'metas';

export type InsightIA = {
  id: string;
  tom: 'alerta' | 'positivo' | 'neutro';
  tema: TemaInsight;
  titulo: string;
  texto: string;
  /** Atalho opcional para agir sobre o insight */
  acao?: { rotulo: string; rota: '/nova-meta' | '/editar-orcamento' | '/novo-lancamento' | '/orcamento' };
};

export type Analise = {
  mes: string;
  /** Frase de abertura, ex.: "Analisei outubro: 2 pontos de atenção e 3 boas notícias." */
  resumo: string;
  insights: InsightIA[];
};

export type EntradaAnalise = {
  mes: string;
  dataHoje: string;
  atual: ResumoMes;
  anterior: ResumoMes;
  /** Resumos dos 3 meses anteriores ao atual (para a média) */
  historico: ResumoMes[];
  perfil: PerfilFinanceiro | null;
  /** Soma das despesas marcadas como recorrentes no mês */
  recorrentesCentavos: number;
  orcamentos: ResumoOrcamentos;
  metas: ProgressoMeta[];
};

const pct = (valor: number) => `${Math.round(valor * 100)}%`;

function analisarRenda(e: EntradaAnalise): InsightIA[] {
  const insights: InsightIA[] = [];
  const { atual, perfil } = e;

  // Taxa de poupança do mês
  if (atual.receitasCentavos > 0) {
    const taxa = (atual.receitasCentavos - atual.despesasCentavos) / atual.receitasCentavos;
    if (taxa < 0) {
      insights.push({
        id: 'poupanca-negativa',
        tom: 'alerta',
        tema: 'renda',
        titulo: t('an.poupNeg.titulo'),
        texto: t('an.poupNeg.texto', { valor: formatarCentavos(atual.despesasCentavos - atual.receitasCentavos) }),
      });
    } else {
      insights.push({
        id: 'taxa-poupanca',
        tom: taxa >= 0.1 ? 'positivo' : 'neutro',
        tema: 'renda',
        titulo: t('an.poup.titulo'),
        texto:
          t('an.poup.texto', { pct: pct(taxa) }) +
          (taxa < 0.1 ? t('an.poup.chegar10') : taxa >= 0.2 ? t('an.poup.excelente') : ''),
      });
    }
  }

  // Peso das despesas fixas na renda (recorrentes do mês ou o valor informado no perfil)
  const renda = Math.max(perfil?.rendaMensalCentavos ?? 0, atual.receitasCentavos);
  const fixas = e.recorrentesCentavos > 0 ? e.recorrentesCentavos : (perfil?.despesasFixasCentavos ?? 0);
  if (renda > 0 && fixas > 0) {
    const peso = fixas / renda;
    insights.push({
      id: 'peso-fixas',
      tom: peso > 0.5 ? 'alerta' : peso <= 0.3 ? 'positivo' : 'neutro',
      tema: 'renda',
      titulo: t('saude.fixas'),
      texto:
        t('an.fixas.texto', { pct: pct(peso) }) +
        (peso > 0.5 ? t('an.fixas.altas') : peso <= 0.3 ? t('an.fixas.margem') : ''),
    });
  }
  return insights;
}

function analisarGastos(e: EntradaAnalise): InsightIA[] {
  const insights: InsightIA[] = [];
  const { atual, anterior } = e;

  // Variações por categoria em relação ao mês passado (as 2 maiores altas e a maior queda)
  const variacoes = atual.despesasPorCategoria
    .map((c) => {
      const antes = anterior.despesasPorCategoria.find((a) => a.categoriaId === c.categoriaId)?.totalCentavos ?? 0;
      return { categoria: c.categoria, diferenca: c.totalCentavos - antes, antes };
    })
    .concat(
      anterior.despesasPorCategoria
        .filter((a) => !atual.despesasPorCategoria.some((c) => c.categoriaId === a.categoriaId))
        .map((a) => ({ categoria: a.categoria, diferenca: -a.totalCentavos, antes: a.totalCentavos })),
    )
    .filter(
      (v) =>
        Math.abs(v.diferenca) >= VARIACAO_MINIMA_CENTAVOS &&
        (v.antes === 0 || Math.abs(v.diferenca) / v.antes >= VARIACAO_MINIMA_PERCENTUAL),
    );

  variacoes
    .filter((v) => v.diferenca > 0)
    .sort((a, b) => b.diferenca - a.diferenca)
    .slice(0, 2)
    .forEach((v) =>
      insights.push({
        id: `alta-${v.categoria}`,
        tom: 'alerta',
        tema: 'gastos',
        titulo: t('an.alta.titulo', { categoria: v.categoria }),
        texto: t('an.alta.texto', { valor: formatarCentavos(v.diferenca), categoria: v.categoria }),
      }),
    );

  const queda = variacoes.filter((v) => v.diferenca < 0).sort((a, b) => a.diferenca - b.diferenca)[0];
  if (queda) {
    insights.push({
      id: `queda-${queda.categoria}`,
      tom: 'positivo',
      tema: 'gastos',
      titulo: t('an.queda.titulo', { categoria: queda.categoria }),
      texto: t('an.queda.texto', { valor: formatarCentavos(-queda.diferenca), categoria: queda.categoria }),
    });
  }

  // Comparação com a média dos meses anteriores (só se o mês atual já terminou ou estiver avançado)
  const mesesComGasto = e.historico.filter((r) => r.despesasCentavos > 0);
  const dia = Number(e.dataHoje.slice(8, 10));
  const mesAtualEmCurso = e.dataHoje.slice(0, 7) === e.mes;
  if (mesesComGasto.length >= 2 && atual.despesasCentavos > 0 && (!mesAtualEmCurso || dia >= 20)) {
    const media = mesesComGasto.reduce((s, r) => s + r.despesasCentavos, 0) / mesesComGasto.length;
    const diferenca = (atual.despesasCentavos - media) / media;
    if (Math.abs(diferenca) >= 0.1) {
      insights.push({
        id: 'comparacao-media',
        tom: diferenca > 0 ? 'alerta' : 'positivo',
        tema: 'gastos',
        titulo: t('an.media.titulo'),
        texto: t(diferenca > 0 ? 'an.media.acima' : 'an.media.abaixo', {
          pct: pct(Math.abs(diferenca)),
          n: mesesComGasto.length,
        }),
      });
    }
  }

  // Projeção do mês no ritmo atual
  if (mesAtualEmCurso && dia >= DIA_MINIMO_PROJECAO && atual.despesasCentavos > 0) {
    const [ano, m] = e.mes.split('-').map(Number);
    const diasNoMes = new Date(ano, m, 0).getDate();
    if (dia < diasNoMes) {
      const projecao = Math.round((atual.despesasCentavos / dia) * diasNoMes);
      const limite =
        e.orcamentos.geral?.limiteCentavos ??
        (e.perfil && e.perfil.rendaMensalCentavos > 0
          ? Math.max(0, e.perfil.rendaMensalCentavos - e.perfil.metaEconomiaCentavos)
          : null);
      const passa = limite !== null && projecao > limite;
      insights.push({
        id: 'projecao-mes',
        tom: passa ? 'alerta' : 'neutro',
        tema: 'gastos',
        titulo: t('an.proj.titulo'),
        texto:
          t('an.proj.texto', { valor: formatarCentavos(projecao), mes: nomeDoMesSemAno(e.mes) }) +
          (passa && limite !== null
            ? t('an.proj.passa', { valor: formatarCentavos(projecao - limite) })
            : limite !== null
              ? t('an.proj.dentro')
              : ''),
      });
    }
  }

  // Onde reduzir: a maior categoria não essencial
  const reduzivel = atual.despesasPorCategoria.find((c) => !categoriaEssencial(c.categoria));
  if (reduzivel && reduzivel.totalCentavos >= 5_000) {
    const economia = Math.round(reduzivel.totalCentavos * 0.1);
    insights.push({
      id: 'onde-reduzir',
      tom: 'neutro',
      tema: 'gastos',
      titulo: t('an.reduzir.titulo'),
      texto: t('an.reduzir.texto', {
        categoria: reduzivel.categoria,
        valor: formatarCentavos(reduzivel.totalCentavos),
        economia: formatarCentavos(economia),
      }),
    });
  }
  return insights;
}

function analisarOrcamento(e: EntradaAnalise): InsightIA[] {
  const insights: InsightIA[] = [];
  const { geral, categorias } = e.orcamentos;
  for (const s of [geral, ...categorias]) {
    if (!s?.mensagem) continue;
    insights.push({
      id: `orcamento-${s.categoriaId ?? 'geral'}`,
      tom: 'alerta',
      tema: 'orcamento',
      titulo: s.situacao === 'ultrapassou' ? t('an.orc.passou') : t('an.orc.perto'),
      texto: s.mensagem,
    });
  }
  if (!geral && categorias.length === 0 && e.atual.despesasCentavos > 0) {
    insights.push({
      id: 'sem-orcamento',
      tom: 'neutro',
      tema: 'orcamento',
      titulo: t('an.orc.defina'),
      texto: t('an.orc.defina.texto'),
      acao: { rotulo: t('an.orc.definir'), rota: '/orcamento' },
    });
  } else if (categorias.length > 0 && categorias.every((c) => c.situacao === 'dentro') && (!geral || geral.situacao === 'dentro')) {
    insights.push({
      id: 'orcamento-em-dia',
      tom: 'positivo',
      tema: 'orcamento',
      titulo: t('an.orc.emDia'),
      texto: t('an.orc.emDia.texto'),
    });
  }
  return insights;
}

function analisarMetas(e: EntradaAnalise): InsightIA[] {
  const insights: InsightIA[] = [];
  const ativas = e.metas.filter((m) => !m.concluida);

  for (const m of ativas) {
    const ritmo = textoRitmo(m);
    if (m.porMesNecessarioCentavos !== null && m.ritmoMensalCentavos !== null && m.ritmoMensalCentavos < m.porMesNecessarioCentavos) {
      insights.push({
        id: `meta-atrasada-${m.id}`,
        tom: 'alerta',
        tema: 'metas',
        titulo: m.nome,
        texto: t('an.meta.atrasada', {
          necessario: formatarCentavos(m.porMesNecessarioCentavos),
          ritmo: formatarCentavos(m.ritmoMensalCentavos),
        }),
      });
    } else if (ritmo) {
      insights.push({ id: `meta-ritmo-${m.id}`, tom: 'positivo', tema: 'metas', titulo: m.nome, texto: ritmo });
    } else if (m.prazoVencido) {
      insights.push({
        id: `meta-vencida-${m.id}`,
        tom: 'alerta',
        tema: 'metas',
        titulo: m.nome,
        texto: t('an.meta.vencida', { valor: formatarCentavos(m.faltaCentavos) }),
      });
    }
  }

  for (const m of e.metas.filter((x) => x.concluida)) {
    insights.push({ id: `meta-concluida-${m.id}`, tom: 'positivo', tema: 'metas', titulo: m.nome, texto: t('an.meta.concluida') });
  }

  const temReserva = e.metas.some((m) => ehMetaDeReserva(m.nome));
  const fixas = e.perfil?.despesasFixasCentavos ?? 0;
  if (!temReserva && fixas > 0) {
    insights.push({
      id: 'sugestao-reserva',
      tom: 'neutro',
      tema: 'metas',
      titulo: t('sit.reserva'),
      texto: t('an.reserva.texto', { valor: formatarCentavos(fixas * 6) }),
      acao: { rotulo: t('an.criarMeta'), rota: '/nova-meta' },
    });
  } else if (e.metas.length === 0) {
    insights.push({
      id: 'sem-metas',
      tom: 'neutro',
      tema: 'metas',
      titulo: t('an.semMetas.titulo'),
      texto: t('an.semMetas.texto'),
      acao: { rotulo: t('an.criarMeta'), rota: '/nova-meta' },
    });
  }
  return insights;
}

const ORDEM_TOM = { alerta: 0, positivo: 1, neutro: 2 } as const;

export function gerarAnalise(e: EntradaAnalise): Analise {
  if (e.atual.receitasCentavos === 0 && e.atual.despesasCentavos === 0 && e.metas.length === 0) {
    return {
      mes: e.mes,
      resumo: t('an.semDados.resumo', { mes: nomeDoMesSemAno(e.mes) }),
      insights: [
        {
          id: 'sem-dados',
          tom: 'neutro',
          tema: 'gastos',
          titulo: t('an.semDados.titulo'),
          texto: t('an.semDados.texto'),
          acao: { rotulo: t('an.novoLancamento'), rota: '/novo-lancamento' },
        },
      ],
    };
  }

  const insights = [...analisarRenda(e), ...analisarGastos(e), ...analisarOrcamento(e), ...analisarMetas(e)]
    // Estável: mantém a ordem por tema dentro de cada tom
    .map((insight, i) => ({ insight, i }))
    .sort((a, b) => ORDEM_TOM[a.insight.tom] - ORDEM_TOM[b.insight.tom] || a.i - b.i)
    .map(({ insight }) => insight);

  const alertas = insights.filter((i) => i.tom === 'alerta').length;
  const positivos = insights.filter((i) => i.tom === 'positivo').length;
  const partes: string[] = [];
  if (alertas > 0) partes.push(t('an.alertas', { n: alertas }));
  if (positivos > 0) partes.push(t('an.positivos', { n: positivos }));
  const mes = nomeDoMesSemAno(e.mes);
  const resumo =
    partes.length === 2
      ? t('an.resumo.ambos', { mes, a: partes[0], b: partes[1] })
      : partes.length === 1
        ? t('an.resumo.um', { mes, a: partes[0] })
        : t('an.resumo.nada', { mes });

  return {
    mes: e.mes,
    resumo,
    insights,
  };
}

export function obterAnalise(mes: string): Analise {
  return gerarAnalise({
    mes,
    dataHoje: hoje(),
    atual: obterResumoDoMes(mes),
    anterior: obterResumoDoMes(somarMeses(mes, -1)),
    historico: [1, 2, 3].map((i) => obterResumoDoMes(somarMeses(mes, -i))),
    perfil: obterPerfilFinanceiro(),
    recorrentesCentavos: listarTransacoes({ mes, tipo: 'despesa' })
      .filter((tr) => tr.recorrente)
      .reduce((s, tr) => s + tr.valorCentavos, 0),
    orcamentos: obterOrcamentos(mes),
    metas: obterMetas(),
  });
}
