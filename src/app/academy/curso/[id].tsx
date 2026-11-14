import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { abrirAula } from '@/components/academy-cartoes';
import { AnelProgresso } from '@/components/anel-progresso';
import { BloqueioPremium } from '@/components/bloqueio-premium';
import { Botao, Cartao } from '@/components/tela';
import { TelaSecundaria } from '@/components/tela-secundaria';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useT } from '@/hooks/use-idioma';
import { useAssinatura, useCurso } from '@/hooks/use-dados';
import { useTheme } from '@/hooks/use-theme';
import { adicionarAosMeusCursos, removerDosMeusCursos } from '@/services/academy-service';
import { temAcesso } from '@/services/assinatura-service';

const BRANCO = '#FFFFFF';
const BRANCO_SUAVE = 'rgba(255,255,255,0.85)';

export default function CursoScreen() {
  const t = useT();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const dados = useCurso(String(id));
  const plus = temAcesso('academy', useAssinatura());

  if (!plus) {
    return (
      <TelaSecundaria titulo={t('acad.curso')}>
        <BloqueioPremium recurso="academy" />
      </TelaSecundaria>
    );
  }

  if (!dados) {
    return (
      <TelaSecundaria titulo={t('acad.curso')}>
        <ThemedText themeColor="textSecondary">{t('acad.e.curso')}</ThemedText>
        <Botao texto={t('comum.voltar')} onPress={() => router.back()} />
      </TelaSecundaria>
    );
  }

  const { progresso: p, concluidas } = dados;
  const textoBotao = p.concluido
    ? t('acad.revisar')
    : p.concluidas === 0
      ? t('acad.comecar')
      : t('acad.continuarAula', { n: p.aulas.indexOf(p.proximaAula) + 1 });

  return (
    <TelaSecundaria titulo={t('acad.curso')}>
      <View style={[styles.capa, { backgroundColor: p.categoria.cor }]}>
        <View style={styles.flex}>
          <ThemedText type="small" style={{ color: BRANCO_SUAVE }}>
            {p.categoria.icone} {p.categoria.nome}
          </ThemedText>
          <ThemedText style={[styles.titulo, { color: BRANCO }]} accessibilityRole="header">
            {p.curso.titulo}
          </ThemedText>
          <ThemedText type="small" style={{ color: BRANCO_SUAVE }}>
            {p.curso.resumo}
          </ThemedText>
        </View>
        <AnelProgresso
          percentual={p.percentual}
          cor={BRANCO}
          corTrilho="rgba(255,255,255,0.3)"
          corTexto={BRANCO}
          tamanho={72}
          espessura={7}
          rotuloAcessivel={t('acad.progresso', { n: p.concluidas, total: p.total })}
        />
      </View>

      <Botao texto={textoBotao} onPress={() => abrirAula(p.proximaAula.id)} />
      {p.noMeusCursos ? (
        <Botao texto={t('acad.remover')} variante="secundario" onPress={() => removerDosMeusCursos(p.curso.id)} />
      ) : (
        <Botao texto={t('acad.adicionar')} variante="secundario" onPress={() => adicionarAosMeusCursos(p.curso.id)} />
      )}

      <ThemedText type="smallBold" accessibilityRole="header">
        {t('acad.aulasConcluidas', { n: p.concluidas, total: p.total })}
      </ThemedText>
      <Cartao>
        {p.aulas.map((aula, i) => {
          const feita = concluidas.has(aula.id);
          return (
            <Pressable
              key={aula.id}
              onPress={() => abrirAula(aula.id)}
              accessibilityRole="button"
              accessibilityLabel={
                t('acad.aulaRotulo', { n: i + 1, titulo: aula.titulo, min: aula.minutos }) + (feita ? t('acad.concluidaRotulo') : '')
              }
              style={({ pressed }) => [
                styles.aula,
                i > 0 && [styles.separador, { borderTopColor: theme.border }],
                pressed && styles.pressionado,
              ]}>
              <View
                style={[
                  styles.numero,
                  feita
                    ? { backgroundColor: theme.accent }
                    : { borderColor: theme.textSecondary, borderWidth: 1.5 },
                ]}>
                <ThemedText type="smallBold" style={feita ? { color: theme.onAccent } : { color: theme.textSecondary }}>
                  {feita ? '✓' : i + 1}
                </ThemedText>
              </View>
              <View style={styles.flex}>
                <ThemedText type="smallBold">{aula.titulo}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {t('acad.min', { n: aula.minutos })}
                  {feita ? ` · ${t('acad.concluidaCurta')}` : ''}
                </ThemedText>
              </View>
              <ThemedText themeColor="textSecondary">›</ThemedText>
            </Pressable>
          );
        })}
      </Cartao>
    </TelaSecundaria>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  capa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
    borderRadius: Spacing.four,
  },
  titulo: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: 700,
    marginVertical: Spacing.one,
  },
  aula: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    minHeight: 56,
    paddingVertical: Spacing.two,
  },
  separador: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  numero: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressionado: {
    opacity: 0.7,
  },
});
