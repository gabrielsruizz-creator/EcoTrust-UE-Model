/**
 * Datas no formato "AAAA-MM-DD" e meses "AAAA-MM", sempre no fuso do telemóvel.
 * Os textos para a tela seguem o idioma escolhido (localeAtual) e a semana começa à segunda-feira (norma europeia).
 */

import { localeAtual, t } from '@/i18n';

function doisDigitos(n: number) {
  return String(n).padStart(2, '0');
}

export function paraDataLocal(data: Date) {
  return `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}`;
}

export function hoje() {
  return paraDataLocal(new Date());
}

export function ontem() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return paraDataLocal(d);
}

export function mesAtual() {
  return hoje().slice(0, 7);
}

export function dataValida(texto: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) return false;
  const [ano, mes, dia] = texto.split('-').map(Number);
  const d = new Date(ano, mes - 1, dia);
  return d.getFullYear() === ano && d.getMonth() === mes - 1 && d.getDate() === dia;
}

/** Soma (ou subtrai, com número negativo) meses a um "AAAA-MM". */
export function somarMeses(mes: string, quantidade: number) {
  const [ano, m] = mes.split('-').map(Number);
  const d = new Date(ano, m - 1 + quantidade, 1);
  return `${d.getFullYear()}-${doisDigitos(d.getMonth() + 1)}`;
}

function paraDate(data: string) {
  const [ano, mes, dia] = data.split('-').map(Number);
  return new Date(ano, mes - 1, dia);
}

/** Dias de `de` até `ate` (negativo se `ate` vem antes). */
export function diasEntre(de: string, ate: string) {
  return Math.round((paraDate(ate).getTime() - paraDate(de).getTime()) / 86_400_000);
}

/** Soma meses a uma data, sem pular para o mês seguinte: 31/01 + 1 mês = 28/02 (ou 29/02). */
export function somarMesesNaData(data: string, quantidade: number) {
  const [ano, mes, dia] = data.split('-').map(Number);
  const ultimoDia = new Date(ano, mes - 1 + quantidade + 1, 0).getDate();
  return paraDataLocal(new Date(ano, mes - 1 + quantidade, Math.min(dia, ultimoDia)));
}

/** "2026-10" → "outubro de 2026" / "October 2026" / "Oktober 2026" */
export function nomeDoMes(mes: string) {
  const [ano, m] = mes.split('-').map(Number);
  return new Date(ano, m - 1, 1).toLocaleDateString(localeAtual(), { month: 'long', year: 'numeric' });
}

/** "2026-10-06" → "06/10/2026" (pt-PT, en, fr, es, it), "06.10.2026" (de, pl), "06-10-2026" (nl) */
export function formatarData(data: string) {
  const [ano, mes, dia] = data.split('-').map(Number);
  return new Date(ano, mes - 1, dia).toLocaleDateString(localeAtual(), { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/** "2026-10-06" → "terça-feira, 6 de outubro de 2026" */
export function formatarDataPorExtenso(data: string) {
  const [ano, mes, dia] = data.split('-').map(Number);
  return new Date(ano, mes - 1, dia).toLocaleDateString(localeAtual(), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Coloca as barras enquanto o usuário digita: "0610" → "06/10", "06102026" → "06/10/2026". */
export function mascararData(texto: string) {
  const digitos = texto.replace(/\D/g, '').slice(0, 8);
  if (digitos.length <= 2) return digitos;
  if (digitos.length <= 4) return `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
  return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`;
}

/** "06/10/2026" (ou com "." ou "-") → "2026-10-06". Retorna null se a data estiver incompleta ou não existir. */
export function lerDataDigitada(texto: string): string | null {
  const partes = /^(\d{2})[/.-](\d{2})[/.-](\d{4})$/.exec(texto.trim());
  if (!partes) return null;
  const data = `${partes[3]}-${partes[2]}-${partes[1]}`;
  return dataValida(data) ? data : null;
}

/** "6 de out." (data AAAA-MM-DD) */
export function formatarDataCurta(data: string) {
  const [ano, mes, dia] = data.split('-').map(Number);
  return new Date(ano, mes - 1, dia).toLocaleDateString(localeAtual(), { day: 'numeric', month: 'short' });
}

/** Tempo desde um momento (ISO): "agora", "há 5 min", "há 3 h", "ontem", "há 4 dias" ou a data. */
export function tempoRelativo(momento: string, agora = new Date()) {
  const minutos = Math.floor((agora.getTime() - new Date(momento).getTime()) / 60_000);
  if (minutos < 1) return t('datas.agora');
  if (minutos < 60) return t('datas.haMinutos', { n: minutos });
  if (minutos < 24 * 60) return t('datas.haHoras', { n: Math.floor(minutos / 60) });
  const dias = diasEntre(paraDataLocal(new Date(momento)), paraDataLocal(agora));
  if (dias === 1) return t('datas.ontem');
  if (dias < 30) return t('datas.haDias', { n: dias });
  return formatarData(paraDataLocal(new Date(momento)));
}

/**
 * Grade do calendário de um mês (AAAA-MM), em semanas de segunda a domingo (norma europeia ISO 8601).
 * Os dias de fora do mês ficam como null.
 */
export function montarGradeDoMes(mes: string): (string | null)[][] {
  const [ano, m] = mes.split('-').map(Number);
  // getDay(): 0 = domingo. Com a semana a começar à segunda, o domingo é a 7.ª coluna.
  const primeiroDiaSemana = (new Date(ano, m - 1, 1).getDay() + 6) % 7;
  const diasNoMes = new Date(ano, m, 0).getDate();
  const celulas: (string | null)[] = [
    ...Array<null>(primeiroDiaSemana).fill(null),
    ...Array.from({ length: diasNoMes }, (_, i) => `${mes}-${doisDigitos(i + 1)}`),
  ];
  while (celulas.length % 7 !== 0) celulas.push(null);
  const semanas: (string | null)[][] = [];
  for (let i = 0; i < celulas.length; i += 7) semanas.push(celulas.slice(i, i + 7));
  return semanas;
}

/** "outubro de 2026" → "Outubro de 2026" (para títulos). */
export function nomeDoMesTitulo(mes: string) {
  const nome = nomeDoMes(mes);
  return nome.charAt(0).toLocaleUpperCase(localeAtual()) + nome.slice(1);
}

/** Dias da semana de segunda a domingo no idioma atual: inicial e nome completo. */
export function diasDaSemana(): { curto: string; nome: string }[] {
  // 1/1/2024 foi uma segunda-feira.
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(2024, 0, 1 + i);
    return {
      curto: d.toLocaleDateString(localeAtual(), { weekday: 'narrow' }),
      nome: d.toLocaleDateString(localeAtual(), { weekday: 'long' }),
    };
  });
}

/** Idade completa em anos numa data (AAAA-MM-DD), considerando se já fez aniversário. */
export function idadeEm(nascimento: string, data = hoje()) {
  const [an, mn, dn] = nascimento.split('-').map(Number);
  const [a, m, d] = data.split('-').map(Number);
  return a - an - (m < mn || (m === mn && d < dn) ? 1 : 0);
}

/** Data (AAAA-MM-DD) somada de alguns dias (negativo volta). */
export function somarDias(data: string, dias: number) {
  const [ano, mes, dia] = data.split('-').map(Number);
  return paraDataLocal(new Date(ano, mes - 1, dia + dias));
}
