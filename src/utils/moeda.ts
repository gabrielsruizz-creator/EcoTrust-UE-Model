/**
 * Dinheiro na tela: formata no idioma escolhido (separadores, posição do símbolo) e na moeda principal.
 * Os valores são sempre inteiros na menor unidade da moeda (cêntimos de euro, haléřů, öre...):
 * todas as moedas da UE têm 2 casas decimais na norma ISO 4217.
 */

import { localeAtual } from '@/i18n';
import type { CodigoMoeda } from '@/data/paises/tipos';

let moedaPrincipal: CodigoMoeda = 'EUR';

export function obterMoedaPrincipal(): CodigoMoeda {
  return moedaPrincipal;
}

/** Chamado ao iniciar e quando o utilizador muda a moeda nas preferências. */
export function definirMoedaPrincipal(moeda: CodigoMoeda) {
  moedaPrincipal = moeda;
}

const formatadores = new Map<string, Intl.NumberFormat>();

function formatador(locale: string, moeda: CodigoMoeda) {
  const chave = `${locale}|${moeda}`;
  let f = formatadores.get(chave);
  if (!f) {
    f = new Intl.NumberFormat(locale, { style: 'currency', currency: moeda });
    formatadores.set(chave, f);
  }
  return f;
}

export function formatarCentavos(centavos: number, moeda: CodigoMoeda = moedaPrincipal) {
  return formatador(localeAtual(), moeda).format(centavos / 100);
}

/** Separador decimal do idioma atual ("," em pt-PT/de/fr..., "." em inglês). */
export function separadorDecimal(locale = localeAtual()) {
  const texto = new Intl.NumberFormat(locale, { minimumFractionDigits: 1 }).format(1.5);
  return texto.replace(/\d/g, '').charAt(0) || ',';
}

/** Símbolo da moeda no idioma atual (€, Kč, zł, kr, Ft, lei). */
export function simboloMoeda(moeda: CodigoMoeda = moedaPrincipal) {
  return formatador(localeAtual(), moeda)
    .format(0)
    .replace(/[\d.,\s  ]/g, '')
    .trim();
}

/**
 * Converte o texto digitado em centavos. Aceita os formatos europeus e o inglês:
 * "1.234,56", "1 234,56", "1,234.56", "12,5", "12.50", "42" e com o símbolo da moeda.
 * Com os dois separadores, o último é o decimal. Com um só: seguido de 3 dígitos é de milhares
 * ("4.500" = 4500, "1,234" = 1234); seguido de 1 ou 2 dígitos é decimal.
 * Retorna null se for inválido ou não positivo (ou negativo, quando `permitirZero` é true).
 */
export function lerValorEmCentavos(texto: string, permitirZero = false): number | null {
  const limpo = texto
    .trim()
    .replace(/[\s  ']/g, '')
    .replace(/^(€|EUR|R\$|Kč|zł|kr|Ft|lei)/i, '')
    .replace(/(€|EUR|Kč|zł|kr|Ft|lei)$/i, '');
  if (!/^\d[\d.,]*$/.test(limpo)) return null;

  const ultimoPonto = limpo.lastIndexOf('.');
  const ultimaVirgula = limpo.lastIndexOf(',');
  let normalizado: string;
  if (ultimoPonto >= 0 && ultimaVirgula >= 0) {
    const decimal = ultimoPonto > ultimaVirgula ? '.' : ',';
    const milhar = decimal === '.' ? ',' : '.';
    normalizado = limpo.split(milhar).join('').replace(decimal, '.');
  } else if (ultimoPonto >= 0 || ultimaVirgula >= 0) {
    const sep = ultimoPonto >= 0 ? '.' : ',';
    const partes = limpo.split(sep);
    const ehMilhar = partes.length > 2 || partes[partes.length - 1].length === 3;
    if (ehMilhar && !partes.slice(1).every((p) => p.length === 3)) return null;
    normalizado = ehMilhar ? partes.join('') : partes.join('.');
  } else {
    normalizado = limpo;
  }
  if (/\.\d{3,}$/.test(normalizado) && normalizado.split('.')[1].length > 2) return null;

  const valor = Number(normalizado);
  if (!Number.isFinite(valor) || valor < 0 || (valor === 0 && !permitirZero)) return null;
  return Math.round(valor * 100);
}

/** Centavos → texto para preencher um campo de valor (4290 → "42,90" ou "42.90"; 450000 → "4500"). */
export function centavosParaTexto(centavos: number) {
  return centavos % 100 === 0 ? String(centavos / 100) : (centavos / 100).toFixed(2).replace('.', separadorDecimal());
}

/** Exemplo de valor vazio para os campos ("0,00" ou "0.00"). */
export function exemploValorVazio() {
  return `0${separadorDecimal()}00`;
}
