import { useState, type ReactNode } from 'react';
import { Alert, StyleSheet, Switch, TextInput, View } from 'react-native';

import { Chip } from '@/components/chip';
import { Botao, Cartao } from '@/components/tela';
import { TelaSecundaria } from '@/components/tela-secundaria';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { PAISES_FISCAIS, PAISES_UE, type CodigoPais } from '@/data/paises';
import { useIdioma, useT } from '@/hooks/use-idioma';
import { useTheme } from '@/hooks/use-theme';
import { localeAtual, type Chave } from '@/i18n';
import { ErroValidacao } from '@/services/erros';
import { REGIOES_FISCAIS, salvarPerfilFiscal } from '@/services/perfil-fiscal-service';
import type { PerfilFiscal, SituacaoProfissional, TipoCombustivel } from '@/types/financas';
import { centavosParaTexto, exemploValorVazio, lerValorEmCentavos, simboloMoeda } from '@/utils/moeda';

const PADRAO: PerfilFiscal = {
  paisResidencia: 'PT',
  regiaoResidencia: null,
  situacao: 'dependente',
  brutoAnualCentavos: null,
  dependentes: 0,
  dependentesAte3Anos: 0,
  declaracaoConjunta: false,
  contribuicaoProporcional: false,
  combustivel: 'gasolina',
};

/** Países em ordem alfabética no idioma atual, com os que já têm regras primeiro. */
function paisesOrdenados(t: (c: Chave) => string) {
  const nome = (p: CodigoPais) => t(`pais.${p}` as Chave);
  const comRegras = (p: CodigoPais) => (PAISES_FISCAIS[p] ? 0 : 1);
  return PAISES_UE.map((p) => p.codigo).sort(
    (a, b) => comRegras(a) - comRegras(b) || nome(a).localeCompare(nome(b), localeAtual()),
  );
}

type Props = {
  inicial: PerfilFiscal | null;
  /** Primeiro acesso: sem botão de voltar */
  primeiraVez?: boolean;
  aoGuardar: () => void;
};

/** Residência fiscal, situação profissional e rendimento — usado no primeiro acesso e no Perfil. */
export function FormularioPerfilFiscal({ inicial, primeiraVez, aoGuardar }: Props) {
  const t = useT();
  useIdioma();
  const theme = useTheme();
  const [p, setP] = useState<PerfilFiscal>(inicial ?? PADRAO);
  const [brutoTexto, setBrutoTexto] = useState(p.brutoAnualCentavos ? centavosParaTexto(p.brutoAnualCentavos) : '');

  const mudar = (m: Partial<PerfilFiscal>) => setP((atual) => ({ ...atual, ...m }));
  const regioes = REGIOES_FISCAIS[p.paisResidencia] ?? [];
  const pais = p.paisResidencia as CodigoPais;
  const temRegras = PAISES_FISCAIS[pais] !== undefined;

  function guardar() {
    const bruto = brutoTexto.trim() ? lerValorEmCentavos(brutoTexto, true) : null;
    if (brutoTexto.trim() && bruto === null) {
      Alert.alert(t('comum.erroGuardar'), t('fiscal.erro.rendimento'));
      return;
    }
    try {
      salvarPerfilFiscal({
        ...p,
        brutoAnualCentavos: bruto,
        regiaoResidencia: regioes.includes(p.regiaoResidencia ?? '') ? p.regiaoResidencia : null,
        // Opções que só existem em certos países ficam desligadas nos outros.
        dependentesAte3Anos: pais === 'PT' ? Math.min(p.dependentesAte3Anos, p.dependentes) : 0,
        declaracaoConjunta: pais === 'MT' ? p.declaracaoConjunta : false,
        contribuicaoProporcional: pais === 'MT' && p.situacao === 'dependente' ? p.contribuicaoProporcional : false,
      });
      aoGuardar();
    } catch (e) {
      Alert.alert(t('comum.erroGuardar'), e instanceof ErroValidacao ? e.message : t('comum.tenteNovamente'));
    }
  }

  return (
    <TelaSecundaria
      titulo={t('fiscal.titulo')}
      textoVoltar={t('comum.cancelar')}
      semVoltar={primeiraVez}
      rodape={<Botao texto={primeiraVez ? t('comum.continuar') : t('comum.guardar')} onPress={guardar} />}>
      <ThemedText type="small" themeColor="textSecondary">
        {t('fiscal.intro')}
      </ThemedText>

      <Grupo titulo={t('fiscal.residencia')} ajuda={t('fiscal.residencia.ajuda')}>
        {paisesOrdenados(t).map((codigo) => (
          <Chip
            key={codigo}
            texto={t(`pais.${codigo}` as Chave)}
            ativo={p.paisResidencia === codigo}
            aoTocar={() => mudar({ paisResidencia: codigo, regiaoResidencia: null })}
          />
        ))}
      </Grupo>
      {!temRegras && (
        <Cartao>
          <ThemedText type="small">{t('fiscal.semRegras', { pais: t(`pais.${pais}` as Chave) })}</ThemedText>
        </Cartao>
      )}

      {regioes.length > 0 && (
        <Grupo titulo={t('fiscal.regiao')}>
          <Chip
            texto={t(`regiao.${pais}-continente` as Chave)}
            ativo={p.regiaoResidencia === null}
            aoTocar={() => mudar({ regiaoResidencia: null })}
          />
          {regioes.map((r) => (
            <Chip key={r} texto={t(`regiao.${r}` as Chave)} ativo={p.regiaoResidencia === r} aoTocar={() => mudar({ regiaoResidencia: r })} />
          ))}
        </Grupo>
      )}

      <Grupo titulo={t('fiscal.situacao')}>
        {(['dependente', 'independente'] as SituacaoProfissional[]).map((s) => (
          <Chip key={s} texto={t(`fiscal.situacao.${s}`)} ativo={p.situacao === s} aoTocar={() => mudar({ situacao: s })} />
        ))}
      </Grupo>

      <View style={styles.grupo}>
        <ThemedText type="smallBold">{t('fiscal.rendimento')}</ThemedText>
        <View style={[styles.campo, { backgroundColor: theme.backgroundElement }]}>
          <ThemedText themeColor="textSecondary">{simboloMoeda()}</ThemedText>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            value={brutoTexto}
            onChangeText={setBrutoTexto}
            placeholder={exemploValorVazio()}
            placeholderTextColor={theme.textSecondary}
            keyboardType="decimal-pad"
            accessibilityLabel={t('fiscal.rendimento')}
          />
        </View>
        <ThemedText type="small" themeColor="textSecondary">
          {t('fiscal.rendimento.ajuda')}
        </ThemedText>
      </View>

      <Contador
        titulo={t('fiscal.dependentes')}
        valor={p.dependentes}
        aoMudar={(n) => mudar({ dependentes: n, dependentesAte3Anos: Math.min(p.dependentesAte3Anos, n) })}
      />
      {pais === 'PT' && p.dependentes > 0 && (
        <Contador
          titulo={t('fiscal.dependentesAte3')}
          valor={p.dependentesAte3Anos}
          maximo={p.dependentes}
          aoMudar={(n) => mudar({ dependentesAte3Anos: n })}
        />
      )}

      {pais === 'MT' && (
        <Interruptor titulo={t('fiscal.conjunta')} valor={p.declaracaoConjunta} aoMudar={(v) => mudar({ declaracaoConjunta: v })} />
      )}
      {pais === 'MT' && p.situacao === 'dependente' && (
        <Interruptor
          titulo={t('fiscal.proporcional')}
          valor={p.contribuicaoProporcional}
          aoMudar={(v) => mudar({ contribuicaoProporcional: v })}
        />
      )}

      <Grupo titulo={t('fiscal.combustivel')}>
        {(['gasolina', 'gasoleo'] as TipoCombustivel[]).map((c) => (
          <Chip key={c} texto={t(`fiscal.combustivel.${c}`)} ativo={p.combustivel === c} aoTocar={() => mudar({ combustivel: c })} />
        ))}
      </Grupo>

      <ThemedText type="small" themeColor="textSecondary">
        {t('fiscal.estimativa')}
      </ThemedText>
    </TelaSecundaria>
  );
}

function Grupo({ titulo, ajuda, children }: { titulo: string; ajuda?: string; children: ReactNode }) {
  return (
    <View style={styles.grupo}>
      <ThemedText type="smallBold">{titulo}</ThemedText>
      {ajuda && (
        <ThemedText type="small" themeColor="textSecondary">
          {ajuda}
        </ThemedText>
      )}
      <View style={styles.chips} accessibilityRole="radiogroup" accessibilityLabel={titulo}>
        {children}
      </View>
    </View>
  );
}

function Contador({ titulo, valor, maximo = 20, aoMudar }: { titulo: string; valor: number; maximo?: number; aoMudar: (n: number) => void }) {
  return (
    <View style={styles.linha}>
      <ThemedText type="smallBold" style={styles.flex}>
        {titulo}
      </ThemedText>
      <Botao texto="−" variante="secundario" disabled={valor <= 0} onPress={() => aoMudar(valor - 1)} accessibilityLabel={`${titulo}: −1`} />
      <ThemedText type="smallBold" accessibilityLabel={`${titulo}: ${valor}`} style={styles.numero}>
        {valor}
      </ThemedText>
      <Botao texto="+" variante="secundario" disabled={valor >= maximo} onPress={() => aoMudar(valor + 1)} accessibilityLabel={`${titulo}: +1`} />
    </View>
  );
}

function Interruptor({ titulo, valor, aoMudar }: { titulo: string; valor: boolean; aoMudar: (v: boolean) => void }) {
  return (
    <View style={styles.linha}>
      <ThemedText type="small" style={styles.flex}>
        {titulo}
      </ThemedText>
      <Switch value={valor} onValueChange={aoMudar} accessibilityLabel={titulo} />
    </View>
  );
}

const styles = StyleSheet.create({
  grupo: { gap: Spacing.two },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  linha: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, minHeight: 44 },
  flex: { flex: 1 },
  numero: { minWidth: 28, textAlign: 'center' },
  campo: { flexDirection: 'row', alignItems: 'center', borderRadius: Spacing.three, paddingHorizontal: Spacing.three, gap: Spacing.two },
  input: { flex: 1, fontSize: 20, fontWeight: 600, paddingVertical: Spacing.three },
});
