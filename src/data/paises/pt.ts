/**
 * Portugal — IVA.
 * - Continente: 23% (normal), 13% (intermédia, Lista II), 6% (reduzida, Lista I) — CIVA art. 18.º, n.º 1.
 * - Açores (PT-20): 16% / 9% / 4%, desde 1/7/2021 (DLR 15-A/2021/A).
 * - Madeira (PT-30): 22% / 12% desde 1/4/2012 (Lei 14-A/2012); a reduzida passou de 5% para 4% em 1/10/2024
 *   (DLR 6/2024/M).
 *   Regiões: Ofício-Circulado n.º 25045/2024 da AT. As taxas normais regionais de 2026 conferem com a TEDB.
 * - Datas de início anteriores ao período conferido ficam como `desde: null`.
 * Nos perfis, reduzida1 = taxa intermédia e reduzida2 = taxa reduzida (nas regiões valem as taxas regionais).
 */

import { FONTE_DIRETIVA_IVA, FONTE_TEDB } from '@/data/paises/fontes-comuns';
import type { PaisFiscal } from '@/data/paises/tipos';

const AT_REGIOES = {
  titulo: 'AT — Ofício-Circulado n.º 25045/2024 (taxas de IVA nas Regiões Autónomas)',
  url: 'https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/legislacao/instrucoes_administrativas/Documents/Oficio_circulado_25045_2024.pdf',
  consultadoEm: '2026-11-13',
};

export const PORTUGAL: PaisFiscal = {
  codigo: 'PT',
  taxas: {
    normal: [{ percentual: 23, desde: null }],
    reduzida1: [{ percentual: 13, desde: null }],
    reduzida2: [{ percentual: 6, desde: null }],
  },
  regioes: [
    {
      id: 'PT-20', // Açores
      taxas: {
        normal: [{ percentual: 16, desde: '2021-07-01' }],
        reduzida1: [{ percentual: 9, desde: '2021-07-01' }],
        reduzida2: [{ percentual: 4, desde: '2021-07-01' }],
      },
      fontes: [AT_REGIOES, FONTE_TEDB],
    },
    {
      id: 'PT-30', // Madeira
      taxas: {
        normal: [{ percentual: 22, desde: '2012-04-01' }],
        reduzida1: [{ percentual: 12, desde: '2012-04-01' }],
        reduzida2: [
          { percentual: 5, desde: '2012-04-01', ate: '2024-09-30' },
          { percentual: 4, desde: '2024-10-01' },
        ],
      },
      fontes: [AT_REGIOES, FONTE_TEDB],
    },
  ],
  perfis: {
    supermercado: {
      tipo: 'reduzida2',
      faixa: ['reduzida2', 'normal'],
      base: 'TEDB FOODSTUFFS (Lista I, 6%); limpeza, higiene e bebidas pagam a taxa normal',
    },
    alimentacao: { tipo: 'reduzida2', faixa: ['reduzida2', 'normal'], base: 'TEDB FOODSTUFFS' },
    restaurante: {
      tipo: 'reduzida1',
      faixa: ['reduzida1', 'normal'],
      base: 'TEDB RESTAURANT 13%: exclui bebidas alcoólicas e refrigerantes (taxa normal)',
    },
    bebidas: {
      tipo: 'normal',
      faixa: ['reduzida1', 'normal'],
      base: 'Taxa normal; o vinho (exceto vinhos especiais) paga 13% (TEDB NEW_PARKING_RATE, Lista II)',
      aConfirmar: 'Impostos especiais (IABA e Imposto sobre o Tabaco) ainda não estão incluídos',
    },
    combustivel: {
      tipo: 'normal',
      base: 'Taxa normal; só o gasóleo colorido e marcado tem 13% (TEDB FOSSIL_FUEL). ISP e outros impostos: combustivel.ts (Oil Bulletin)',
    },
    transporte: {
      tipo: 'reduzida2',
      faixa: ['reduzida2', 'normal'],
      base: 'TEDB TRANSPORT_PASSENGERS 6%; estacionamento e manutenção pagam a taxa normal',
    },
    moradia: { tipo: 'isento', base: 'Arrendamento de imóveis isento (Diretiva IVA art. 135.º, n.º 1, al. l))' },
    contas: {
      tipo: 'normal',
      faixa: ['reduzida2', 'normal'],
      base: 'Água a 6% (TEDB SUPPLY_WATER); eletricidade a 6% só em potências baixas e até certo consumo (TEDB SUSTAINABLE_ENERGY)',
    },
    telecom: { tipo: 'normal', base: 'Taxa normal' },
    saude: {
      tipo: 'reduzida2',
      faixa: ['isento', 'normal'],
      base: 'Medicamentos a 6% (TEDB PHARMACEUTICAL_PRODUCTS); atos médicos isentos (Diretiva IVA art. 132.º)',
    },
    educacao: {
      tipo: 'isento',
      faixa: ['isento', 'normal'],
      base: 'Ensino isento (Diretiva IVA art. 132.º, n.º 1, al. i)); livros a 6% (TEDB IMPRESSIONS)',
    },
    lazer: {
      tipo: 'normal',
      faixa: ['reduzida2', 'normal'],
      base: 'Taxa normal na maior parte',
      aConfirmar: 'Taxa das entradas em espetáculos e eventos culturais (não aparece na TEDB)',
    },
    servicos: { tipo: 'normal', base: 'Taxa normal' },
    compras: { tipo: 'normal', base: 'Taxa normal' },
    assinaturas: { tipo: 'normal', base: 'Serviços eletrónicos à taxa normal (CIVA art. 18.º, n.º 7)' },
    viagens: {
      tipo: 'reduzida2',
      faixa: ['reduzida2', 'normal'],
      base: 'Alojamento e transporte de passageiros a 6% (TEDB ACCOMMODATION, TRANSPORT_PASSENGERS)',
    },
    geral: { tipo: 'normal', faixa: ['reduzida2', 'normal'], base: 'Taxa normal' },
    isento: { tipo: 'isento', base: 'Escolha do utilizador' },
  },
  fontes: [
    {
      titulo: 'Código do IVA, art. 18.º (Portal das Finanças)',
      url: 'https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/civa_rep/Pages/iva18.aspx',
      consultadoEm: '2026-11-13',
    },
    AT_REGIOES,
    FONTE_TEDB,
    FONTE_DIRETIVA_IVA,
  ],
};
