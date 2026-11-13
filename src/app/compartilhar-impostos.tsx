import { useLocalSearchParams } from 'expo-router';
import { isAvailableAsync, shareAsync } from 'expo-sharing';
import { useRef, useState } from 'react';
import { Alert, StyleSheet, Switch, View, type HostInstance } from 'react-native';
import { captureRef } from 'react-native-view-shot';

import { LogoEcoTrust } from '@/components/logo-ecotrust';
import { Botao } from '@/components/tela';
import { TelaSecundaria } from '@/components/tela-secundaria';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useImpostometroUE } from '@/hooks/use-dados';
import { useT } from '@/hooks/use-idioma';
import { useTheme } from '@/hooks/use-theme';
import { localeAtual, type Chave } from '@/i18n';
import { mesAtual, nomeDoMes } from '@/utils/datas';
import { formatarCentavos } from '@/utils/moeda';
import { vibrarErro, vibrarSucesso } from '@/utils/vibracao';

function numero(n: number) {
  return n.toLocaleString(localeAtual(), { maximumFractionDigits: 1 });
}

function diaEMes(data: string) {
  const [ano, mes, dia] = data.split('-').map(Number);
  return new Date(ano, mes - 1, dia).toLocaleDateString(localeAtual(), { day: 'numeric', month: 'long' });
}

/** Cartão do Impostómetro do mês em imagem, para enviar a amigos ou publicar. */
export default function CompartilharImpostosScreen() {
  const theme = useTheme();
  const t = useT();
  const params = useLocalSearchParams<{ mes?: string }>();
  const mes = params.mes && /^\d{4}-\d{2}$/.test(params.mes) ? params.mes : mesAtual();
  const imp = useImpostometroUE(mes);
  const [mostrarValores, setMostrarValores] = useState(true);
  const [gerando, setGerando] = useState(false);
  const cartao = useRef<HostInstance>(null);
  const nomeMes = nomeDoMes(mes);

  async function compartilhar() {
    setGerando(true);
    try {
      if (!(await isAvailableAsync())) throw new Error('indisponível');
      const uri = await captureRef(cartao, { format: 'png', quality: 1, fileName: 'meu-impostometro' });
      await shareAsync(uri, { mimeType: 'image/png', UTI: 'public.png', dialogTitle: t('partilhar.dialogo') });
      vibrarSucesso();
    } catch {
      vibrarErro();
      Alert.alert(t('partilhar.erro'), t('comum.tenteNovamente'));
    } finally {
      setGerando(false);
    }
  }

  return (
    <TelaSecundaria
      titulo={t('partilhar.titulo')}
      textoVoltar={t('comum.fechar')}
      rodape={<Botao texto={t('partilhar.imagem')} icone="compartilhar" disabled={gerando} onPress={compartilhar} />}>
      {/* O que está dentro deste View vira a imagem */}
      <View ref={cartao} collapsable={false} style={styles.cartao}>
        <View style={styles.decoracao} />
        <ThemedText type="small" style={styles.claro}>
          {t('partilhar.meu', { mes: nomeMes })}
        </ThemedText>
        {mostrarValores ? (
          <ThemedText style={styles.grande} numberOfLines={1} adjustsFontSizeToFit>
            {formatarCentavos(imp.cargaTotalCentavos)}
          </ThemedText>
        ) : (
          <ThemedText style={styles.grande}>
            {imp.percentualDaRenda !== null ? `${numero(imp.percentualDaRenda)}%` : `${numero(imp.percentualDosGastos ?? 0)}%`}
          </ThemedText>
        )}
        <ThemedText style={styles.branco}>
          {mostrarValores
            ? t('partilhar.frase.valor')
            : imp.percentualDaRenda !== null
              ? t('partilhar.frase.renda')
              : t('partilhar.frase.gastos')}
        </ThemedText>

        <View style={styles.numeros}>
          {imp.percentualDosGastos !== null && (
            <Numero valor={`${numero(imp.percentualDosGastos)}%`} rotulo={t('partilhar.gastos')} />
          )}
          {imp.diasTrabalhados !== null && (
            <Numero valor={t('comum.dias', { n: Math.round(imp.diasTrabalhados) })} rotulo={t('partilhar.dias')} />
          )}
        </View>

        {imp.porPais.length > 0 && (
          <View style={styles.esferas}>
            {imp.porPais.slice(0, 4).map((p) => (
              <View key={p.pais} style={styles.esfera}>
                <ThemedText type="small" style={[styles.claro, styles.flex]}>
                  {t(`pais.${p.pais}` as Chave)}
                </ThemedText>
                <ThemedText type="smallBold" style={styles.branco}>
                  {mostrarValores
                    ? formatarCentavos(p.impostosCentavos)
                    : `${numero(p.gastoCentavos > 0 ? (p.impostosCentavos / p.gastoCentavos) * 100 : 0)}%`}
                </ThemedText>
              </View>
            ))}
          </View>
        )}

        {imp.liberdade && (
          <ThemedText type="small" style={styles.claro}>
            {t('partilhar.liberdade', { ano: mes.slice(0, 4), data: diaEMes(imp.liberdade.data) })}
          </ThemedText>
        )}

        <View style={styles.rodapeCartao}>
          <LogoEcoTrust tamanho={20} cor="#F3EEE4" />
          <ThemedText type="smallBold" style={styles.branco}>
            {t('partilhar.marca')}
          </ThemedText>
        </View>
      </View>

      <View style={[styles.opcao, { backgroundColor: theme.backgroundElement }]}>
        <View style={styles.flex}>
          <ThemedText type="smallBold">{t('partilhar.mostrarValores')}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {t('partilhar.mostrarValores.ajuda')}
          </ThemedText>
        </View>
        <Switch
          value={mostrarValores}
          onValueChange={setMostrarValores}
          trackColor={{ true: theme.positive }}
          accessibilityLabel={t('partilhar.mostrarValores')}
        />
      </View>
    </TelaSecundaria>
  );
}

function Numero({ valor, rotulo }: { valor: string; rotulo: string }) {
  return (
    <View style={styles.numero}>
      <ThemedText style={styles.medio}>{valor}</ThemedText>
      <ThemedText type="small" style={styles.claro}>
        {rotulo}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  cartao: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.two,
    overflow: 'hidden',
    backgroundColor: '#16150F',
    experimental_backgroundImage: 'linear-gradient(135deg, #16150F, #2F2C24)',
  },
  decoracao: {
    position: 'absolute',
    right: -50,
    top: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  claro: {
    color: 'rgba(255,255,255,0.85)',
  },
  branco: {
    color: '#FFFFFF',
  },
  grande: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: 700,
    color: '#FFFFFF',
  },
  medio: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: 700,
    color: '#FFFFFF',
  },
  numeros: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  numero: {
    flex: 1,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  esferas: {
    gap: Spacing.one,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  esfera: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rodapeCartao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
});
