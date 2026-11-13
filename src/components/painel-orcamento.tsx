import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BarraProgresso } from '@/components/barra-progresso';
import { GraficoOrcamento } from '@/components/grafico-orcamento';
import { EtiquetaSituacao, useCorSituacao } from '@/components/situacao-orcamento';
import { Botao, Cartao } from '@/components/tela';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useImpostometroUE, useOrcamentos } from '@/hooks/use-dados';
import { useT } from '@/hooks/use-idioma';
import { t as traduzirAgora } from '@/i18n';
import type { StatusOrcamento } from '@/services/orcamento-service';
import { mesAtual, nomeDoMes } from '@/utils/datas';
import { formatarCentavos } from '@/utils/moeda';

function abrirEdicao(categoria?: number | 'geral') {
  router.push(
    categoria === undefined
      ? '/editar-orcamento'
      : { pathname: '/editar-orcamento', params: { categoria: String(categoria) } },
  );
}

/** Conteúdo do Orçamento, mostrado dentro da aba Planejar. */
export function PainelOrcamento() {
  const t = useT();
  const mes = mesAtual();
  const orcamentos = useOrcamentos(mes);
  const impostometro = useImpostometroUE(mes);
  const impostosPorCategoria = new Map(impostometro.porCategoria.map((c) => [c.categoriaId, c.impostosCentavos]));
  const [selecionadoId, setSelecionadoId] = useState<number | null>(null);
  // Se a categoria escolhida perdeu o orçamento, volta a mostrar o total.
  const selecionado = orcamentos.categorias.find((c) => c.categoriaId === selecionadoId) ?? null;

  return (
    <>
      <ThemedText themeColor="textSecondary" style={styles.mes}>
        {nomeDoMes(mes)}
      </ThemedText>

      {/* Orçamento geral do mês */}
      <Cartao>
        <ThemedText type="small" themeColor="textSecondary">
          {t('orc.mensal')}
        </ThemedText>
        {orcamentos.geral ? (
          <ResumoGeral status={orcamentos.geral} />
        ) : (
          <>
            <ThemedText type="small">
              {t('orc.definaGeral')}
            </ThemedText>
            {orcamentos.sugestaoGeralCentavos !== null && orcamentos.sugestaoGeralCentavos > 0 && (
              <ThemedText type="small" themeColor="textSecondary">
                {t('orc.sugestaoPerfil', { valor: formatarCentavos(orcamentos.sugestaoGeralCentavos) })}
              </ThemedText>
            )}
            <Botao texto={t('orc.definir')} onPress={() => abrirEdicao('geral')} />
          </>
        )}
      </Cartao>

      {/* Gráfico interativo por categoria */}
      <ThemedText type="smallBold" accessibilityRole="header">
        {t('orc.porCategoria')}
      </ThemedText>
      {orcamentos.categorias.length === 0 ? (
        <Cartao>
          <ThemedText type="small" themeColor="textSecondary">
            {t('orc.definaCategorias')}
          </ThemedText>
          <Botao texto={t('orc.maisCategoria')} onPress={() => abrirEdicao()} />
        </Cartao>
      ) : (
        <>
          <Cartao>
            <ThemedText type="small" themeColor="textSecondary">
              {t('orc.comoDivide')}
            </ThemedText>
            <GraficoOrcamento
              itens={orcamentos.categorias}
              selecionadoId={selecionado?.categoriaId ?? null}
              aoSelecionar={setSelecionadoId}
              impostosPorCategoria={impostosPorCategoria}
            />
          </Cartao>

          {selecionado && (
            <DetalheCategoria
              status={selecionado}
              impostosCentavos={selecionado.categoriaId !== null ? (impostosPorCategoria.get(selecionado.categoriaId) ?? 0) : 0}
            />
          )}

          <Botao
            texto={t('orc.maisCategoria')}
            variante="secundario"
            onPress={() => abrirEdicao()}
          />
        </>
      )}

      <ThemedText type="small" themeColor="textSecondary">
        {t('orc.valemTodos')}
      </ThemedText>
    </>
  );
}

function ResumoGeral({ status }: { status: StatusOrcamento }) {
  const t = useT();
  const cor = useCorSituacao()(status.situacao);
  return (
    <>
      <View style={styles.linhaValores}>
        <ThemedText style={styles.valorGrande}>{formatarCentavos(status.gastoCentavos)}</ThemedText>
        <ThemedText themeColor="textSecondary">{t('orc.deLimite', { valor: formatarCentavos(status.limiteCentavos) })}</ThemedText>
      </View>
      <BarraProgresso
        percentual={status.percentual}
        cor={cor}
        altura={10}
        rotuloAcessivel={t('orc.mensalUsado')}
      />
      <View style={styles.linhaValores}>
        <EtiquetaSituacao situacao={status.situacao} />
        <ThemedText type="small" themeColor="textSecondary">
          {t('orc.usado', { pct: Math.floor(status.percentual) })}
        </ThemedText>
      </View>
      <ThemedText type="small">{status.mensagem ?? textoRestante(status)}</ThemedText>
      <Botao texto={t('orc.alterar')} variante="secundario" onPress={() => abrirEdicao('geral')} />
    </>
  );
}

function textoRestante(status: StatusOrcamento) {
  if (status.restanteCentavos <= 0) return traduzirAgora('orc.chegou');
  const valor = formatarCentavos(status.restanteCentavos);
  return status.porDiaCentavos !== null
    ? traduzirAgora('orc.restamDia', { valor, dia: formatarCentavos(status.porDiaCentavos) })
    : traduzirAgora('orc.restam', { valor });
}

function DetalheCategoria({ status, impostosCentavos }: { status: StatusOrcamento; impostosCentavos: number }) {
  const t = useT();
  const cor = useCorSituacao()(status.situacao);
  return (
    <Cartao>
      <View style={styles.linhaValores}>
        <ThemedText type="smallBold" accessibilityRole="header" accessibilityLiveRegion="polite">
          {status.nome}
        </ThemedText>
        <EtiquetaSituacao situacao={status.situacao} />
      </View>
      <View style={styles.linhaValores}>
        <ThemedText style={styles.valorMedio}>{formatarCentavos(status.gastoCentavos)}</ThemedText>
        <ThemedText themeColor="textSecondary">
          {t('orc.dePct', { valor: formatarCentavos(status.limiteCentavos), pct: Math.floor(status.percentual) })}
        </ThemedText>
      </View>
      <BarraProgresso
        percentual={status.percentual}
        cor={cor}
        rotuloAcessivel={t('orc.categoriaUsado', { nome: status.nome })}
      />
      <ThemedText type="small">{status.mensagem ?? textoRestante(status)}</ThemedText>
      {impostosCentavos > 0 && status.gastoCentavos > 0 && (
        <ThemedText type="small" themeColor="textSecondary">
          {t('orc.impostosDoGasto', {
            valor: formatarCentavos(impostosCentavos),
            pct: Math.round((impostosCentavos / status.gastoCentavos) * 100),
          })}
        </ThemedText>
      )}
      {status.mensagem && status.situacao === 'atencao' && (
        <ThemedText type="small" themeColor="textSecondary">
          {textoRestante(status)}
        </ThemedText>
      )}
      <Botao
        texto={t('orc.editarLimite')}
        variante="secundario"
        onPress={() => status.categoriaId !== null && abrirEdicao(status.categoriaId)}
      />
    </Cartao>
  );
}

const styles = StyleSheet.create({
  mes: {
    textTransform: 'capitalize',
  },
  linhaValores: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
  valorGrande: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: 700,
  },
  valorMedio: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 700,
  },
});
