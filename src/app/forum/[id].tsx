import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { BloqueioPremium } from '@/components/bloqueio-premium';
import { Botao, Cartao } from '@/components/tela';
import { TelaSecundaria } from '@/components/tela-secundaria';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useT } from '@/hooks/use-idioma';
import { useAssinatura, useTopico } from '@/hooks/use-dados';
import { useTheme } from '@/hooks/use-theme';
import { temAcesso } from '@/services/assinatura-service';
import { ErroValidacao } from '@/services/erros';
import { excluirResposta, excluirTopico, LIMITES_FORUM, responderTopico } from '@/services/forum-service';
import { tempoRelativo } from '@/utils/datas';
import { vibrarErro, vibrarSucesso } from '@/utils/vibracao';

export default function TopicoScreen() {
  const t = useT();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const dados = useTopico(Number(id));
  const plus = temAcesso('academy', useAssinatura());
  const [resposta, setResposta] = useState('');

  if (!plus) {
    return (
      <TelaSecundaria titulo={t('forum.topico')}>
        <BloqueioPremium recurso="academy" />
      </TelaSecundaria>
    );
  }

  if (!dados) {
    return (
      <TelaSecundaria titulo={t('forum.topico')}>
        <ThemedText themeColor="textSecondary">{t('forum.e.naoExiste')}</ThemedText>
        <Botao texto={t('comum.voltar')} onPress={() => router.back()} />
      </TelaSecundaria>
    );
  }

  const { topico, categoria, respostas } = dados;

  function enviar() {
    try {
      responderTopico(topico.id, resposta);
      setResposta('');
      vibrarSucesso();
    } catch (erro) {
      vibrarErro();
      Alert.alert(t('forum.erroResponder'), erro instanceof ErroValidacao ? erro.message : t('comum.tenteNovamente'));
    }
  }

  function confirmarExclusao(tipo: 'topico' | 'resposta', idItem: number) {
    Alert.alert(
      tipo === 'topico' ? t('forum.eliminarTopico') : t('forum.eliminarResposta'),
      tipo === 'topico' ? t('forum.eliminarTopico.texto') : t('forum.eliminarResposta.texto'),
      [
        { text: t('comum.cancelar'), style: 'cancel' },
        {
          text: t('comum.eliminar'),
          style: 'destructive',
          onPress: () => {
            if (tipo === 'topico') {
              excluirTopico(idItem);
              router.back();
            } else {
              excluirResposta(idItem);
            }
          },
        },
      ],
    );
  }

  const podeEnviar = resposta.trim().length >= LIMITES_FORUM.resposta.min;

  return (
    <TelaSecundaria
      titulo={categoria?.nome ?? t('forum.topico')}
      rodape={
        <View style={styles.composicao}>
          <TextInput
            value={resposta}
            onChangeText={setResposta}
            placeholder={t('forum.escrevaResposta')}
            placeholderTextColor={theme.textSecondary}
            multiline
            maxLength={LIMITES_FORUM.resposta.max}
            accessibilityLabel={t('forum.suaResposta')}
            style={[styles.campo, { color: theme.text, backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
          />
          <Botao texto={t('chat.ui.enviar')} onPress={enviar} disabled={!podeEnviar} style={styles.enviar} />
        </View>
      }>
      <Cartao>
        {topico.exemplo && (
          <ThemedText type="small" themeColor="textSecondary">
            {t('forum.topicoExemplo')}
          </ThemedText>
        )}
        <ThemedText style={styles.titulo} accessibilityRole="header">
          {topico.titulo}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {topico.autor} · {tempoRelativo(topico.criadoEm)}
        </ThemedText>
        <ThemedText>{topico.texto}</ThemedText>
        {topico.meu && (
          <Pressable
            onPress={() => confirmarExclusao('topico', topico.id)}
            accessibilityRole="button"
            hitSlop={12}
            style={styles.excluir}>
            <ThemedText type="smallBold" style={{ color: theme.negative }}>
              {t('forum.eliminarTopico')}
            </ThemedText>
          </Pressable>
        )}
      </Cartao>

      <ThemedText type="smallBold" accessibilityRole="header">
        {respostas.length === 0 ? t('forum.semRespostas') : t('forum.respostas', { n: respostas.length })}
      </ThemedText>

      {respostas.map((r) => (
        <View
          key={r.id}
          style={[
            styles.resposta,
            { backgroundColor: r.meu ? theme.accentSoft : theme.backgroundElement, borderColor: theme.border },
          ]}>
          <ThemedText type="smallBold">
            {r.meu ? t('forum.voce') : r.autor}
            <ThemedText type="small" themeColor="textSecondary">
              {' '}
              · {tempoRelativo(r.criadoEm)}
            </ThemedText>
          </ThemedText>
          <ThemedText type="small">{r.texto}</ThemedText>
          {r.meu && (
            <Pressable
              onPress={() => confirmarExclusao('resposta', r.id)}
              accessibilityRole="button"
              accessibilityLabel={t('forum.eliminarSua')}
              hitSlop={12}
              style={styles.excluir}>
              <ThemedText type="small" style={{ color: theme.negative }}>
                {t('comum.eliminar')}
              </ThemedText>
            </Pressable>
          )}
        </View>
      ))}
    </TelaSecundaria>
  );
}

const styles = StyleSheet.create({
  titulo: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: 700,
  },
  excluir: {
    alignSelf: 'flex-start',
    minHeight: 32,
    justifyContent: 'center',
  },
  resposta: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
    gap: Spacing.one,
  },
  composicao: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.two,
  },
  campo: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  enviar: {
    minWidth: 88,
  },
});
