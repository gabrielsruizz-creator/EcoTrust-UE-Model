import { router, useLocalSearchParams } from 'expo-router';
import { useT } from '@/hooks/use-idioma';
import type { Chave } from '@/i18n';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnelProgresso } from '@/components/anel-progresso';
import { Botao, Cartao } from '@/components/tela';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useMeta } from '@/hooks/use-dados';
import { useTheme } from '@/hooks/use-theme';
import { excluirMeta, textoRitmo } from '@/services/metas-service';
import type { TipoMovimentoMeta } from '@/types/financas';
import { formatarData, nomeDoMes } from '@/utils/datas';
import { formatarCentavos } from '@/utils/moeda';

const ROTULO_MOVIMENTO: Record<TipoMovimentoMeta, Chave> = {
  inicial: 'metas.mov.inicial',
  deposito: 'metas.mov.deposito',
  retirada: 'metas.mov.retirada',
};

function abrirMovimento(id: number, tipo: 'guardar' | 'retirar') {
  router.push({ pathname: '/movimentar-meta/[id]', params: { id: String(id), tipo } });
}

export default function DetalheMetaScreen() {
  const theme = useTheme();
  const t = useT();
  const { id } = useLocalSearchParams<{ id: string }>();
  const dados = useMeta(Number(id));

  function confirmarExclusao() {
    if (!dados) return;
    Alert.alert(
      t('metas.excluir'),
      t('metas.excluir.texto', { nome: dados.meta.nome }),
      [
        { text: t('comum.cancelar'), style: 'cancel' },
        {
          text: t('comum.eliminar'),
          style: 'destructive',
          onPress: () => {
            excluirMeta(dados.meta.id);
            router.back();
          },
        },
      ],
    );
  }

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
            {t('metas.meta')}
          </ThemedText>
          <View style={styles.espacoTopo} />
        </View>

        {!dados ? (
          <View style={styles.conteudo}>
            <ThemedText themeColor="textSecondary">{t('metas.erro.naoExiste')}</ThemedText>
            <Botao texto={t('comum.voltar')} onPress={() => router.back()} />
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.conteudo}>
            {(() => {
              const { meta, movimentos } = dados;
              const cor = meta.concluida ? theme.positive : theme.accent;
              const ritmo = textoRitmo(meta);
              return (
                <>
                  <View style={styles.cabecalho}>
                    <AnelProgresso percentual={meta.percentual} cor={cor} />
                    <ThemedText style={styles.nome} accessibilityRole="header">
                      {meta.nome}
                    </ThemedText>
                    <ThemedText style={styles.valor}>{formatarCentavos(meta.atualCentavos)}</ThemedText>
                    <ThemedText themeColor="textSecondary">
                      {t('metas.de', { valor: formatarCentavos(meta.objetivoCentavos) })}
                    </ThemedText>
                    {meta.concluida && (
                      <ThemedText type="smallBold" style={{ color: theme.positive }}>
                        {t('metas.alcancada')}
                      </ThemedText>
                    )}
                  </View>

                  <Cartao>
                    {!meta.concluida && <Linha rotulo={t('metas.falta')} valor={formatarCentavos(meta.faltaCentavos)} />}
                    <Linha
                      rotulo={t('metas.prazo')}
                      valor={
                        meta.prazo
                          ? `${formatarData(meta.prazo)}${meta.prazoVencido ? ` ${t('metas.passou')}` : ''}`
                          : t('metas.semPrazo')
                      }
                    />
                    {meta.porMesNecessarioCentavos !== null && meta.prazo && (
                      <Linha
                        rotulo={t('metas.guardarPorMesAte', { mes: nomeDoMes(meta.prazo.slice(0, 7)) })}
                        valor={formatarCentavos(meta.porMesNecessarioCentavos)}
                      />
                    )}
                    {meta.ritmoMensalCentavos !== null && (
                      <Linha
                        rotulo={t('metas.ritmoRecente')}
                        valor={t('metas.porMesCurto', { valor: formatarCentavos(meta.ritmoMensalCentavos) })}
                      />
                    )}
                  </Cartao>

                  {ritmo && (
                    <View style={[styles.aviso, { backgroundColor: theme.accentSoft }]}>
                      <ThemedText type="small">{ritmo}</ThemedText>
                    </View>
                  )}

                  <View style={styles.botoes}>
                    <Botao texto={t('metas.guardarDinheiro')} onPress={() => abrirMovimento(meta.id, 'guardar')} />
                    {meta.atualCentavos > 0 && (
                      <Botao
                        texto={t('metas.retirar')}
                        variante="secundario"
                        onPress={() => abrirMovimento(meta.id, 'retirar')}
                      />
                    )}
                    <Botao
                      texto={t('metas.editar')}
                      variante="secundario"
                      onPress={() =>
                        router.push({ pathname: '/editar-meta/[id]', params: { id: String(meta.id) } })
                      }
                    />
                  </View>

                  <ThemedText type="smallBold" accessibilityRole="header">
                    {t('metas.historico')}
                  </ThemedText>
                  {movimentos.length === 0 ? (
                    <ThemedText type="small" themeColor="textSecondary">
                      {t('metas.historicoVazio')}
                    </ThemedText>
                  ) : (
                    <Cartao>
                      {movimentos.map((m) => {
                        const sinal = m.tipo === 'retirada' ? '−' : '+';
                        return (
                          <View
                            key={m.id}
                            style={styles.linha}
                            accessible
                            accessibilityLabel={`${t(ROTULO_MOVIMENTO[m.tipo])} · ${formatarData(m.data)}: ${formatarCentavos(m.valorCentavos)}`}>
                            <View>
                              <ThemedText type="small">{t(ROTULO_MOVIMENTO[m.tipo])}</ThemedText>
                              <ThemedText type="small" themeColor="textSecondary">
                                {formatarData(m.data)}
                              </ThemedText>
                            </View>
                            <ThemedText
                              type="smallBold"
                              style={{ color: m.tipo === 'retirada' ? theme.negative : theme.positive }}>
                              {sinal} {formatarCentavos(m.valorCentavos)}
                            </ThemedText>
                          </View>
                        );
                      })}
                    </Cartao>
                  )}

                  <Botao texto={t('metas.excluir')} variante="perigo" onPress={confirmarExclusao} />
                </>
              );
            })()}
          </ScrollView>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <View style={styles.linha} accessible accessibilityLabel={`${rotulo}: ${valor}`}>
      <ThemedText type="small" themeColor="textSecondary" style={styles.rotulo}>
        {rotulo}
      </ThemedText>
      <ThemedText type="smallBold">{valor}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
  },
  topo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    minHeight: 44,
  },
  espacoTopo: {
    width: 60,
  },
  conteudo: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  cabecalho: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  nome: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: 600,
    textAlign: 'center',
    marginTop: Spacing.two,
  },
  valor: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: 700,
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.one,
  },
  rotulo: {
    flexShrink: 1,
  },
  aviso: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  botoes: {
    gap: Spacing.two,
  },
});
