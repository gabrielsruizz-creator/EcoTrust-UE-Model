import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Botao, Cartao } from '@/components/tela';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useAssinatura } from '@/hooks/use-dados';
import { useT } from '@/hooks/use-idioma';
import { useTheme } from '@/hooks/use-theme';
import {
  ativarPlusSimulado,
  cancelarPlus,
  NOME_PLANO_PLUS,
  recursosGratuitos,
  RECURSOS_PREMIUM,
  type RecursoPremium,
} from '@/services/assinatura-service';
import { formatarData, paraDataLocal } from '@/utils/datas';

/** Tela do EcoTrust Plus (paywall). Parâmetro opcional "recurso": de onde a pessoa veio. */
export default function AssinaturaScreen() {
  const t = useT();
  const theme = useTheme();
  const { recurso } = useLocalSearchParams<{ recurso?: string }>();
  const assinatura = useAssinatura();
  const ehPlus = assinatura.plano === 'plus';
  const recursos = Object.entries(RECURSOS_PREMIUM) as [RecursoPremium, (typeof RECURSOS_PREMIUM)[RecursoPremium]][];

  function assinar() {
    Alert.alert(
      t('plus.teste'),
      t('plus.teste.texto', { plano: NOME_PLANO_PLUS }),
      [
        { text: t('comum.cancelar'), style: 'cancel' },
        {
          text: t('plus.ativar'),
          onPress: () => {
            ativarPlusSimulado();
            router.back();
          },
        },
      ],
    );
  }

  function cancelar() {
    Alert.alert(t('plus.cancelar'), t('plus.cancelar.texto'), [
      { text: t('plus.manter'), style: 'cancel' },
      { text: t('plus.cancelar'), style: 'destructive', onPress: cancelarPlus },
    ]);
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topo}>
          <Pressable onPress={() => router.back()} accessibilityRole="button" hitSlop={12}>
            <ThemedText type="smallBold" themeColor="textSecondary">
              {t('comum.fechar')}
            </ThemedText>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.conteudo}>
          <View style={styles.hero}>
            <View style={[styles.selo, { backgroundColor: theme.accent }]}>
              <ThemedText type="smallBold" style={[styles.textoSelo, { color: theme.onAccent }]}>
                PLUS
              </ThemedText>
            </View>
            <ThemedText style={styles.titulo} accessibilityRole="header">
              {NOME_PLANO_PLUS}
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.subtitulo}>
              {ehPlus
                ? t('plus.ativa')
                : t('plus.convite')}
            </ThemedText>
          </View>

          <Cartao>
            <ThemedText type="smallBold">{t('plus.incluido')}</ThemedText>
            {recursos.map(([id, r]) => (
              <View
                key={id}
                style={[styles.item, id === recurso && { backgroundColor: theme.accentSoft }]}
                accessible
                accessibilityLabel={`${r.nome}. ${r.descricao}`}>
                <ThemedText type="smallBold" style={{ color: theme.accentText }}>
                  ✓
                </ThemedText>
                <View style={styles.flex}>
                  <ThemedText type="smallBold">{r.nome}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {r.descricao}
                  </ThemedText>
                </View>
              </View>
            ))}
          </Cartao>

          <Cartao>
            <ThemedText type="smallBold">{t('plus.gratis')}</ThemedText>
            {recursosGratuitos().map((r) => (
              <ThemedText key={r} type="small" themeColor="textSecondary">
                • {r}
              </ThemedText>
            ))}
          </Cartao>

          {ehPlus ? (
            <>
              {assinatura.ativadoEm && (
                <ThemedText type="small" themeColor="textSecondary" style={styles.centralizado}>
                  {t(assinatura.simulada ? 'plus.ativaDesdeSimulada' : 'plus.ativaDesde', {
                    data: formatarData(paraDataLocal(new Date(assinatura.ativadoEm))),
                  })}
                </ThemedText>
              )}
              <Botao texto={t('plus.cancelar')} variante="perigo" onPress={cancelar} />
            </>
          ) : (
            <>
              <Botao texto={t('plus.assinar', { plano: NOME_PLANO_PLUS })} onPress={assinar} />
              <ThemedText type="small" themeColor="textSecondary" style={styles.centralizado}>
                {t('plus.teste.rodape')}
              </ThemedText>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
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
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    minHeight: 44,
    alignItems: 'center',
  },
  conteudo: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  hero: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },
  selo: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.two,
  },
  textoSelo: {
    letterSpacing: 1,
  },
  titulo: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: 700,
    textAlign: 'center',
  },
  subtitulo: {
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    gap: Spacing.two,
    padding: Spacing.two,
    borderRadius: Spacing.two,
  },
  flex: {
    flex: 1,
  },
  centralizado: {
    textAlign: 'center',
  },
});
