/**
 * Estrutura da Trust Academy (igual em todos os idiomas): categorias, cursos, ordem das aulas,
 * duração, data de publicação e a resposta certa de cada quiz. Os textos ficam em ./textos/.
 * Os ids não mudam (o progresso guardado usa-os).
 * Regra editorial: educativo e geral. Não citar produtos, instituições ou ativos específicos.
 */

export const IDS_CATEGORIAS = ['basico', 'orcamento', 'dividas', 'investimentos'] as const;
export type IdCategoria = (typeof IDS_CATEGORIAS)[number];

export const ESTRUTURA_CATEGORIAS: { id: IdCategoria; icone: string; cor: string }[] = [
  // Fundo dos cartões; texto branco por cima tem contraste de pelo menos 5:1
  { id: 'basico', icone: '🌱', cor: '#0A7A5E' },
  { id: 'orcamento', icone: '📊', cor: '#2958A8' },
  { id: 'dividas', icone: '🧯', cor: '#B23A2B' },
  { id: 'investimentos', icone: '📈', cor: '#6B3FB8' },
];

export const IDS_AULAS = [
  'reserva-emergencia',
  'regra-50-30-20',
  'gastos-recorrentes',
  'gastos-superfluos',
  'sair-das-dividas',
  'primeiros-investimentos',
  'metas-financeiras',
  'para-onde-vai-o-dinheiro',
  'juros-do-cartao',
  'negociar-dividas',
  'inflacao',
  'juros-compostos',
] as const;
export type IdAula = (typeof IDS_AULAS)[number];

export const ESTRUTURA_AULAS: Record<IdAula, { minutos: number; publicadaEm: string; correta: number }> = {
  'reserva-emergencia': { minutos: 3, publicadaEm: '2026-08-04', correta: 1 },
  'regra-50-30-20': { minutos: 3, publicadaEm: '2026-08-11', correta: 2 },
  'gastos-recorrentes': { minutos: 3, publicadaEm: '2026-08-13', correta: 0 },
  'gastos-superfluos': { minutos: 3, publicadaEm: '2026-08-18', correta: 1 },
  'sair-das-dividas': { minutos: 4, publicadaEm: '2026-08-20', correta: 1 },
  'primeiros-investimentos': { minutos: 4, publicadaEm: '2026-08-25', correta: 0 },
  'metas-financeiras': { minutos: 2, publicadaEm: '2026-08-27', correta: 1 },
  'para-onde-vai-o-dinheiro': { minutos: 3, publicadaEm: '2026-09-08', correta: 0 },
  'juros-do-cartao': { minutos: 3, publicadaEm: '2026-09-15', correta: 1 },
  'negociar-dividas': { minutos: 3, publicadaEm: '2026-09-24', correta: 1 },
  inflacao: { minutos: 3, publicadaEm: '2026-09-29', correta: 1 },
  'juros-compostos': { minutos: 3, publicadaEm: '2026-10-02', correta: 0 },
};

export const IDS_CURSOS = ['financas-do-zero', 'orcamento-sem-sofrimento', 'saindo-do-vermelho', 'comecando-a-investir'] as const;
export type IdCurso = (typeof IDS_CURSOS)[number];

export const ESTRUTURA_CURSOS: { id: IdCurso; categoriaId: IdCategoria; aulas: IdAula[] }[] = [
  { id: 'financas-do-zero', categoriaId: 'basico', aulas: ['para-onde-vai-o-dinheiro', 'reserva-emergencia', 'metas-financeiras'] },
  { id: 'orcamento-sem-sofrimento', categoriaId: 'orcamento', aulas: ['regra-50-30-20', 'gastos-recorrentes', 'gastos-superfluos'] },
  { id: 'saindo-do-vermelho', categoriaId: 'dividas', aulas: ['juros-do-cartao', 'sair-das-dividas', 'negociar-dividas'] },
  { id: 'comecando-a-investir', categoriaId: 'investimentos', aulas: ['inflacao', 'juros-compostos', 'primeiros-investimentos'] },
];

/** Textos de um idioma. O TypeScript obriga cada idioma a ter todas as categorias, cursos e aulas. */
export type TextosAcademy = {
  categorias: Record<IdCategoria, { nome: string; descricao: string }>;
  cursos: Record<IdCurso, { titulo: string; resumo: string }>;
  aulas: Record<
    IdAula,
    {
      titulo: string;
      resumo: string;
      paragrafos: string[];
      pontosChave: string[];
      /** A opção certa é ESTRUTURA_AULAS[id].correta (índice em `opcoes`) */
      quiz: { pergunta: string; opcoes: [string, string, string]; explicacao: string };
    }
  >;
  dicas: string[];
  conceitos: { termo: string; definicao: string }[];
};
