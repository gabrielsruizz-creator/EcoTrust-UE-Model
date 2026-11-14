/**
 * Leitura do código QR das faturas portuguesas (Portaria n.º 195/2020, de 13 de agosto).
 *
 * Fonte: AT, "Especificações técnicas – Código de barras bidimensional (código QR)", versão 1.1,
 * outubro de 2020 (snapshot e endereço em fontes/at/README.md). Regras usadas:
 * - cada campo é «código»«:»«valor»; os campos vêm separados por «*», sempre pela ordem da tabela;
 * - valores monetários em euros, com «.» decimal e duas casas;
 * - A (NIF do emitente), B, C, D (tipo), E (estado), F (data AAAAMMDD), G (n.º do documento),
 *   H (ATCUD), I1 (espaço fiscal), N (total de impostos), O (total com impostos), Q e R são obrigatórios;
 * - I1–I8, J1–J8 e K1–K8: até três espaços fiscais (PT, PT-AC, PT-MA ou estrangeiros) com bases e IVA
 *   por taxa (isenta, reduzida, intermédia, normal); I1:0 = documento sem indicação de taxa de IVA;
 * - N = IVA + imposto do selo (TaxPayable do SAF-T).
 *
 * Tudo aqui é puro (sem câmara nem banco): fácil de testar com os exemplos da especificação.
 */

import { paisUE } from '@/data/paises/ue';
import type { CodigoPais } from '@/data/paises/tipos';
import { t } from '@/i18n';
import { ErroValidacao } from '@/services/erros';
import { dataValida } from '@/utils/datas';

/** Totais de um espaço fiscal (campos I, J ou K), em cêntimos de euro. */
export type EspacoFiscalFatura = {
  /** "PT", "PT-AC", "PT-MA" ou o código de outro país (ex.: "FR") */
  codigo: string;
  baseIsenta: number;
  baseReduzida: number;
  ivaReduzida: number;
  baseIntermedia: number;
  ivaIntermedia: number;
  baseNormal: number;
  ivaNormal: number;
};

export type FaturaPT = {
  nifEmitente: string;
  nifAdquirente: string;
  paisAdquirente: string;
  /** Tipo de documento do SAF-T (FT, FS, FR, NC, ND, GT, PF...) */
  tipo: string;
  /** Estado do documento do SAF-T (N = normal, A = anulado...) */
  estado: string;
  /** AAAA-MM-DD */
  data: string;
  numero: string;
  atcud: string;
  /** I1:0 - o documento não indica taxas de IVA */
  semIndicacaoIva: boolean;
  espacos: EspacoFiscalFatura[];
  naoSujeitoCentavos: number;
  seloCentavos: number;
  /** Campo N: IVA + imposto do selo */
  impostosCentavos: number;
  /** Campo O: total do documento com impostos */
  totalCentavos: number;
  retencaoCentavos: number;
  /** Identificador único usado para não registar a mesma fatura duas vezes */
  chave: string;
};

/** Tipos de fatura aceites como despesa: fatura, fatura simplificada, fatura-recibo e nota de débito. */
const TIPOS_DESPESA = new Set(['FT', 'FS', 'FR', 'ND']);
const PREFIXO_CHAVE = 'PT:';
const FORMATO_CHAVE = /^PT:\d{9}:[^*]{1,70}$/;

/** A chave guardada no movimento tem o formato das faturas portuguesas lidas pelo QR? */
export function chaveFaturaValida(chave: string) {
  return FORMATO_CHAVE.test(chave);
}

function centimos(valor: string | undefined): number | null {
  if (valor === undefined || valor === '') return 0;
  if (!/^\d{1,13}(\.\d{1,2})?$/.test(valor)) return null;
  const [inteiros, decimais = ''] = valor.split('.');
  return Number(inteiros) * 100 + Number(decimais.padEnd(2, '0'));
}

/** Separa a mensagem do QR em campos. Tolera espaços à volta de «:» (aparecem num exemplo oficial). */
function campos(texto: string): Map<string, string> | null {
  const mapa = new Map<string, string>();
  for (const parte of texto.trim().split('*')) {
    const i = parte.indexOf(':');
    if (i <= 0) return null;
    const codigo = parte.slice(0, i).trim().toUpperCase();
    if (!/^([A-HL-S]|[IJK][1-8])$/.test(codigo) || mapa.has(codigo)) return null;
    mapa.set(codigo, parte.slice(i + 1).trim());
  }
  return mapa;
}

function espaco(mapa: Map<string, string>, letra: 'I' | 'J' | 'K'): EspacoFiscalFatura | null | 'invalido' {
  const codigo = mapa.get(`${letra}1`);
  if (codigo === undefined || codigo === '0') return null;
  const valores = [2, 3, 4, 5, 6, 7, 8].map((n) => centimos(mapa.get(`${letra}${n}`)));
  if (valores.some((v) => v === null) || !/^[A-Z]{2}(-[A-Z]{2})?$/.test(codigo)) return 'invalido';
  const [baseIsenta, baseReduzida, ivaReduzida, baseIntermedia, ivaIntermedia, baseNormal, ivaNormal] = valores as number[];
  return { codigo, baseIsenta, baseReduzida, ivaReduzida, baseIntermedia, ivaIntermedia, baseNormal, ivaNormal };
}

/**
 * Lê a mensagem do QR de um documento emitido em Portugal. Devolve null quando o texto não segue a
 * especificação da AT (outro QR qualquer, ou campos obrigatórios em falta ou mal formados).
 */
export function lerQrFaturaPT(texto: string): FaturaPT | null {
  const mapa = campos(texto);
  if (!mapa) return null;
  for (const obrigatorio of ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I1', 'N', 'O']) {
    if (!mapa.get(obrigatorio)) return null;
  }
  const nifEmitente = mapa.get('A')!;
  const f = mapa.get('F')!;
  if (!/^\d{9}$/.test(nifEmitente) || !/^\d{8}$/.test(f)) return null;
  const data = `${f.slice(0, 4)}-${f.slice(4, 6)}-${f.slice(6, 8)}`;
  if (!dataValida(data)) return null;

  const espacos: EspacoFiscalFatura[] = [];
  for (const letra of ['I', 'J', 'K'] as const) {
    const e = espaco(mapa, letra);
    if (e === 'invalido') return null;
    if (e) espacos.push(e);
  }
  const naoSujeitoCentavos = centimos(mapa.get('L'));
  const seloCentavos = centimos(mapa.get('M'));
  const impostosCentavos = centimos(mapa.get('N'));
  const totalCentavos = centimos(mapa.get('O'));
  const retencaoCentavos = centimos(mapa.get('P'));
  if ([naoSujeitoCentavos, seloCentavos, impostosCentavos, totalCentavos, retencaoCentavos].some((v) => v === null)) return null;

  const numero = mapa.get('G')!;
  const atcud = mapa.get('H')!;
  // Antes de o ATCUD ser obrigatório, alguns programas usavam "0": aí o n.º do documento identifica a fatura.
  const identificador = (atcud !== '0' ? atcud : numero).slice(0, 70);

  return {
    nifEmitente,
    nifAdquirente: mapa.get('B')!,
    paisAdquirente: mapa.get('C')!,
    tipo: mapa.get('D')!.toUpperCase(),
    estado: mapa.get('E')!.toUpperCase(),
    data,
    numero,
    atcud,
    semIndicacaoIva: mapa.get('I1') === '0',
    espacos,
    naoSujeitoCentavos: naoSujeitoCentavos!,
    seloCentavos: seloCentavos!,
    impostosCentavos: impostosCentavos!,
    totalCentavos: totalCentavos!,
    retencaoCentavos: retencaoCentavos!,
    chave: `${PREFIXO_CHAVE}${nifEmitente}:${identificador}`,
  };
}

/** Confirma que o documento pode virar uma despesa. Lança ErroValidacao com o motivo, se não puder. */
export function validarFaturaParaDespesa(f: FaturaPT) {
  if (f.estado === 'A') throw new ErroValidacao(t('fatura.e.anulada'));
  if (f.tipo === 'NC') throw new ErroValidacao(t('fatura.e.notaCredito'));
  if (!TIPOS_DESPESA.has(f.tipo)) throw new ErroValidacao(t('fatura.e.naoFatura'));
  if (f.totalCentavos <= 0) throw new ErroValidacao(t('fatura.e.semValor'));
}

/** Espaço fiscal da compra → país e região do app (Açores = PT-20, Madeira = PT-30). */
export function localDoEspaco(codigo: string): { pais: CodigoPais; regiao: string | null } | null {
  if (codigo === 'PT') return { pais: 'PT', regiao: null };
  if (codigo === 'PT-AC') return { pais: 'PT', regiao: 'PT-20' };
  if (codigo === 'PT-MA') return { pais: 'PT', regiao: 'PT-30' };
  const pais = paisUE(codigo);
  return pais ? { pais: pais.codigo, regiao: null } : null;
}

function totalDoEspaco(e: EspacoFiscalFatura) {
  return e.baseIsenta + e.baseReduzida + e.ivaReduzida + e.baseIntermedia + e.ivaIntermedia + e.baseNormal + e.ivaNormal;
}

/** IVA identificado na fatura, somando os espaços fiscais. */
export function ivaDaFatura(f: FaturaPT) {
  return f.espacos.reduce((s, e) => s + e.ivaReduzida + e.ivaIntermedia + e.ivaNormal, 0);
}

export type DespesaDaFatura = {
  valorCentavos: number;
  /** Impostos impressos na fatura (campo N); null quando a fatura não os discrimina */
  tributosCentavos: number | null;
  data: string;
  chaveNota: string;
  paisConsumo: CodigoPais | null;
  regiaoConsumo: string | null;
};

/** Dados para preencher o formulário de despesa a partir da fatura. */
export function despesaDaFatura(f: FaturaPT): DespesaDaFatura {
  // Com vários espaços fiscais, a compra fica no que tem maior valor.
  const principal = [...f.espacos].sort((a, b) => totalDoEspaco(b) - totalDoEspaco(a))[0];
  const local = principal ? localDoEspaco(principal.codigo) : null;
  // Impostos de 0,00 contam como "não informados" (o Impostómetro estima).
  const tributos = f.impostosCentavos > 0 && f.impostosCentavos < f.totalCentavos ? f.impostosCentavos : null;
  return {
    valorCentavos: f.totalCentavos,
    tributosCentavos: tributos,
    data: f.data,
    chaveNota: f.chave,
    paisConsumo: local?.pais ?? null,
    regiaoConsumo: local?.regiao ?? null,
  };
}
