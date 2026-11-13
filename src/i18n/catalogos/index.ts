import { de } from '@/i18n/catalogos/de';
import { en } from '@/i18n/catalogos/en';
import { es } from '@/i18n/catalogos/es';
import { fr } from '@/i18n/catalogos/fr';
import { it } from '@/i18n/catalogos/it';
import { nl } from '@/i18n/catalogos/nl';
import { pl } from '@/i18n/catalogos/pl';
import { ptPT } from '@/i18n/catalogos/pt-PT';
import type { Idioma } from '@/i18n/idiomas';
import type { Catalogo } from '@/i18n/tipos';

export const CATALOGOS: Record<Idioma, Catalogo> = { en, 'pt-PT': ptPT, es, fr, de, it, nl, pl };
