/**
 * Impostos sobre o rendimento do trabalho (por país de residência fiscal), valores ANUAIS em centavos.
 * Cada país tem o seu cálculo próprio — não há um modelo genérico para a UE.
 * Todos os resultados são ESTIMATIVAS: não substituem a declaração oficial nem um contabilista.
 */

export type SituacaoProfissional = 'dependente' | 'independente';

export type EntradaRenda = {
  /** Ano dos rendimentos (ex.: 2026) */
  ano: number;
  brutoAnualCentavos: number;
  situacao: SituacaoProfissional;
  /** Filhos/dependentes a cargo */
  dependentes: number;
  /** Quantos dependentes têm até 3 anos (Portugal) */
  dependentesAte3Anos?: number;
  /** Casado com tributação/declaração conjunta (Malta: tabela de casados) */
  declaracaoConjunta?: boolean;
  /** Região fiscal (ISO 3166-2), ex.: 'PT-20' Açores */
  regiao?: string | null;
  /** Ano de nascimento (Malta: o teto das contribuições depende da geração) */
  anoNascimento?: number | null;
  /** Portugal: despesas gerais familiares com NIF no ano (null = supõe que atingiu o limite da dedução) */
  despesasGeraisCentavos?: number | null;
};

/** Limitações da estimativa, para a tela explicar (o texto fica nos catálogos de tradução). */
export type AvisoRenda =
  | 'contribuicoes-a-confirmar'
  | 'regiao-usa-tabela-nacional'
  | 'despesas-gerais-presumidas'
  | 'adicionais-locais-nao-incluidos'
  | 'conjunta-nao-incluida'
  | 'alto-rendimento-simplificado'
  | 'tabela-a-confirmar'
  | 'despesas-profissionais-nao-incluidas'
  | 'nacionalidade-ue-presumida';

export type ResultadoRenda = {
  /** Imposto sobre o rendimento (IRS, income tax, IRPEF...) */
  impostoCentavos: number;
  /** Contribuições sociais a cargo do trabalhador */
  contribuicoesCentavos: number;
  /** Valores que o Estado acrescenta ao rendimento (ex.: "somma esente" em Itália) */
  bonusCentavos: number;
  liquidoCentavos: number;
  /** Rendimento sobre o qual incidem as taxas */
  baseTributavelCentavos: number;
  /** Taxa do escalão em que cai o último euro (%), null se isento */
  taxaMarginal: number | null;
  avisos: AvisoRenda[];
};

/** Resultado quando o país/ano/situação ainda não tem regras no app. */
export type SemRegras = { semRegras: 'ano' | 'situacao' | 'pais' };

/** [limite superior do escalão em centavos, taxa em %] — o último escalão usa Infinity. */
export type Escaloes = [number, number][];

/** Imposto progressivo por escalões (centavos fracionados, sem arredondar). */
export function impostoPorEscaloes(baseCentavos: number, escaloes: Escaloes): number {
  let imposto = 0;
  let anterior = 0;
  for (const [limite, taxa] of escaloes) {
    if (baseCentavos <= anterior) break;
    imposto += ((Math.min(baseCentavos, limite) - anterior) * taxa) / 100;
    anterior = limite;
  }
  return imposto;
}

export function taxaMarginal(baseCentavos: number, escaloes: Escaloes): number | null {
  if (baseCentavos <= 0) return null;
  const taxa = escaloes.find(([limite]) => baseCentavos <= limite)?.[1] ?? null;
  return taxa === 0 ? null : taxa;
}

export function montarResultado(
  bruto: number,
  imposto: number,
  contribuicoes: number,
  base: number,
  marginal: number | null,
  avisos: AvisoRenda[],
  bonus = 0,
): ResultadoRenda {
  const impostoCentavos = Math.round(Math.max(0, imposto));
  const contribuicoesCentavos = Math.round(Math.max(0, contribuicoes));
  const bonusCentavos = Math.round(Math.max(0, bonus));
  return {
    impostoCentavos,
    contribuicoesCentavos,
    bonusCentavos,
    liquidoCentavos: bruto - impostoCentavos - contribuicoesCentavos + bonusCentavos,
    baseTributavelCentavos: Math.round(Math.max(0, base)),
    taxaMarginal: marginal,
    avisos,
  };
}
