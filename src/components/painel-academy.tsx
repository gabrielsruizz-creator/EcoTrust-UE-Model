import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import {
  CartaoAtalho,
  CartaoCategoria,
  CartaoCurso,
  ItemRecente,
  TituloSecao,
} from '@/components/academy-cartoes';
import { Cartao } from '@/components/tela';
import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useT } from '@/hooks/use-idioma';
import { useAcademy } from '@/hooks/use-dados';
import { useTheme } from '@/hooks/use-theme';
import { calcularProgressoCurso } from '@/services/academy-service';

const NENHUM = new Set<string>();

/** Trust Academy: meus cursos, categorias, conteúdos recentes e fórum. (Só para assinantes Plus.) */
export function PainelAcademy() {
  const t = useT();
  const theme = useTheme();
  const academy = useAcademy();

  return (
    <ScrollView contentContainerStyle={styles.conteudo}>
      {/* 1. Meus cursos */}
      <TituloSecao titulo={t('acad.meusCursos')} />
      {academy.meusCursos.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carrossel}
          style={styles.sangria}>
          {academy.meusCursos.map((p) => (
            <CartaoCurso key={p.curso.id} progresso={p} />
          ))}
        </ScrollView>
      ) : (
        <>
          <Cartao>
            <ThemedText type="smallBold">{t('acad.escolhaPrimeiro')}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {t('acad.escolhaPrimeiro.texto')}
            </ThemedText>
          </Cartao>
          {academy.recomendados.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carrossel}
              style={styles.sangria}>
              {academy.recomendados.map((r) => (
                <CartaoCurso
                  key={r.curso.id}
                  progresso={calcularProgressoCurso(r.curso, NENHUM, NENHUM)}
                  motivo={r.motivo}
                />
              ))}
            </ScrollView>
          )}
        </>
      )}

      {/* 2. Categorias */}
      <TituloSecao titulo={t('acad.categorias')} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carrossel}
        style={styles.sangria}>
        {academy.categorias.map((c) => (
          <CartaoCategoria key={c.id} categoria={c} />
        ))}
      </ScrollView>

      {/* 3. Recentes */}
      <TituloSecao titulo={t('acad.recentes')} />
      <View style={styles.lista}>
        {academy.recentes.map((r) => (
          <ItemRecente key={r.aula.id} recente={r} />
        ))}
      </View>

      {/* 4. Comunidade */}
      <TituloSecao titulo={t('acad.comunidade')} />
      <CartaoAtalho
        icone="💬"
        titulo={t('acad.forum')}
        subtitulo={t('acad.topicos', { n: academy.totalTopicos })}
        aoTocar={() => router.push('/forum')}
      />

      <View style={[styles.dica, { backgroundColor: theme.accentSoft }]} accessible>
        <ThemedText type="smallBold" style={{ color: theme.accentText }}>
          {t('acad.dicaDia')}
        </ThemedText>
        <ThemedText>{academy.dica}</ThemedText>
      </View>

      <CartaoAtalho
        icone="📖"
        titulo={t('acad.glossario')}
        subtitulo={t('acad.termos', { n: academy.totalConceitos })}
        aoTocar={() => router.push('/academy/glossario')}
        cor={theme.backgroundSelected}
      />

      <ThemedText type="small" themeColor="textSecondary" style={styles.rodape}>
        {t('ia.educativo')}
      </ThemedText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  conteudo: {
    padding: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.four,
    gap: Spacing.three,
  },
  // Os carrosséis vão até a borda da tela, mas o primeiro cartão fica alinhado com o resto.
  sangria: {
    marginHorizontal: -Spacing.three,
    flexGrow: 0,
  },
  carrossel: {
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
  },
  lista: {
    gap: Spacing.two,
  },
  dica: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.one,
  },
  rodape: {
    textAlign: 'center',
  },
});
