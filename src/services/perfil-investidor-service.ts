/**
 * Questionário educativo de perfil de investidor. Cada resposta vale de 1 a 3 pontos; a soma define o perfil.
 * NÃO é a avaliação de adequação da MiFID II (essa é feita pelas entidades autorizadas) nem aconselhamento
 * de investimento: o app não recomenda produtos nem instituições.
 */

import {
  obterPerfilInvestidor,
  salvarPerfilInvestidor,
} from '@/repositories/perfil-investidor-repository';
import { t, type Chave } from '@/i18n';
import type { PerfilInvestidor, TipoPerfilInvestidor } from '@/types/financas';

export type Pergunta = {
  texto: string;
  opcoes: { texto: string; pontos: number }[];
};

/** Pergunta n (1 a 6), com as 3 opções valendo 1, 2 e 3 pontos. Textos no idioma atual. */
function pergunta(n: number): Pergunta {
  return {
    get texto() {
      return t(`inv.q${n}` as Chave);
    },
    opcoes: [1, 2, 3].map((o) => ({
      get texto() {
        return t(`inv.q${n}.o${o}` as Chave);
      },
      pontos: o,
    })),
  };
}

export const PERGUNTAS: Pergunta[] = [1, 2, 3, 4, 5, 6].map(pergunta);

const INDICE_RESERVA = 4;

export function calcularPerfil(respostas: number[]): PerfilInvestidor {
  if (
    respostas.length !== PERGUNTAS.length ||
    respostas.some((opcao, i) => !Number.isInteger(opcao) || !PERGUNTAS[i].opcoes[opcao])
  ) {
    throw new Error(t('inv.erro'));
  }
  const pontos = respostas.reduce((soma, opcao, i) => soma + PERGUNTAS[i].opcoes[opcao].pontos, 0);
  const tipo: TipoPerfilInvestidor = pontos <= 10 ? 'conservador' : pontos <= 14 ? 'moderado' : 'arrojado';
  return {
    tipo,
    pontos,
    respostas,
    temReserva: respostas[INDICE_RESERVA] > 0,
    respondidoEm: new Date().toISOString(),
  };
}

export function obterPerfil(): PerfilInvestidor | null {
  return obterPerfilInvestidor();
}

/** Calcula o perfil a partir das respostas e salva no banco. */
export function responderQuestionario(respostas: number[]): PerfilInvestidor {
  const perfil = calcularPerfil(respostas);
  salvarPerfilInvestidor(perfil);
  return perfil;
}

/** Descrição educativa de cada perfil (sem recomendar produtos: não é aconselhamento de investimento). */
export const DESCRICAO_PERFIL: Record<TipoPerfilInvestidor, { titulo: string; texto: string }> = {
  conservador: {
    get titulo() {
      return t('inv.conservador.titulo');
    },
    get texto() {
      return t('inv.conservador.texto');
    },
  },
  moderado: {
    get titulo() {
      return t('inv.moderado.titulo');
    },
    get texto() {
      return t('inv.moderado.texto');
    },
  },
  arrojado: {
    get titulo() {
      return t('inv.arrojado.titulo');
    },
    get texto() {
      return t('inv.arrojado.texto');
    },
  },
};
