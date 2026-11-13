/**
 * Mascote do EcoTrust (o "Eco"): um bichinho que reage aos seus hábitos financeiros, como um Tamagotchi.
 * - Humor: depende de há quantos dias você não registra nada, orçamento estourado e saúde financeira.
 * - Energia: cai 20% por dia sem registros e volta ao registrar.
 * - Estágio: cresce com o nível da jornada (Filhote → Jovem → Adulto → Sábio).
 * - Falas: frases sobre a sua situação; tocar no Eco mostra a próxima.
 * `calcularPet` é puro; `obterPet` busca os dados.
 */

import { t, type Chave } from '@/i18n';
import { lerConfiguracao, salvarConfiguracao } from '@/repositories/configuracoes-repository';
import { listarMomentosDeRegistro } from '@/repositories/jornada-repository';
import { ErroValidacao } from '@/services/erros';
import { obterJornada } from '@/services/gamificacao-service';
import { obterMetas } from '@/services/metas-service';
import { obterOrcamentos } from '@/services/orcamento-service';
import { primeiroNome } from '@/services/perfil-financeiro-service';
import { obterSaude } from '@/services/saude-service';
import { diasEntre, hoje, mesAtual, paraDataLocal } from '@/utils/datas';
import { formatarCentavos } from '@/utils/moeda';

export type HumorPet = 'radiante' | 'feliz' | 'tranquilo' | 'preocupado' | 'com-fome' | 'triste';
export type EstagioPet = 'filhote' | 'jovem' | 'adulto' | 'sabio';

const HUMORES: HumorPet[] = ['radiante', 'feliz', 'tranquilo', 'preocupado', 'com-fome', 'triste'];

/** Nome de cada humor no idioma atual. */
export const ROTULO_HUMOR = Object.defineProperties(
  {} as Record<HumorPet, string>,
  Object.fromEntries(
    HUMORES.map((h) => [h, { get: () => t(`pet.humor.${h}` as Chave), enumerable: true }]),
  ),
);

type Estagio = { estagio: EstagioPet; readonly nome: string; nivelMinimo: number };

function estagio(id: EstagioPet, nivelMinimo: number): Estagio {
  return {
    estagio: id,
    nivelMinimo,
    get nome() {
      return t(`pet.estagio.${id}` as Chave);
    },
  };
}

const ESTAGIOS: Estagio[] = [estagio('filhote', 1), estagio('jovem', 3), estagio('adulto', 5), estagio('sabio', 7)];

export type EstadoPet = {
  nome: string;
  humor: HumorPet;
  estagio: EstagioPet;
  nomeEstagio: string;
  /** 0 a 100 */
  energia: number;
  /** A primeira é a principal; as outras aparecem ao tocar no Eco */
  falas: string[];
  /** Ex.: "Eu evoluo para Jovem no nível 3." (null no estágio máximo) */
  proximaEvolucao: string | null;
};

export type EntradaPet = {
  nomePet: string;
  nomeUsuario: string;
  /** null = nunca registrou nada */
  diasSemRegistro: number | null;
  sequenciaAtual: number;
  notaSaude: number | null;
  /** Nomes dos orçamentos ultrapassados; null = orçamento mensal (geral) */
  orcamentosUltrapassados: (string | null)[];
  /** A meta ativa mais adiantada */
  metaMaisPerto: { nome: string; faltaCentavos: number; percentual: number } | null;
  nivel: number;
  xpFaltando: number | null;
};

export function estagioDoNivel(nivel: number) {
  let atual = ESTAGIOS[0];
  for (const e of ESTAGIOS) if (nivel >= e.nivelMinimo) atual = e;
  const proximo = ESTAGIOS[ESTAGIOS.indexOf(atual) + 1] ?? null;
  return { atual, proximo };
}

export function calcularPet(e: EntradaPet): EstadoPet {
  const nome = primeiroNome(e.nomeUsuario);
  const dias = e.diasSemRegistro;
  const energia = dias === null ? 50 : Math.max(0, 100 - dias * 20);

  let humor: HumorPet;
  if (dias === null) humor = 'tranquilo';
  else if (dias >= 7) humor = 'triste';
  else if (dias >= 3) humor = 'com-fome';
  else if (e.orcamentosUltrapassados.length > 0 || (e.notaSaude !== null && e.notaSaude < 40)) humor = 'preocupado';
  else if ((e.notaSaude ?? 0) >= 80 && e.sequenciaAtual >= 3) humor = 'radiante';
  else if ((e.notaSaude ?? 0) >= 60 || e.sequenciaAtual >= 3) humor = 'feliz';
  else humor = 'tranquilo';

  const falas: string[] = [];
  switch (humor) {
    case 'triste':
      falas.push(t('pet.f.triste', { n: dias ?? 0 }));
      break;
    case 'com-fome':
      falas.push(t('pet.f.fome', { n: dias ?? 0 }));
      break;
    case 'preocupado':
      if (e.orcamentosUltrapassados.length > 0) {
        const categoria = e.orcamentosUltrapassados[0];
        falas.push(categoria === null ? t('pet.f.orcGeral', { nome }) : t('pet.f.orcCategoria', { nome, categoria }));
      } else {
        falas.push(t('pet.f.preocupado'));
      }
      break;
    case 'radiante':
      falas.push(t('pet.f.radiante', { nome }));
      break;
    case 'feliz':
      falas.push(t('pet.f.feliz', { nome }));
      break;
    default:
      falas.push(
        dias === null
          ? t('pet.f.primeiro', { pet: e.nomePet })
          : t('pet.f.tranquilo', { nome }),
      );
  }

  if (e.sequenciaAtual >= 2) falas.push(t('pet.f.sequencia', { n: e.sequenciaAtual }));
  if (e.metaMaisPerto) {
    const m = e.metaMaisPerto;
    falas.push(
      m.percentual >= 50
        ? t('pet.f.quaseMeta', { valor: formatarCentavos(m.faltaCentavos), meta: m.nome })
        : t('pet.f.meta', { meta: m.nome, pct: Math.floor(m.percentual) }),
    );
  }

  const { atual, proximo } = estagioDoNivel(e.nivel);
  if (proximo && e.xpFaltando !== null) {
    falas.push(t('pet.f.xp', { xp: e.xpFaltando, nivel: proximo.nivelMinimo, estagio: proximo.nome }));
  }
  falas.push(t('pet.f.dica'));

  return {
    nome: e.nomePet,
    humor,
    estagio: atual.estagio,
    nomeEstagio: atual.nome,
    energia,
    falas,
    proximaEvolucao: proximo ? t('pet.evolucao', { estagio: proximo.nome, nivel: proximo.nivelMinimo }) : null,
  };
}

const CHAVE_NOME = 'pet_nome';
export const NOME_PADRAO_PET = 'Eco';

export function nomeDoPet() {
  return lerConfiguracao(CHAVE_NOME) ?? NOME_PADRAO_PET;
}

export function renomearPet(nome: string) {
  const limpo = nome.trim().replace(/\s+/g, ' ');
  if (!limpo) throw new ErroValidacao(t('pet.e.nome'));
  if (limpo.length > 16) throw new ErroValidacao(t('pet.e.max'));
  salvarConfiguracao(CHAVE_NOME, limpo);
}

export function obterPet(nomeUsuario: string, inicioConta: string | null = null): EstadoPet {
  const dataHoje = hoje();
  const registros = listarMomentosDeRegistro().map((m) => paraDataLocal(new Date(m)));
  const ultimo = registros.sort().at(-1) ?? null;
  const jornada = obterJornada(inicioConta);
  const orcamentos = obterOrcamentos(mesAtual());
  const metaMaisPerto =
    obterMetas()
      .filter((m) => !m.concluida)
      .sort((a, b) => b.percentual - a.percentual)[0] ?? null;

  return calcularPet({
    nomePet: nomeDoPet(),
    nomeUsuario,
    diasSemRegistro: ultimo ? Math.max(0, diasEntre(ultimo, dataHoje)) : null,
    sequenciaAtual: jornada.sequenciaAtual,
    notaSaude: obterSaude().nota,
    orcamentosUltrapassados: [orcamentos.geral, ...orcamentos.categorias]
      .filter((o) => o !== null && o.situacao === 'ultrapassou')
      .map((o) => (o!.categoriaId === null ? null : o!.nome)),
    metaMaisPerto: metaMaisPerto
      ? { nome: metaMaisPerto.nome, faltaCentavos: metaMaisPerto.faltaCentavos, percentual: metaMaisPerto.percentual }
      : null,
    nivel: jornada.nivel,
    xpFaltando: jornada.xpParaProximo !== null ? jornada.xpParaProximo - jornada.xpNoNivel : null,
  });
}
