import { router } from 'expo-router';

import { useT } from '@/hooks/use-idioma';
import { PainelMetas } from '@/components/painel-metas';
import { Tela } from '@/components/tela';

/** Aba Metas: progresso de cada objetivo e atalho para as conquistas. */
export default function MetasScreen() {
  const t = useT();
  return (
    <Tela
      titulo={t('abas.metas')}
      subtitulo={t('metas.subtitulo')}
      acoes={[{ icone: 'mais', rotulo: t('metas.nova'), aoTocar: () => router.push('/nova-meta') }]}>
      <PainelMetas />
    </Tela>
  );
}
