/**
 * Fórum da Trust Academy (protótipo local).
 * Por enquanto tudo fica no aparelho: tópicos de exemplo + o que o usuário publica.
 * As regras de validação e privacidade já valem para quando o fórum for online.
 */

import { CATEGORIAS_ACADEMY } from '@/data/academy-conteudo';
import { t, type Chave } from '@/i18n';
import {
  apagarRespostaMinha,
  apagarTopicoMeu,
  buscarTopico,
  inserirResposta,
  inserirTopico,
  listarRespostas,
  listarTopicos,
  type RespostaForum,
  type TopicoForum,
} from '@/repositories/forum-repository';
import { obterConta } from '@/services/conta-service';
import { ErroValidacao } from '@/services/erros';

export const LIMITES_FORUM = {
  titulo: { min: 5, max: 120 },
  texto: { min: 10, max: 2000 },
  resposta: { min: 2, max: 1000 },
} as const;

/** Regras do fórum no idioma atual. */
export function regrasForum() {
  return [t('forum.regra1'), t('forum.regra2'), t('forum.regra3'), t('forum.regra4')];
}

/**
 * Os tópicos de exemplo foram gravados pela migração v10 (em português do Brasil). Há um por
 * categoria, por isso são reconhecidos pela categoria; as respostas, pela ordem. O texto mostrado
 * vem sempre do idioma atual. O que a pessoa publica não muda.
 */
function exemploTraduzido(categoriaId: string, campo: string): string | null {
  const chave = `forum.ex.${categoriaId}.${campo}` as Chave;
  const texto = t(chave);
  return texto === chave ? null : texto;
}

function traduzirTopico(topico: TopicoForum): TopicoForum {
  if (!topico.exemplo) return topico;
  return {
    ...topico,
    titulo: exemploTraduzido(topico.categoriaId, 'titulo') ?? topico.titulo,
    texto: exemploTraduzido(topico.categoriaId, 'texto') ?? topico.texto,
  };
}

function traduzirRespostas(topico: TopicoForum, respostas: RespostaForum[]): RespostaForum[] {
  if (!topico.exemplo) return respostas;
  let indice = 0;
  return respostas.map((r) => {
    if (!r.exemplo) return r;
    const texto = exemploTraduzido(topico.categoriaId, `r${indice++}`);
    return texto ? { ...r, texto } : r;
  });
}

/**
 * Bloqueia dados pessoais que costumam aparecer por engano: e-mails e sequências longas
 * de números (CPF, cartão, conta, telefone), mesmo com pontos, traços ou espaços.
 */
export function contemDadosPessoais(texto: string): boolean {
  if (/[^\s@]+@[^\s@]+\.[^\s@]+/.test(texto)) return true;
  const soDigitosJuntos = texto.replace(/(\d)[\s.\-/()]+(?=\d)/g, '$1');
  return /\d{10,}/.test(soDigitosJuntos);
}

function validarTexto(valor: string, campo: string, limites: { min: number; max: number }) {
  const limpo = valor.trim().replace(/\n{3,}/g, '\n\n');
  if (limpo.length < limites.min) throw new ErroValidacao(t('forum.e.min', { campo, min: limites.min }));
  if (limpo.length > limites.max) throw new ErroValidacao(t('forum.e.max', { campo, max: limites.max }));
  if (contemDadosPessoais(limpo)) {
    throw new ErroValidacao(t('forum.e.dados'));
  }
  return limpo;
}

/** Nome mostrado nas publicações: só o primeiro nome da conta. */
function nomeDoAutor() {
  return obterConta()?.nome.trim().split(/\s+/)[0] || t('forum.voce');
}

export function obterForum(categoriaId: string | null) {
  return { topicos: listarTopicos(categoriaId).map(traduzirTopico), categorias: CATEGORIAS_ACADEMY };
}

export function obterTopico(id: number) {
  const topico = buscarTopico(id);
  if (!topico) return null;
  return {
    topico: traduzirTopico(topico),
    categoria: CATEGORIAS_ACADEMY.find((c) => c.id === topico.categoriaId) ?? null,
    respostas: traduzirRespostas(topico, listarRespostas(id)),
  };
}

export function criarTopico(dados: { categoriaId: string; titulo: string; texto: string }): number {
  if (!CATEGORIAS_ACADEMY.some((c) => c.id === dados.categoriaId)) throw new ErroValidacao(t('forum.e.tema'));
  const titulo = validarTexto(dados.titulo, t('forum.campo.titulo'), LIMITES_FORUM.titulo);
  const texto = validarTexto(dados.texto, t('forum.campo.mensagem'), LIMITES_FORUM.texto);
  return inserirTopico({ categoriaId: dados.categoriaId, titulo, texto, autor: nomeDoAutor() });
}

export function responderTopico(topicoId: number, texto: string): number {
  if (!buscarTopico(topicoId)) throw new ErroValidacao(t('forum.e.naoExiste'));
  const limpo = validarTexto(texto, t('forum.campo.resposta'), LIMITES_FORUM.resposta);
  return inserirResposta({ topicoId, texto: limpo, autor: nomeDoAutor() });
}

export function excluirTopico(id: number) {
  if (!apagarTopicoMeu(id)) throw new ErroValidacao(t('forum.e.soTopicosMeus'));
}

export function excluirResposta(id: number) {
  if (!apagarRespostaMinha(id)) throw new ErroValidacao(t('forum.e.soRespostasMinhas'));
}
