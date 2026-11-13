import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { Chip } from '@/components/chip';
import { Icone } from '@/components/icone';
import { Cartao, IconeCirculo } from '@/components/tela';
import { TelaSecundaria } from '@/components/tela-secundaria';
import { ThemedText } from '@/components/themed-text';
import { SeriesColors, Spacing } from '@/constants/theme';
import type { CodigoPais } from '@/data/paises';
import { PERFIS_CONSUMO, type PerfilTributarioId } from '@/data/perfis-consumo';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCategorias, usePerfilFiscal } from '@/hooks/use-dados';
import { useT } from '@/hooks/use-idioma';
import { useTheme } from '@/hooks/use-theme';
import { localeAtual, type Chave, type Tradutor } from '@/i18n';
import { alterarPerfilTributario, perfilTributarioDaCategoria } from '@/services/categorias-service';
import { ErroValidacao } from '@/services/erros';
import { estimarTaxaDoPerfil, type LocalCompra } from '@/services/iva-service';
import type { Categoria } from '@/types/financas';
import { hoje } from '@/utils/datas';
import { visualCategoria } from '@/utils/visual';

/** "13%" ou "6–23%" (quando a categoria mistura produtos com taxas diferentes). null sem regras. */
function textoTaxa(local: LocalCompra, perfil: PerfilTributarioId): string | null {
  const e = estimarTaxaDoPerfil(local, perfil, hoje());
  if (!e) return null;
  const n = (x: number) => x.toLocaleString(localeAtual(), { maximumFractionDigits: 1 });
  return e.faixa && e.faixa.minimo !== e.faixa.maximo ? `${n(e.faixa.minimo)}–${n(e.faixa.maximo)}%` : `${n(e.percentual)}%`;
}

const nomePerfil = (t: Tradutor, p: PerfilTributarioId) => t(`perfil.${p}` as Chave);

/** Escolhe o tipo de consumo de cada categoria de despesa, que define a taxa de IVA estimada. */
export default function AjustarImpostosScreen() {
  const t = useT();
  const categorias = useCategorias('despesa');
  const fiscal = usePerfilFiscal();
  const local: LocalCompra = { pais: (fiscal?.paisResidencia ?? 'PT') as CodigoPais, regiao: fiscal?.regiaoResidencia ?? null };
  const [abertaId, setAbertaId] = useState<number | null>(null);

  return (
    <TelaSecundaria titulo={t('ajustar.titulo')}>
      <ThemedText type="small" themeColor="textSecondary">
        {t('ajustar.intro', { pais: t(`pais.${local.pais}` as Chave) })}
      </ThemedText>
      <Cartao style={styles.lista}>
        {categorias.map((c, i) => (
          <LinhaCategoria
            key={c.id}
            categoria={c}
            local={local}
            aberta={abertaId === c.id}
            aoTocar={() => setAbertaId(abertaId === c.id ? null : c.id)}
            separador={i > 0}
          />
        ))}
      </Cartao>
      <ThemedText type="small" themeColor="textSecondary">
        {t('ajustar.rodape')}
      </ThemedText>
    </TelaSecundaria>
  );
}

function LinhaCategoria({
  categoria,
  local,
  aberta,
  aoTocar,
  separador,
}: {
  categoria: Categoria;
  local: LocalCompra;
  aberta: boolean;
  aoTocar: () => void;
  separador: boolean;
}) {
  const t = useT();
  const theme = useTheme();
  const esquema = useColorScheme() === 'light' ? 'light' : 'dark';
  const visual = visualCategoria(categoria.nome, categoria.id);
  const perfil = perfilTributarioDaCategoria(categoria);
  const taxa = textoTaxa(local, perfil) ?? t('ajustar.semRegras');

  function escolher(id: PerfilTributarioId) {
    try {
      alterarPerfilTributario(categoria.id, id);
    } catch (e) {
      Alert.alert(t('comum.erroGuardar'), e instanceof ErroValidacao ? e.message : t('comum.tenteNovamente'));
    }
  }

  return (
    <View style={separador && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.border }}>
      <Pressable
        onPress={aoTocar}
        accessibilityRole="button"
        accessibilityState={{ expanded: aberta }}
        accessibilityLabel={t('ajustar.rotulo', { categoria: categoria.nome, perfil: nomePerfil(t, perfil), taxa })}
        style={({ pressed }) => [styles.linha, pressed && styles.pressionado]}>
        <IconeCirculo icone={visual.icone} cor={SeriesColors[esquema][visual.cor]} tamanho={36} />
        <View style={styles.flex}>
          <ThemedText type="smallBold" numberOfLines={1}>
            {categoria.nome}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
            {nomePerfil(t, perfil)}
            {categoria.perfilTributario === null ? ` ${t('ajustar.automatico')}` : ''}
          </ThemedText>
        </View>
        <ThemedText type="smallBold">{taxa}</ThemedText>
        <Icone nome={aberta ? 'fechar' : 'editar'} cor={theme.textSecondary} tamanho={16} />
      </Pressable>

      {aberta && (
        <View style={styles.opcoes}>
          <View style={styles.chips} accessibilityRole="radiogroup" accessibilityLabel={t('ajustar.tipoDe', { categoria: categoria.nome })}>
            {PERFIS_CONSUMO.map((p) => {
              const taxaP = textoTaxa(local, p);
              return (
                <Chip
                  key={p}
                  texto={taxaP ? `${nomePerfil(t, p)} · ${taxaP}` : nomePerfil(t, p)}
                  ativo={p === perfil}
                  aoTocar={() => escolher(p)}
                />
              );
            })}
          </View>
          <ThemedText type="small" themeColor="textSecondary">
            {t('ajustar.exemplos', { exemplos: t(`perfil.${perfil}.exemplos` as Chave) })}
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  pressionado: { opacity: 0.6 },
  lista: { paddingVertical: Spacing.one, gap: 0 },
  linha: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, minHeight: 56, paddingVertical: Spacing.two },
  opcoes: { gap: Spacing.two, paddingBottom: Spacing.three },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
});
