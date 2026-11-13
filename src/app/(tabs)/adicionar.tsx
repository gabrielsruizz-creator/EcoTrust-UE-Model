import { router, type Href } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icone, type NomeIcone } from '@/components/icone';
import { Cartao, Tela } from '@/components/tela';
import { ThemedText } from '@/components/themed-text';
import { SeriesColors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCategorias, useTransacoes } from '@/hooks/use-dados';
import { useT } from '@/hooks/use-idioma';
import { useTheme } from '@/hooks/use-theme';
import type { Chave } from '@/i18n';
import { visualCategoria } from '@/utils/visual';

const MAX_ATALHOS = 6;

const OPCOES: { icone: NomeIcone; titulo: Chave; texto: Chave; destino: Href; principal?: boolean }[] = [
  {
    icone: 'mais',
    titulo: 'lanc.despesa',
    texto: 'adicionar.despesa.texto',
    destino: { pathname: '/novo-lancamento', params: { tipo: 'despesa' } },
    principal: true,
  },
  {
    icone: 'entrada',
    titulo: 'lanc.receita',
    texto: 'adicionar.receita.texto',
    destino: { pathname: '/novo-lancamento', params: { tipo: 'receita' } },
  },
];

/** Aba "+": tudo o que dá para registrar, com atalhos das categorias mais usadas. */
export default function AdicionarScreen() {
  const theme = useTheme();
  const t = useT();
  const esquema = useColorScheme() === 'dark' ? 'dark' : 'light';
  const categorias = useCategorias('despesa');
  const transacoes = useTransacoes();

  // Categorias de despesa mais usadas; sem histórico, as primeiras padrão.
  const contagem = new Map<number, number>();
  for (const tr of transacoes) if (tr.tipo === 'despesa') contagem.set(tr.categoriaId, (contagem.get(tr.categoriaId) ?? 0) + 1);
  const atalhos = [...categorias]
    .sort((a, b) => (contagem.get(b.id) ?? 0) - (contagem.get(a.id) ?? 0))
    .slice(0, MAX_ATALHOS);

  return (
    <Tela titulo={t('abas.adicionar')} subtitulo={t('adicionar.subtitulo')}>
      <Cartao style={styles.lista}>
        {OPCOES.map((o, i) => (
          <Pressable
            key={o.titulo}
            onPress={() => router.push(o.destino)}
            accessibilityRole="button"
            accessibilityLabel={`${t(o.titulo)}. ${t(o.texto)}`}
            style={({ pressed }) => [
              styles.opcao,
              i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.border },
              pressed && styles.pressionado,
            ]}>
            <View style={[styles.circulo, { backgroundColor: o.principal ? theme.accent : theme.accentSoft }]}>
              <Icone nome={o.icone} cor={o.principal ? theme.onAccent : theme.accentText} tamanho={22} />
            </View>
            <View style={styles.flex}>
              <ThemedText type="smallBold" style={styles.tituloOpcao}>
                {t(o.titulo)}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {t(o.texto)}
              </ThemedText>
            </View>
            <Icone nome="avancar" cor={theme.textSecondary} tamanho={16} />
          </Pressable>
        ))}
      </Cartao>

      <ThemedText type="smallBold" style={styles.secao} accessibilityRole="header">
        {t('adicionar.rapida')}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.dica}>
        {t('adicionar.rapida.dica')}
      </ThemedText>
      <View style={styles.grade}>
        {atalhos.map((c) => {
          const visual = visualCategoria(c.nome, c.id);
          return (
            <Pressable
              key={c.id}
              onPress={() =>
                router.push({ pathname: '/novo-lancamento', params: { tipo: 'despesa', categoria: String(c.id) } })
              }
              accessibilityRole="button"
              accessibilityLabel={t('adicionar.novaEm', { categoria: c.nome })}
              style={({ pressed }) => [styles.atalhoToque, pressed && styles.pressionado]}>
              <Cartao style={styles.atalho}>
                <Icone nome={visual.icone} cor={SeriesColors[esquema][visual.cor]} tamanho={22} />
                <ThemedText type="small" numberOfLines={1} style={styles.textoAtalho}>
                  {c.nome}
                </ThemedText>
              </Cartao>
            </Pressable>
          );
        })}
      </View>
    </Tela>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  pressionado: {
    opacity: 0.7,
  },
  lista: {
    paddingVertical: Spacing.one,
    gap: 0,
  },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    minHeight: 72,
    paddingVertical: Spacing.two + Spacing.one,
  },
  circulo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tituloOpcao: {
    fontSize: 16,
    lineHeight: 22,
  },
  secao: {
    fontSize: 18,
    lineHeight: 24,
    marginTop: Spacing.two,
  },
  dica: {
    marginTop: -Spacing.two,
  },
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  atalhoToque: {
    width: '31.5%',
  },
  atalho: {
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
  },
  textoAtalho: {
    fontSize: 12.5,
  },
});
