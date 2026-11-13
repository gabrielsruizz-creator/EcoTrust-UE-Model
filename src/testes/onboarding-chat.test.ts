import { beforeAll, describe, expect, it, jest } from '@jest/globals';

import { definirIdioma } from '@/i18n';
import { passoAtual, responder, type RespostasChat } from '@/services/onboarding-chat-service';

jest.mock('@/repositories/situacao-repository', () => ({}));
jest.mock('@/services/metas-service', () => ({}));
jest.mock('@/repositories/perfil-financeiro-repository', () => ({}));

const base: RespostasChat = {
  nome: 'Ana',
  rendaCentavos: 200000,
  fonte: 'clt',
  fixasCentavos: 80000,
  dividas: 'nao',
  reserva: 'parcial',
  reservaValorCentavos: 50000,
  investe: 'nao',
  objetivo: 'controlar',
};

describe('conversa de boas-vindas', () => {
  beforeAll(() => definirIdioma('pt-PT'));

  it('metas escolhidas ganham o nome no idioma e o fundo de emergência leva o valor guardado', () => {
    const passo = passoAtual(base)!;
    expect(passo.id).toBe('sonhos');
    const r = responder(base, passo, ['reserva', 'viagem']);
    expect(r.respostas.sonhos).toEqual(['reserva', 'viagem']);
    expect(r.respostas.metas).toEqual([
      { nome: 'Fundo de emergência', sonho: 'reserva', inicialCentavos: 50000 },
      { nome: 'Viagem', sonho: 'viagem', inicialCentavos: 0 },
    ]);
    expect(r.textoUsuario).toBe('Fundo de emergência, Viagem');
    const valor = passoAtual(r.respostas)!;
    expect(valor.id).toBe('meta-valor:0');
    expect(valor.entrada.tipo === 'valor' && valor.entrada.sugestoes?.[0].valor).toBe('480000');
  });

  it('recusa opções que não existem', () => {
    const passo = passoAtual(base)!;
    expect(() => responder(base, passo, ['Viagem'])).toThrow('Escolha pelo menos uma opção.');
  });

  it('as opções mudam com o idioma', () => {
    definirIdioma('en');
    const passo = passoAtual({ nome: 'Ana', rendaCentavos: 1, fonte: 'clt', fixasCentavos: 0 })!;
    expect(passo.entrada.tipo === 'opcoes' && passo.entrada.opcoes.map((o) => o.rotulo)).toEqual([
      'I have no debts',
      'Yes, but under control',
      "Yes, and it's a burden",
    ]);
    definirIdioma('pt-PT');
  });
});
