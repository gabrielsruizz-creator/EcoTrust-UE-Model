import { router, useLocalSearchParams } from 'expo-router';
import { useT } from '@/hooks/use-idioma';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CampoValor } from '@/components/campo-valor';
import { Botao } from '@/components/tela';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useMeta } from '@/hooks/use-dados';
import { useTheme } from '@/hooks/use-theme';
import { ErroValidacao } from '@/services/erros';
import { guardarNaMeta, retirarDaMeta } from '@/services/metas-service';
import { formatarCentavos, lerValorEmCentavos } from '@/utils/moeda';
import { vibrarErro, vibrarSucesso } from '@/utils/vibracao';

/** Guardar ou retirar dinheiro de uma meta (parâmetro tipo = "guardar" | "retirar"). */
export default function MovimentarMetaScreen() {
  const theme = useTheme();
  const t = useT();
  const { id, tipo } = useLocalSearchParams<{ id: string; tipo?: string }>();
  const retirando = tipo === 'retirar';
  const dados = useMeta(Number(id));
  const [valorTexto, setValorTexto] = useState('');
  const valor = lerValorEmCentavos(valorTexto);

  const meta = dados?.meta;
  const novoTotal = meta && valor !== null ? meta.atualCentavos + (retirando ? -valor : valor) : null;
  const excedeRetirada = retirando && meta && valor !== null && valor > meta.atualCentavos;
  const podeSalvar = !!meta && valor !== null && !excedeRetirada;

  function confirmar() {
    if (!meta || valor === null) return;
    try {
      if (retirando) retirarDaMeta(meta.id, valor);
      else guardarNaMeta(meta.id, valor);
      vibrarSucesso();
      router.back();
    } catch (erro) {
      vibrarErro();
      Alert.alert(t('comum.erroGuardar'), erro instanceof ErroValidacao ? erro.message : t('comum.tenteNovamente'));
    }
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.topo}>
            <Pressable onPress={() => router.back()} accessibilityRole="button" hitSlop={12}>
              <ThemedText type="smallBold" themeColor="textSecondary">
                {t('comum.cancelar')}
              </ThemedText>
            </Pressable>
            <ThemedText type="smallBold" accessibilityRole="header">
              {retirando ? t('metas.retirarDa') : t('metas.guardarNa')}
            </ThemedText>
            <View style={styles.espacoTopo} />
          </View>

          <View style={styles.conteudo}>
            {!meta ? (
              <ThemedText themeColor="textSecondary">{t('metas.erro.naoExiste')}</ThemedText>
            ) : (
              <>
                <ThemedText style={styles.nome}>{meta.nome}</ThemedText>
                <ThemedText themeColor="textSecondary">
                  {t('metas.guardadoAte', { atual: formatarCentavos(meta.atualCentavos), objetivo: formatarCentavos(meta.objetivoCentavos) })}
                </ThemedText>
                <CampoValor
                  valor={valorTexto}
                  aoMudar={setValorTexto}
                  rotulo={retirando ? t('metas.valorRetirar') : t('metas.valorGuardar')}
                  autoFocus
                  aoConfirmar={confirmar}
                />
                {excedeRetirada ? (
                  <ThemedText type="small" style={{ color: theme.negative }} accessibilityLiveRegion="polite">
                    {t('metas.soTem', { valor: formatarCentavos(meta.atualCentavos) })}
                  </ThemedText>
                ) : (
                  novoTotal !== null && (
                    <ThemedText type="small" themeColor="textSecondary" accessibilityLiveRegion="polite">
                      {t('metas.ficaCom', {
                        valor: formatarCentavos(novoTotal),
                        percentual: Math.min(100, Math.floor((novoTotal / meta.objetivoCentavos) * 100)),
                      })}
                    </ThemedText>
                  )
                )}
                <ThemedText type="small" themeColor="textSecondary">
                  {t('metas.soNaMeta')}
                </ThemedText>
              </>
            )}
          </View>

          <View style={styles.rodape}>
            <Botao
              texto={retirando ? t('metas.retirar') : t('metas.guardar')}
              variante={retirando ? 'perigo' : 'primario'}
              disabled={!podeSalvar}
              onPress={confirmar}
            />
          </View>
        </KeyboardAvoidingView>
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
  flex: {
    flex: 1,
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
    flex: 1,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  nome: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: 600,
  },
  rodape: {
    padding: Spacing.three,
  },
});
