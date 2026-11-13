import { router } from 'expo-router';
import { useT } from '@/hooks/use-idioma';
import type { Chave } from '@/i18n';
import { useMemo, useState, type ReactNode } from 'react';
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

import { CampoData } from '@/components/calendario';
import { CampoValor } from '@/components/campo-valor';
import { Chip } from '@/components/chip';
import { Botao } from '@/components/tela';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { ErroValidacao } from '@/services/erros';
import { estimarPorMes, modelosDeMeta, type DadosMeta } from '@/services/metas-service';
import type { Meta } from '@/types/financas';
import { formatarData, hoje, nomeDoMes, somarDias, somarMesesNaData } from '@/utils/datas';
import { centavosParaTexto, formatarCentavos, lerValorEmCentavos } from '@/utils/moeda';
import { vibrarErro, vibrarSucesso } from '@/utils/vibracao';

type OpcaoPrazo = 'sem' | '6' | '12' | '24' | 'outra';

const PRAZOS: { valor: OpcaoPrazo; rotulo: Chave }[] = [
  { valor: 'sem', rotulo: 'metas.semPrazo' },
  { valor: '6', rotulo: 'metas.prazo6' },
  { valor: '12', rotulo: 'metas.prazo12' },
  { valor: '24', rotulo: 'metas.prazo24' },
  { valor: 'outra', rotulo: 'lanc.form.outraData' },
];

type Props = {
  titulo: string;
  /** Meta existente, para edição (o valor guardado não é editado aqui, e sim por Guardar/Retirar). */
  inicial?: Meta;
  aoSalvar: (dados: DadosMeta, valorInicialCentavos: number) => void;
};

export function FormularioMeta({ titulo, inicial, aoSalvar }: Props) {
  const theme = useTheme();
  const t = useT();
  const modelos = useMemo(() => (inicial ? [] : modelosDeMeta()), [inicial]);
  const [nome, setNome] = useState(inicial?.nome ?? '');
  const [objetivoTexto, setObjetivoTexto] = useState(
    inicial ? centavosParaTexto(inicial.objetivoCentavos) : '',
  );
  const [guardadoTexto, setGuardadoTexto] = useState('');
  const [opcaoPrazo, setOpcaoPrazo] = useState<OpcaoPrazo>(inicial?.prazo ? 'outra' : 'sem');
  const [outroPrazo, setOutroPrazo] = useState<string | null>(inicial?.prazo ?? null);

  const objetivo = lerValorEmCentavos(objetivoTexto);
  const guardado = guardadoTexto.trim() === '' ? 0 : lerValorEmCentavos(guardadoTexto, true);
  const prazo =
    opcaoPrazo === 'sem'
      ? null
      : opcaoPrazo === 'outra'
        ? outroPrazo
        : somarMesesNaData(hoje(), Number(opcaoPrazo));
  const prazoInvalido = opcaoPrazo === 'outra' && (prazo === null || (prazo <= hoje() && prazo !== inicial?.prazo));
  const podeSalvar = nome.trim().length > 0 && objetivo !== null && guardado !== null && !prazoInvalido;

  const porMes =
    objetivo !== null && prazo !== null && !prazoInvalido
      ? estimarPorMes(objetivo, inicial?.atualCentavos ?? guardado ?? 0, prazo)
      : null;

  function salvar() {
    if (!podeSalvar || objetivo === null || guardado === null) return;
    try {
      aoSalvar({ nome, objetivoCentavos: objetivo, prazo }, guardado);
      vibrarSucesso();
      router.back();
    } catch (erro) {
      vibrarErro();
      Alert.alert(t('comum.erroGuardar'), erro instanceof ErroValidacao ? erro.message : t('comum.tenteNovamente'));
    }
  }

  const estiloCampo = [styles.campo, { color: theme.text, backgroundColor: theme.backgroundElement }];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.topo}>
            <Pressable onPress={() => router.back()} accessibilityRole="button" hitSlop={12}>
              <ThemedText type="smallBold" themeColor="textSecondary">
                {t('comum.cancelar')}
              </ThemedText>
            </Pressable>
            <ThemedText type="smallBold" accessibilityRole="header">
              {titulo}
            </ThemedText>
            <View style={styles.espacoTopo} />
          </View>

          <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
            {modelos.length > 0 && (
              <Secao titulo={t('metas.ideias')}>
                <View style={styles.chips}>
                  {modelos.map((m) => (
                    <Chip
                      key={m.nome}
                      texto={m.nome}
                      ativo={nome === m.nome}
                      aoTocar={() => {
                        setNome(m.nome);
                        if (m.objetivoCentavos) setObjetivoTexto(centavosParaTexto(m.objetivoCentavos));
                      }}
                    />
                  ))}
                </View>
              </Secao>
            )}

            <Secao titulo={t('metas.nome')}>
              <TextInput
                style={estiloCampo}
                value={nome}
                onChangeText={setNome}
                placeholder={t('metas.nome.ex')}
                placeholderTextColor={theme.textSecondary}
                accessibilityLabel={t('metas.nome')}
                maxLength={40}
                autoCapitalize="sentences"
              />
            </Secao>

            <Secao titulo={t('metas.quanto')}>
              <CampoValor valor={objetivoTexto} aoMudar={setObjetivoTexto} rotulo={t('metas.valorMeta')} />
              {nome === t('metas.modelo.reserva') && (
                <Dica>{t('metas.dicaReserva')}</Dica>
              )}
            </Secao>

            {!inicial && (
              <Secao titulo={t('metas.jaTem')}>
                <CampoValor
                  valor={guardadoTexto}
                  aoMudar={setGuardadoTexto}
                  rotulo={t('metas.valorJaGuardado')}
                />
              </Secao>
            )}

            <Secao titulo={t('metas.prazo')}>
              <View style={styles.chips} accessibilityRole="radiogroup">
                {PRAZOS.map((p) => (
                  <Chip
                    key={p.valor}
                    texto={t(p.rotulo)}
                    ativo={opcaoPrazo === p.valor}
                    aoTocar={() => setOpcaoPrazo(p.valor)}
                  />
                ))}
              </View>
              {opcaoPrazo === 'outra' && (
                <CampoData
                  rotulo={t('metas.prazoDa')}
                  valor={outroPrazo}
                  aoMudar={setOutroPrazo}
                  min={somarDias(hoje(), 1)}
                  abrirAoAparecer={outroPrazo === null}
                />
              )}
              {prazoInvalido && outroPrazo !== null && (
                <ThemedText type="small" style={{ color: theme.negative }} accessibilityLiveRegion="polite">
                  {t('metas.erro.prazoFuturo')}
                </ThemedText>
              )}
              {prazo !== null && !prazoInvalido && opcaoPrazo !== 'outra' && (
                <Dica>{t('metas.ate', { data: formatarData(prazo) })}</Dica>
              )}
            </Secao>

            {porMes !== null && porMes > 0 && prazo && (
              <View style={[styles.previa, { backgroundColor: theme.accentSoft }]}>
                <ThemedText type="small">
                  {t('metas.previa', { valor: formatarCentavos(porMes), mes: nomeDoMes(prazo.slice(0, 7)) })}
                </ThemedText>
              </View>
            )}
          </ScrollView>

          <View style={styles.rodape}>
            <Botao texto={inicial ? t('lanc.form.guardarAlteracoes') : t('metas.criar')} disabled={!podeSalvar} onPress={salvar} />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
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

function Dica({ children }: { children: ReactNode }) {
  return (
    <ThemedText type="small" themeColor="textSecondary">
      {children}
    </ThemedText>
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
  espacoTopo: {
    width: 60,
  },
  conteudo: {
    padding: Spacing.three,
    gap: Spacing.four,
  },
  secao: {
    gap: Spacing.two,
  },
  campo: {
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 16,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  previa: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  rodape: {
    padding: Spacing.three,
  },
});
