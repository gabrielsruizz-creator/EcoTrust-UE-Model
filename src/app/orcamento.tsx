import { router } from 'expo-router';

import { PainelOrcamento } from '@/components/painel-orcamento';
import { Botao } from '@/components/tela';
import { TelaSecundaria } from '@/components/tela-secundaria';
import { useT } from '@/hooks/use-idioma';

/** Categorias e orçamento do mês (aberto pela aba Transações e pelo Início). */
export default function OrcamentoScreen() {
  const t = useT();
  return (
    <TelaSecundaria titulo={t('transacoes.categoriasOrcamento')}>
      <PainelOrcamento />
      <Botao
        texto={t('orc.gerirCategorias')}
        variante="secundario"
        icone="ajustes"
        onPress={() => router.push('/categorias')}
      />
    </TelaSecundaria>
  );
}
