import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Chip } from '@/components/chip';
import { Spacing } from '@/constants/theme';
import { PAISES_FISCAIS, PAISES_UE, type CodigoPais } from '@/data/paises';
import { useT } from '@/hooks/use-idioma';
import { localeAtual, type Chave } from '@/i18n';
import { REGIOES_FISCAIS } from '@/services/perfil-fiscal-service';

export type LocalEscolhido = { pais: string | null; regiao: string | null };

type Props = {
  /** País de residência (opção padrão: "pais = null") */
  residencia: string;
  regiaoResidencia: string | null;
  valor: LocalEscolhido;
  aoMudar: (local: LocalEscolhido) => void;
};

/**
 * Onde aconteceu a compra. Mostra primeiro o país de residência e os países que já têm regras;
 * "Outro país" abre os 27. Se o país tem regiões com IVA próprio (Açores, Madeira), mostra as regiões.
 */
export function SeletorPais({ residencia, regiaoResidencia, valor, aoMudar }: Props) {
  const t = useT();
  const nome = (p: string) => t(`pais.${p}` as Chave);
  const paisAtual = valor.pais ?? residencia;
  const principais = [residencia, ...Object.keys(PAISES_FISCAIS).filter((p) => p !== residencia)];
  const [todos, setTodos] = useState(!principais.includes(paisAtual));
  const outros = PAISES_UE.map((p) => p.codigo as string)
    .filter((p) => !principais.includes(p))
    .sort((a, b) => nome(a).localeCompare(nome(b), localeAtual()));
  const regioes = REGIOES_FISCAIS[paisAtual] ?? [];
  const regiaoAtual = valor.pais === null ? regiaoResidencia : valor.regiao;

  function escolherPais(p: string) {
    // Voltar ao país de residência guarda null: o lançamento acompanha a residência.
    aoMudar(p === residencia ? { pais: null, regiao: null } : { pais: p, regiao: null });
  }

  function escolherRegiao(r: string | null) {
    aoMudar({ pais: paisAtual, regiao: r });
  }

  return (
    <View style={styles.coluna}>
      <View style={styles.chips} accessibilityRole="radiogroup" accessibilityLabel={t('lanc.onde')}>
        {principais.map((p) => (
          <Chip key={p} texto={nome(p)} ativo={paisAtual === p} aoTocar={() => escolherPais(p)} />
        ))}
        {!todos && <Chip texto={`${t('lanc.onde.outro')}…`} ativo={false} aoTocar={() => setTodos(true)} />}
        {todos &&
          outros.map((p) => <Chip key={p} texto={nome(p)} ativo={paisAtual === p} aoTocar={() => escolherPais(p)} />)}
      </View>
      {regioes.length > 0 && (
        <View style={styles.chips} accessibilityRole="radiogroup" accessibilityLabel={t('fiscal.regiao')}>
          <Chip
            texto={t(`regiao.${paisAtual}-continente` as Chave)}
            ativo={regiaoAtual === null}
            aoTocar={() => escolherRegiao(null)}
          />
          {regioes.map((r) => (
            <Chip key={r} texto={t(`regiao.${r}` as Chave)} ativo={regiaoAtual === r} aoTocar={() => escolherRegiao(r)} />
          ))}
        </View>
      )}
    </View>
  );
}

/** País e região efetivos de uma compra (o de residência quando não foi indicado). */
export function localEfetivo(valor: LocalEscolhido, residencia: string, regiaoResidencia: string | null) {
  return valor.pais === null
    ? { pais: residencia as CodigoPais, regiao: regiaoResidencia }
    : { pais: valor.pais as CodigoPais, regiao: valor.regiao };
}

const styles = StyleSheet.create({
  coluna: { gap: Spacing.two },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
});
