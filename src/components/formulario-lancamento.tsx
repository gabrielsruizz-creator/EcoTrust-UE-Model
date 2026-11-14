import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CampoData } from '@/components/calendario';
import { CampoNovaCategoria } from '@/components/campo-nova-categoria';
import { CampoValor } from '@/components/campo-valor';
import { Chip } from '@/components/chip';
import { Icone } from '@/components/icone';
import { Botao } from '@/components/tela';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { localEfetivo, SeletorPais, type LocalEscolhido } from '@/components/seletor-pais';
import { useCategorias, usePerfilFiscal } from '@/hooks/use-dados';
import { useT } from '@/hooks/use-idioma';
import { localeAtual, type Chave } from '@/i18n';
import { useTheme } from '@/hooks/use-theme';
import { perfilTributarioDaCategoria } from '@/services/categorias-service';
import { estimarImpostosDaCompra } from '@/services/impostos-consumo-ue-service';
import { ErroValidacao } from '@/services/erros';
import type { NovaTransacao, TipoTransacao, Transacao } from '@/types/financas';
import { hoje, ontem } from '@/utils/datas';
import { centavosParaTexto, exemploValorVazio, formatarCentavos, lerValorEmCentavos } from '@/utils/moeda';
import { vibrarErro, vibrarSucesso } from '@/utils/vibracao';

type OpcaoData = 'hoje' | 'ontem' | 'outra';

/** Dados que chegam já preenchidos (ex.: atalho de categoria, ou leitura de um recibo). O utilizador confere e guarda. */
export type SugestaoLancamento = Partial<
  Pick<Transacao, 'valorCentavos' | 'tributosCentavos' | 'data' | 'descricao' | 'categoriaId' | 'chaveNota' | 'paisConsumo' | 'regiaoConsumo'>
> & {
  /** N.º do documento quando os dados vieram do QR de uma fatura (mostrado como aviso) */
  numeroFatura?: string;
};

type Props = {
  titulo: string;
  /** Lançamento existente, para edição. Sem ele, o formulário começa vazio. */
  inicial?: Transacao;
  /** Salva os dados (pode lançar ErroValidacao). Depois de salvar, a tela fecha. */
  aoSalvar: (dados: NovaTransacao) => void;
  /** Tipo já escolhido ao abrir um novo lançamento (atalhos Receita/Despesa) */
  tipoInicial?: TipoTransacao;
  /** Novo lançamento com dados pré-preenchidos (sempre despesa) */
  sugestao?: SugestaoLancamento;
};

function opcaoDataInicial(data: string): OpcaoData {
  if (data === hoje()) return 'hoje';
  if (data === ontem()) return 'ontem';
  return 'outra';
}

/** Formulário de receita/despesa, usado para criar e para editar lançamentos. */
export function FormularioLancamento({ titulo, inicial, aoSalvar, tipoInicial = 'despesa', sugestao }: Props) {
  const theme = useTheme();
  const base = inicial ?? sugestao;
  const [tipo, setTipo] = useState<TipoTransacao>(inicial?.tipo ?? (sugestao ? 'despesa' : tipoInicial));
  const categorias = useCategorias(tipo);
  const [valorTexto, setValorTexto] = useState(base?.valorCentavos ? centavosParaTexto(base.valorCentavos) : '');
  const [descricao, setDescricao] = useState(base?.descricao ?? '');
  const [categoriaId, setCategoriaId] = useState<number | null>(base?.categoriaId ?? null);
  const [opcaoData, setOpcaoData] = useState<OpcaoData>(base?.data ? opcaoDataInicial(base.data) : 'hoje');
  const [outraData, setOutraData] = useState<string | null>(
    base?.data && opcaoDataInicial(base.data) === 'outra' ? base.data : null,
  );
  const [recorrente, setRecorrente] = useState(inicial?.recorrente ?? false);
  const [tributosTexto, setTributosTexto] = useState(
    base?.tributosCentavos ? centavosParaTexto(base.tributosCentavos) : '',
  );
  const chaveNota = inicial?.chaveNota ?? sugestao?.chaveNota ?? null;
  const [criandoCategoria, setCriandoCategoria] = useState(false);
  const t = useT();
  const fiscal = usePerfilFiscal();
  const residencia = fiscal?.paisResidencia ?? 'PT';
  const regiaoResidencia = fiscal?.regiaoResidencia ?? null;
  const [local, setLocal] = useState<LocalEscolhido>({
    pais: base?.paisConsumo ?? null,
    regiao: base?.regiaoConsumo ?? null,
  });

  const valorCentavos = lerValorEmCentavos(valorTexto);
  const categoria = categorias.find((c) => c.id === categoriaId) ?? null;
  const data = opcaoData === 'hoje' ? hoje() : opcaoData === 'ontem' ? ontem() : outraData;
  const dataNoFuturo = data !== null && data > hoje();

  // Impostos: o valor da nota fiscal (opcional) ou a estimativa pelo tipo de consumo da categoria.
  const digitouTributos = tipo === 'despesa' && tributosTexto.trim() !== '';
  const tributosCentavos = digitouTributos ? lerValorEmCentavos(tributosTexto, true) : null;
  // 0,00 não é um valor real de imposto: o app estima como se o campo estivesse vazio.
  const informouTributos = digitouTributos && tributosCentavos !== 0;
  let avisoTributos: string | null = null;
  if (digitouTributos && tributosCentavos === null) avisoTributos = t('lanc.erro.tributos');
  else if (tributosCentavos !== null && valorCentavos !== null && tributosCentavos >= valorCentavos) {
    avisoTributos = t('lanc.erro.tributosMaior');
  }
  // Estimativa pelo país onde a compra aconteceu (IVA + impostos especiais).
  const ondeFoi = localEfetivo(local, residencia, regiaoResidencia);
  const nomePais = t(`pais.${ondeFoi.pais}` as Chave);
  let dicaTributos: string;
  if (informouTributos) dicaTributos = t('lanc.dica.identificado');
  else if (!categoria) dicaTributos = `${t('lanc.dica.recibo')} ${t('lanc.dica.semCategoria')}`;
  else {
    const estimativa = estimarImpostosDaCompra(
      valorCentavos ?? 10_000,
      ondeFoi,
      perfilTributarioDaCategoria(categoria),
      data ?? hoje(),
      { combustivel: fiscal?.combustivel },
    );
    const inicio = digitouTributos && tributosCentavos === 0 ? t('lanc.dica.zero') : t('lanc.dica.recibo');
    if (!estimativa) dicaTributos = `${inicio} ${t('lanc.dica.semRegras', { pais: nomePais })}`;
    else {
      const percentual = estimativa.percentual.toLocaleString(localeAtual(), { maximumFractionDigits: 1 });
      dicaTributos = `${inicio} ${t('lanc.dica.estimativa', {
        valor: valorCentavos !== null ? formatarCentavos(Math.round(estimativa.totalCentavos)) : '—',
        percentual,
        pais: nomePais,
      })}`;
      if (estimativa.avisos.includes('especial-alcool-tabaco-nao-incluido')) dicaTributos += ` ${t('lanc.dica.especial')}`;
    }
  }

  const podeSalvar =
    valorCentavos !== null && categoria !== null && data !== null && !dataNoFuturo && avisoTributos === null;

  let avisoData: string | null = null;
  if (dataNoFuturo) avisoData = t('lanc.form.dataFutura');

  function trocarTipo(novo: TipoTransacao) {
    setTipo(novo);
    setCategoriaId(null);
    setCriandoCategoria(false);
  }

  function salvar() {
    if (!podeSalvar || valorCentavos === null || !categoria || !data) return;
    try {
      aoSalvar({
        tipo,
        valorCentavos,
        descricao,
        categoriaId: categoria.id,
        data,
        recorrente: tipo === 'despesa' && recorrente,
        tributosCentavos: tipo === 'despesa' && informouTributos ? tributosCentavos : null,
        chaveNota: tipo === 'despesa' ? chaveNota : null,
        paisConsumo: tipo === 'despesa' ? local.pais : null,
        regiaoConsumo: tipo === 'despesa' ? local.regiao : null,
        origemPais:
          tipo === 'despesa' && local.pais
            ? sugestao?.chaveNota && local.pais === sugestao.paisConsumo && local.regiao === (sugestao.regiaoConsumo ?? null)
              ? 'recibo'
              : 'manual'
            : null,
      });
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

          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.conteudo}
            keyboardShouldPersistTaps="handled">
            {sugestao?.numeroFatura && (
              <View style={[styles.avisoFatura, { backgroundColor: theme.accentSoft }]} accessibilityLiveRegion="polite">
                <Icone nome="qrcode" cor={theme.accentText} tamanho={20} />
                <ThemedText type="small" style={[styles.flex, { color: theme.accentText }]}>
                  {t('fatura.lida', { numero: sugestao.numeroFatura })}
                </ThemedText>
              </View>
            )}

            <View style={styles.linha} accessibilityRole="radiogroup">
              <Botao
                texto={t('lanc.despesa')}
                variante="secundario"
                selecionado={tipo === 'despesa'}
                onPress={() => trocarTipo('despesa')}
                style={styles.flex}
              />
              <Botao
                texto={t('lanc.receita')}
                variante="secundario"
                selecionado={tipo === 'receita'}
                onPress={() => trocarTipo('receita')}
                style={styles.flex}
              />
            </View>

            <CampoValor
              valor={valorTexto}
              aoMudar={setValorTexto}
              rotulo={tipo === 'despesa' ? t('lanc.form.valorDespesa') : t('lanc.form.valorReceita')}
              autoFocus={!base}
            />

            <Secao titulo={t('lanc.descricao')}>
              <TextInput
                style={estiloCampo}
                value={descricao}
                onChangeText={setDescricao}
                placeholder={tipo === 'despesa' ? t('lanc.form.exDespesa') : t('lanc.form.exReceita')}
                placeholderTextColor={theme.textSecondary}
                accessibilityLabel={t('lanc.form.descricaoOpcional')}
                maxLength={120}
                returnKeyType="done"
              />
            </Secao>

            <Secao titulo={t('lanc.categoria')}>
              <View style={styles.chips} accessibilityRole="radiogroup">
                {categorias.map((c) => {
                  const ativa = c.id === categoria?.id;
                  return (
                    <Chip key={c.id} texto={c.nome} ativo={ativa} aoTocar={() => setCategoriaId(c.id)} />
                  );
                })}
                {!criandoCategoria && (
                  <Chip texto={t('lanc.form.novaCategoria')} ativo={false} aoTocar={() => setCriandoCategoria(true)} />
                )}
              </View>
              {criandoCategoria && (
                <CampoNovaCategoria
                  tipo={tipo}
                  aoCriar={(id) => {
                    setCategoriaId(id);
                    setCriandoCategoria(false);
                  }}
                  aoCancelar={() => setCriandoCategoria(false)}
                />
              )}
            </Secao>

            <Secao titulo={t('lanc.data')}>
              <View style={styles.chips} accessibilityRole="radiogroup">
                <Chip texto={t('lanc.form.hoje')} ativo={opcaoData === 'hoje'} aoTocar={() => setOpcaoData('hoje')} />
                <Chip texto={t('lanc.form.ontem')} ativo={opcaoData === 'ontem'} aoTocar={() => setOpcaoData('ontem')} />
                <Chip
                  texto={t('lanc.form.outraData')}
                  ativo={opcaoData === 'outra'}
                  aoTocar={() => setOpcaoData('outra')}
                />
              </View>
              {opcaoData === 'outra' && (
                <CampoData
                  rotulo={t('lanc.form.dataLancamento')}
                  valor={outraData}
                  aoMudar={setOutraData}
                  max={hoje()}
                  abrirAoAparecer={outraData === null}
                />
              )}
              {avisoData && (
                <ThemedText type="small" style={{ color: theme.negative }} accessibilityLiveRegion="polite">
                  {avisoData}
                </ThemedText>
              )}
            </Secao>

            {tipo === 'despesa' && (
              <Secao titulo={t('lanc.onde')}>
                <SeletorPais residencia={residencia} regiaoResidencia={regiaoResidencia} valor={local} aoMudar={setLocal} />
                <ThemedText type="small" themeColor="textSecondary">
                  {t('lanc.onde.ajuda')}
                </ThemedText>
              </Secao>
            )}

            {tipo === 'despesa' && (
              <Secao titulo={t('lanc.impostos.titulo')}>
                <TextInput
                  style={estiloCampo}
                  value={tributosTexto}
                  onChangeText={setTributosTexto}
                  placeholder={exemploValorVazio()}
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="decimal-pad"
                  accessibilityLabel={t('lanc.impostos.rotulo')}
                  returnKeyType="done"
                />
                <ThemedText type="small" themeColor="textSecondary">
                  {dicaTributos}
                </ThemedText>
                {avisoTributos && (
                  <ThemedText type="small" style={{ color: theme.negative }} accessibilityLiveRegion="polite">
                    {avisoTributos}
                  </ThemedText>
                )}
              </Secao>
            )}

            {tipo === 'despesa' && (
              <View style={[styles.recorrente, { backgroundColor: theme.backgroundElement }]}>
                <View style={styles.flex}>
                  <ThemedText type="smallBold">{t('lanc.recorrente.titulo')}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {t('lanc.form.recorrenteAjuda')}
                  </ThemedText>
                </View>
                <Switch
                  value={recorrente}
                  onValueChange={setRecorrente}
                  trackColor={{ true: theme.positive }}
                  accessibilityLabel={t('lanc.recorrente.titulo')}
                />
              </View>
            )}
          </ScrollView>

          <View style={styles.rodape}>
            {!categoria && valorCentavos !== null && (
              <ThemedText type="small" themeColor="textSecondary" style={styles.dica}>
                {t('lanc.form.escolhaCategoria')}
              </ThemedText>
            )}
            <Botao
              texto={inicial ? t('lanc.form.guardarAlteracoes') : t('comum.guardar')}
              disabled={!podeSalvar}
              onPress={salvar}
            />
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

const styles = StyleSheet.create({
  avisoFatura: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
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
  linha: {
    flexDirection: 'row',
    gap: Spacing.two,
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
  recorrente: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  aviso: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.one,
  },
  rodape: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  dica: {
    textAlign: 'center',
  },
});
