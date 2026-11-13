import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { FolhaCalendario } from '@/components/calendario';
import { Chip } from '@/components/chip';
import { Icone } from '@/components/icone';
import { Selo, seloDoLancamento } from '@/components/selo';
import { Valor } from '@/components/valor';
import type { OrigemImposto } from '@/services/impostometro-ue-service';
import { Botao, Cartao, Segmentado, Tela } from '@/components/tela';
import { ThemedText } from '@/components/themed-text';
import { SeriesColors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useDiasComLancamentos, useHistorico, useImpostosDosLancamentos } from '@/hooks/use-dados';
import { useT } from '@/hooks/use-idioma';
import { useTheme } from '@/hooks/use-theme';
import { localeAtual } from '@/i18n';
import { rotuloCategoriaFiltro } from '@/services/historico-service';
import type { TipoTransacao, Transacao } from '@/types/financas';
import {
  formatarData,
  formatarDataCurta,
  formatarDataPorExtenso,
  hoje,
  mesAtual,
  nomeDoMesTitulo,
  paraDataLocal,
  somarMeses,
} from '@/utils/datas';
import { formatarCentavos } from '@/utils/moeda';
import { visualCategoria } from '@/utils/visual';

type FiltroTipo = 'todos' | TipoTransacao;

export default function TransacoesScreen() {
  const theme = useTheme();
  const t = useT();
  const [mes, setMes] = useState(mesAtual());
  const [tipo, setTipo] = useState<FiltroTipo>('todos');
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [dia, setDia] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [calendarioAberto, setCalendarioAberto] = useState(false);
  const historico = useHistorico(mes, tipo === 'todos' ? undefined : tipo, categoriaId, dia, busca);
  const diasComLancamentos = useDiasComLancamentos();
  const impostos = useImpostosDosLancamentos(mes);
  const impostosFiltrados = historico.grupos
    .flatMap((g) => g.transacoes)
    .reduce((soma, t) => soma + (impostos.get(t.id)?.centavos ?? 0), 0);

  const ehMesAtual = mes >= mesAtual();
  const filtrando = tipo !== 'todos' || historico.categoriaAplicada !== null || dia !== null || busca.trim() !== '';

  function trocarMes(novo: string) {
    setMes(novo);
    setDia(null);
  }

  function escolherDia(data: string) {
    setMes(data.slice(0, 7));
    setDia(data);
  }

  function trocarTipo(novo: FiltroTipo) {
    setTipo(novo);
    setCategoriaId(null);
  }

  return (
    <Tela
      titulo={t('abas.transacoes')}
      acoes={[
        { icone: 'categorias', rotulo: t('transacoes.categoriasOrcamento'), aoTocar: () => router.push('/orcamento') },
        { icone: 'mais', rotulo: t('lanc.novo'), aoTocar: () => router.push('/novo-lancamento') },
      ]}>
      {/* Busca */}
      <View style={[styles.busca, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        <Icone nome="busca" cor={theme.textSecondary} tamanho={18} />
        <TextInput
          value={busca}
          onChangeText={setBusca}
          placeholder={t('transacoes.buscar')}
          placeholderTextColor={theme.textSecondary}
          accessibilityLabel={t('transacoes.buscar.rotulo')}
          returnKeyType="search"
          style={[styles.campoBusca, { color: theme.text }]}
        />
        {busca !== '' && (
          <Pressable onPress={() => setBusca('')} accessibilityRole="button" accessibilityLabel={t('transacoes.limparBusca')} hitSlop={12}>
            <Icone nome="fechar" cor={theme.textSecondary} tamanho={16} />
          </Pressable>
        )}
      </View>

      <Segmentado
        rotulo={t('transacoes.tipo')}
        valor={tipo}
        aoMudar={trocarTipo}
        opcoes={[
          { valor: 'todos', texto: t('transacoes.todos') },
          { valor: 'receita', texto: t('transacoes.receitas') },
          { valor: 'despesa', texto: t('transacoes.despesas') },
        ]}
      />

      {/* Mês (o nome abre o calendário) */}
      <View style={styles.seletorMes}>
        <BotaoSeta icone="voltar" rotulo={t('imp.mesAnterior')} aoTocar={() => trocarMes(somarMeses(mes, -1))} />
        <Pressable
          onPress={() => setCalendarioAberto(true)}
          accessibilityRole="button"
          accessibilityLabel={`${nomeDoMesTitulo(mes)}. ${t('transacoes.abrirCalendario')}`}
          style={({ pressed }) => [styles.botaoMes, pressed && styles.pressionado]}>
          <Icone nome="calendario" cor={theme.accentText} tamanho={18} />
          <ThemedText type="smallBold" accessibilityLiveRegion="polite">
            {nomeDoMesTitulo(mes)}
          </ThemedText>
        </Pressable>
        <BotaoSeta
          icone="avancar"
          rotulo={t('imp.proximoMes')}
          desativado={ehMesAtual}
          aoTocar={() => trocarMes(somarMeses(mes, 1))}
        />
      </View>
      <FolhaCalendario
        visivel={calendarioAberto}
        titulo={t('transacoes.verDia')}
        valor={dia}
        mesInicial={mes}
        max={hoje()}
        marcados={diasComLancamentos}
        aoEscolher={escolherDia}
        aoFechar={() => setCalendarioAberto(false)}
        acaoExtra={dia ? { texto: t('transacoes.mesInteiro'), aoTocar: () => setDia(null) } : undefined}
      />

      {dia && (
        <View style={[styles.filtroDia, { backgroundColor: theme.accentSoft }]}>
          <ThemedText type="small" style={styles.flex}>
            {t('transacoes.mostrandoSo')} <ThemedText type="smallBold">{formatarDataPorExtenso(dia)}</ThemedText>
          </ThemedText>
          <Pressable onPress={() => setDia(null)} accessibilityRole="button" accessibilityLabel={t('transacoes.mesInteiro')} hitSlop={12}>
            <ThemedText type="smallBold" style={{ color: theme.accentText }}>
              {t('transacoes.mesInteiro')}
            </ThemedText>
          </Pressable>
        </View>
      )}

      {/* Categoria (só as que aparecem no período) */}
      {historico.categorias.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.sangria}
          contentContainerStyle={styles.chipsRolagem}
          accessibilityRole="radiogroup"
          accessibilityLabel={t('transacoes.filtrarCategoria')}>
          <Chip texto={t('transacoes.todas')} ativo={historico.categoriaAplicada === null} aoTocar={() => setCategoriaId(null)} />
          {historico.categorias.map((c) => (
            <Chip
              key={c.id}
              texto={rotuloCategoriaFiltro(c, historico.categorias)}
              ativo={historico.categoriaAplicada === c.id}
              aoTocar={() => setCategoriaId(c.id)}
            />
          ))}
        </ScrollView>
      )}

      {/* Totais do que está filtrado */}
      <Cartao>
        <View style={styles.totais}>
          <Total rotulo={t('transacoes.receitas')} valor={historico.totais.receitasCentavos} cor={theme.positive} />
          <Total rotulo={t('transacoes.despesas')} valor={historico.totais.despesasCentavos} cor={theme.negative} />
          <Total
            rotulo={t('transacoes.saldo')}
            valor={historico.totais.saldoCentavos}
            cor={historico.totais.saldoCentavos >= 0 ? theme.text : theme.negative}
          />
        </View>
        <ThemedText type="small" themeColor="textSecondary">
          {t('transacoes.quantidade', { n: historico.totais.quantidade })}
          {filtrando ? ` ${t('transacoes.comFiltros')}` : ''}
        </ThemedText>
        {impostosFiltrados > 0 && (
          <Pressable
            onPress={() => router.push('/impostos')}
            accessibilityRole="link"
            accessibilityLabel={`${t('transacoes.impostosNessas', { valor: formatarCentavos(impostosFiltrados) })}. ${t('imp.titulo')}`}
            style={({ pressed }) => [styles.linhaImpostos, pressed && styles.pressionado]}>
            <Icone nome="impostos" cor={theme.accentText} tamanho={16} />
            <ThemedText type="small" style={styles.flex}>
              {t('transacoes.impostosNessas', { valor: formatarCentavos(impostosFiltrados) })}
            </ThemedText>
            <Icone nome="avancar" cor={theme.textSecondary} tamanho={14} />
          </Pressable>
        )}
      </Cartao>

      {/* Lista agrupada por dia */}
      {historico.grupos.length === 0 && (
        <View style={styles.vazio}>
          <ThemedText type="small" themeColor="textSecondary" style={styles.centro}>
            {busca.trim()
              ? t('transacoes.vazio.busca', { busca: busca.trim() })
              : dia
                ? t('transacoes.vazio.dia', { data: formatarData(dia) })
                : filtrando
                  ? t('transacoes.vazio.filtros')
                  : t('transacoes.vazio.mes', { mes: nomeDoMesTitulo(mes).toLocaleLowerCase(localeAtual()) })}
          </ThemedText>
          {ehMesAtual && !filtrando && (
            <Botao texto={t('lanc.novo')} icone="mais" onPress={() => router.push('/novo-lancamento')} />
          )}
        </View>
      )}

      {historico.grupos.map((grupo) => (
        <View key={grupo.data} style={styles.grupo}>
          <ThemedText type="small" themeColor="textSecondary" accessibilityRole="header">
            {grupo.destaque ? `${grupo.destaque}, ${formatarDataCurta(grupo.data)}` : formatarDataCurta(grupo.data)}
          </ThemedText>
          <Cartao style={styles.cartaoDia}>
            {grupo.transacoes.map((t, i) => (
              <ItemTransacao
                key={t.id}
                transacao={t}
                separador={i > 0}
                impostosCentavos={impostos.get(t.id)?.centavos ?? 0}
                origem={impostos.get(t.id)?.origem ?? null}
              />
            ))}
          </Cartao>
        </View>
      ))}
    </Tela>
  );
}

/** Hora em que o lançamento foi registrado, só quando foi registrado no próprio dia. */
function horaDoRegistro(t: Transacao) {
  if (!t.criadoEm) return null;
  const criado = new Date(t.criadoEm);
  if (Number.isNaN(criado.getTime()) || paraDataLocal(criado) !== t.data) return null;
  return criado.toLocaleTimeString(localeAtual(), { hour: '2-digit', minute: '2-digit' });
}

function ItemTransacao({
  transacao: t,
  separador,
  impostosCentavos,
  origem,
}: {
  transacao: Transacao;
  separador: boolean;
  /** Impostos da despesa (da nota ou estimados); 0 em receitas */
  impostosCentavos: number;
  origem: OrigemImposto | null;
}) {
  const theme = useTheme();
  const tr = useT();
  const esquema = useColorScheme() === 'light' ? 'light' : 'dark';
  const titulo = t.descricao || t.categoriaNome;
  const receita = t.tipo === 'receita';
  const visual = visualCategoria(t.categoriaNome, t.categoriaId);
  const hora = horaDoRegistro(t);

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/lancamento/[id]', params: { id: String(t.id) } })}
      accessibilityRole="button"
      accessibilityLabel={`${tr(receita ? 'lanc.receita' : 'lanc.despesa')}: ${titulo}, ${formatarCentavos(t.valorCentavos)}${impostosCentavos > 0 ? `, ${tr('inicio.impostosDe', { valor: formatarCentavos(impostosCentavos) })}` : ''}, ${t.categoriaNome}, ${formatarData(t.data)}${t.recorrente ? `, ${tr('selo.recorrente')}` : ''}`}
      accessibilityHint={tr('transacoes.abreDetalhes')}
      style={({ pressed }) => [
        styles.item,
        separador && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.border },
        pressed && styles.pressionado,
      ]}>
      <View style={[styles.quadrado, { borderColor: theme.border }]}>
        <Icone nome={visual.icone} cor={SeriesColors[esquema][visual.cor]} tamanho={18} />
      </View>
      <View style={styles.flex}>
        <ThemedText type="small" style={styles.tituloItem} numberOfLines={1}>
          {titulo}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
          {t.categoriaNome}
          {impostosCentavos > 0 ? ` · ${tr('inicio.impAbrev', { valor: formatarCentavos(impostosCentavos) })}` : hora ? ` · ${hora}` : ''}
        </ThemedText>
      </View>
      <View style={styles.valor}>
        <Valor centavos={t.valorCentavos} sinal={receita ? '+' : undefined} style={styles.valorItem} />
        <Selo {...seloDoLancamento(t, origem)} />
      </View>
    </Pressable>
  );
}

function Total({ rotulo, valor, cor }: { rotulo: string; valor: number; cor: string }) {
  return (
    <View style={styles.total} accessible accessibilityLabel={`${rotulo}: ${formatarCentavos(valor)}`}>
      <ThemedText type="small" themeColor="textSecondary">
        {rotulo}
      </ThemedText>
      <ThemedText type="smallBold" style={{ color: cor }} numberOfLines={1} adjustsFontSizeToFit>
        {formatarCentavos(valor)}
      </ThemedText>
    </View>
  );
}

function BotaoSeta({
  icone,
  rotulo,
  aoTocar,
  desativado,
}: {
  icone: 'voltar' | 'avancar';
  rotulo: string;
  aoTocar: () => void;
  desativado?: boolean;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={aoTocar}
      disabled={desativado}
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      accessibilityState={{ disabled: !!desativado }}
      hitSlop={8}
      style={({ pressed }) => [
        styles.seta,
        { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        pressed && styles.pressionado,
        desativado && styles.desativado,
      ]}>
      <Icone nome={icone} cor={theme.text} tamanho={18} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  centro: {
    textAlign: 'center',
  },
  pressionado: {
    opacity: 0.7,
  },
  desativado: {
    opacity: 0.35,
  },
  busca: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    minHeight: 48,
    borderRadius: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
  },
  campoBusca: {
    flex: 1,
    fontSize: 16,
    paddingVertical: Spacing.two,
  },
  seletorMes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  botaoMes: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    minHeight: 44,
  },
  seta: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtroDia: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  sangria: {
    marginHorizontal: -Spacing.three,
    flexGrow: 0,
  },
  chipsRolagem: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  totais: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  total: {
    flex: 1,
    gap: Spacing.half,
  },
  linhaImpostos: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    minHeight: 32,
  },
  vazio: {
    gap: Spacing.three,
    paddingVertical: Spacing.four,
  },
  grupo: {
    gap: Spacing.two,
  },
  cartaoDia: {
    paddingVertical: Spacing.one,
    gap: 0,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    minHeight: 64,
    paddingVertical: Spacing.two,
  },
  valor: {
    alignItems: 'flex-end',
    gap: Spacing.half,
  },
  quadrado: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tituloItem: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: 500,
  },
  valorItem: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: 700,
  },
});
