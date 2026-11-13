import type { CodigoPais } from '@/data/paises/tipos';
import { calcularRendaItalia } from '@/data/renda/it';
import { calcularRendaMalta } from '@/data/renda/mt';
import { calcularRendaPortugal } from '@/data/renda/pt';
import type { EntradaRenda, ResultadoRenda, SemRegras } from '@/data/renda/tipos';

/** Cálculo do imposto sobre o rendimento por país de RESIDÊNCIA FISCAL (não o país onde se gasta). */
const CALCULOS: Partial<Record<CodigoPais, (e: EntradaRenda) => ResultadoRenda | SemRegras>> = {
  PT: calcularRendaPortugal,
  MT: calcularRendaMalta,
  IT: calcularRendaItalia,
};

export function calcularImpostosDaRenda(residencia: CodigoPais, e: EntradaRenda): ResultadoRenda | SemRegras {
  const calcular = CALCULOS[residencia];
  return calcular ? calcular(e) : { semRegras: 'pais' };
}

export function temRegras(r: ResultadoRenda | SemRegras): r is ResultadoRenda {
  return !('semRegras' in r);
}

export * from '@/data/renda/tipos';
