import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icone } from '@/components/icone';
import { Botao } from '@/components/tela';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useT } from '@/hooks/use-idioma';
import { useTheme } from '@/hooks/use-theme';
import { ErroValidacao } from '@/services/erros';
import { lerQrFaturaPT, validarFaturaParaDespesa } from '@/services/fatura-pt-service';
import { obterTransacaoPorChaveNota } from '@/services/transacoes-service';
import { formatarData } from '@/utils/datas';
import { vibrarErro, vibrarSucesso } from '@/utils/vibracao';

// Cores fixas sobre a imagem da câmara (sempre escura), não dependem do tema.
const BRANCO = '#FFFFFF';
const FUNDO_CAMERA = '#000000';

/** Lê o código QR de uma fatura portuguesa e abre o formulário de despesa já preenchido. Tudo fica no aparelho. */
export default function LerFaturaScreen() {
  const t = useT();
  const theme = useTheme();
  const [permissao, pedirPermissao] = useCameraPermissions();
  const [lanterna, setLanterna] = useState(false);
  // A câmara dispara várias leituras por segundo: o ref garante que só a primeira é tratada.
  const ocupado = useRef(false);

  function liberar() {
    ocupado.current = false;
  }

  function aoLer({ data }: BarcodeScanningResult) {
    if (ocupado.current) return;
    ocupado.current = true;

    const fatura = lerQrFaturaPT(data);
    if (!fatura) {
      vibrarErro();
      Alert.alert(t('fatura.naoAT'), t('fatura.naoAT.texto'), [{ text: t('fatura.tentar'), onPress: liberar }]);
      return;
    }
    try {
      validarFaturaParaDespesa(fatura);
    } catch (e) {
      vibrarErro();
      Alert.alert(t('fatura.naoUsar'), e instanceof ErroValidacao ? e.message : t('comum.tenteNovamente'), [
        { text: t('fatura.lerOutra'), onPress: liberar },
      ]);
      return;
    }

    const existente = obterTransacaoPorChaveNota(fatura.chave);
    if (existente) {
      vibrarErro();
      Alert.alert(
        t('fatura.jaRegistada'),
        t('fatura.jaRegistada.texto', {
          data: formatarData(existente.data),
          descricao: existente.descricao || existente.categoriaNome,
        }),
        [
          { text: t('fatura.lerOutra'), onPress: liberar },
          {
            text: t('fatura.verMovimento'),
            onPress: () => router.replace({ pathname: '/lancamento/[id]', params: { id: String(existente.id) } }),
          },
        ],
      );
      return;
    }

    vibrarSucesso();
    // O texto do QR vai para o formulário, que volta a lê-lo (a fonte da verdade é sempre a fatura).
    router.replace({ pathname: '/novo-lancamento', params: { tipo: 'despesa', qr: data } });
  }

  let conteudo;
  if (!permissao) {
    conteudo = <ActivityIndicator color={theme.accent} />;
  } else if (!permissao.granted) {
    conteudo = (
      <View style={styles.pedido}>
        <Icone nome="qrcode" cor={theme.accentText} tamanho={48} />
        <ThemedText style={styles.titulo}>{t('fatura.permissao.titulo')}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.centro}>
          {t('fatura.permissao.texto')}
        </ThemedText>
        {permissao.canAskAgain ? (
          <Botao texto={t('fatura.permitir')} onPress={pedirPermissao} />
        ) : (
          <Botao texto={t('fatura.ajustes')} onPress={() => Linking.openSettings()} />
        )}
      </View>
    );
  } else {
    conteudo = (
      <View style={styles.cameraArea}>
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          enableTorch={lanterna}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={aoLer}
        />
        <View style={styles.mira} pointerEvents="none" />
        <View style={styles.rodapeCamera}>
          <ThemedText type="small" style={[styles.textoBranco, styles.centro, styles.etiqueta]}>
            {t('fatura.aponte')}
          </ThemedText>
          <Pressable
            onPress={() => setLanterna(!lanterna)}
            accessibilityRole="button"
            accessibilityLabel={lanterna ? t('fatura.lanternaDesligar') : t('fatura.lanternaLigar')}
            accessibilityState={{ selected: lanterna }}
            style={[styles.botaoLanterna, lanterna && { backgroundColor: theme.accent }]}>
            <Icone nome="lanterna" cor={BRANCO} tamanho={22} />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.flex}>
        <View style={styles.topo}>
          <Pressable onPress={() => router.back()} accessibilityRole="button" hitSlop={12}>
            <ThemedText type="smallBold" themeColor="textSecondary">
              {t('comum.cancelar')}
            </ThemedText>
          </Pressable>
          <ThemedText type="smallBold" accessibilityRole="header">
            {t('fatura.titulo')}
          </ThemedText>
          <Pressable
            onPress={() => router.replace({ pathname: '/novo-lancamento', params: { tipo: 'despesa' } })}
            accessibilityRole="button"
            accessibilityLabel={t('fatura.digitar.rotulo')}
            hitSlop={12}>
            <ThemedText type="smallBold" style={{ color: theme.accentText }}>
              {t('fatura.digitar')}
            </ThemedText>
          </Pressable>
        </View>
        <View style={styles.centroTela}>{conteudo}</View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  topo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    minHeight: 44,
  },
  centroTela: { flex: 1, justifyContent: 'center' },
  centro: { textAlign: 'center' },
  pedido: { alignItems: 'center', gap: Spacing.three, padding: Spacing.four },
  titulo: { fontSize: 22, lineHeight: 30, fontWeight: 700 },
  cameraArea: { flex: 1, overflow: 'hidden', backgroundColor: FUNDO_CAMERA, alignItems: 'center', justifyContent: 'center' },
  mira: { width: 240, height: 240, borderRadius: Spacing.four, borderWidth: 3, borderColor: 'rgba(255,255,255,0.9)' },
  rodapeCamera: {
    position: 'absolute',
    left: Spacing.three,
    right: Spacing.three,
    bottom: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
  },
  etiqueta: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  textoBranco: { color: BRANCO },
  botaoLanterna: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
