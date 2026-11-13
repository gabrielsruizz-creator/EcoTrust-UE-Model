/**
 * Roteiro do chat de cadastro: o EcoTrust conversa com a pessoa e monta o perfil financeiro,
 * a situação (dívidas, reserva, investimentos) e as metas.
 *
 * Funciona como uma máquina de estados simples: `passoAtual` olha o que já foi respondido e
 * devolve a próxima pergunta; `responder` valida a resposta e devolve as respostas atualizadas.
 * Tudo é puro (sem banco) até `concluirChat`, que salva o resultado.
 */

import { localeAtual, t } from '@/i18n';
import { salvarSituacaoFinanceira } from '@/repositories/situacao-repository';
import { ErroValidacao } from '@/services/erros';
import { adicionarMeta, obterMetas } from '@/services/metas-service';
import {
  FONTES_RENDA,
  OBJETIVOS,
  primeiroNome,
  rotuloFonteRenda,
  rotuloObjetivo,
  salvarPerfil,
  sugerirMetasEconomia,
  validarPerfilFinanceiro,
} from '@/services/perfil-financeiro-service';
import type {
  FonteRenda,
  ObjetivoFinanceiro,
  SituacaoDividas,
  SituacaoInvestimentos,
  SituacaoReserva,
} from '@/types/financas';
import { hoje, nomeDoMes, somarMesesNaData } from '@/utils/datas';
import { centavosParaTexto, formatarCentavos, lerValorEmCentavos } from '@/utils/moeda';

export type MetaDesejada = {
  nome: string;
  /** Id da sugestão escolhida (ex.: 'reserva'); ausente quando a pessoa escreveu o nome. */
  sonho?: string;
  valorCentavos?: number;
  /** null = sem prazo; undefined = ainda não respondeu */
  prazoMeses?: number | null;
  /** Valor que a pessoa já tem guardado para esta meta */
  inicialCentavos: number;
};

export type RespostasChat = {
  nome?: string;
  rendaCentavos?: number;
  fonte?: FonteRenda;
  fixasCentavos?: number;
  dividas?: SituacaoDividas;
  reserva?: SituacaoReserva;
  reservaValorCentavos?: number;
  investe?: SituacaoInvestimentos;
  objetivo?: ObjetivoFinanceiro;
  /** Ids das sugestões escolhidas (ver SONHOS). */
  sonhos?: string[];
  outraMeta?: string;
  metas?: MetaDesejada[];
  metaEconomiaCentavos?: number;
  confirmado?: boolean;
};

export type Opcao = { valor: string; rotulo: string };

export type Entrada =
  | { tipo: 'texto'; placeholder: string; sugestoes?: Opcao[] }
  | { tipo: 'valor'; permitirZero: boolean; sugestoes?: Opcao[] }
  | { tipo: 'opcoes'; opcoes: Opcao[] }
  | { tipo: 'multipla'; opcoes: Opcao[]; exclusiva?: string };

export type PassoChat = { id: string; mensagens: string[]; entrada: Entrada };

export type ResultadoResposta = { respostas: RespostasChat; textoUsuario: string; reacao: string | null };

function opcoes(prefixo: string, valores: string[]): Opcao[] {
  return valores.map((valor) => ({ valor, rotulo: t(`${prefixo}.${valor}` as never) }));
}
const opcoesDividas = () => opcoes('chat.div', ['nao', 'controlada', 'pesando']);
const opcoesReserva = () => opcoes('chat.res', ['nao', 'parcial', 'completa']);
const opcoesInveste = () => opcoes('chat.inv', ['nao', 'poupanca', 'outros']);
const opcoesPrazo = () => opcoes('chat.prazo', ['6', '12', '24', '60', 'sem']);

const RESERVA = 'reserva';
const OUTRA = 'outra';
const NENHUMA = 'nenhuma';

function rotuloDe(opcoes: Opcao[], valor: string) {
  return opcoes.find((o) => o.valor === valor)?.rotulo ?? valor;
}

function opcoesSonhos(r: RespostasChat): Opcao[] {
  const ids = [
    ...(r.reserva !== 'completa' ? [RESERVA] : []),
    ...(r.dividas && r.dividas !== 'nao' ? ['dividas'] : []),
    'viagem',
    'carro',
    'casa',
    'estudos',
    'reforma',
    OUTRA,
    NENHUMA,
  ];
  return opcoes('chat.sonho', ids);
}

/** Quanto guardar por mês para cumprir todas as metas com prazo. */
export function somaMensalDasMetas(metas: MetaDesejada[] = []) {
  return metas.reduce((soma, m) => {
    if (!m.valorCentavos || !m.prazoMeses) return soma;
    return soma + Math.ceil(Math.max(0, m.valorCentavos - m.inicialCentavos) / m.prazoMeses);
  }, 0);
}

function sobra(r: RespostasChat) {
  return (r.rendaCentavos ?? 0) - (r.fixasCentavos ?? 0);
}

function linhasResumo(r: RespostasChat) {
  const linhas = [
    t('chat.res.renda', { valor: formatarCentavos(r.rendaCentavos ?? 0), fonte: rotuloFonteRenda(r.fonte ?? 'outra') }),
    t('chat.res.fixas', { valor: formatarCentavos(r.fixasCentavos ?? 0) }),
    t('chat.res.dividas', { valor: rotuloDe(opcoesDividas(), r.dividas ?? 'nao') }),
    t('chat.res.reserva', { valor: rotuloDe(opcoesReserva(), r.reserva ?? 'nao') }),
    t('chat.res.objetivo', { valor: rotuloObjetivo(r.objetivo ?? 'controlar') }),
    t('chat.res.guardar', { valor: formatarCentavos(r.metaEconomiaCentavos ?? 0) }),
  ];
  for (const m of r.metas ?? []) {
    const valor = formatarCentavos(m.valorCentavos ?? 0);
    linhas.push(
      m.prazoMeses
        ? t('chat.res.metaPrazo', { nome: m.nome, valor, meses: t('chat.meses', { n: m.prazoMeses }) })
        : t('chat.res.meta', { nome: m.nome, valor }),
    );
  }
  return linhas.map((l) => `• ${l}`).join('\n');
}

/** Próxima pergunta, ou null quando a conversa terminou (resumo confirmado). */
export function passoAtual(r: RespostasChat, nomeConta?: string): PassoChat | null {
  if (r.nome === undefined) {
    const sugerido = nomeConta ? primeiroNome(nomeConta) : '';
    return {
      id: 'nome',
      mensagens: [
        t('chat.ola1'),
        t('chat.ola2'),
        t('chat.ola3'),
      ],
      entrada: {
        tipo: 'texto',
        placeholder: t('acesso.nome'),
        sugestoes: sugerido ? [{ valor: sugerido, rotulo: sugerido }] : undefined,
      },
    };
  }
  if (r.rendaCentavos === undefined) {
    return {
      id: 'renda',
      mensagens: [
        t('chat.prazer', { nome: r.nome }),
        t('chat.renda'),
      ],
      entrada: { tipo: 'valor', permitirZero: true },
    };
  }
  if (r.fonte === undefined) {
    return {
      id: 'fonte',
      mensagens: [t('chat.fonte')],
      entrada: { tipo: 'opcoes', opcoes: FONTES_RENDA.map((f) => ({ valor: f.valor, rotulo: f.rotulo })) },
    };
  }
  if (r.fixasCentavos === undefined) {
    return {
      id: 'fixas',
      mensagens: [
        t('chat.fixas1'),
        t('chat.fixas2'),
      ],
      entrada: { tipo: 'valor', permitirZero: true },
    };
  }
  if (r.dividas === undefined) {
    return {
      id: 'dividas',
      mensagens: [t('chat.dividas')],
      entrada: { tipo: 'opcoes', opcoes: opcoesDividas() },
    };
  }
  if (r.reserva === undefined) {
    return {
      id: 'reserva',
      mensagens: [t('chat.reserva')],
      entrada: { tipo: 'opcoes', opcoes: opcoesReserva() },
    };
  }
  if (r.reserva === 'parcial' && r.reservaValorCentavos === undefined) {
    return {
      id: 'reserva-valor',
      mensagens: [t('chat.reservaValor')],
      entrada: { tipo: 'valor', permitirZero: true },
    };
  }
  if (r.investe === undefined) {
    return {
      id: 'investe',
      mensagens: [t('chat.investe')],
      entrada: { tipo: 'opcoes', opcoes: opcoesInveste() },
    };
  }
  if (r.objetivo === undefined) {
    return {
      id: 'objetivo',
      mensagens: [t('chat.objetivo')],
      entrada: { tipo: 'opcoes', opcoes: OBJETIVOS.map((o) => ({ valor: o.valor, rotulo: o.rotulo })) },
    };
  }
  if (r.sonhos === undefined) {
    return {
      id: 'sonhos',
      mensagens: [
        t('chat.sonhos1'),
        t('chat.sonhos2'),
      ],
      entrada: { tipo: 'multipla', opcoes: opcoesSonhos(r), exclusiva: NENHUMA },
    };
  }
  if (r.sonhos.includes(OUTRA) && r.outraMeta === undefined) {
    return {
      id: 'outra-meta',
      mensagens: [t('chat.outraMeta')],
      entrada: { tipo: 'texto', placeholder: t('chat.outraMeta.ex') },
    };
  }
  const indice = (r.metas ?? []).findIndex((m) => m.valorCentavos === undefined || m.prazoMeses === undefined);
  if (indice >= 0) {
    const meta = r.metas![indice];
    if (meta.valorCentavos === undefined) {
      const sugestoes: Opcao[] = [];
      if (meta.sonho === RESERVA && (r.fixasCentavos ?? 0) > 0) {
        const seisMeses = (r.fixasCentavos ?? 0) * 6;
        sugestoes.push({ valor: String(seisMeses), rotulo: t('chat.seisMeses', { valor: formatarCentavos(seisMeses) }) });
      }
      return {
        id: `meta-valor:${indice}`,
        mensagens: [t('chat.metaValor', { nome: meta.nome })],
        entrada: { tipo: 'valor', permitirZero: false, sugestoes },
      };
    }
    return {
      id: `meta-prazo:${indice}`,
      mensagens: [t('chat.metaPrazo', { nome: meta.nome })],
      entrada: { tipo: 'opcoes', opcoes: opcoesPrazo() },
    };
  }
  if (r.metaEconomiaCentavos === undefined) {
    const sugestoes: Opcao[] = [];
    const paraMetas = somaMensalDasMetas(r.metas);
    if (paraMetas > 0) {
      sugestoes.push({ valor: String(paraMetas), rotulo: t('chat.paraMetas', { valor: formatarCentavos(paraMetas) }) });
    }
    for (const s of sugerirMetasEconomia(r.rendaCentavos ?? 0, r.fixasCentavos ?? 0)) {
      if (s !== paraMetas) sugestoes.push({ valor: String(s), rotulo: formatarCentavos(s) });
    }
    sugestoes.push({ valor: '0', rotulo: t('chat.naoSei') });
    return {
      id: 'economia',
      mensagens: [t('chat.economia')],
      entrada: { tipo: 'valor', permitirZero: true, sugestoes },
    };
  }
  if (!r.confirmado) {
    return {
      id: 'resumo',
      mensagens: [t('chat.resumo1'), linhasResumo(r), t('chat.resumo2')],
      entrada: {
        tipo: 'opcoes',
        opcoes: [
          { valor: 'sim', rotulo: t('chat.confirmar') },
          { valor: 'refazer', rotulo: t('chat.recomecar') },
        ],
      },
    };
  }
  return null;
}

function lerValor(texto: string, permitirZero: boolean) {
  const valor = lerValorEmCentavos(texto, permitirZero);
  if (valor === null) {
    throw new ErroValidacao(
      permitirZero ? t('chat.e.valor', { exemplo: centavosParaTexto(250050) }) : t('chat.e.maiorZero'),
    );
  }
  return valor;
}

function exigirOpcao(opcoes: Opcao[], valor: string) {
  if (!opcoes.some((o) => o.valor === valor)) throw new ErroValidacao(t('chat.e.opcao'));
  return valor;
}

/** Registra a resposta do passo atual. Lança ErroValidacao com a mensagem para mostrar no chat. */
export function responder(r: RespostasChat, passo: PassoChat, resposta: string | string[]): ResultadoResposta {
  const texto = Array.isArray(resposta) ? '' : resposta.trim();
  const [id, indiceTexto] = passo.id.split(':');

  switch (id) {
    case 'nome': {
      const nome = texto.replace(/\s+/g, ' ');
      if (nome.length < 1 || nome.length > 40) throw new ErroValidacao(t('chat.e.nome'));
      return { respostas: { ...r, nome }, textoUsuario: nome, reacao: null };
    }
    case 'renda': {
      const renda = lerValor(texto, true);
      return {
        respostas: { ...r, rendaCentavos: renda },
        textoUsuario: formatarCentavos(renda),
        reacao: renda === 0 ? t('chat.r.rendaZero') : null,
      };
    }
    case 'fonte': {
      const fonte = exigirOpcao(FONTES_RENDA.map((f) => ({ valor: f.valor, rotulo: f.rotulo })), texto) as FonteRenda;
      return { respostas: { ...r, fonte }, textoUsuario: rotuloFonteRenda(fonte), reacao: null };
    }
    case 'fixas': {
      const fixas = lerValor(texto, true);
      const novas = { ...r, fixasCentavos: fixas };
      const resto = sobra(novas);
      let reacao: string | null = null;
      if ((r.rendaCentavos ?? 0) > 0) {
        reacao =
          resto >= 0
            ? t('chat.r.sobra', { valor: formatarCentavos(resto) })
            : t('chat.r.passou');
      }
      return { respostas: novas, textoUsuario: formatarCentavos(fixas), reacao };
    }
    case 'dividas': {
      const dividas = exigirOpcao(opcoesDividas(), texto) as SituacaoDividas;
      return {
        respostas: { ...r, dividas },
        textoUsuario: rotuloDe(opcoesDividas(), dividas),
        reacao:
          dividas === 'pesando'
            ? t('chat.r.pesando')
            : dividas === 'controlada'
              ? t('chat.r.controlada')
              : null,
      };
    }
    case 'reserva': {
      const reserva = exigirOpcao(opcoesReserva(), texto) as SituacaoReserva;
      return {
        respostas: { ...r, reserva, reservaValorCentavos: reserva === 'parcial' ? undefined : 0 },
        textoUsuario: rotuloDe(opcoesReserva(), reserva),
        reacao:
          reserva === 'nao'
            ? t('chat.r.semReserva')
            : reserva === 'completa'
              ? t('chat.r.reservaCompleta')
              : null,
      };
    }
    case 'reserva-valor': {
      const valor = lerValor(texto, true);
      return { respostas: { ...r, reservaValorCentavos: valor }, textoUsuario: formatarCentavos(valor), reacao: null };
    }
    case 'investe': {
      const investe = exigirOpcao(opcoesInveste(), texto) as SituacaoInvestimentos;
      return { respostas: { ...r, investe }, textoUsuario: rotuloDe(opcoesInveste(), investe), reacao: null };
    }
    case 'objetivo': {
      const objetivo = exigirOpcao(OBJETIVOS.map((o) => ({ valor: o.valor, rotulo: o.rotulo })), texto) as ObjetivoFinanceiro;
      return { respostas: { ...r, objetivo }, textoUsuario: rotuloObjetivo(objetivo), reacao: null };
    }
    case 'sonhos': {
      const escolhidos = Array.isArray(resposta) ? resposta : [];
      const opcoesValidas = opcoesSonhos(r);
      const validos = opcoesValidas.map((o) => o.valor);
      if (escolhidos.length === 0 || escolhidos.some((s) => !validos.includes(s))) {
        throw new ErroValidacao(t('chat.e.umaOpcao'));
      }
      const sonhos = escolhidos.includes(NENHUMA) ? [] : escolhidos;
      const metas: MetaDesejada[] = sonhos
        .filter((s) => s !== OUTRA)
        .map((sonho) => ({
          nome: rotuloDe(opcoesValidas, sonho),
          sonho,
          inicialCentavos: sonho === RESERVA ? (r.reservaValorCentavos ?? 0) : 0,
        }));
      return {
        respostas: { ...r, sonhos, metas },
        textoUsuario: escolhidos.map((s) => rotuloDe(opcoesValidas, s)).join(', '),
        reacao: sonhos.length === 0 ? t('chat.r.semMetas', { aba: t('abas.metas') }) : null,
      };
    }
    case 'outra-meta': {
      const nome = texto.replace(/\s+/g, ' ');
      if (nome.length < 1 || nome.length > 40) throw new ErroValidacao(t('chat.e.nomeMeta'));
      return {
        respostas: { ...r, outraMeta: nome, metas: [...(r.metas ?? []), { nome, inicialCentavos: 0 }] },
        textoUsuario: nome,
        reacao: null,
      };
    }
    case 'meta-valor': {
      const i = Number(indiceTexto);
      const valor = lerValor(texto, false);
      const metas = (r.metas ?? []).map((m, k) => (k === i ? { ...m, valorCentavos: valor } : m));
      return { respostas: { ...r, metas }, textoUsuario: formatarCentavos(valor), reacao: null };
    }
    case 'meta-prazo': {
      const i = Number(indiceTexto);
      const escolha = exigirOpcao(opcoesPrazo(), texto);
      const prazoMeses = escolha === 'sem' ? null : Number(escolha);
      const metas = (r.metas ?? []).map((m, k) => (k === i ? { ...m, prazoMeses } : m));
      const meta = metas[i];
      let reacao: string | null = null;
      if (prazoMeses && meta.valorCentavos) {
        const porMes = Math.ceil(Math.max(0, meta.valorCentavos - meta.inicialCentavos) / prazoMeses);
        const data = somarMesesNaData(hoje(), prazoMeses);
        reacao =
          porMes > 0
            ? t('chat.r.porMes', { mes: nomeDoMes(data.slice(0, 7)), valor: formatarCentavos(porMes) })
            : t('chat.r.jaTem');
      }
      return { respostas: { ...r, metas }, textoUsuario: rotuloDe(opcoesPrazo(), escolha), reacao };
    }
    case 'economia': {
      const valor = lerValor(texto, true);
      const resto = sobra(r);
      const reacao =
        valor > 0 && (r.rendaCentavos ?? 0) > 0 && valor > Math.max(resto, 0)
          ? t('chat.r.maisQueSobra', { valor: formatarCentavos(Math.max(resto, 0)) })
          : null;
      return {
        respostas: { ...r, metaEconomiaCentavos: valor },
        textoUsuario: valor === 0 ? t('chat.naoSei') : formatarCentavos(valor),
        reacao,
      };
    }
    case 'resumo': {
      if (texto === 'refazer') {
        return { respostas: {}, textoUsuario: t('chat.recomecar'), reacao: t('chat.r.denovo') };
      }
      exigirOpcao([{ valor: 'sim', rotulo: '' }], texto);
      return { respostas: { ...r, confirmado: true }, textoUsuario: t('chat.confirmar'), reacao: null };
    }
    default:
      throw new ErroValidacao(t('chat.e.desconhecida'));
  }
}

/**
 * Salva tudo o que a conversa coletou. As metas e a situação são salvas antes do perfil,
 * porque salvar o perfil libera o app (o Expo Router sai do cadastro sozinho).
 * Ao refazer a conversa depois, `pularMetasExistentes` evita duplicar metas com o mesmo nome.
 */
export function concluirChat(r: RespostasChat, opcoes: { pularMetasExistentes?: boolean } = {}) {
  if (
    !r.confirmado ||
    r.nome === undefined ||
    r.rendaCentavos === undefined ||
    r.fonte === undefined ||
    r.fixasCentavos === undefined ||
    r.dividas === undefined ||
    r.reserva === undefined ||
    r.investe === undefined ||
    r.objetivo === undefined ||
    r.metaEconomiaCentavos === undefined
  ) {
    throw new ErroValidacao(t('chat.e.naoTerminou'));
  }

  const perfil = validarPerfilFinanceiro({
    nome: r.nome,
    rendaMensalCentavos: r.rendaCentavos,
    fonteRenda: r.fonte,
    despesasFixasCentavos: r.fixasCentavos,
    objetivo: r.objetivo,
    metaEconomiaCentavos: r.metaEconomiaCentavos,
  });

  salvarSituacaoFinanceira({ dividas: r.dividas, reserva: r.reserva, investe: r.investe });
  const existentes = new Set(
    opcoes.pularMetasExistentes ? obterMetas().map((m) => m.nome.toLocaleLowerCase(localeAtual())) : [],
  );
  for (const m of r.metas ?? []) {
    if (!m.valorCentavos || existentes.has(m.nome.toLocaleLowerCase(localeAtual()))) continue;
    adicionarMeta(
      {
        nome: m.nome,
        objetivoCentavos: m.valorCentavos,
        prazo: m.prazoMeses ? somarMesesNaData(hoje(), m.prazoMeses) : null,
      },
      Math.min(m.inicialCentavos, m.valorCentavos),
    );
  }
  salvarPerfil(perfil);
}
