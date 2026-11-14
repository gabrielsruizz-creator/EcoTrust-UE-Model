import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { BarraProgresso } from '@/components/barra-progresso';
import { SeloNivel } from '@/components/selo-nivel';
import { Cartao } from '@/components/tela';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useT } from '@/hooks/use-idioma';
import { useTheme } from '@/hooks/use-theme';
import type { ConquistaJornada, Jornada } from '@/services/gamificacao-service';
import { formatarData, paraDataLocal } from '@/utils/datas';

/** Nível, XP, sequência e números da jornada. */
export function CartaoJornada({ jornada }: { jornada: Jornada }) {
  const t = useT();
  const theme = useTheme();
  const percentual = jornada.xpParaProximo ? (jornada.xpNoNivel / jornada.xpParaProximo) * 100 : 100;

  return (
    <Cartao>
      <View style={styles.linha}>
        <SeloNivel tamanho={72} numero={jornada.nivel} />
        <View style={styles.flex}>
          <ThemedText style={styles.tituloNivel}>{t('pf.nivel', { n: jornada.nivel })}</ThemedText>
          <ThemedText type="small" style={{ color: theme.accentText }}>
            {jornada.nomeNivel} · {jornada.xp} XP
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {t('jor.evoluindo')}
          </ThemedText>
        </View>
      </View>
      <BarraProgresso
        percentual={percentual}
        altura={10}
        rotuloAcessivel={
          jornada.xpParaProximo
            ? t('jor.progresso', { nivel: jornada.nivel + 1, xp: jornada.xpNoNivel, total: jornada.xpParaProximo })
            : t('jor.maximo')
        }
      />
      <ThemedText type="small" themeColor="textSecondary">
        {jornada.xpParaProximo
          ? t('jor.faltam', { n: jornada.xpParaProximo - jornada.xpNoNivel })
          : t('jor.chegouMaximo')}
      </ThemedText>

      <View style={styles.numeros}>
        <Numero valor={`🔥 ${jornada.sequenciaAtual}`} rotulo={t('jor.diasSeguidos', { n: jornada.sequenciaAtual })} />
        <Numero valor={String(jornada.totalLancamentos)} rotulo={t('jor.lancamentos')} />
        <Numero valor={String(jornada.metasConcluidas)} rotulo={t('jor.metasConcluidas')} />
        <Numero valor={String(jornada.diasDeUso)} rotulo={t('jor.diasEcoTrust', { n: jornada.diasDeUso })} />
      </View>
      {jornada.melhorSequencia > jornada.sequenciaAtual && (
        <ThemedText type="small" themeColor="textSecondary">
          {t('jor.melhor', { n: jornada.melhorSequencia })}
        </ThemedText>
      )}
      <ThemedText type="small" themeColor="textSecondary">
        {t('jor.ganhe')}
      </ThemedText>
    </Cartao>
  );
}

function Numero({ valor, rotulo }: { valor: string; rotulo: string }) {
  return (
    <View style={styles.numero} accessible accessibilityLabel={`${valor.replace('🔥 ', '')} ${rotulo}`}>
      <ThemedText style={styles.valorNumero}>{valor}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.rotuloNumero}>
        {rotulo}
      </ThemedText>
    </View>
  );
}

/** Grade de medalhas. Alcançadas aparecem coloridas; as outras, apagadas com o progresso. */
export function GradeConquistas({ conquistas }: { conquistas: ConquistaJornada[] }) {
  const t = useT();
  const theme = useTheme();
  return (
    <View style={styles.grade}>
      {conquistas.map((c) => (
        <Pressable
          key={c.id}
          onPress={() =>
            Alert.alert(
              `${c.icone} ${c.nome}`,
              `${c.descricao}\n\n${
                c.alcancada
                  ? c.alcancadaEm
                    ? t('jor.alcancadaEm', { data: formatarData(paraDataLocal(new Date(c.alcancadaEm))) })
                    : t('jor.alcancada')
                  : c.progresso
                    ? t('jor.naoAlcancadaProg', { progresso: c.progresso })
                    : t('jor.naoAlcancada')
              }`,
            )
          }
          accessibilityRole="button"
          accessibilityLabel={
            t(c.alcancada ? 'jor.medalhaAlcancada' : 'jor.medalhaBloqueada', { nome: c.nome, descricao: c.descricao }) +
            (!c.alcancada && c.progresso ? t('jor.progressoRotulo', { progresso: c.progresso }) : '')
          }
          style={({ pressed }) => [styles.medalha, pressed && styles.pressionado]}>
          <View
            style={[
              styles.circulo,
              { backgroundColor: c.alcancada ? theme.accentSoft : theme.backgroundSelected },
              !c.alcancada && styles.bloqueada,
            ]}>
            <ThemedText style={styles.icone}>{c.icone}</ThemedText>
          </View>
          <ThemedText type="small" style={styles.nomeMedalha} numberOfLines={2}>
            {c.nome}
          </ThemedText>
          {!c.alcancada && c.progresso && (
            <ThemedText type="small" themeColor="textSecondary" style={styles.progresso}>
              {c.progresso}
            </ThemedText>
          )}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  flex: {
    flex: 1,
  },
  tituloNivel: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: 700,
  },
  numeros: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.two,
  },
  numero: {
    width: '50%',
    paddingVertical: Spacing.one,
  },
  valorNumero: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: 700,
  },
  rotuloNumero: {
    marginTop: -2,
  },
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: Spacing.three,
  },
  medalha: {
    width: '33.33%',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.one,
  },
  circulo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bloqueada: {
    opacity: 0.4,
  },
  icone: {
    fontSize: 26,
    lineHeight: 32,
  },
  nomeMedalha: {
    textAlign: 'center',
  },
  progresso: {
    fontSize: 11,
    lineHeight: 14,
  },
  pressionado: {
    opacity: 0.6,
  },
});
