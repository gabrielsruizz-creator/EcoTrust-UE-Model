import { describe, expect, it } from '@jest/globals';

import { perfilPorNome, perfilTributarioValido, PERFIS_CONSUMO } from '@/data/perfis-consumo';
import { CATALOGOS } from '@/i18n/catalogos';
import { IDIOMAS } from '@/i18n/idiomas';

describe('tipo de consumo pelo nome da categoria (8 idiomas)', () => {
  it.each([
    ['Supermarkt', 'supermercado'],
    ['Lidl', 'supermercado'],
    ['Restaurantes', 'restaurante'],
    ['Ristorante', 'restaurante'],
    ['Tankstelle', 'combustivel'],
    ['Benzina', 'combustivel'],
    ['Comboio', 'transporte'],
    ['Renda de casa', 'moradia'],
    ['Miete', 'moradia'],
    ['Électricité', 'contas'],
    ['Telemóvel', 'telecom'],
    ['Apteka', 'saude'],
    ['Farmácia', 'saude'],
    ['Ginásio', 'servicos'],
    ['Kleidung', 'compras'],
    ['Netflix', 'assinaturas'],
    ['Reisen', 'viagens'],
    ['Kino', 'lazer'],
    ['Piwo', 'bebidas'],
    ['Donativos', 'isento'],
    ['Diversos', 'geral'],
  ])('"%s" → %s', (nome, perfil) => {
    expect(perfilPorNome(nome)).toBe(perfil);
  });

  it('categorias padrão usam o tipo gravado na migração', () => {
    expect(perfilPorNome('Contas da casa')).toBe('contas');
    expect(perfilPorNome('Outros')).toBe('geral');
  });

  it('valida os identificadores guardados no banco', () => {
    expect(perfilTributarioValido('restaurante')).toBe(true);
    expect(perfilTributarioValido('icms')).toBe(false);
    expect(perfilTributarioValido(null)).toBe(false);
  });

  it('todo tipo tem nome e exemplos em todos os idiomas', () => {
    for (const { id } of IDIOMAS) {
      for (const p of PERFIS_CONSUMO) {
        const catalogo = CATALOGOS[id] as Record<string, unknown>;
        expect([id, p, typeof catalogo[`perfil.${p}`], typeof catalogo[`perfil.${p}.exemplos`]]).toEqual([id, p, 'string', 'string']);
      }
    }
  });
});
