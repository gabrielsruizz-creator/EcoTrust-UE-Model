import { router, useLocalSearchParams } from 'expo-router';
import { useT } from '@/hooks/use-idioma';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormularioMeta } from '@/components/formulario-meta';
import { Botao } from '@/components/tela';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useMeta } from '@/hooks/use-dados';
import { editarMeta } from '@/services/metas-service';

export default function EditarMetaScreen() {
  const t = useT();
  const { id } = useLocalSearchParams<{ id: string }>();
  const dados = useMeta(Number(id));

  if (!dados) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.vazio}>
          <ThemedText themeColor="textSecondary">{t('metas.erro.naoExiste')}</ThemedText>
          <Botao texto={t('comum.voltar')} onPress={() => router.back()} />
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <FormularioMeta
      titulo={t('metas.editar')}
      inicial={dados.meta}
      aoSalvar={(novos) => editarMeta(dados.meta.id, novos)}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  vazio: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
});
