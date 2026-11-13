import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CampoValor } from '@/components/campo-valor';
import { Chip } from '@/components/chip';
import { Botao } from '@/components/tela';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useCategorias, useDashboard, useOrcamentos } from '@/hooks/use-dados';
import { useT } from '@/hooks/use-idioma';
import { ErroValidacao } from '@/services/erros';
import {
  definirOrcamento,
  excluirOrcamento,
  obterLimite,
  sugerirLimiteCategoria,
} from '@/services/orcamento-service';
import { mesAtual } from '@/utils/datas';
import { centavosParaTexto, formatarCentavos, lerValorEmCentavos } from '@/utils/moeda';
import { vibrarErro, vibrarSucesso } from '@/utils/vibracao';

/**
 * Parâmetro "categoria": "geral" (orçamento do mês), o id de uma categoria (editar),
 * ou ausente (novo orçamento por categoria: o usuário escolhe a categoria).
 */
export default function EditarOrcamentoScreen() {
  const t = useT();
  const { categoria: parametro } = useLocalSearchParams<{ categoria?: string }>();
  const geral = parametro === 'geral';
  const idFixo = parametro && !geral ? Number(parametro) : null;
  const mes = mesAtual();

  const categoriasDespesa = useCategorias('despesa');
  const orcamentos = useOrcamentos(mes);
  const dashboard = useDashboard(mes);
  const [categoriaEscolhida, setCategoriaEscolhida] = useState<number | null>(null);
  const categoriaId = geral ? null : (idFixo ?? categoriaEscolhida);

  const limiteAtual = useMemo(
    () => (geral || idFixo !== null ? obterLimite(geral ? null : idFixo) : null),
    [geral, idFixo],
  );
  const [valorTexto, setValorTexto] = useState(limiteAtual ? centavosParaTexto(limiteAtual) : '');
  const valor = lerValorEmCentavos(valorTexto);

  const nomeCategoria = categoriasDespesa.find((c) => c.id === categoriaId)?.nome;
  const comOrcamento = new Set(orcamentos.categorias.map((c) => c.categoriaId));
  const disponiveis = categoriasDespesa.filter((c) => !comOrcamento.has(c.id));
  const gastoNoMes = geral
    ? dashboard.despesasCentavos
    : categoriaId !== null
      ? (dashboard.categorias.find((c) => c.categoriaId === categoriaId)?.totalCentavos ?? 0)
      : null;

  const sugestao = useMemo(() => {
    if (geral) {
      return orcamentos.sugestaoGeralCentavos
        ? { valor: orcamentos.sugestaoGeralCentavos, texto: t('orc.sugestaoGeral') }
        : null;
    }
    if (categoriaId === null) return null;
    const media = sugerirLimiteCategoria(categoriaId, mes);
    return media ? { valor: media, texto: t('orc.sugestaoMedia') } : null;
  }, [geral, categoriaId, mes, orcamentos.sugestaoGeralCentavos, t]);

  const titulo = geral
    ? t('orc.mensal')
    : idFixo !== null
      ? t('orc.de', { nome: nomeCategoria ?? t('orc.categoria') })
      : t('orc.novo');
  const podeSalvar = valor !== null && (geral || categoriaId !== null);

  function salvar() {
    if (!podeSalvar || valor === null) return;
    try {
      definirOrcamento(categoriaId, valor);
      vibrarSucesso();
      router.back();
    } catch (erro) {
      vibrarErro();
      Alert.alert(
        t('comum.erroGuardar'),
        erro instanceof ErroValidacao ? erro.message : t('comum.tenteNovamente'),
      );
    }
  }

  function confirmarRemocao() {
    Alert.alert(t('orc.remover'), t('orc.remover.texto'), [
      { text: t('comum.cancelar'), style: 'cancel' },
      {
        text: t('orc.removerBotao'),
        style: 'destructive',
        onPress: () => {
          excluirOrcamento(categoriaId);
          router.back();
        },
      },
    ]);
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.topo}>
            <Pressable onPress={() => router.back()} accessibilityRole="button" hitSlop={12}>
              <ThemedText type="smallBold" themeColor="textSecondary">
                Cancelar
              </ThemedText>
            </Pressable>
            <ThemedText type="smallBold" accessibilityRole="header" numberOfLines={1} style={styles.titulo}>
              {titulo}
            </ThemedText>
            <View style={styles.espacoTopo} />
          </View>

          <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
            {!geral && idFixo === null && (
              <View style={styles.secao}>
                <ThemedText type="smallBold">{t('orc.categoria')}</ThemedText>
                {disponiveis.length === 0 ? (
                  <ThemedText type="small" themeColor="textSecondary">
                    {t('orc.todasTem')}
                  </ThemedText>
                ) : (
                  <View style={styles.chips} accessibilityRole="radiogroup">
                    {disponiveis.map((c) => (
                      <Chip
                        key={c.id}
                        texto={c.nome}
                        ativo={c.id === categoriaEscolhida}
                        aoTocar={() => setCategoriaEscolhida(c.id)}
                      />
                    ))}
                  </View>
                )}
              </View>
            )}

            <View style={styles.secao}>
              <ThemedText type="smallBold">
                {geral ? t('orc.quantoTotal') : t('orc.limiteMes')}
              </ThemedText>
              <CampoValor
                valor={valorTexto}
                aoMudar={setValorTexto}
                rotulo={geral ? t('orc.limiteGeral.rotulo') : t('orc.limiteCategoria.rotulo')}
                autoFocus={limiteAtual === null && (geral || idFixo !== null)}
              />
              {gastoNoMes !== null && (
                <ThemedText type="small" themeColor="textSecondary">
                  {t('orc.gastoAteAgora', { valor: formatarCentavos(gastoNoMes) })}
                </ThemedText>
              )}
            </View>

            {sugestao && (
              <View style={styles.secao}>
                <ThemedText type="small" themeColor="textSecondary">
                  {sugestao.texto}:
                </ThemedText>
                <View style={styles.chips}>
                  <Chip
                    texto={t('orc.usar', { valor: formatarCentavos(sugestao.valor) })}
                    ativo={valor === sugestao.valor}
                    aoTocar={() => setValorTexto(centavosParaTexto(sugestao.valor))}
                  />
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.rodape}>
            <Botao texto={t('comum.guardar')} disabled={!podeSalvar} onPress={salvar} />
            {limiteAtual !== null && (
              <Botao texto={t('orc.remover')} variante="perigo" onPress={confirmarRemocao} />
            )}
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
    gap: Spacing.two,
  },
  titulo: {
    flexShrink: 1,
    textAlign: 'center',
  },
  espacoTopo: {
    width: 60,
  },
  conteudo: {
    padding: Spacing.three,
    gap: Spacing.four,
  },
  secao: {
    gap: Spacing.two,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  rodape: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
});
