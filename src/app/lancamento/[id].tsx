import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Botao, Cartao } from '@/components/tela';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useImpostosDoLancamentoUE, usePerfilFiscal, useTransacao } from '@/hooks/use-dados';
import { useT } from '@/hooks/use-idioma';
import { useTheme } from '@/hooks/use-theme';
import { localeAtual, type Chave } from '@/i18n';
import { excluirTransacao } from '@/services/transacoes-service';
import { formatarDataPorExtenso } from '@/utils/datas';
import { formatarCentavos } from '@/utils/moeda';

export default function DetalheLancamentoScreen() {
  const t = useT();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const transacao = useTransacao(Number(id));
  const impostos = useImpostosDoLancamentoUE(Number(id));
  const fiscal = usePerfilFiscal();

  function confirmarExclusao() {
    if (!transacao) return;
    Alert.alert(t('lanc.excluir.titulo'), t('lanc.excluir.texto', { nome: transacao.descricao || transacao.categoriaNome }), [
      { text: t('comum.cancelar'), style: 'cancel' },
      {
        text: t('comum.eliminar'),
        style: 'destructive',
        onPress: () => {
          excluirTransacao(transacao.id);
          router.back();
        },
      },
    ]);
  }

  const receita = transacao?.tipo === 'receita';
  const corValor = receita ? theme.positive : theme.negative;
  const nomePais = (p: string) => t(`pais.${p}` as Chave);
  const pct = impostos ? `${impostos.percentual.toLocaleString(localeAtual())}%` : '';
  const regiao = impostos?.regiao ? ` · ${t(`regiao.${impostos.regiao}` as Chave)}` : '';

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topo}>
          <Pressable onPress={() => router.back()} accessibilityRole="button" hitSlop={12}>
            <ThemedText type="smallBold" themeColor="textSecondary">
              {t('comum.voltar')}
            </ThemedText>
          </Pressable>
          <ThemedText type="smallBold" accessibilityRole="header">
            {t('lanc.detalhes')}
          </ThemedText>
          <View style={styles.espacoTopo} />
        </View>

        {!transacao ? (
          <View style={styles.conteudo}>
            <ThemedText themeColor="textSecondary">{t('lanc.naoExiste')}</ThemedText>
            <Botao texto={t('comum.voltar')} onPress={() => router.back()} />
          </View>
        ) : (
          <>
            <ScrollView contentContainerStyle={styles.conteudo}>
              <View style={[styles.selo, { backgroundColor: receita ? theme.positiveSoft : theme.negativeSoft }]}>
                <ThemedText type="smallBold" style={{ color: corValor }}>
                  {receita ? t('lanc.receita') : t('lanc.despesa')}
                </ThemedText>
              </View>

              <View accessible accessibilityLabel={`${transacao.descricao || transacao.categoriaNome}, ${formatarCentavos(transacao.valorCentavos)}`}>
                <ThemedText style={styles.titulo}>{transacao.descricao || transacao.categoriaNome}</ThemedText>
                <ThemedText style={[styles.valor, { color: corValor }]}>
                  {receita ? '+' : '−'} {formatarCentavos(transacao.valorCentavos)}
                </ThemedText>
              </View>

              <Cartao>
                <Linha rotulo={t('lanc.categoria')} valor={transacao.categoriaNome} />
                <Linha rotulo={t('lanc.data')} valor={formatarDataPorExtenso(transacao.data)} />
                <Linha rotulo={t('lanc.descricao')} valor={transacao.descricao || t('lanc.semDescricao')} />
                {!receita && impostos && <Linha rotulo={t('lanc.ondeFoi')} valor={`${nomePais(impostos.pais)}${regiao}`} />}
                {!receita && (
                  <Linha rotulo={t('lanc.recorrencia')} valor={transacao.recorrente ? t('lanc.recorrente.sim') : t('lanc.recorrente.nao')} />
                )}
              </Cartao>

              {impostos && (
                <Cartao>
                  {impostos.origem === 'semRegras' ? (
                    <ThemedText type="small" themeColor="textSecondary">
                      {t('lanc.dica.semRegras', { pais: nomePais(impostos.pais) })}
                    </ThemedText>
                  ) : (
                    <>
                      <View style={styles.linha} accessible>
                        <ThemedText type="smallBold">
                          {impostos.origem === 'identificado' ? t('lanc.impostos.identificados') : t('lanc.impostos.estimados')}
                        </ThemedText>
                        <ThemedText type="smallBold">{formatarCentavos(impostos.totalCentavos)}</ThemedText>
                      </View>
                      <ThemedText type="small" themeColor="textSecondary">
                        {impostos.origem === 'identificado'
                          ? t('lanc.impostos.descIdentificado', { percentual: pct })
                          : t('lanc.impostos.descEstimado', { percentual: pct, pais: nomePais(impostos.pais) })}
                      </ThemedText>
                      {impostos.ivaCentavos > 0 && <Linha rotulo={t('imp.iva')} valor={formatarCentavos(impostos.ivaCentavos)} />}
                      {impostos.especiaisCentavos > 0 && (
                        <Linha rotulo={t('imp.especiais')} valor={formatarCentavos(impostos.especiaisCentavos)} />
                      )}
                      {impostos.avisos.includes('especial-alcool-tabaco-nao-incluido') && (
                        <ThemedText type="small" themeColor="textSecondary">
                          {t('lanc.dica.especial')}
                        </ThemedText>
                      )}
                    </>
                  )}
                </Cartao>
              )}
              {!receita && !fiscal && (
                <ThemedText type="small" themeColor="textSecondary">
                  {t('fiscal.resumo.vazio')}
                </ThemedText>
              )}

              {transacao.recorrente && (
                <View style={[styles.aviso, { backgroundColor: theme.accentSoft }]}>
                  <ThemedText type="smallBold" style={{ color: theme.accentText }}>
                    {t('lanc.recorrente.titulo')}
                  </ThemedText>
                  <ThemedText type="small">{t('lanc.recorrente.texto')}</ThemedText>
                </View>
              )}
            </ScrollView>

            <View style={styles.rodape}>
              <Botao
                texto={t('lanc.editar')}
                onPress={() => router.push({ pathname: '/editar-lancamento/[id]', params: { id: String(transacao.id) } })}
              />
              <Botao texto={t('lanc.excluir')} variante="perigo" onPress={confirmarExclusao} />
            </View>
          </>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <View style={styles.linha} accessible accessibilityLabel={`${rotulo}: ${valor}`}>
      <ThemedText type="small" themeColor="textSecondary">
        {rotulo}
      </ThemedText>
      <ThemedText type="small" style={styles.valorLinha}>
        {valor}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', justifyContent: 'center' },
  safeArea: { flex: 1, maxWidth: MaxContentWidth },
  topo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    minHeight: 44,
  },
  espacoTopo: { width: 60 },
  conteudo: { padding: Spacing.three, gap: Spacing.three },
  selo: { alignSelf: 'flex-start', paddingVertical: Spacing.one, paddingHorizontal: Spacing.three, borderRadius: Spacing.four },
  titulo: { fontSize: 22, lineHeight: 30, fontWeight: 600 },
  valor: { fontSize: 34, lineHeight: 42, fontWeight: 700 },
  linha: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.three, paddingVertical: Spacing.one },
  valorLinha: { flexShrink: 1, textAlign: 'right' },
  aviso: { padding: Spacing.three, borderRadius: Spacing.three, gap: Spacing.one },
  rodape: { padding: Spacing.three, gap: Spacing.two },
});
