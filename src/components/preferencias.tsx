import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Switch, TextInput, View } from 'react-native';

import { Chip } from '@/components/chip';
import { Cartao } from '@/components/tela';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useAparencia } from '@/hooks/use-aparencia';
import { useT } from '@/hooks/use-idioma';
import { usePreferencias } from '@/hooks/use-dados';
import { useConta } from '@/hooks/use-sessao';
import { useTheme } from '@/hooks/use-theme';
import { biometriaDisponivel, definirBiometria } from '@/services/conta-service';
import { ErroValidacao } from '@/services/erros';
import { IDIOMAS } from '@/i18n/idiomas';
import type { Chave } from '@/i18n';
import { HORAS_LEMBRETE, salvarPreferencias, type Preferencias, type Tema } from '@/services/preferencias-service';

const TEMAS: { valor: Tema; rotulo: Chave }[] = [
  { valor: 'sistema', rotulo: 'pref.tema.sistema' },
  { valor: 'claro', rotulo: 'pref.tema.claro' },
  { valor: 'escuro', rotulo: 'pref.tema.escuro' },
];

/** Tema, idioma, dia do pagamento, lembretes e biometria. */
export function CartaoPreferencias() {
  const theme = useTheme();
  const t = useT();
  const preferencias = usePreferencias();
  const { vidroNativoDisponivel } = useAparencia();
  const conta = useConta();
  const [biometriaOk, setBiometriaOk] = useState(false);
  const [diaTexto, setDiaTexto] = useState(preferencias.diaPagamento ? String(preferencias.diaPagamento) : '');

  useEffect(() => {
    biometriaDisponivel().then(setBiometriaOk);
  }, []);

  async function atualizar(mudanca: Partial<Preferencias>) {
    try {
      const permitiu = await salvarPreferencias({ ...preferencias, ...mudanca });
      if (!permitiu) {
        await salvarPreferencias({ ...preferencias, ...mudanca, lembreteDiario: false, lembretePagamento: false });
        Alert.alert(t('pref.notificacoesDesligadas.titulo'), t('pref.notificacoesDesligadas.texto'));
      }
    } catch (e) {
      Alert.alert(t('comum.erroGuardar'), e instanceof ErroValidacao ? e.message : t('comum.tenteNovamente'));
    }
  }

  function salvarDia() {
    const dia = diaTexto.trim() ? Number(diaTexto) : null;
    if (dia === preferencias.diaPagamento) return;
    atualizar({ diaPagamento: dia, lembretePagamento: dia === null ? false : preferencias.lembretePagamento });
  }

  async function alternarBiometria(ativar: boolean) {
    const ok = await definirBiometria(ativar);
    if (!ok && ativar) Alert.alert(t('pref.biometriaFalhou.titulo'), t('pref.biometriaFalhou.texto'));
  }

  return (
    <Cartao>
      <ThemedText type="smallBold">{t('pref.aparencia')}</ThemedText>
      <View style={styles.chips} accessibilityRole="radiogroup" accessibilityLabel={t('pref.aparencia')}>
        {TEMAS.map((tema) => (
          <Chip
            key={tema.valor}
            texto={t(tema.rotulo)}
            ativo={preferencias.tema === tema.valor}
            aoTocar={() => atualizar({ tema: tema.valor })}
          />
        ))}
      </View>
      <View style={styles.linha}>
        <View style={styles.flex}>
          <ThemedText type="small">{t('pref.vidro')}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {preferencias.vidro
              ? vidroNativoDisponivel
                ? t('pref.vidro.nativo')
                : t('pref.vidro.simulado')
              : t('pref.vidro.desligado')}
          </ThemedText>
        </View>
        <Switch
          value={preferencias.vidro}
          onValueChange={(vidro) => atualizar({ vidro })}
          trackColor={{ true: theme.positive }}
          accessibilityLabel={t('pref.vidro')}
        />
      </View>

      <View style={[styles.separador, { borderTopColor: theme.backgroundSelected }]} />
      <ThemedText type="small">{t('pref.idioma')}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {t('pref.idioma.descricao')}
      </ThemedText>
      <View style={styles.chips} accessibilityRole="radiogroup" accessibilityLabel={t('pref.idioma')}>
        <Chip
          texto={t('pref.idioma.aparelho')}
          ativo={preferencias.idioma === null}
          aoTocar={() => atualizar({ idioma: null })}
        />
        {IDIOMAS.map((idioma) => (
          <Chip
            key={idioma.id}
            texto={idioma.nomeNativo}
            ativo={preferencias.idioma === idioma.id}
            aoTocar={() => atualizar({ idioma: idioma.id })}
          />
        ))}
      </View>

      <View style={[styles.separador, { borderTopColor: theme.backgroundSelected }]} />
      <View style={styles.linha}>
        <View style={styles.flex}>
          <ThemedText type="small">{t('pref.diaPagamento')}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {t('pref.diaPagamento.descricao')}
          </ThemedText>
        </View>
        <TextInput
          style={[styles.campoDia, { color: theme.text, backgroundColor: theme.background }]}
          value={diaTexto}
          onChangeText={(texto) => setDiaTexto(texto.replace(/\D/g, '').slice(0, 2))}
          onEndEditing={salvarDia}
          onSubmitEditing={salvarDia}
          placeholder="–"
          placeholderTextColor={theme.textSecondary}
          keyboardType="number-pad"
          accessibilityLabel={t('pref.diaPagamento.rotulo')}
          maxLength={2}
        />
      </View>

      <View style={[styles.separador, { borderTopColor: theme.backgroundSelected }]} />
      <View style={styles.linha}>
        <View style={styles.flex}>
          <ThemedText type="small">{t('pref.lembreteDiario')}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {t('pref.lembreteDiario.descricao')}
          </ThemedText>
        </View>
        <Switch
          value={preferencias.lembreteDiario}
          onValueChange={(v) => atualizar({ lembreteDiario: v })}
          accessibilityLabel={t('pref.lembreteDiario')}
        />
      </View>
      {preferencias.lembreteDiario && (
        <View style={styles.chips} accessibilityRole="radiogroup" accessibilityLabel={t('pref.lembreteDiario.horario')}>
          {HORAS_LEMBRETE.map((h) => (
            <Chip key={h} texto={t('pref.hora', { h })} ativo={preferencias.horaLembrete === h} aoTocar={() => atualizar({ horaLembrete: h })} />
          ))}
        </View>
      )}

      <View style={styles.linha}>
        <View style={styles.flex}>
          <ThemedText type="small">{t('pref.lembretePagamento')}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {preferencias.diaPagamento ? t('pref.lembretePagamento.descricao') : t('pref.lembretePagamento.semDia')}
          </ThemedText>
        </View>
        <Switch
          value={preferencias.lembretePagamento}
          disabled={preferencias.diaPagamento === null}
          onValueChange={(v) => atualizar({ lembretePagamento: v })}
          accessibilityLabel={t('pref.lembretePagamento')}
        />
      </View>

      {biometriaOk && conta && (
        <>
          <View style={[styles.separador, { borderTopColor: theme.backgroundSelected }]} />
          <View style={styles.linha}>
            <ThemedText type="small" style={styles.flex}>
              {t('pref.biometria')}
            </ThemedText>
            <Switch value={conta.biometria} onValueChange={alternarBiometria} accessibilityLabel={t('pref.biometria')} />
          </View>
        </>
      )}
    </Cartao>
  );
}

const styles = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  flex: {
    flex: 1,
  },
  separador: {
    borderTopWidth: StyleSheet.hairlineWidth,
    marginVertical: Spacing.one,
  },
  campoDia: {
    width: 56,
    textAlign: 'center',
    fontSize: 16,
    borderRadius: Spacing.two,
    paddingVertical: Spacing.two,
  },
});
