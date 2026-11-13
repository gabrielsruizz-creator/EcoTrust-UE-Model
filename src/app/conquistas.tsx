import { CartaoJornada, GradeConquistas } from '@/components/jornada';
import { TelaSecundaria } from '@/components/tela-secundaria';
import { ThemedText } from '@/components/themed-text';
import { useJornada } from '@/hooks/use-dados';
import { useT } from '@/hooks/use-idioma';
import { useConta } from '@/hooks/use-sessao';

export default function ConquistasScreen() {
  const conta = useConta();
  const jornada = useJornada(conta?.criadoEm ?? null);
  const t = useT();
  const alcancadas = jornada.conquistas.filter((c) => c.alcancada).length;

  return (
    <TelaSecundaria titulo={t('pf.jornada')}>
      <CartaoJornada jornada={jornada} />
      <ThemedText type="smallBold" accessibilityRole="header">
        {t('conq.tela.titulo', { n: alcancadas, total: jornada.conquistas.length })}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {t('conq.tela.dica')}
      </ThemedText>
      <GradeConquistas conquistas={jornada.conquistas} />
    </TelaSecundaria>
  );
}
