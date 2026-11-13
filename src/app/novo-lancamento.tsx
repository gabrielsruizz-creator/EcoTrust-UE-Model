import { useLocalSearchParams } from 'expo-router';

import { FormularioLancamento, type SugestaoLancamento } from '@/components/formulario-lancamento';
import { useT } from '@/hooks/use-idioma';
import { adicionarTransacao } from '@/services/transacoes-service';

type Parametros = {
  tipo?: string;
  /** Categoria já escolhida (atalhos do Início) */
  categoria?: string;
};

function inteiro(texto?: string) {
  const n = Number(texto);
  return texto && Number.isInteger(n) && n >= 0 ? n : undefined;
}

export default function NovoLancamentoScreen() {
  const t = useT();
  const p = useLocalSearchParams<Parametros>();
  const categoriaId = inteiro(p.categoria);
  const sugestao: SugestaoLancamento | undefined = categoriaId !== undefined ? { categoriaId } : undefined;

  return (
    <FormularioLancamento
      titulo={t('lanc.novo')}
      aoSalvar={(dados) => {
        adicionarTransacao(dados);
      }}
      tipoInicial={p.tipo === 'receita' ? 'receita' : 'despesa'}
      sugestao={sugestao}
    />
  );
}
