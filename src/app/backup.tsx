import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';

import { Botao, Cartao, IconeCirculo } from '@/components/tela';
import { TelaSecundaria } from '@/components/tela-secundaria';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useUltimoBackup } from '@/hooks/use-dados';
import { useT } from '@/hooks/use-idioma';
import { useTheme } from '@/hooks/use-theme';
import { escolherBackup, exportarBackup, restaurarBackup, resumirBackup } from '@/services/backup-service';
import { ErroValidacao } from '@/services/erros';
import { formatarData, paraDataLocal, tempoRelativo } from '@/utils/datas';
import { vibrarErro, vibrarSucesso } from '@/utils/vibracao';

/** Backup em arquivo: guardar todos os dados fora do celular e trazê-los de volta. */
export default function BackupScreen() {
  const t = useT();
  const theme = useTheme();
  const ultimo = useUltimoBackup();
  const [ocupado, setOcupado] = useState(false);

  function erro(e: unknown, titulo: string) {
    vibrarErro();
    Alert.alert(titulo, e instanceof ErroValidacao ? e.message : t('comum.tenteNovamente'));
  }

  async function exportar() {
    setOcupado(true);
    try {
      await exportarBackup();
      vibrarSucesso();
    } catch (e) {
      erro(e, t('bk.erroFazer'));
    } finally {
      setOcupado(false);
    }
  }

  async function importar() {
    setOcupado(true);
    try {
      const backup = await escolherBackup();
      if (!backup) return;
      const r = resumirBackup(backup);
      Alert.alert(
        t('bk.restaurar.titulo'),
        t('bk.restaurar.texto', {
          data: formatarData(paraDataLocal(new Date(r.criadoEm))),
          lancamentos: t('bk.lancamentos', { n: r.lancamentos }),
          metas: t('bk.metas', { n: r.metas }),
        }),
        [
          { text: t('comum.cancelar'), style: 'cancel' },
          {
            text: t('bk.restaurar'),
            style: 'destructive',
            onPress: () => {
              try {
                restaurarBackup(backup);
                vibrarSucesso();
                Alert.alert(t('bk.restaurado'), t('bk.restaurado.texto'));
              } catch (e) {
                erro(e, t('bk.erroRestaurar'));
              }
            },
          },
        ],
      );
    } catch (e) {
      erro(e, t('bk.erroAbrir'));
    } finally {
      setOcupado(false);
    }
  }

  return (
    <TelaSecundaria titulo={t('pf.backup')}>
      <Cartao style={styles.linha}>
        <IconeCirculo icone="escudo" cor={theme.brand} />
        <View style={styles.flex}>
          <ThemedText type="smallBold">{t('bk.soNeste')}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {t('bk.soNeste.texto')}
          </ThemedText>
        </View>
      </Cartao>

      <ThemedText type="small" themeColor="textSecondary" accessibilityLiveRegion="polite">
        {ultimo ? t('bk.ultimo', { quando: tempoRelativo(ultimo) }) : t('bk.nunca')}
      </ThemedText>

      {ocupado && <ActivityIndicator color={theme.accent} />}

      <Botao texto={t('bk.fazer')} icone="escudo" disabled={ocupado} onPress={exportar} />
      <ThemedText type="small" themeColor="textSecondary">
        {t('bk.fazer.texto')}
      </ThemedText>

      <Botao texto={t('bk.deArquivo')} variante="secundario" disabled={ocupado} onPress={importar} />
      <ThemedText type="small" themeColor="textSecondary">
        {t('bk.deArquivo.texto')}
      </ThemedText>
    </TelaSecundaria>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
});
