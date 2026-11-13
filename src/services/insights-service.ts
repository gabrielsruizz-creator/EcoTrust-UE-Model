/**
 * Primeiros insights do EcoTrust: regras simples sobre os dados do usuário.
 * Ordem de importância: alertas → conquistas → informações. A tela mostra o primeiro da lista.
 */

import { localeAtual, t } from '@/i18n';
import type { StatusOrcamento } from '@/services/orcamento-service';
import type { Insight, ResumoMes } from '@/types/financas';
import { formatarCentavos } from '@/utils/moeda';

/** Só comparamos categorias com pelo menos 50 (moeda principal) no mês passado, para evitar "aumentou 300%" sobre 5. */
const MINIMO_COMPARACAO_CENTAVOS = 5000;
/** Aumento a partir do qual vale avisar */
const AUMENTO_RELEVANTE = 0.15;

/** Impostos sobre consumo do mês (do Impostômetro). */
export type ResumoImpostosInsight = {
  impostosCentavos: number;
  percentualDosGastos: number;
  /** Categoria que mais pagou imposto no mês */
  maiorCategoria: { nome: string; impostosCentavos: number } | null;
};

export type EntradaInsights = {
  resumoAtual: ResumoMes;
  resumoAnterior: ResumoMes;
  metaEconomiaCentavos: number;
  percentualMeta: number | null;
  disponivelParaGastarCentavos: number | null;
  /** De onde vem o limite do mês: orçamento geral definido pelo usuário ou renda − meta */
  origemLimite: 'orcamento' | 'renda' | null;
  orcamentosCategorias: StatusOrcamento[];
  impostos?: ResumoImpostosInsight | null;
};

function maiorAumentoDeCategoria(atual: ResumoMes, anterior: ResumoMes) {
  let maior: { categoria: string; percentual: number; diferenca: number } | null = null;
  for (const c of atual.despesasPorCategoria) {
    const antes = anterior.despesasPorCategoria.find((a) => a.categoriaId === c.categoriaId);
    if (!antes || antes.totalCentavos < MINIMO_COMPARACAO_CENTAVOS) continue;
    const diferenca = c.totalCentavos - antes.totalCentavos;
    if (diferenca / antes.totalCentavos < AUMENTO_RELEVANTE) continue;
    if (!maior || diferenca > maior.diferenca) {
      maior = {
        categoria: c.categoria,
        percentual: Math.round((diferenca / antes.totalCentavos) * 100),
        diferenca,
      };
    }
  }
  return maior;
}

export function gerarInsights(entrada: EntradaInsights): Insight[] {
  const { resumoAtual: atual, resumoAnterior: anterior } = entrada;

  if (atual.receitasCentavos === 0 && atual.despesasCentavos === 0) {
    return [
      {
        id: 'sem-dados',
        tom: 'neutro',
        texto: t('ins.semDados'),
      },
    ];
  }

  const insights: Insight[] = [];

  if (atual.receitasCentavos > 0 && atual.despesasCentavos > atual.receitasCentavos) {
    insights.push({
      id: 'gastou-mais-que-recebeu',
      tom: 'alerta',
      texto: t('ins.passouReceitas', { valor: formatarCentavos(atual.despesasCentavos - atual.receitasCentavos) }),
    });
  }

  if (entrada.disponivelParaGastarCentavos !== null && entrada.disponivelParaGastarCentavos < 0) {
    const excesso = formatarCentavos(-entrada.disponivelParaGastarCentavos);
    insights.push({
      id: 'acima-do-limite',
      tom: 'alerta',
      texto:
        entrada.origemLimite === 'orcamento'
          ? t('ins.passouOrcamento', { valor: excesso })
          : entrada.metaEconomiaCentavos > 0
            ? t('ins.passouMeta', { valor: excesso })
            : t('ins.passouRenda', { valor: excesso }),
    });
  }

  // Orçamentos por categoria: o mais estourado e o mais perto do limite.
  const estourado = entrada.orcamentosCategorias
    .filter((o) => o.situacao === 'ultrapassou')
    .sort((a, b) => a.restanteCentavos - b.restanteCentavos)[0];
  if (estourado?.mensagem) {
    insights.push({ id: 'orcamento-ultrapassado', tom: 'alerta', texto: estourado.mensagem });
  }
  const atencao = entrada.orcamentosCategorias
    .filter((o) => o.situacao === 'atencao')
    .sort((a, b) => b.percentual - a.percentual)[0];
  if (atencao?.mensagem) {
    insights.push({ id: 'orcamento-atencao', tom: 'alerta', texto: atencao.mensagem });
  }

  const aumento = maiorAumentoDeCategoria(atual, anterior);
  if (aumento) {
    insights.push({
      id: 'aumento-categoria',
      tom: 'alerta',
      texto: t('ins.aumento', { categoria: aumento.categoria, pct: aumento.percentual }),
    });
  }

  if (entrada.percentualMeta !== null && entrada.percentualMeta >= 100) {
    insights.push({
      id: 'meta-atingida',
      tom: 'positivo',
      texto: t('ins.metaAtingida'),
    });
  } else if (entrada.percentualMeta !== null && entrada.percentualMeta > 0) {
    insights.push({
      id: 'progresso-meta',
      tom: 'positivo',
      texto: t('ins.progressoMeta', { pct: Math.floor(entrada.percentualMeta) }),
    });
  }

  if (
    entrada.disponivelParaGastarCentavos !== null &&
    entrada.disponivelParaGastarCentavos >= 0 &&
    atual.despesasCentavos > 0
  ) {
    insights.push({
      id: 'dentro-do-orcamento',
      tom: 'positivo',
      texto: t('ins.dentro', { valor: formatarCentavos(entrada.disponivelParaGastarCentavos) }),
    });
  }

  const impostos = entrada.impostos;
  if (impostos && impostos.impostosCentavos > 0) {
    const maior = impostos.maiorCategoria;
    insights.push({
      id: 'impostos-do-mes',
      tom: 'neutro',
      texto:
        t('ins.impostos', {
          valor: formatarCentavos(impostos.impostosCentavos),
          pct: impostos.percentualDosGastos.toLocaleString(localeAtual()),
        }) +
        (maior ? t('ins.impostosOnde', { categoria: maior.nome, valor: formatarCentavos(maior.impostosCentavos) }) : ''),
    });
  }

  const principal = atual.despesasPorCategoria[0];
  if (principal && atual.despesasCentavos > 0) {
    insights.push({
      id: 'categoria-principal',
      tom: 'neutro',
      texto: t('ins.principal', {
        categoria: principal.categoria,
        valor: formatarCentavos(principal.totalCentavos),
        pct: Math.round((principal.totalCentavos / atual.despesasCentavos) * 100),
      }),
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: 'continue-registrando',
      tom: 'neutro',
      texto: t('ins.continue'),
    });
  }

  return insights;
}
