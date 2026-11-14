import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { abrirCurso } from '@/components/academy-cartoes';
import { BarraProgresso } from '@/components/barra-progresso';
import { BloqueioPremium } from '@/components/bloqueio-premium';
import { Botao, Cartao } from '@/components/tela';
import { TelaSecundaria } from '@/components/tela-secundaria';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useT } from '@/hooks/use-idioma';
import { useAssinatura, useCursosDaCategoria } from '@/hooks/use-dados';
import { useTheme } from '@/hooks/use-theme';
import { temAcesso } from '@/services/assinatura-service';

const BRANCO = '#FFFFFF';

export default function CategoriaScreen() {
  const t = useT();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const dados = useCursosDaCategoria(String(id));
  const plus = temAcesso('academy', useAssinatura());

  if (!plus) {
    return (
      <TelaSecundaria titulo={t('acad.categoria')}>
        <BloqueioPremium recurso="academy" />
      </TelaSecundaria>
    );
  }

  if (!dados) {
    return (
      <TelaSecundaria titulo={t('acad.categoria')}>
        <ThemedText themeColor="textSecondary">{t('acad.naoEncontradaCategoria')}</ThemedText>
        <Botao texto={t('comum.voltar')} onPress={() => router.back()} />
      </TelaSecundaria>
    );
  }

  const { categoria, cursos } = dados;

  return (
    <TelaSecundaria titulo={categoria.nome}>
      <View style={[styles.capa, { backgroundColor: categoria.cor }]}>
        <ThemedText style={styles.icone}>{categoria.icone}</ThemedText>
        <ThemedText style={[styles.titulo, { color: BRANCO }]} accessibilityRole="header">
          {categoria.nome}
        </ThemedText>
        <ThemedText type="small" style={{ color: BRANCO }}>
          {categoria.descricao}
        </ThemedText>
      </View>

      <ThemedText type="smallBold" accessibilityRole="header">
        {t('acad.cursos', { n: cursos.length })}
      </ThemedText>
      {cursos.map((p) => (
        <Pressable
          key={p.curso.id}
          onPress={() => abrirCurso(p.curso.id)}
          accessibilityRole="button"
          accessibilityLabel={t('acad.cursoRotulo', { titulo: p.curso.titulo, resumo: p.curso.resumo, n: p.concluidas, total: p.total })}
          style={({ pressed }) => pressed && styles.pressionado}>
          <Cartao>
            <View style={styles.linha}>
              <ThemedText type="smallBold" style={styles.flex}>
                {p.curso.titulo}
              </ThemedText>
              {p.noMeusCursos && (
                <ThemedText type="small" style={{ color: theme.accentText }}>
                  {t('acad.meusCursos')}
                </ThemedText>
              )}
            </View>
            <ThemedText type="small" themeColor="textSecondary">
              {p.curso.resumo}
            </ThemedText>
            <BarraProgresso percentual={p.percentual} cor={categoria.cor} altura={6} />
            <ThemedText type="small" themeColor="textSecondary">
              {p.concluido ? t('acad.concluido') : t('acad.nDeAulas', { n: p.concluidas, total: p.total })} ·{' '}
              {t('acad.minTotal', { n: p.aulas.reduce((soma, a) => soma + a.minutos, 0) })}
            </ThemedText>
          </Cartao>
        </Pressable>
      ))}
    </TelaSecundaria>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  capa: {
    padding: Spacing.four,
    borderRadius: Spacing.four,
    gap: Spacing.one,
  },
  icone: {
    fontSize: 36,
    lineHeight: 44,
  },
  titulo: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: 700,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  pressionado: {
    opacity: 0.7,
  },
});
