/**
 * Perguntas do perfil financeiro, uma por tela. Usado no onboarding e para editar o perfil depois.
 */

import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CampoValor } from '@/components/campo-valor';
import { Botao, Cartao } from '@/components/tela';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useT } from '@/hooks/use-idioma';
import { useTheme } from '@/hooks/use-theme';
import { ErroValidacao } from '@/services/erros';
import {
  calcularSobraEstimada,
  FONTES_RENDA,
  OBJETIVOS,
  rotuloFonteRenda,
  rotuloObjetivo,
  salvarPerfil,
  sugerirMetasEconomia,
} from '@/services/perfil-financeiro-service';
import type { FonteRenda, ObjetivoFinanceiro, PerfilFinanceiro } from '@/types/financas';
import { centavosParaTexto, formatarCentavos, lerValorEmCentavos } from '@/utils/moeda';

type Props = {
  inicial?: PerfilFinanceiro | null;
};

const TOTAL_PERGUNTAS = 5;

/** Edição do perfil financeiro em 5 passos (o primeiro acesso usa a conversa do ChatCadastro). */
export function FluxoPerfil({ inicial }: Props) {
  const t = useT();
  const theme = useTheme();
  const [passo, setPasso] = useState(0);
  const [nome, setNome] = useState(inicial?.nome ?? '');
  const [rendaTexto, setRendaTexto] = useState(
    inicial ? centavosParaTexto(inicial.rendaMensalCentavos) : '',
  );
  const [fonteRenda, setFonteRenda] = useState<FonteRenda | null>(inicial?.fonteRenda ?? null);
  const [fixasTexto, setFixasTexto] = useState(
    inicial ? centavosParaTexto(inicial.despesasFixasCentavos) : '',
  );
  const [objetivo, setObjetivo] = useState<ObjetivoFinanceiro | null>(inicial?.objetivo ?? null);
  const [metaTexto, setMetaTexto] = useState(
    inicial ? centavosParaTexto(inicial.metaEconomiaCentavos) : '',
  );

  const renda = lerValorEmCentavos(rendaTexto, true);
  const fixas = lerValorEmCentavos(fixasTexto, true);
  const meta = lerValorEmCentavos(metaTexto, true);
  const sobra = renda !== null && fixas !== null ? calcularSobraEstimada(renda, fixas) : null;

  const passoValido = [
    nome.trim().length > 0,
    renda !== null && fonteRenda !== null,
    fixas !== null,
    objetivo !== null,
    meta !== null,
    true,
  ][passo];

  function voltar() {
    if (passo > 0) setPasso(passo - 1);
    else router.back();
  }

  function concluir() {
    if (renda === null || fixas === null || meta === null || !fonteRenda || !objetivo) return;
    try {
      salvarPerfil({
        nome,
        rendaMensalCentavos: renda,
        fonteRenda,
        despesasFixasCentavos: fixas,
        objetivo,
        metaEconomiaCentavos: meta,
      });
      router.back();
    } catch (erro) {
      Alert.alert(
        t('comum.erroGuardar'),
        erro instanceof ErroValidacao ? erro.message : t('comum.tenteNovamente'),
      );
    }
  }

  function avancar() {
    if (!passoValido) return;
    if (passo < TOTAL_PERGUNTAS) setPasso(passo + 1);
    else concluir();
  }

  const campoValor = (valor: string, aoMudar: (t: string) => void, rotulo: string) => (
    <CampoValor valor={valor} aoMudar={aoMudar} rotulo={rotulo} autoFocus aoConfirmar={avancar} />
  );

  let conteudo: ReactNode;
  switch (passo) {
    case 0:
      conteudo = (
        <>
          <Pergunta>{t('fp.nome')}</Pergunta>
          <TextInput
            style={[styles.inputTexto, { color: theme.text, backgroundColor: theme.backgroundElement }]}
            value={nome}
            onChangeText={setNome}
            placeholder={t('acesso.nome')}
            placeholderTextColor={theme.textSecondary}
            accessibilityLabel={t('acesso.nome')}
            autoCapitalize="words"
            autoComplete="given-name"
            maxLength={40}
            autoFocus
            returnKeyType="next"
            onSubmitEditing={avancar}
          />
        </>
      );
      break;

    case 1:
      conteudo = (
        <>
          <Pergunta>{t('fp.renda')}</Pergunta>
          {campoValor(rendaTexto, setRendaTexto, t('fp.renda.rotulo'))}
          <Dica>{t('fp.renda.dica')}</Dica>
          <ThemedText type="smallBold" style={styles.subpergunta}>
            {t('fp.fonte')}
          </ThemedText>
          <Opcoes
            opcoes={FONTES_RENDA.map((f) => ({ valor: f.valor, rotulo: f.rotulo }))}
            selecionada={fonteRenda}
            aoEscolher={setFonteRenda}
          />
        </>
      );
      break;

    case 2:
      conteudo = (
        <>
          <Pergunta>{t('chat.fixas1')}</Pergunta>
          {campoValor(fixasTexto, setFixasTexto, t('fp.fixas.rotulo'))}
          <Dica>{t('chat.fixas2')}</Dica>
          {sobra !== null && (
            <Cartao>
              <ThemedText type="small" themeColor="textSecondary">
                {t('fp.sobra')}
              </ThemedText>
              <ThemedText
                style={[styles.destaque, { color: sobra >= 0 ? theme.positive : theme.negative }]}>
                {formatarCentavos(sobra)}
              </ThemedText>
              {sobra < 0 && (
                <ThemedText type="small">{t('fp.passou')}</ThemedText>
              )}
            </Cartao>
          )}
        </>
      );
      break;

    case 3:
      conteudo = (
        <>
          <Pergunta>{t('fp.objetivo')}</Pergunta>
          <Opcoes
            opcoes={OBJETIVOS.map((o) => ({ valor: o.valor, rotulo: o.rotulo, descricao: o.descricao }))}
            selecionada={objetivo}
            aoEscolher={setObjetivo}
            emLista
          />
        </>
      );
      break;

    case 4: {
      const sugestoes = renda !== null && fixas !== null ? sugerirMetasEconomia(renda, fixas) : [];
      conteudo = (
        <>
          <Pergunta>{t('chat.economia')}</Pergunta>
          {campoValor(metaTexto, setMetaTexto, t('fp.meta.rotulo'))}
          {sugestoes.length > 0 && (
            <>
              <Dica>{t('fp.sugestoes')}</Dica>
              <View style={styles.linhaOpcoes}>
                {sugestoes.map((s) => (
                  <Botao
                    key={s}
                    texto={formatarCentavos(s)}
                    variante="secundario"
                    selecionado={meta === s}
                    onPress={() => setMetaTexto(centavosParaTexto(s))}
                  />
                ))}
                <Botao
                  texto={t('chat.naoSei')}
                  variante="secundario"
                  selecionado={meta === 0}
                  onPress={() => setMetaTexto('0')}
                />
              </View>
            </>
          )}
          {meta !== null && sobra !== null && meta > Math.max(sobra, 0) && (
            <ThemedText type="small" style={{ color: theme.negative }}>
              {t('fp.metaAlta', { valor: formatarCentavos(Math.max(sobra, 0)) })}
            </ThemedText>
          )}
          {meta === 0 && <Dica>{t('fp.depois')}</Dica>}
        </>
      );
      break;
    }

    default:
      conteudo = (
        <>
          <Pergunta>{t('fp.confira')}</Pergunta>
          <Cartao>
            <LinhaResumo rotulo={t('fp.renda.rotulo')} valor={formatarCentavos(renda ?? 0)} />
            <LinhaResumo rotulo={t('fp.fonte.rotulo')} valor={fonteRenda ? rotuloFonteRenda(fonteRenda) : '-'} />
            <LinhaResumo rotulo={t('fp.fixas.rotulo')} valor={formatarCentavos(fixas ?? 0)} />
            <LinhaResumo rotulo={t('fp.sobra.rotulo')} valor={formatarCentavos(sobra ?? 0)} />
            <LinhaResumo rotulo={t('fp.objetivo.rotulo')} valor={objetivo ? rotuloObjetivo(objetivo) : '-'} />
            <LinhaResumo rotulo={t('fp.metaMes')} valor={formatarCentavos(meta ?? 0)} />
          </Cartao>
        </>
      );
  }

  const ultimoPasso = passo === TOTAL_PERGUNTAS;
  const textoBotao = ultimoPasso ? t('fp.guardarAlteracoes') : t('comum.continuar');

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.topo}>
            <Pressable onPress={voltar} accessibilityRole="button" hitSlop={12}>
              <ThemedText type="smallBold" themeColor="textSecondary">
                {passo === 0 ? t('comum.cancelar') : t('comum.voltar')}
              </ThemedText>
            </Pressable>
            <ThemedText type="small" themeColor="textSecondary">
              {ultimoPasso ? t('fp.resumo') : t('fp.passo', { n: passo + 1, total: TOTAL_PERGUNTAS })}
            </ThemedText>
          </View>
          <View
            style={[styles.trilho, { backgroundColor: theme.backgroundSelected }]}
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: TOTAL_PERGUNTAS, now: passo }}>
            <View
              style={[
                styles.progresso,
                { width: `${(passo / TOTAL_PERGUNTAS) * 100}%`, backgroundColor: theme.accent },
              ]}
            />
          </View>

          <ScrollView
            key={passo}
            style={styles.flex}
            contentContainerStyle={styles.conteudo}
            keyboardShouldPersistTaps="handled">
            {conteudo}
          </ScrollView>

          <View style={styles.rodape}>
            <Botao texto={textoBotao} disabled={!passoValido} onPress={avancar} />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

function Pergunta({ children }: { children: ReactNode }) {
  return (
    <ThemedText style={styles.pergunta} accessibilityRole="header">
      {children}
    </ThemedText>
  );
}

function Dica({ children }: { children: ReactNode }) {
  return (
    <ThemedText type="small" themeColor="textSecondary">
      {children}
    </ThemedText>
  );
}

function LinhaResumo({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <View style={styles.linhaResumo}>
      <ThemedText type="small" themeColor="textSecondary">
        {rotulo}
      </ThemedText>
      <ThemedText type="smallBold" style={styles.valorResumo}>
        {valor}
      </ThemedText>
    </View>
  );
}

function Opcoes<T extends string>({
  opcoes,
  selecionada,
  aoEscolher,
  emLista,
}: {
  opcoes: { valor: T; rotulo: string; descricao?: string }[];
  selecionada: T | null;
  aoEscolher: (valor: T) => void;
  emLista?: boolean;
}) {
  const theme = useTheme();
  return (
    <View style={emLista ? styles.lista : styles.linhaOpcoes} accessibilityRole="radiogroup">
      {opcoes.map((o) => {
        const ativa = o.valor === selecionada;
        return (
          <Pressable
            key={o.valor}
            onPress={() => aoEscolher(o.valor)}
            accessibilityRole="radio"
            accessibilityState={{ checked: ativa }}
            style={({ pressed }) => [
              emLista ? styles.opcaoLista : styles.chip,
              { backgroundColor: ativa ? theme.accent : theme.backgroundElement },
              pressed && styles.pressionado,
            ]}>
            <ThemedText type={emLista ? 'smallBold' : 'small'} style={ativa && { color: theme.onAccent }}>
              {o.rotulo}
            </ThemedText>
            {o.descricao && (
              <ThemedText
                type="small"
                themeColor={ativa ? undefined : 'textSecondary'}
                style={ativa && { color: theme.onAccent }}>
                {o.descricao}
              </ThemedText>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
  },
  flex: {
    flex: 1,
  },
  topo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    minHeight: 44,
  },
  trilho: {
    height: 4,
    marginHorizontal: Spacing.three,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progresso: {
    height: '100%',
    borderRadius: 2,
  },
  conteudo: {
    padding: Spacing.three,
    paddingTop: Spacing.four,
    gap: Spacing.three,
  },
  pergunta: {
    fontSize: 26,
    lineHeight: 34,
    fontWeight: 700,
  },
  subpergunta: {
    marginTop: Spacing.two,
  },
  inputTexto: {
    fontSize: 20,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  destaque: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: 700,
  },
  linhaOpcoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  lista: {
    gap: Spacing.two,
  },
  chip: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.four,
  },
  opcaoLista: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.half,
  },
  pressionado: {
    opacity: 0.7,
  },
  linhaResumo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  valorResumo: {
    flexShrink: 1,
    textAlign: 'right',
  },
  rodape: {
    padding: Spacing.three,
  },
});
