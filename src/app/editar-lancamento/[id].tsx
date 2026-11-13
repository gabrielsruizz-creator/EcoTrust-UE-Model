import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormularioLancamento } from '@/components/formulario-lancamento';
import { Botao } from '@/components/tela';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTransacao } from '@/hooks/use-dados';
import { useT } from '@/hooks/use-idioma';
import { editarTransacao } from '@/services/transacoes-service';

export default function EditarLancamentoScreen() {
  const t = useT();
  const { id } = useLocalSearchParams<{ id: string }>();
  const transacao = useTransacao(Number(id));

  if (!transacao) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.vazio}>
          <ThemedText themeColor="textSecondary">{t('lanc.naoExiste')}</ThemedText>
          <Botao texto={t('comum.voltar')} onPress={() => router.back()} />
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <FormularioLancamento
      titulo={t('lanc.editar')}
      inicial={transacao}
      aoSalvar={(dados) => editarTransacao(transacao.id, dados)}
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
