/**
 * Malta — IVA: 18% (normal), 12% (parking), 7% (alojamento), 5% (reduzida) e 0% com direito a dedução
 * (alimentos, medicamentos, transporte público). Fonte: TEDB (situação em 13/11/2026).
 * Datas de início anteriores ao período conferido ficam como `desde: null`.
 */

import { FONTE_DIRETIVA_IVA, FONTE_TEDB } from '@/data/paises/fontes-comuns';
import type { PaisFiscal } from '@/data/paises/tipos';

export const MALTA: PaisFiscal = {
  codigo: 'MT',
  taxas: {
    normal: [{ percentual: 18, desde: null }],
    parking: [{ percentual: 12, desde: null }],
    reduzida1: [{ percentual: 7, desde: null }],
    reduzida2: [{ percentual: 5, desde: null }],
  },
  regioes: [],
  perfis: {
    supermercado: {
      tipo: 'zero',
      faixa: ['zero', 'normal'],
      base: 'TEDB FOODSTUFFS isentos com crédito; alguns alimentos a 5%; limpeza e higiene à taxa normal',
    },
    alimentacao: { tipo: 'zero', faixa: ['zero', 'normal'], base: 'TEDB FOODSTUFFS' },
    restaurante: { tipo: 'normal', base: 'Taxa normal (a TEDB não indica taxa reduzida para restauração)' },
    bebidas: {
      tipo: 'normal',
      base: 'Taxa normal',
      aConfirmar: 'Impostos especiais (excise duty) sobre álcool e tabaco ainda não estão incluídos',
    },
    combustivel: { tipo: 'normal', base: 'Taxa normal; imposto especial em combustivel.ts (Oil Bulletin)' },
    transporte: {
      tipo: 'zero',
      faixa: ['zero', 'normal'],
      base: 'TEDB TRANSPORT_PASSENGERS: transporte público regular isento com crédito',
    },
    moradia: { tipo: 'isento', base: 'Arrendamento de imóveis isento (Diretiva IVA art. 135.º, n.º 1, al. l))' },
    contas: {
      tipo: 'normal',
      faixa: ['isento', 'normal'],
      base: 'Água fornecida por autoridade pública isenta (TEDB SUPPLY_WATER)',
      aConfirmar: 'Taxa da eletricidade doméstica (não aparece na TEDB)',
    },
    telecom: { tipo: 'normal', base: 'Taxa normal' },
    saude: {
      tipo: 'zero',
      faixa: ['zero', 'normal'],
      base: 'Medicamentos e cuidados médicos isentos (TEDB PHARMACEUTICAL_PRODUCTS, MEDICAL_CARE); equipamento médico a 5%',
    },
    educacao: { tipo: 'isento', base: 'Ensino isento (Diretiva IVA art. 132.º, n.º 1, al. i))' },
    lazer: {
      tipo: 'normal',
      faixa: ['reduzida2', 'normal'],
      base: 'Museus, exposições, concertos e teatro a 5% (TEDB CULTURAL_EVENTS)',
    },
    servicos: {
      tipo: 'normal',
      faixa: ['parking', 'normal'],
      base: 'Taxa normal; alguns cuidados pessoais a 12% (TEDB BODY_CARE_SERVICES)',
    },
    compras: { tipo: 'normal', base: 'Taxa normal' },
    assinaturas: { tipo: 'normal', base: 'Taxa normal; jornais e revistas, inclusive digitais, a 5% (TEDB NEWSPAPERS)' },
    viagens: {
      tipo: 'reduzida1',
      faixa: ['zero', 'normal'],
      base: 'Alojamento licenciado a 7% (TEDB ACCOMMODATION); transporte internacional isento',
    },
    geral: { tipo: 'normal', faixa: ['zero', 'normal'], base: 'Taxa normal' },
    isento: { tipo: 'isento', base: 'Escolha do utilizador' },
  },
  fontes: [FONTE_TEDB, FONTE_DIRETIVA_IVA],
};
