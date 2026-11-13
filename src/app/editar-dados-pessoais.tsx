import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { CampoData } from '@/components/calendario';
import { Chip } from '@/components/chip';
import { Botao } from '@/components/tela';
import { TelaSecundaria } from '@/components/tela-secundaria';
import { ThemedText } from '@/components/themed-text';
import { AvatarColors, Spacing } from '@/constants/theme';
import { useDadosPessoais } from '@/hooks/use-dados';
import { useT } from '@/hooks/use-idioma';
import { useConta } from '@/hooks/use-sessao';
import { useTheme } from '@/hooks/use-theme';
import { ErroValidacao } from '@/services/erros';
import { AVATARES, ESTADOS_CIVIS, salvarDadosPessoais } from '@/services/perfil-pessoal-service';
import type { EstadoCivil } from '@/types/financas';
import { formatarData, hoje, idadeEm, somarMesesNaData } from '@/utils/datas';

export default function EditarDadosPessoaisScreen() {
  const t = useT();
  const theme = useTheme();
  const conta = useConta();
  const inicial = useDadosPessoais();
  const [avatar, setAvatar] = useState(inicial.avatar);
  const [cor, setCor] = useState(inicial.corAvatar);
  const [dataNascimento, setDataNascimento] = useState<string | null>(inicial.dataNascimento);
  const [cidade, setCidade] = useState(inicial.cidade ?? '');
  const [profissao, setProfissao] = useState(inicial.profissao ?? '');
  const [estadoCivil, setEstadoCivil] = useState<EstadoCivil | null>(inicial.estadoCivil);
  const [dependentes, setDependentes] = useState<number | null>(inicial.dependentes);

  const estiloCampo = [styles.campo, { color: theme.text, backgroundColor: theme.backgroundElement }];

  function salvar() {
    try {
      salvarDadosPessoais({
        avatar,
        corAvatar: cor,
        dataNascimento,
        // Quem só tinha informado o ano continua com ele até escolher a data completa.
        anoNascimento: dataNascimento ? null : inicial.anoNascimento,
        cidade,
        profissao,
        estadoCivil,
        dependentes,
      });
      router.back();
    } catch (e) {
      Alert.alert(t('comum.erroGuardar'), e instanceof ErroValidacao ? e.message : t('comum.tenteNovamente'));
    }
  }

  return (
    <TelaSecundaria
      titulo={t('dp.titulo')}
      textoVoltar={t('comum.cancelar')}
      rodape={<Botao texto={t('comum.guardar')} onPress={salvar} />}>
      <View style={styles.centro}>
        <Avatar nome={conta?.nome ?? ''} avatar={avatar} cor={cor} tamanho={88} />
      </View>

      <Secao titulo={t('dp.avatar')}>
        <View style={styles.grade} accessibilityRole="radiogroup">
          <Chip texto={t('dp.iniciais')} ativo={avatar === null} aoTocar={() => setAvatar(null)} />
          {AVATARES.map((a) => (
            <Chip key={a} texto={a} ativo={avatar === a} aoTocar={() => setAvatar(a)} />
          ))}
        </View>
        <View style={styles.cores} accessibilityRole="radiogroup">
          {AvatarColors.map((c, i) => (
            <Pressable
              key={c}
              onPress={() => setCor(i)}
              accessibilityRole="radio"
              accessibilityState={{ checked: cor === i }}
              accessibilityLabel={t('dp.cor', { n: i + 1 })}
              hitSlop={4}
              style={[styles.cor, { backgroundColor: c }, cor === i && { borderColor: theme.text }]}
            />
          ))}
        </View>
      </Secao>

      <Secao titulo={t('dp.nascimento')}>
        <CampoData
          rotulo={t('dp.nascimento')}
          valor={dataNascimento}
          aoMudar={setDataNascimento}
          min={somarMesesNaData(hoje(), -110 * 12)}
          max={somarMesesNaData(hoje(), -10 * 12)}
          mesInicial={`${inicial.anoNascimento ?? Number(hoje().slice(0, 4)) - 30}-01`}
          visaoInicial={dataNascimento ? 'dias' : 'anos'}
          permitirLimpar
          formatar={(d) => t('dp.idade', { data: formatarData(d), idade: t('pf.anos', { n: idadeEm(d) }) })}
          placeholder={
            inicial.anoNascimento ? t('dp.anoInformado', { ano: inicial.anoNascimento }) : t('dp.escolherCalendario')
          }
        />
        {!dataNascimento && inicial.anoNascimento !== null && (
          <ThemedText type="small" themeColor="textSecondary">
            {t('dp.diaMes')}
          </ThemedText>
        )}
      </Secao>

      <Secao titulo={t('dp.cidade')}>
        <TextInput
          style={estiloCampo}
          value={cidade}
          onChangeText={setCidade}
          placeholder={t('dp.cidade.ex')}
          placeholderTextColor={theme.textSecondary}
          accessibilityLabel={t('dp.cidade')}
          maxLength={40}
        />
      </Secao>

      <Secao titulo={t('dp.profissao')}>
        <TextInput
          style={estiloCampo}
          value={profissao}
          onChangeText={setProfissao}
          placeholder={t('dp.profissao.ex')}
          placeholderTextColor={theme.textSecondary}
          accessibilityLabel={t('dp.profissao')}
          maxLength={40}
        />
      </Secao>

      <Secao titulo={t('dp.estadoCivil')}>
        <View style={styles.grade} accessibilityRole="radiogroup">
          {ESTADOS_CIVIS.map((e) => (
            <Chip
              key={e.valor}
              texto={e.rotulo}
              ativo={estadoCivil === e.valor}
              aoTocar={() => setEstadoCivil(estadoCivil === e.valor ? null : e.valor)}
            />
          ))}
        </View>
      </Secao>

      <Secao titulo={t('dp.dependentes')}>
        <View style={styles.contador}>
          <Botao
            texto="−"
            variante="secundario"
            disabled={!dependentes}
            onPress={() => setDependentes(Math.max(0, (dependentes ?? 0) - 1))}
            accessibilityLabel={t('dp.menos')}
            style={styles.botaoContador}
          />
          <ThemedText style={styles.numero} accessibilityLiveRegion="polite">
            {dependentes ?? '–'}
          </ThemedText>
          <Botao
            texto="+"
            variante="secundario"
            onPress={() => setDependentes(Math.min(20, (dependentes ?? 0) + 1))}
            accessibilityLabel={t('dp.mais')}
            style={styles.botaoContador}
          />
        </View>
      </Secao>

      <ThemedText type="small" themeColor="textSecondary">
        {t('dp.opcionais')}
      </ThemedText>
    </TelaSecundaria>
  );
}

function Secao({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <View style={styles.secao}>
      <ThemedText type="smallBold">{titulo}</ThemedText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  centro: {
    alignItems: 'center',
  },
  secao: {
    gap: Spacing.two,
  },
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  cores: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  cor: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  campo: {
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 16,
  },
  contador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  botaoContador: {
    width: 56,
  },
  numero: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 700,
    minWidth: 32,
    textAlign: 'center',
  },
});
