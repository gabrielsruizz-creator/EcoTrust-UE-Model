/**
 * Conteúdo da Trust Academy, guardado no próprio app para funcionar sem internet.
 * Estrutura (ids, ordem, quiz): ./academy/estrutura.ts · Textos por idioma: ./academy/textos/.
 * As listas abaixo devolvem sempre os textos do idioma atual (getters), por isso podem ser
 * usadas como antes. Para adicionar uma aula: id em IDS_AULAS/ESTRUTURA_AULAS, num curso de
 * ESTRUTURA_CURSOS e o texto em TODOS os idiomas (o TypeScript avisa se faltar algum).
 */

import {
  ESTRUTURA_AULAS,
  ESTRUTURA_CATEGORIAS,
  ESTRUTURA_CURSOS,
  IDS_AULAS,
  type IdAula,
  type IdCategoria,
  type IdCurso,
  type TextosAcademy,
} from '@/data/academy/estrutura';
import { academyDe } from '@/data/academy/textos/de';
import { academyEn } from '@/data/academy/textos/en';
import { academyEs } from '@/data/academy/textos/es';
import { academyFr } from '@/data/academy/textos/fr';
import { academyIt } from '@/data/academy/textos/it';
import { academyNl } from '@/data/academy/textos/nl';
import { academyPl } from '@/data/academy/textos/pl';
import { academyPtPT } from '@/data/academy/textos/pt-PT';
import { idiomaAtual } from '@/i18n';
import type { Idioma } from '@/i18n/idiomas';

export const TEXTOS_ACADEMY: Record<Idioma, TextosAcademy> = {
  'pt-PT': academyPtPT,
  en: academyEn,
  es: academyEs,
  fr: academyFr,
  de: academyDe,
  it: academyIt,
  nl: academyNl,
  pl: academyPl,
};

function textos() {
  return TEXTOS_ACADEMY[idiomaAtual()] ?? academyEn;
}

export type QuizAula = {
  pergunta: string;
  opcoes: string[];
  /** Índice da opção correta em `opcoes` */
  correta: number;
  explicacao: string;
};

export type Aula = {
  id: string;
  readonly titulo: string;
  readonly resumo: string;
  minutos: number;
  /** Data de publicação (AAAA-MM-DD), usada em "Recentes" */
  publicadaEm: string;
  readonly paragrafos: string[];
  readonly pontosChave: string[];
  readonly quiz: QuizAula;
};

export type CategoriaAcademy = {
  id: string;
  readonly nome: string;
  readonly descricao: string;
  icone: string;
  /** Fundo dos cartões; texto branco por cima tem contraste de pelo menos 5:1 */
  cor: string;
};

export type Curso = {
  id: string;
  readonly titulo: string;
  readonly resumo: string;
  categoriaId: string;
  /** Ids das aulas, na ordem do curso */
  aulas: string[];
};

export type Conceito = { termo: string; definicao: string };

export const CATEGORIAS_ACADEMY: CategoriaAcademy[] = ESTRUTURA_CATEGORIAS.map((c) => ({
  ...c,
  get nome() {
    return textos().categorias[c.id as IdCategoria].nome;
  },
  get descricao() {
    return textos().categorias[c.id as IdCategoria].descricao;
  },
}));

export const CURSOS: Curso[] = ESTRUTURA_CURSOS.map((c) => ({
  id: c.id,
  categoriaId: c.categoriaId,
  aulas: [...c.aulas],
  get titulo() {
    return textos().cursos[c.id as IdCurso].titulo;
  },
  get resumo() {
    return textos().cursos[c.id as IdCurso].resumo;
  },
}));

function aula(id: IdAula): Aula {
  const e = ESTRUTURA_AULAS[id];
  const texto = () => textos().aulas[id];
  return {
    id,
    minutos: e.minutos,
    publicadaEm: e.publicadaEm,
    get titulo() {
      return texto().titulo;
    },
    get resumo() {
      return texto().resumo;
    },
    get paragrafos() {
      return texto().paragrafos;
    },
    get pontosChave() {
      return texto().pontosChave;
    },
    get quiz() {
      const q = texto().quiz;
      return { pergunta: q.pergunta, opcoes: [...q.opcoes], correta: e.correta, explicacao: q.explicacao };
    },
  };
}

/** Todas as aulas. A ordem dentro de cada curso fica em CURSOS. */
export const AULAS: Aula[] = IDS_AULAS.map(aula);

/** Dicas do dia no idioma atual. */
export function dicasAcademy(): string[] {
  return textos().dicas;
}

/** Glossário no idioma atual. */
export function conceitosAcademy(): Conceito[] {
  return textos().conceitos;
}
