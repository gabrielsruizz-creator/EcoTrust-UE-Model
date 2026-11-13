import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { ICONES } from '@/components/icone';
import { useAparencia } from '@/hooks/use-aparencia';
import { useT } from '@/hooks/use-idioma';
import { useTheme } from '@/hooks/use-theme';

/** Abas: Início · Transações · Adicionar (+) · Metas · Perfil. Impostômetro e Academy abrem pelo Início. */
export default function AppTabs() {
  const theme = useTheme();
  const t = useT();
  // Com o vidro ligado, a barra fica com o material do sistema (Liquid Glass no iOS 26+).
  const { vidro } = useAparencia();

  return (
    <NativeTabs
      backgroundColor={vidro ? undefined : theme.background}
      indicatorColor={theme.accentSoft}
      iconColor={{ default: theme.textSecondary, selected: theme.accentText }}
      labelStyle={{ default: { color: theme.textSecondary }, selected: { color: theme.text } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>{t('abas.inicio')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={ICONES.inicio.ios} md={ICONES.inicio.android} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="transacoes">
        <NativeTabs.Trigger.Label>{t('abas.transacoes')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={ICONES.transacoes.ios} md={ICONES.transacoes.android} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="adicionar">
        <NativeTabs.Trigger.Label>{t('abas.adicionar')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={ICONES.adicionar.ios} md={ICONES.adicionar.android} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="metas">
        <NativeTabs.Trigger.Label>{t('abas.metas')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={ICONES.metas.ios} md={ICONES.metas.android} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="perfil">
        <NativeTabs.Trigger.Label>{t('abas.perfil')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={ICONES.perfil.ios} md={ICONES.perfil.android} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
