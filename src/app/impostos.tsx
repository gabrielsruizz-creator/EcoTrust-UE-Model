import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { BarraProgresso } from '@/components/barra-progresso';
import { Icone } from '@/components/icone';
import { Botao, Cartao, IconeCirculo, LinhaLista, Tela, useDegrade } from '@/components/tela';
import { ThemedText } from '@/components/themed-text';
import { SeriesColors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useImpostometroUE } from '@/hooks/use-dados';
import { useT } from '@/hooks/use-idioma';
import { useTheme } from '@/hooks/use-theme';
import { localeAtual, type Chave } from '@/i18n';
import { formatarDataCurta, mesAtual, nomeDoMesSemAno, nomeDoMesTitulo, somarMeses } from '@/utils/datas';
import { formatarCentavos } from '@/utils/moeda';
import { visualCategoria } from '@/utils/visual';

/** Número com no máximo uma casa decimal, no formato do idioma. */
function numero(n: number) {
  return n.toLocaleString(localeAtual(), { maximumFractionDigits: 1 });
}

/** "2026-03-12" → "12 de março" / "12 March" */
function diaEMes(data: string) {
  const [ano, mes, dia] = data.split('-').map(Number);
  return new Date(ano, mes - 1, dia).toLocaleDateString(localeAtual(), { day: 'numeric', month: 'long' });
}

/**
 * Impostómetro (edição europeia): impostos das compras pelo país onde aconteceram, identificados (recibo)
 * separados dos estimados, mais o imposto sobre o rendimento pela residência fiscal.
 */
export default function ImpostosScreen() {
  const t = useT();
  const theme = useTheme();
  const degrade = useDegrade(135);
  const esquema = useColorScheme() === 'light' ? 'light' : 'dark';
  const [mes, setMes] = useState(mesAtual());
  const imp = useImpostometroUE(mes);
  const nomeMes = nomeDoMesSemAno(mes);
  const ehMesAtual = mes >= mesAtual();
  const pais = (codigo: string) => t(`pais.${codigo}` as Chave);
  const consumo = imp.identificadosCentavos + imp.estimadosCentavos;
  const rendaEPatrimonio = imp.cargaTotalCentavos - consumo;
  const residencia = imp.residencia ?? 'PT';

  let textoRenda: string | null = null;
  if (imp.motivoSemRenda === 'sem-rendimento' || imp.motivoSemRenda === 'sem-perfil') textoRenda = t('imp.renda.semRendimento');
  else if (imp.motivoSemRenda === 'pais') textoRenda = t('imp.renda.semRegras', { pais: pais(residencia) });
  else if (imp.motivoSemRenda === 'ano') textoRenda = t('imp.renda.ano', { ano: mes.slice(0, 4), pais: pais(residencia) });
  else if (imp.motivoSemRenda === 'situacao') textoRenda = t('imp.renda.situacao', { pais: pais(residencia) });

  const maiorPais = Math.max(1, ...imp.porPais.map((p) => p.impostosCentavos));

  return (
    <Tela voltar titulo={t('imp.titulo')} subtitulo={t('imp.subtitulo')}>
      {/* Mês */}
      <View style={styles.seletorMes}>
        <BotaoSeta icone="voltar" rotulo={t('imp.mesAnterior')} aoTocar={() => setMes(somarMeses(mes, -1))} />
        <ThemedText type="smallBold" style={styles.nomeMes} accessibilityLiveRegion="polite">
          {nomeDoMesTitulo(mes)}
        </ThemedText>
        <BotaoSeta icone="avancar" rotulo={t('imp.proximoMes')} desativado={ehMesAtual} aoTocar={() => setMes(somarMeses(mes, 1))} />
      </View>

      {/* Total do mês */}
      <View style={[styles.destaque, degrade, { boxShadow: `0 12px 32px ${theme.brilho}` }]} accessible>
        <View style={styles.decoracao} />
        <View style={styles.linha}>
          <Icone nome="impostos" cor="#FFFFFF" tamanho={18} />
          <ThemedText type="small" style={styles.textoClaro}>
            {t('imp.destaque.titulo', { mes: nomeMes })}
          </ThemedText>
        </View>
        <ThemedText style={styles.valorDestaque} numberOfLines={1} adjustsFontSizeToFit>
          {formatarCentavos(imp.cargaTotalCentavos)}
        </ThemedText>
        <ThemedText type="small" style={styles.textoClaro}>
          {imp.percentualDosGastos !== null
            ? t('imp.destaque.percentual', { percentual: numero(imp.percentualDosGastos), gastos: formatarCentavos(imp.gastosCentavos) })
            : t('imp.destaque.semDespesas')}
          {rendaEPatrimonio > 0 ? ` ${t('imp.destaque.maisRenda', { valor: formatarCentavos(rendaEPatrimonio) })}` : ''}
        </ThemedText>
        {imp.variacao !== null && (
          <View style={styles.pilula}>
            <Icone nome={imp.variacao >= 0 ? 'subindo' : 'descendo'} cor="#FFFFFF" tamanho={14} />
            <ThemedText type="smallBold" style={styles.textoBranco}>
              {t('imp.variacao', { valor: `${imp.variacao >= 0 ? '+' : ''}${imp.variacao}` })}
            </ThemedText>
          </View>
        )}
      </View>

      {imp.despesas === 0 && (
        <Cartao>
          <ThemedText type="small">{t('imp.vazio')}</ThemedText>
          {ehMesAtual && (
            <Botao
              texto={t('imp.registar')}
              icone="mais"
              onPress={() => router.push({ pathname: '/novo-lancamento', params: { tipo: 'despesa' } })}
            />
          )}
        </Cartao>
      )}

      {/* Compras: identificado × estimado, IVA × especiais */}
      {imp.despesas > 0 && (
        <Cartao>
          <ThemedText type="smallBold">{t('imp.consumo.titulo')}</ThemedText>
          <LinhaValor rotulo={t('imp.identificado')} valor={imp.identificadosCentavos} />
          <LinhaValor rotulo={t('imp.estimado')} valor={imp.estimadosCentavos} />
          <ThemedText type="small" themeColor="textSecondary">
            {t('imp.identificado.ajuda', { n: imp.despesasIdentificadas, total: imp.despesas - imp.semRegras.despesas })}
          </ThemedText>
          <View style={[styles.separador, { borderTopColor: theme.border }]} />
          <LinhaValor rotulo={t('imp.iva')} valor={imp.ivaCentavos} />
          {imp.especiaisCentavos > 0 && <LinhaValor rotulo={t('imp.especiais')} valor={imp.especiaisCentavos} />}
          {imp.semRegras.despesas > 0 && (
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              {t('imp.semRegras', { n: imp.semRegras.despesas, valor: formatarCentavos(imp.semRegras.gastoCentavos) })}
            </ThemedText>
          )}
        </Cartao>
      )}

      {/* Rendimento e património */}
      <Cartao>
        <ThemedText type="smallBold">{t('imp.renda.titulo')}</ThemedText>
        {imp.renda ? (
          <>
            <LinhaValor rotulo={t('imp.renda.imposto')} valor={imp.renda.impostoCentavos} />
            <LinhaValor rotulo={t('imp.renda.contribuicoes')} valor={imp.renda.contribuicoesCentavos} />
            {imp.renda.bonusCentavos > 0 && <LinhaValor rotulo={t('imp.renda.bonus')} valor={imp.renda.bonusCentavos} sinal="+" />}
            <ThemedText type="small" themeColor="textSecondary">
              {t('imp.renda.base', { pais: pais(residencia) })}
            </ThemedText>
          </>
        ) : (
          <ThemedText type="small" themeColor="textSecondary">
            {textoRenda}
          </ThemedText>
        )}
        {imp.patrimonioCentavos > 0 && <LinhaValor rotulo={t('imp.patrimonio')} valor={imp.patrimonioCentavos} />}
        <Botao texto={t('imp.editarPerfil')} variante="secundario" icone="ajustes" onPress={() => router.push('/editar-perfil-fiscal')} />
      </Cartao>

      {/* Por país */}
      {imp.porPais.length > 0 && (
        <>
          <ThemedText type="smallBold" accessibilityRole="header">
            {t('imp.porPais')}
          </ThemedText>
          <Cartao>
            {imp.porPais.map((p, i) => (
              <View
                key={p.pais}
                style={styles.barraLinha}
                accessible
                accessibilityLabel={`${pais(p.pais)}: ${formatarCentavos(p.impostosCentavos)}, ${t('imp.despesas', { n: p.despesas })}`}>
                <View style={styles.linha}>
                  <ThemedText type="small" style={styles.flex} numberOfLines={1}>
                    {pais(p.pais)}
                    {p.pais === residencia ? ` · ${t('imp.residencia')}` : ''}
                  </ThemedText>
                  <ThemedText type="smallBold">{formatarCentavos(p.impostosCentavos)}</ThemedText>
                </View>
                <ThemedText type="small" themeColor="textSecondary">
                  {t('imp.despesas', { n: p.despesas })} · {formatarCentavos(p.gastoCentavos)}
                </ThemedText>
                <BarraProgresso
                  percentual={(p.impostosCentavos / maiorPais) * 100}
                  cor={SeriesColors[esquema][i % 8]}
                  altura={6}
                />
              </View>
            ))}
          </Cartao>
        </>
      )}

      {/* Por categoria */}
      {imp.porCategoria.length > 0 && (
        <>
          <ThemedText type="smallBold" accessibilityRole="header">
            {t('imp.porCategoria')}
          </ThemedText>
          <Cartao>
            {imp.porCategoria.map((c) => {
              const visual = visualCategoria(c.categoria, c.categoriaId);
              return (
                <View
                  key={c.categoriaId}
                  style={styles.categoria}
                  accessible
                  accessibilityLabel={`${c.categoria}: ${formatarCentavos(c.impostosCentavos)}, ${t('imp.carga', { percentual: numero(c.carga) })}`}>
                  <IconeCirculo icone={visual.icone} cor={SeriesColors[esquema][visual.cor]} tamanho={36} />
                  <View style={styles.flex}>
                    <ThemedText type="small" numberOfLines={1}>
                      {c.categoria}
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
                      {t('imp.carga', { percentual: numero(c.carga) })} · {formatarCentavos(c.gastoCentavos)}
                    </ThemedText>
                  </View>
                  <ThemedText type="smallBold">{formatarCentavos(c.impostosCentavos)}</ThemedText>
                </View>
              );
            })}
          </Cartao>
        </>
      )}

      {/* Maiores */}
      {imp.maioresLancamentos.length > 0 && (
        <>
          <ThemedText type="smallBold" accessibilityRole="header">
            {t('imp.maiores')}
          </ThemedText>
          <Cartao style={styles.cartaoLista}>
            {imp.maioresLancamentos.map(({ transacao: tr, impostos }, i) => (
              <LinhaLista
                key={tr.id}
                separador={i > 0}
                titulo={tr.descricao || tr.categoriaNome}
                subtitulo={[
                  formatarDataCurta(tr.data),
                  formatarCentavos(tr.valorCentavos),
                  pais(impostos.pais),
                  t(impostos.origem === 'identificado' ? 'imp.origem.identificado' : 'imp.origem.estimado'),
                ].join(' · ')}
                direita={<ThemedText type="smallBold">{formatarCentavos(impostos.totalCentavos)}</ThemedText>}
                aoTocar={() => router.push({ pathname: '/lancamento/[id]', params: { id: String(tr.id) } })}
              />
            ))}
          </Cartao>
        </>
      )}

      {/* Dias de trabalho e Dia da Libertação */}
      {imp.diasTrabalhados !== null && imp.cargaTotalCentavos > 0 && (
        <Cartao>
          <ThemedText type="smallBold">{t('imp.dias.titulo')}</ThemedText>
          <ThemedText style={styles.valorGrande}>
            {t('imp.dias.texto', { dias: numero(imp.diasTrabalhados), total: imp.diasNoMes, mes: nomeMes })}
          </ThemedText>
          {imp.liberdade && (
            <View style={[styles.liberdade, { backgroundColor: theme.accentSoft }]}>
              <ThemedText type="smallBold">{t('imp.liberdade.titulo')}</ThemedText>
              <ThemedText type="small">{t('imp.liberdade.texto')}</ThemedText>
              <ThemedText style={styles.valorGrande}>{diaEMes(imp.liberdade.data)}</ThemedText>
            </View>
          )}
        </Cartao>
      )}

      {/* Avisos */}
      {imp.avisos.length > 0 && (
        <Cartao>
          <ThemedText type="smallBold">{t('imp.avisos.titulo')}</ThemedText>
          {imp.avisos.map((a) => (
            <View key={a} style={styles.aviso}>
              <Icone nome="ajuda" cor={theme.textSecondary} tamanho={16} />
              <ThemedText type="small" themeColor="textSecondary" style={styles.flex}>
                {t(`aviso.${a}` as Chave)}
              </ThemedText>
            </View>
          ))}
        </Cartao>
      )}

      <Cartao>
        <ThemedText type="smallBold">{t('imp.como.titulo')}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {t('imp.como.texto')}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {t('fiscal.estimativa')}
        </ThemedText>
      </Cartao>
    </Tela>
  );
}

function LinhaValor({ rotulo, valor, sinal }: { rotulo: string; valor: number; sinal?: string }) {
  const texto = `${sinal ? `${sinal} ` : ''}${formatarCentavos(valor)}`;
  return (
    <View style={styles.linha} accessible accessibilityLabel={`${rotulo}: ${texto}`}>
      <ThemedText type="small" themeColor="textSecondary" style={styles.flex}>
        {rotulo}
      </ThemedText>
      <ThemedText type="smallBold">{texto}</ThemedText>
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
  flex: { flex: 1 },
  pressionado: { opacity: 0.7 },
  desativado: { opacity: 0.35 },
  seletorMes: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  nomeMes: { flex: 1, textAlign: 'center' },
  seta: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destaque: { borderRadius: Spacing.four, padding: Spacing.four, gap: Spacing.one, overflow: 'hidden' },
  decoracao: {
    position: 'absolute',
    right: -40,
    top: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  textoClaro: { color: 'rgba(255,255,255,0.85)' },
  textoBranco: { color: '#FFFFFF' },
  valorDestaque: { fontSize: 36, lineHeight: 44, fontWeight: 700, color: '#FFFFFF' },
  pilula: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginTop: Spacing.one,
  },
  linha: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  separador: { borderTopWidth: StyleSheet.hairlineWidth, marginVertical: Spacing.one },
  liberdade: { padding: Spacing.three, borderRadius: Spacing.three, gap: Spacing.one },
  valorGrande: { fontSize: 24, lineHeight: 32, fontWeight: 700 },
  barraLinha: { gap: Spacing.one },
  categoria: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, minHeight: 48 },
  aviso: { flexDirection: 'row', gap: Spacing.two, alignItems: 'flex-start' },
  cartaoLista: { paddingVertical: Spacing.one, gap: 0 },
});
