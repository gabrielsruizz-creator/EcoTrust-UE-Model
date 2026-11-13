/**
 * Itália — IVA: 22% (normal), 10% (ridotta), 5% (ridotta) e 4% (super-ridotta).
 * Fonte: TEDB (situação em 13/11/2026), com base no DPR 633/1972, Tabella A.
 * Datas de início anteriores ao período conferido ficam como `desde: null`.
 */

import { FONTE_DIRETIVA_IVA, FONTE_TEDB } from '@/data/paises/fontes-comuns';
import type { PaisFiscal } from '@/data/paises/tipos';

export const ITALIA: PaisFiscal = {
  codigo: 'IT',
  taxas: {
    normal: [{ percentual: 22, desde: null }],
    reduzida1: [{ percentual: 10, desde: null }],
    reduzida2: [{ percentual: 5, desde: null }],
    superReduzida: [{ percentual: 4, desde: null }],
  },
  regioes: [],
  perfis: {
    supermercado: {
      tipo: 'reduzida1',
      faixa: ['superReduzida', 'normal'],
      base: 'TEDB FOODSTUFFS: básicos (pão, massa, leite, fruta e legumes) a 4%, muitos alimentos a 10%; limpeza e higiene a 22%',
    },
    alimentacao: { tipo: 'reduzida1', faixa: ['superReduzida', 'normal'], base: 'TEDB FOODSTUFFS' },
    restaurante: { tipo: 'reduzida1', base: 'TEDB RESTAURANT 10%' },
    bebidas: {
      tipo: 'normal',
      base: 'Taxa normal (cerveja e águas minerais à taxa normal, TEDB SUPPLY_WATER)',
      aConfirmar: 'Accise sobre álcool e tabaco ainda não estão incluídas',
    },
    combustivel: {
      tipo: 'normal',
      base: 'Taxa normal para combustível de automóvel',
      aConfirmar: 'Accise sobre combustíveis ainda não estão incluídas',
    },
    transporte: {
      tipo: 'reduzida1',
      faixa: ['reduzida2', 'normal'],
      base: 'TEDB TRANSPORT_PASSENGERS 10% (5% em alguns transportes por água)',
    },
    moradia: { tipo: 'isento', base: 'Arrendamento de imóveis isento (Diretiva IVA art. 135.º, n.º 1, al. l))' },
    contas: {
      tipo: 'reduzida1',
      faixa: ['reduzida1', 'normal'],
      base: 'Eletricidade doméstica, gás até 480 m³/ano e água a 10% (TEDB SUPPLY_ELECTRICITY, SUPPLY_GAS, SUPPLY_WATER)',
    },
    telecom: { tipo: 'normal', base: 'Taxa normal' },
    saude: {
      tipo: 'reduzida1',
      faixa: ['isento', 'normal'],
      base: 'Medicamentos a 10% (TEDB PHARMACEUTICAL_PRODUCTS); atos médicos isentos (Diretiva IVA art. 132.º)',
    },
    educacao: { tipo: 'isento', base: 'Ensino isento (Diretiva IVA art. 132.º, n.º 1, al. i))' },
    lazer: {
      tipo: 'normal',
      faixa: ['reduzida1', 'normal'],
      base: 'Espetáculos e eventos culturais a 10% (TEDB CULTURAL_EVENTS)',
    },
    servicos: { tipo: 'normal', base: 'Taxa normal' },
    compras: { tipo: 'normal', base: 'Taxa normal' },
    assinaturas: { tipo: 'normal', base: 'Taxa normal' },
    viagens: {
      tipo: 'reduzida1',
      faixa: ['reduzida1', 'normal'],
      base: 'Alojamento e transporte de passageiros a 10% (TEDB ACCOMMODATION, TRANSPORT_PASSENGERS)',
    },
    geral: { tipo: 'normal', faixa: ['superReduzida', 'normal'], base: 'Taxa normal' },
    isento: { tipo: 'isento', base: 'Escolha do utilizador' },
  },
  fontes: [FONTE_TEDB, FONTE_DIRETIVA_IVA],
};
