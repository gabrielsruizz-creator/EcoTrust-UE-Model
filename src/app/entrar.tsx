import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet } from 'react-native';

import { CampoSenha } from '@/components/campo-senha';
import { Botao } from '@/components/tela';
import { TelaAcesso } from '@/components/tela-acesso';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useConta } from '@/hooks/use-sessao';
import { useT } from '@/hooks/use-idioma';
import { useTheme } from '@/hooks/use-theme';
import { apagarContaEDados, entrar, entrarComBiometria } from '@/services/conta-service';
import { ErroValidacao } from '@/services/erros';
import { primeiroNome } from '@/services/perfil-financeiro-service';

export default function EntrarScreen() {
  const t = useT();
  const theme = useTheme();
  const conta = useConta();
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [entrando, setEntrando] = useState(false);
  const biometriaPedida = useRef(false);

  // Com biometria ativada, pede a digital/Face ID assim que a tela abre (uma vez).
  useEffect(() => {
    if (conta?.biometria && !biometriaPedida.current) {
      biometriaPedida.current = true;
      entrarComBiometria();
    }
  }, [conta?.biometria]);

  async function entrarComSenha() {
    if (!conta || !senha || entrando) return;
    setErro(null);
    setEntrando(true);
    try {
      await entrar(conta.email, senha);
    } catch (e) {
      setErro(e instanceof ErroValidacao ? e.message : t('acesso.erroEntrar'));
      setEntrando(false);
    }
  }

  function esqueciSenha() {
    Alert.alert(
      t('acesso.esqueceu'),
      t('acesso.esqueceu.texto'),
      [
        { text: t('acesso.tentarLembrar'), style: 'cancel' },
        { text: t('pf.apagar'), style: 'destructive', onPress: confirmarApagar },
      ],
    );
  }

  function confirmarApagar() {
    Alert.alert(t('acesso.temCerteza'), t('acesso.apagar.texto'), [
      { text: t('comum.cancelar'), style: 'cancel' },
      { text: t('pf.apagarTudo'), style: 'destructive', onPress: () => apagarContaEDados() },
    ]);
  }

  const nome = conta ? primeiroNome(conta.nome) : '';

  return (
    <TelaAcesso titulo={nome ? t('acesso.olaDeNovo', { nome }) : t('acesso.entrar')} subtitulo={conta?.email ?? ''}>
      <CampoSenha
        rotulo={t('acesso.senha')}
        value={senha}
        onChangeText={(texto) => {
          setSenha(texto);
          setErro(null);
        }}
        placeholder={t('acesso.suaSenha')}
        autoComplete="current-password"
        textContentType="password"
        onSubmitEditing={entrarComSenha}
        returnKeyType="go"
      />

      {erro && (
        <ThemedText type="small" style={{ color: theme.negative }} accessibilityLiveRegion="polite">
          {erro}
        </ThemedText>
      )}

      {entrando ? (
        <ActivityIndicator color={theme.accent} accessibilityLabel={t('acesso.entrando')} />
      ) : (
        <Botao texto={t('acesso.entrar')} disabled={!senha} onPress={entrarComSenha} />
      )}

      {conta?.biometria && (
        <Botao texto={t('acesso.entrarBio')} variante="secundario" onPress={() => entrarComBiometria()} />
      )}

      <Pressable onPress={esqueciSenha} accessibilityRole="button" style={styles.link} hitSlop={8}>
        <ThemedText type="smallBold" style={{ color: theme.accentText }}>
          {t('acesso.esqueci')}
        </ThemedText>
      </Pressable>
    </TelaAcesso>
  );
}

const styles = StyleSheet.create({
  link: {
    alignSelf: 'center',
    paddingVertical: Spacing.two,
  },
});
