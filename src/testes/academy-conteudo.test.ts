import { afterAll, describe, expect, it } from '@jest/globals';

import { IDS_AULAS } from '@/data/academy/estrutura';
import { AULAS, CURSOS, TEXTOS_ACADEMY } from '@/data/academy-conteudo';
import { definirIdioma } from '@/i18n';

const ref = TEXTOS_ACADEMY['pt-PT'];

describe('conteúdo da Trust Academy', () => {
  afterAll(() => definirIdioma('pt-PT'));

  it('todos os idiomas têm as mesmas aulas, dicas e conceitos', () => {
    for (const [idioma, textos] of Object.entries(TEXTOS_ACADEMY)) {
      expect([idioma, textos.dicas.length]).toEqual([idioma, ref.dicas.length]);
      expect([idioma, textos.conceitos.length]).toEqual([idioma, ref.conceitos.length]);
      for (const id of IDS_AULAS) {
        expect([idioma, id, textos.aulas[id].paragrafos.length]).toEqual([idioma, id, ref.aulas[id].paragrafos.length]);
      }
    }
  });

  it('não fala de produtos nem da moeda do Brasil', () => {
    const proibidos = /R\$|\bCDB\b|\bSelic\b|\bCDI\b|\bFGC\b|\bCPF\b|rotativo|cheque especial|Banco Central do Brasil/i;
    for (const [idioma, textos] of Object.entries(TEXTOS_ACADEMY)) {
      const achado = JSON.stringify(textos).match(proibidos);
      expect([idioma, achado?.[0] ?? null]).toEqual([idioma, null]);
    }
    // Em espanhol e italiano, "IPCA" é o nome correto do índice harmonizado da UE; em pt-PT seria o índice brasileiro.
    expect(JSON.stringify(ref)).not.toMatch(/\bIPCA\b/);
  });

  it('os textos acompanham o idioma escolhido e a resposta certa não muda', () => {
    definirIdioma('en');
    expect(CURSOS[0].titulo).toBe('Finance from scratch');
    const aula = AULAS.find((a) => a.id === 'reserva-emergencia')!;
    expect(aula.quiz.opcoes[aula.quiz.correta]).toBe('Being safe and quick to withdraw');
    definirIdioma('de');
    expect(aula.quiz.opcoes[aula.quiz.correta]).toBe('Sicher und schnell verfügbar');
  });
});
