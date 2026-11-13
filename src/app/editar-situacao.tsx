import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { Chip } from '@/components/chip';
import { Botao } from '@/components/tela';
import { TelaSecundaria } from '@/components/tela-secundaria';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useSituacao } from '@/hooks/use-dados';
import { useT } from '@/hooks/use-idioma';
import { ErroValidacao } from '@/services/erros';
import { DIVIDAS, INVESTIMENTOS, MORADIAS, RESERVAS, salvarSituacao } from '@/services/perfil-pessoal-service';
import type { Moradia, SituacaoDividas, SituacaoInvestimentos, SituacaoReserva } from '@/types/financas';

export default function EditarSituacaoScreen() {
  const t = useT();
  const inicial = useSituacao();
  const [moradia, setMoradia] = useState<Moradia | null>(inicial?.moradia ?? null);
  const [dividas, setDividas] = useState<SituacaoDividas | null>(inicial?.dividas ?? null);
  const [reserva, setReserva] = useState<SituacaoReserva | null>(inicial?.reserva ?? null);
  const [investe, setInveste] = useState<SituacaoInvestimentos | null>(inicial?.investe ?? null);
  const [rendaExtra, setRendaExtra] = useState<boolean | null>(inicial?.rendaExtra ?? null);

  const completo = dividas !== null && reserva !== null && investe !== null;

  function salvar() {
    if (!completo) return;
    try {
      salvarSituacao({ dividas, reserva, investe, moradia, rendaExtra });
      router.back();
    } catch (e) {
      Alert.alert(t('comum.erroGuardar'), e instanceof ErroValidacao ? e.message : t('comum.tenteNovamente'));
    }
  }

  return (
    <TelaSecundaria
      titulo={t('pf.situacao')}
      textoVoltar={t('comum.cancelar')}
      rodape={<Botao texto={t('comum.guardar')} disabled={!completo} onPress={salvar} />}>
      <Grupo titulo={t('sit.moradia')}>
        {MORADIAS.map((o) => (
          <Chip key={o.valor} texto={o.rotulo} ativo={moradia === o.valor} aoTocar={() => setMoradia(o.valor)} />
        ))}
      </Grupo>
      <Grupo titulo={t('pf.dividas')}>
        {DIVIDAS.map((o) => (
          <Chip key={o.valor} texto={o.rotulo} ativo={dividas === o.valor} aoTocar={() => setDividas(o.valor)} />
        ))}
      </Grupo>
      <Grupo titulo={t('sit.reserva')}>
        {RESERVAS.map((o) => (
          <Chip key={o.valor} texto={o.rotulo} ativo={reserva === o.valor} aoTocar={() => setReserva(o.valor)} />
        ))}
      </Grupo>
      <Grupo titulo={t('sit.investimentos')}>
        {INVESTIMENTOS.map((o) => (
          <Chip key={o.valor} texto={o.rotulo} ativo={investe === o.valor} aoTocar={() => setInveste(o.valor)} />
        ))}
      </Grupo>
      <Grupo titulo={t('sit.rendaExtra')}>
        <Chip texto={t('comum.sim')} ativo={rendaExtra === true} aoTocar={() => setRendaExtra(true)} />
        <Chip texto={t('comum.nao')} ativo={rendaExtra === false} aoTocar={() => setRendaExtra(false)} />
      </Grupo>
      {!completo && (
        <ThemedText type="small" themeColor="textSecondary">
          {t('sit.falta')}
        </ThemedText>
      )}
    </TelaSecundaria>
  );
}

function Grupo({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <View style={styles.grupo}>
      <ThemedText type="smallBold">{titulo}</ThemedText>
      <View style={styles.chips} accessibilityRole="radiogroup">
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grupo: {
    gap: Spacing.two,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
});
