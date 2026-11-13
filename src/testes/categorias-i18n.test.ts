import { afterAll, describe, expect, it } from '@jest/globals';

import { definirIdioma } from '@/i18n';
import { chaveDaCategoriaPorNome, nomeDaCategoria } from '@/i18n/categorias';
import { visualCategoria } from '@/utils/visual';

afterAll(() => definirIdioma('en'));

describe('categorias padrão no idioma escolhido', () => {
  it('a chave traduz; sem chave fica o nome do utilizador', () => {
    definirIdioma('de');
    expect(nomeDaCategoria('Supermercado', 'supermercado')).toBe('Lebensmittel');
    definirIdioma('pt-PT');
    expect(nomeDaCategoria('Moradia', 'moradia')).toBe('Habitação');
    expect(nomeDaCategoria('Explicações do Tomás', null)).toBe('Explicações do Tomás');
    expect(nomeDaCategoria('Qualquer', 'chave-desconhecida')).toBe('Qualquer');
  });

  it('reconhece a categoria padrão pelo nome em qualquer idioma (e pelo nome antigo)', () => {
    expect(chaveDaCategoriaPorNome('Groceries')).toBe('supermercado');
    expect(chaveDaCategoriaPorNome('Bollette')).toBe('contas');
    expect(chaveDaCategoriaPorNome('Telefone e internet')).toBe('telecom');
    expect(chaveDaCategoriaPorNome('Explicações')).toBeNull();
  });

  it('o ícone não depende do idioma', () => {
    const pt = visualCategoria('Contas da casa', 3);
    expect(visualCategoria('Bills', 3)).toEqual(pt);
    expect(visualCategoria('Nebenkosten', 3)).toEqual(pt);
    expect(visualCategoria('Minha categoria', 3).icone).toBe('etiqueta');
  });
});
