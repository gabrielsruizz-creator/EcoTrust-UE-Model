/**
 * Evolução da saúde financeira mês a mês, com comentários.
 * - `montarEvolucao` (puro): comentário da EcoTrust IA para cada mês, dizendo o que mudou nos fatores.
 * - `pedirAnaliseDaEvolucao`: pede ao Claude um comentário sobre a evolução (usa créditos da API),
 *   e guarda o resultado para não pedir de novo sem necessidade.
 */

import { idiomaAtual, t } from '@/i18n';
import { lerConfiguracao, salvarConfiguracao } from '@/repositories/configuracoes-repository';
import { listarHistoricoSaude, type PontoHistoricoSaude } from '@/repositories/jornada-repository';
import { montarContextoIA } from '@/services/contexto-ia-service';
import { ErroValidacao } from '@/services/erros';
import { faixaDaNota, ROTULO_FAIXA, type FaixaSaude } from '@/services/saude-service';
import { mesAtual, nomeDoMes, nomeDoMesSemAno } from '@/utils/datas';

const CHAVE_FATOR = {
  poupanca: 'saude.poupanca',
  fixas: 'saude.fixas',
  orcamento: 'saude.orcamento',
  metas: 'saude.metas',
  'nao-essenciais': 'saude.naoEssenciais',
  saldo: 'saude.saldo',
} as const;

function nomeFator(id: string) {
  const chave = CHAVE_FATOR[id as keyof typeof CHAVE_FATOR];
  return chave ? t(chave) : id;
}

/** Quantos meses o gráfico mostra */
export const MESES_EVOLUCAO = 6;

export type PontoEvolucao = {
  mes: string;
  nota: number;
  faixa: FaixaSaude;
  estimado: boolean;
  /** Diferença em relação ao mês anterior do gráfico (null no primeiro) */
  delta: number | null;
  comentario: string;
};

export type Evolucao = { pontos: PontoEvolucao[]; resumo: string };

const nomeMes = (mes: string) => nomeDoMesSemAno(mes);
const pontos = (n: number) => t('evo.pontos', { n });

function maiorVariacao(atual: Record<string, number>, anterior: Record<string, number>, sinal: 1 | -1) {
  let melhor: { id: string; diferenca: number } | null = null;
  for (const id of Object.keys(atual)) {
    const diferenca = Math.round(((atual[id] ?? 0) - (anterior[id] ?? 0)) * sinal);
    if (diferenca >= 1 && (!melhor || diferenca > melhor.diferenca)) melhor = { id, diferenca };
  }
  return melhor;
}

function comentar(ponto: PontoHistoricoSaude, anterior: PontoHistoricoSaude | null): string {
  const faixa = ROTULO_FAIXA[faixaDaNota(ponto.nota)];
  const partes: string[] = [];
  if (!anterior) {
    partes.push(t('evo.primeiro', { mes: nomeMes(ponto.mes), nota: ponto.nota, faixa }));
  } else {
    const delta = ponto.nota - anterior.nota;
    if (delta > 0) partes.push(t('evo.subiu', { pontos: pontos(delta), mes: nomeMes(anterior.mes) }));
    else if (delta < 0) partes.push(t('evo.caiu', { pontos: pontos(-delta), mes: nomeMes(anterior.mes) }));
    else partes.push(t('evo.igual', { mes: nomeMes(anterior.mes) }));

    if (ponto.fatores && anterior.fatores) {
      const ganho = maiorVariacao(ponto.fatores, anterior.fatores, 1);
      const perda = maiorVariacao(ponto.fatores, anterior.fatores, -1);
      if (ganho) partes.push(t('evo.ajudou', { fator: nomeFator(ganho.id), n: ganho.diferenca }));
      if (perda) partes.push(t('evo.pesou', { fator: nomeFator(perda.id), n: perda.diferenca }));
    }
  }
  if (ponto.estimado) partes.push(t('evo.estimado'));
  return partes.join(' ');
}

export function montarEvolucao(historico: PontoHistoricoSaude[]): Evolucao {
  const recentes = historico.slice(-MESES_EVOLUCAO);
  const pontosEvolucao = recentes.map((p, i) => ({
    mes: p.mes,
    nota: p.nota,
    faixa: faixaDaNota(p.nota),
    estimado: p.estimado,
    delta: i > 0 ? p.nota - recentes[i - 1].nota : null,
    comentario: comentar(p, i > 0 ? recentes[i - 1] : null),
  }));

  let resumo: string;
  if (pontosEvolucao.length === 0) {
    resumo = t('evo.semDados');
  } else if (pontosEvolucao.length === 1) {
    resumo = t('evo.primeiroMes');
  } else {
    const primeiro = pontosEvolucao[0];
    const ultimo = pontosEvolucao.at(-1)!;
    const melhor = pontosEvolucao.reduce((a, b) => (b.nota > a.nota ? b : a));
    const diferenca = ultimo.nota - primeiro.nota;
    const tendencia =
      diferenca > 0
        ? t('evo.subiuDe', { de: primeiro.nota, para: ultimo.nota })
        : diferenca < 0
          ? t('evo.caiuDe', { de: primeiro.nota, para: ultimo.nota })
          : t('evo.manteve', { nota: ultimo.nota });
    resumo = t('evo.resumo', { n: pontosEvolucao.length, tendencia, mes: nomeMes(melhor.mes), nota: melhor.nota });
  }

  return { pontos: pontosEvolucao, resumo };
}

export function obterEvolucao(): Evolucao {
  return montarEvolucao(listarHistoricoSaude());
}

// ---------- Análise do Claude (sob demanda, guardada) ----------

const CHAVE_ANALISE = 'analise_evolucao';

export type AnaliseEvolucao = { texto: string; mes: string; geradoEm: string };

export function obterAnaliseSalva(): AnaliseEvolucao | null {
  const texto = lerConfiguracao(CHAVE_ANALISE);
  if (!texto) return null;
  try {
    return JSON.parse(texto) as AnaliseEvolucao;
  } catch {
    return null;
  }
}

export function montarPedidoAnalise(evolucao: Evolucao) {
  const linhas = evolucao.pontos.map(
    (p) => t(p.estimado ? 'evo.linhaEstimada' : 'evo.linha', { mes: nomeDoMes(p.mes), nota: p.nota, comentario: p.comentario }),
  );
  return [
    t('evo.pedido1'),
    t('evo.pedido2'),
    t('evo.pedido3'),
    ...linhas,
  ].join('\n');
}

/** Pede ao EcoTrust (Claude) um comentário sobre a evolução e guarda a resposta. */
export async function pedirAnaliseDaEvolucao(evolucao: Evolucao): Promise<AnaliseEvolucao> {
  let dados: { resposta?: string; erro?: string };
  try {
    const resposta = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mensagens: [{ role: 'user', content: montarPedidoAnalise(evolucao) }],
        contexto: montarContextoIA(),
        idioma: idiomaAtual(),
      }),
    });
    dados = (await resposta.json()) as { resposta?: string; erro?: string };
  } catch {
    throw new ErroValidacao(t('evo.e.conexao'));
  }
  if (!dados.resposta) throw new ErroValidacao(dados.erro ?? t('evo.e.gerar'));

  const analise: AnaliseEvolucao = { texto: dados.resposta, mes: mesAtual(), geradoEm: new Date().toISOString() };
  salvarConfiguracao(CHAVE_ANALISE, JSON.stringify(analise));
  return analise;
}
