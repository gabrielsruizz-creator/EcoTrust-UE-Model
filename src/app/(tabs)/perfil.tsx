import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { CartaoPet } from '@/components/cartao-pet';
import { Icone } from '@/components/icone';
import { CartaoPreferencias } from '@/components/preferencias';
import { SeloNivel } from '@/components/selo-nivel';
import { Botao, Cartao, LinhaLista, Tela, useDegrade } from '@/components/tela';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import {
  useAssinatura,
  useDadosPessoais,
  useUltimoBackup,
  useJornada,
  usePerfilFinanceiro,
  usePerfilFiscal,
  usePerfilInvestidor,
  useSituacao,
} from '@/hooks/use-dados';
import { useT } from '@/hooks/use-idioma';
import { useConta } from '@/hooks/use-sessao';
import { useTheme } from '@/hooks/use-theme';
import { localeAtual, type Chave } from '@/i18n';
import { NOME_PLANO_PLUS } from '@/services/assinatura-service';
import { apagarContaEDados, sair } from '@/services/conta-service';
import { rotuloObjetivo } from '@/services/perfil-financeiro-service';
import { DESCRICAO_PERFIL } from '@/services/perfil-investidor-service';
import { camposPreenchidos, DIVIDAS, idadeDoPerfil, rotulo, TOTAL_CAMPOS_PESSOAIS } from '@/services/perfil-pessoal-service';
import { tempoRelativo } from '@/utils/datas';
import { formatarCentavos } from '@/utils/moeda';

export default function PerfilScreen() {
  const theme = useTheme();
  const t = useT();
  const fiscal = usePerfilFiscal();
  const degrade = useDegrade(90);
  const conta = useConta();
  const pessoal = useDadosPessoais();
  const situacao = useSituacao();
  const perfilFinanceiro = usePerfilFinanceiro();
  const investidor = usePerfilInvestidor();
  const jornada = useJornada(conta?.criadoEm ?? null);
  const plus = useAssinatura().plano === 'plus';
  const ultimoBackup = useUltimoBackup();
  const alcancadas = jornada.conquistas.filter((c) => c.alcancada).length;
  const anos = idadeDoPerfil(pessoal);
  const preenchidos = camposPreenchidos(pessoal);

  function confirmarApagar() {
    Alert.alert(
      t('pf.apagar'),
      t('pf.apagar.texto'),
      [
        { text: t('comum.cancelar'), style: 'cancel' },
        { text: t('pf.apagarTudo'), style: 'destructive', onPress: () => apagarContaEDados() },
      ],
    );
  }

  return (
    <Tela titulo={t('abas.perfil')}>
      {/* Cabeçalho */}
      <Pressable
        onPress={() => router.push('/editar-dados-pessoais')}
        accessibilityRole="button"
        accessibilityLabel={`${conta?.nome ?? ''}, ${t('pf.nivel', { n: jornada.nivel })}, ${jornada.xp} XP${plus ? `, ${NOME_PLANO_PLUS}` : ''}. ${t('pf.editarDados')}`}
        style={({ pressed }) => pressed && styles.pressionado}>
        <Cartao style={styles.cabecalho}>
          <View style={[styles.anelAvatar, degrade]}>
            <Avatar nome={conta?.nome ?? ''} avatar={pessoal.avatar} cor={pessoal.corAvatar} tamanho={64} />
          </View>
          <View style={styles.flex}>
            <ThemedText style={styles.nome} numberOfLines={1}>
              {conta?.nome}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {t('pf.nivel', { n: jornada.nivel })} · {jornada.xp} XP
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
              {conta?.email}
            </ThemedText>
          </View>
          {plus && (
            <View style={[styles.selo, degrade]}>
              <ThemedText type="smallBold" style={styles.textoSelo}>
                Plus
              </ThemedText>
            </View>
          )}
        </Cartao>
      </Pressable>

      {/* Números da jornada */}
      <View style={styles.numeros}>
        <Numero icone={<Icone nome="fogo" cor="#FF8A3D" tamanho={18} />} valor={jornada.sequenciaAtual} rotulo={t('pf.sequencia')} />
        <Numero icone={<Icone nome="trofeu" cor="#F2C94C" tamanho={18} />} valor={alcancadas} rotulo={t('pf.conquistas')} />
        <Numero icone={<SeloNivel tamanho={22} />} valor={jornada.nivel} rotulo={jornada.nomeNivel} />
      </View>

      {/* Mascote */}
      <CartaoPet />

      {/* Sobre você */}
      <Grupo titulo={t('pf.sobre')}>
        <LinhaLista
          icone="impostos"
          titulo={t('fiscal.titulo')}
          subtitulo={
            fiscal
              ? [t(`pais.${fiscal.paisResidencia}` as Chave), fiscal.regiaoResidencia ? t(`regiao.${fiscal.regiaoResidencia}` as Chave) : null, t(`fiscal.situacao.${fiscal.situacao}`)]
                  .filter(Boolean)
                  .join(' · ')
              : t('fiscal.resumo.vazio')
          }
          aoTocar={() => router.push('/editar-perfil-fiscal')}
        />
        <LinhaLista
          separador
          icone="usuario"
          titulo={t('pf.meusDados')}
          subtitulo={
            preenchidos < TOTAL_CAMPOS_PESSOAIS
              ? t('pf.preenchidos', { n: preenchidos, total: TOTAL_CAMPOS_PESSOAIS })
              : [anos !== null ? t('pf.anos', { n: anos }) : null, pessoal.cidade].filter(Boolean).join(' · ')
          }
          aoTocar={() => router.push('/editar-dados-pessoais')}
        />
        <LinhaLista
          separador
          icone="carteira"
          titulo={t('pf.situacao')}
          subtitulo={situacao ? `${t('pf.dividas')}: ${rotulo(DIVIDAS, situacao.dividas).toLocaleLowerCase(localeAtual())}` : t('pf.situacao.vazio')}
          aoTocar={() => router.push('/editar-situacao')}
        />
        <LinhaLista
          separador
          icone="bandeira"
          titulo={t('pf.objetivos')}
          subtitulo={
            perfilFinanceiro
              ? `${rotuloObjetivo(perfilFinanceiro.objetivo)} · ${t('metas.porMesCurto', { valor: formatarCentavos(perfilFinanceiro.metaEconomiaCentavos) })}`
              : undefined
          }
          aoTocar={() => router.push('/editar-perfil')}
        />
        <LinhaLista
          separador
          icone="investimentos"
          titulo={t('pf.investidor')}
          subtitulo={investidor ? DESCRICAO_PERFIL[investidor.tipo].titulo : t('pf.investidor.vazio')}
          aoTocar={() => router.push('/perfil-investidor')}
        />
        <LinhaLista
          separador
          icone="chat"
          titulo={t('pf.refazerConversa')}
          aoTocar={() => router.push('/refazer-conversa')}
        />
      </Grupo>

      <Grupo titulo={t('pf.jornada')}>
        <LinhaLista
          icone="trofeu"
          titulo={t('pf.conquistas')}
          subtitulo={t('pf.alcancadas', { n: alcancadas, total: jornada.conquistas.length })}
          aoTocar={() => router.push('/conquistas')}
        />
        <LinhaLista
          separador
          icone="coracao"
          titulo={t('pf.saude')}
          subtitulo={t('pf.saude.texto')}
          aoTocar={() => router.push('/saude-financeira')}
        />
        <LinhaLista
          separador
          icone="etiqueta"
          titulo={t('lanc.categoria')}
          subtitulo={t('pf.categorias.texto')}
          aoTocar={() => router.push('/categorias')}
        />
      </Grupo>

      <Grupo titulo={t('pf.aprender')}>
        <LinhaLista
          icone="aprender"
          titulo="EcoTrust Academy"
          subtitulo={t('pf.academy.texto')}
          aoTocar={() => router.push('/academy')}
        />
      </Grupo>

      <View style={styles.grupo}>
        <ThemedText type="smallBold" accessibilityRole="header">
          {t('pf.preferencias')}
        </ThemedText>
        <CartaoPreferencias />
      </View>

      <Grupo titulo={t('pf.planoConta')}>
        <LinhaLista
          icone="coroa"
          titulo={plus ? NOME_PLANO_PLUS : t('pf.conhecer', { plano: NOME_PLANO_PLUS })}
          subtitulo={plus ? t('pf.gerirSubscricao') : t('pf.plus.texto')}
          aoTocar={() => router.push('/assinatura')}
          direita={
            !plus ? (
              <ThemedText type="smallBold" style={{ color: theme.accentText }}>
                {t('pf.ver')}
              </ThemedText>
            ) : undefined
          }
        />
        <LinhaLista
          separador
          icone="escudo"
          titulo={t('pf.backup')}
          subtitulo={ultimoBackup ? t('pf.backup.ultimo', { quando: tempoRelativo(ultimoBackup) }) : t('pf.backup.nunca')}
          aoTocar={() => router.push('/backup')}
        />
        <LinhaLista separador icone="sair" titulo={t('pf.sair')} aoTocar={sair} />
      </Grupo>

      <Botao texto={t('pf.apagar')} variante="perigo" icone="lixeira" onPress={confirmarApagar} />
    </Tela>
  );
}

function Grupo({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <View style={styles.grupo}>
      <ThemedText type="smallBold" accessibilityRole="header">
        {titulo}
      </ThemedText>
      <Cartao style={styles.lista}>{children}</Cartao>
    </View>
  );
}

function Numero({ icone, valor, rotulo: r }: { icone: ReactNode; valor: number; rotulo: string }) {
  return (
    <Cartao style={styles.numero}>
      <View accessible accessibilityLabel={`${r}: ${valor}`} style={styles.numeroConteudo}>
        {icone}
        <ThemedText style={styles.numeroValor}>{valor}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
          {r}
        </ThemedText>
      </View>
    </Cartao>
  );
}

const styles = StyleSheet.create({
  pressionado: {
    opacity: 0.75,
  },
  flex: {
    flex: 1,
    gap: Spacing.half,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  anelAvatar: {
    padding: 3,
    borderRadius: 999,
  },
  nome: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: 700,
  },
  selo: {
    paddingHorizontal: Spacing.two + Spacing.one,
    paddingVertical: Spacing.half,
    borderRadius: 999,
  },
  textoSelo: {
    color: '#FFFFFF',
  },
  numeros: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  numero: {
    flex: 1,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
  },
  numeroConteudo: {
    alignItems: 'center',
    gap: Spacing.half,
  },
  numeroValor: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: 700,
  },
  grupo: {
    gap: Spacing.two,
  },
  lista: {
    paddingVertical: Spacing.one,
    gap: 0,
  },
});
