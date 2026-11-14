import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { GraficoEvolucao } from '@/components/grafico-evolucao';
import { Botao, Cartao } from '@/components/tela';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useEvolucao } from '@/hooks/use-dados';
import { useT } from '@/hooks/use-idioma';
import { useTheme } from '@/hooks/use-theme';
import { ErroValidacao } from '@/services/erros';
import { pedirAnaliseDaEvolucao } from '@/services/evolucao-service';
import { formatarData, nomeDoMes, paraDataLocal } from '@/utils/datas';

/** Evolução da nota mês a mês, com comentários da EcoTrust IA (recurso do Plus). */
export function SecaoEvolucao() {
  const t = useT();
  const theme = useTheme();
  const { evolucao, analise } = useEvolucao();
  const [escolhido, setEscolhido] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const pontos = evolucao.pontos;
  const indice = escolhido !== null && escolhido < pontos.length ? escolhido : pontos.length - 1;
  const ponto = pontos[indice];

  async function pedirAnalise() {
    setErro(null);
    setCarregando(true);
    try {
      await pedirAnaliseDaEvolucao(evolucao);
    } catch (e) {
      setErro(e instanceof ErroValidacao ? e.message : t('evo.e.gerar'));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <>
      {/* Primeiro, em destaque: a análise do EcoTrust (Claude) */}
      <Cartao>
        <ThemedText type="smallBold">{t('evo.analise')}</ThemedText>
        {analise ? (
          <>
            <ThemedText>{analise.texto}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {t('evo.geradaEm', { data: formatarData(paraDataLocal(new Date(analise.geradoEm))) })}
            </ThemedText>
          </>
        ) : (
          <ThemedText type="small" themeColor="textSecondary">
            {t('evo.peca')}
          </ThemedText>
        )}
        {erro && (
          <ThemedText type="small" style={{ color: theme.negative }} accessibilityLiveRegion="polite">
            {erro}
          </ThemedText>
        )}
        {carregando ? (
          <View style={styles.linha}>
            <ActivityIndicator color={theme.accent} />
            <ThemedText type="small" themeColor="textSecondary">
              {t('evo.analisando')}
            </ThemedText>
          </View>
        ) : (
          <Botao
            texto={analise ? t('evo.atualizar') : t('evo.pedir')}
            variante={analise ? 'secundario' : 'primario'}
            onPress={pedirAnalise}
          />
        )}
      </Cartao>

      {pontos.length > 0 && (
        <Cartao>
          <ThemedText type="small" themeColor="textSecondary">
            {t('evo.toque')}
          </ThemedText>
          <GraficoEvolucao pontos={pontos} selecionado={indice} aoSelecionar={setEscolhido} />
        </Cartao>
      )}

      {ponto && (
        <Animated.View key={ponto.mes} entering={FadeIn.duration(250)}>
          <View style={[styles.comentario, { backgroundColor: theme.accentSoft, borderLeftColor: theme.accent }]} accessible>
            <View style={styles.linha}>
              <ThemedText type="smallBold" style={[styles.flex, { color: theme.accentText }]}>
                EcoTrust IA · {nomeDoMes(ponto.mes)}
              </ThemedText>
              {ponto.delta !== null && ponto.delta !== 0 && (
                <ThemedText type="smallBold" style={{ color: ponto.delta > 0 ? theme.positive : theme.negative }}>
                  {ponto.delta > 0 ? `▲ +${ponto.delta}` : `▼ ${ponto.delta}`}
                </ThemedText>
              )}
            </View>
            <ThemedText>{ponto.comentario}</ThemedText>
          </View>
        </Animated.View>
      )}

      <ThemedText type="small" themeColor="textSecondary">
        {evolucao.resumo}
      </ThemedText>

    </>
  );
}

const styles = StyleSheet.create({
  comentario: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    borderLeftWidth: 4,
    gap: Spacing.one,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  flex: {
    flex: 1,
  },
});
