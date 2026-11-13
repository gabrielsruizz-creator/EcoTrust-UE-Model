import { afterAll, describe, expect, it } from '@jest/globals';

import { CATALOGOS } from '@/i18n/catalogos';
import { definirIdioma, t, traduzir } from '@/i18n';
import { escolherIdioma, IDIOMAS } from '@/i18n/idiomas';
import { categoriaPlural } from '@/i18n/plurais';
import { ptPT } from '@/i18n/catalogos/pt-PT';

describe('escolha do idioma pelo aparelho', () => {
  it('usa o primeiro idioma suportado da lista', () => {
    expect(escolherIdioma(['mt-MT', 'it-IT', 'en-GB'])).toBe('it');
    expect(escolherIdioma(['de-AT'])).toBe('de');
    expect(escolherIdioma(['nl-BE'])).toBe('nl');
  });

  it('nunca usa o português do Brasil', () => {
    expect(escolherIdioma(['pt-BR'])).toBe('pt-PT');
    expect(escolherIdioma(['pt'])).toBe('pt-PT');
  });

  it('cai no inglês quando nada é suportado', () => {
    expect(escolherIdioma(['mt-MT', 'el-GR'])).toBe('en');
    expect(escolherIdioma([])).toBe('en');
  });
});

describe('plurais', () => {
  it('francês trata 0 e 1 como singular', () => {
    expect(categoriaPlural('fr', 0)).toBe('one');
    expect(categoriaPlural('fr', 1)).toBe('one');
    expect(categoriaPlural('fr', 2)).toBe('other');
  });

  it('português, inglês e italiano: só 1 é singular', () => {
    for (const idioma of ['pt-PT', 'en', 'it'] as const) {
      expect(categoriaPlural(idioma, 0)).toBe('other');
      expect(categoriaPlural(idioma, 1)).toBe('one');
    }
  });

  it('polonês usa few (2-4, exceto 12-14) e many', () => {
    expect(categoriaPlural('pl', 1)).toBe('one');
    expect(categoriaPlural('pl', 3)).toBe('few');
    expect(categoriaPlural('pl', 22)).toBe('few');
    expect(categoriaPlural('pl', 12)).toBe('many');
    expect(categoriaPlural('pl', 5)).toBe('many');
    expect(categoriaPlural('pl', 0)).toBe('many');
  });

  it('escolhe o texto pelo número', () => {
    expect(traduzir('pt-PT', 'comum.dias', { n: 1 })).toBe('1 dia');
    expect(traduzir('pt-PT', 'comum.dias', { n: 3 })).toBe('3 dias');
    expect(traduzir('fr', 'comum.dias', { n: 0 })).toBe('0 jour');
    expect(traduzir('pl', 'comum.dias', { n: 5 })).toBe('5 dni');
  });
});

describe('catálogos', () => {
  const chaves = Object.keys(ptPT).sort();

  it.each(IDIOMAS.map((i) => i.id))('%s tem todas as chaves, sem textos vazios', (idioma) => {
    const catalogo = CATALOGOS[idioma];
    expect(Object.keys(catalogo).sort()).toEqual(chaves);
    for (const valor of Object.values(catalogo)) {
      const textos: string[] = typeof valor === 'string' ? [valor] : Object.values(valor).filter((v): v is string => typeof v === 'string');
      for (const texto of textos) expect(texto.trim()).not.toBe('');
    }
  });

  it.each(IDIOMAS.map((i) => i.id))('%s usa os mesmos marcadores {…} da referência', (idioma) => {
    const marcadores = (texto: unknown) =>
      (JSON.stringify(texto).match(/\{\w+\}/g) ?? []).filter((m, i, a) => a.indexOf(m) === i).sort();
    for (const chave of chaves) {
      expect([chave, marcadores(CATALOGOS[idioma][chave as keyof typeof ptPT])]).toEqual([
        chave,
        marcadores(ptPT[chave as keyof typeof ptPT]),
      ]);
    }
  });

  it('polonês tem few e many em todo plural', () => {
    for (const valor of Object.values(CATALOGOS.pl)) {
      if (typeof valor !== 'string') {
        expect(valor.few).toBeDefined();
        expect(valor.many).toBeDefined();
      }
    }
  });

  it('o português de Portugal não usa termos do Brasil', () => {
    const texto = JSON.stringify(ptPT).toLowerCase();
    for (const termo of ['celular', 'registrar', 'usuário', 'cadastr', 'configurações', 'ônibus', 'você']) {
      expect([termo, texto.includes(termo)]).toEqual([termo, false]);
    }
  });
});

describe('t() no idioma ativo', () => {
  afterAll(() => definirIdioma('en'));

  it('troca o texto quando o idioma muda e preenche os valores', () => {
    definirIdioma('de');
    expect(t('abas.metas')).toBe('Ziele');
    expect(t('pref.hora', { h: 8 })).toBe('8:00 Uhr');
    definirIdioma('it');
    expect(t('abas.metas')).toBe('Obiettivi');
  });
});
