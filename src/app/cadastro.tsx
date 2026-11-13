import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TextInput } from 'react-native';

import { CampoSenha } from '@/components/campo-senha';
import { Botao } from '@/components/tela';
import { TelaAcesso } from '@/components/tela-acesso';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useT } from '@/hooks/use-idioma';
import { useTheme } from '@/hooks/use-theme';
import { biometriaDisponivel, criarConta, definirBiometria } from '@/services/conta-service';
import { ErroValidacao } from '@/services/erros';

export default function CadastroScreen() {
  const t = useT();
  const theme = useTheme();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const preenchido = nome.trim() && email.trim() && senha && confirmacao;
  const estiloCampo = [styles.campo, { color: theme.text, backgroundColor: theme.backgroundElement }];

  async function oferecerBiometria() {
    if (!(await biometriaDisponivel())) return;
    Alert.alert(t('acesso.bio.titulo'), t('acesso.bio.texto'), [
      { text: t('acesso.agoraNao'), style: 'cancel' },
      { text: t('plus.ativar'), onPress: () => definirBiometria(true) },
    ]);
  }

  async function cadastrar() {
    if (!preenchido || salvando) return;
    setErro(null);
    setSalvando(true);
    try {
      await criarConta({ nome, email, senha, confirmacao });
      // A conta já está aberta: o app segue sozinho para o perfil financeiro.
      oferecerBiometria();
    } catch (e) {
      setErro(e instanceof ErroValidacao ? e.message : t('acesso.erroCriar'));
      setSalvando(false);
    }
  }

  return (
    <TelaAcesso
      titulo={t('acesso.criar.titulo')}
      subtitulo={t('acesso.criar.subtitulo')}>
      <TextInput
        style={estiloCampo}
        value={nome}
        onChangeText={setNome}
        placeholder={t('acesso.nome')}
        placeholderTextColor={theme.textSecondary}
        accessibilityLabel={t('acesso.nome')}
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
        maxLength={40}
      />
      <TextInput
        style={estiloCampo}
        value={email}
        onChangeText={setEmail}
        placeholder={t('acesso.email')}
        placeholderTextColor={theme.textSecondary}
        accessibilityLabel={t('acesso.email')}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
      />
      <CampoSenha
        rotulo={t('acesso.senha')}
        value={senha}
        onChangeText={setSenha}
        placeholder={t('acesso.senha.regra')}
        autoComplete="new-password"
        textContentType="newPassword"
      />
      <CampoSenha
        rotulo={t('acesso.confirmar')}
        value={confirmacao}
        onChangeText={setConfirmacao}
        placeholder={t('acesso.confirmar.ph')}
        autoComplete="new-password"
        textContentType="newPassword"
        onSubmitEditing={cadastrar}
      />

      {erro && (
        <ThemedText type="small" style={{ color: theme.negative }} accessibilityLiveRegion="polite">
          {erro}
        </ThemedText>
      )}

      {salvando ? (
        <ActivityIndicator color={theme.accent} accessibilityLabel={t('acesso.criando')} />
      ) : (
        <Botao texto={t('acesso.criar')} disabled={!preenchido} onPress={cadastrar} />
      )}

      <ThemedText type="small" themeColor="textSecondary" style={styles.aviso}>
        {t('acesso.local')}
      </ThemedText>
    </TelaAcesso>
  );
}

const styles = StyleSheet.create({
  campo: {
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 16,
  },
  aviso: {
    textAlign: 'center',
  },
});
