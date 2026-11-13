import type { Fonte } from '@/data/paises/tipos';

export const FONTE_TEDB: Fonte = {
  titulo: 'Comissão Europeia — Taxes in Europe Database (TEDB), VatRetrievalService (cópia em fontes/tedb/)',
  url: 'https://ec.europa.eu/taxation_customs/tedb/',
  consultadoEm: '2026-11-13',
};

/** Diretiva 2006/112/CE: isenções de saúde e educação (art. 132.º) e de arrendamento de imóveis (art. 135.º). */
export const FONTE_DIRETIVA_IVA: Fonte = {
  titulo: 'Diretiva 2006/112/CE do Conselho (sistema comum do IVA)',
  url: 'https://eur-lex.europa.eu/legal-content/PT/TXT/?uri=CELEX:02006L0112-20250101',
  consultadoEm: '2026-11-13',
};
