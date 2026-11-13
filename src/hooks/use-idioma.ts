import { useSyncExternalStore } from 'react';

import { assinarIdioma, idiomaAtual, tradutorPara, type Idioma, type Tradutor } from '@/i18n';

export function useIdioma(): Idioma {
  return useSyncExternalStore(assinarIdioma, idiomaAtual);
}

/** Função de tradução que faz o componente renderizar de novo quando o idioma muda. */
export function useT(): Tradutor {
  return tradutorPara(useIdioma());
}
