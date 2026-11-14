import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, TextInput, View } from 'react-native';

import { BloqueioPremium } from '@/components/bloqueio-premium';
import { Chip } from '@/components/chip';
import { Botao, Cartao } from '@/components/tela';
import { TelaSecundaria } from '@/components/tela-secundaria';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { CATEGORIAS_ACADEMY } from '@/data/academy-conteudo';
import { useT } from '@/hooks/use-idioma';
import { useAssinatura } from '@/hooks/use-dados';
import { useTheme } from '@/hooks/use-theme';
import { temAcesso } from '@/services/assinatura-service';
import { ErroValidacao } from '@/services/erros';
import { criarTopico, LIMITES_FORUM, regrasForum } from '@/services/forum-service';
import { vibrarErro, vibrarSucesso } from '@/utils/vibracao';

export default function NovoTopicoScreen() {
  const t = useT();
  const theme = useTheme();
  const plus = temAcesso('academy', useAssinatura());
  const [categoria, setCategoria] = useState<string | null>(null);
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');

  if (!plus) {
    return (
      <TelaSecundaria titulo={t('forum.novoTitulo')} textoVoltar={t('comum.cancelar')}>
        <BloqueioPremium recurso="academy" />
      </TelaSecundaria>
    );
  }

  const podePublicar =
    categoria !== null &&
    titulo.trim().length >= LIMITES_FORUM.titulo.min &&
    texto.trim().length >= LIMITES_FORUM.texto.min;

  function publicar() {
    if (!categoria) return;
    try {
      const id = criarTopico({ categoriaId: categoria, titulo, texto });
      vibrarSucesso();
      router.replace({ pathname: '/forum/[id]', params: { id: String(id) } });
    } catch (erro) {
      vibrarErro();
      Alert.alert(t('forum.erroPublicar'), erro instanceof ErroValidacao ? erro.message : t('comum.tenteNovamente'));
    }
  }

  const estiloCampo = [styles.campo, { color: theme.text, backgroundColor: theme.backgroundElement, borderColor: theme.border }];

  return (
    <TelaSecundaria
      titulo={t('forum.novoTitulo')}
      textoVoltar={t('comum.cancelar')}
      rodape={<Botao texto={t('forum.publicar')} onPress={publicar} disabled={!podePublicar} />}>
      <ThemedText type="smallBold">{t('forum.tema')}</ThemedText>
      <View style={styles.chips} accessibilityRole="radiogroup">
        {CATEGORIAS_ACADEMY.map((c) => (
          <Chip key={c.id} texto={`${c.icone} ${c.nome}`} ativo={categoria === c.id} aoTocar={() => setCategoria(c.id)} />
        ))}
      </View>

      <ThemedText type="smallBold">{t('forum.campo.titulo')}</ThemedText>
      <TextInput
        value={titulo}
        onChangeText={setTitulo}
        placeholder={t('forum.titulo.ex')}
        placeholderTextColor={theme.textSecondary}
        maxLength={LIMITES_FORUM.titulo.max}
        accessibilityLabel={t('forum.titulo.rotulo')}
        style={estiloCampo}
      />

      <ThemedText type="smallBold">{t('forum.campo.mensagem')}</ThemedText>
      <TextInput
        value={texto}
        onChangeText={setTexto}
        placeholder={t('forum.mensagem.ex')}
        placeholderTextColor={theme.textSecondary}
        multiline
        maxLength={LIMITES_FORUM.texto.max}
        accessibilityLabel={t('forum.mensagem.rotulo')}
        style={[estiloCampo, styles.mensagem]}
        textAlignVertical="top"
      />
      <ThemedText type="small" themeColor="textSecondary" style={styles.contador}>
        {texto.length}/{LIMITES_FORUM.texto.max}
      </ThemedText>

      <Cartao>
        <ThemedText type="smallBold">{t('forum.antes')}</ThemedText>
        {regrasForum().map((r) => (
          <ThemedText key={r} type="small" themeColor="textSecondary">
            • {r}
          </ThemedText>
        ))}
      </Cartao>
    </TelaSecundaria>
  );
}

const styles = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  campo: {
    minHeight: 48,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  mensagem: {
    minHeight: 140,
  },
  contador: {
    alignSelf: 'flex-end',
    marginTop: -Spacing.two,
  },
});
