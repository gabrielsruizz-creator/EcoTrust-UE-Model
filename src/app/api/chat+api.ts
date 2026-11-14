/**
 * Rota de servidor: recebe a conversa do app e consulta o Claude.
 * Corre no servidor (Expo Router API route), por isso a chave da API nunca vai para o telemóvel.
 * O app envia só totais (nunca a lista de movimentos) e o idioma escolhido.
 */

import Anthropic from '@anthropic-ai/sdk';

import { traduzir, type Chave } from '@/i18n';
import { ehIdioma, IDIOMA_PADRAO, type Idioma } from '@/i18n/idiomas';

const MAX_MENSAGENS = 20;
const MAX_CARACTERES = 4000;
/** O resumo dos dados (perfil, meses, orçamentos, metas e análise) pode ser maior que uma mensagem. */
const MAX_CONTEXTO = 12000;

const INSTRUCOES = `You are EcoTrust, the personal finance assistant of a budgeting app for people living in the European Union. You talk to ordinary people, many with no investing experience, and help them organise their budget and understand saving and investing in line with their profile.

How to work:
- Use the user's financial data and investor profile (sent below) to personalise answers. Quote their real numbers when it helps. The data contains only totals and summaries, never individual transactions.
- The data includes budgets, goals and an "automatic analysis" the app already shows. Stay consistent with those numbers; you may go deeper and explain, but do not contradict the analysis without saying why.
- Follow the usual order of financial education: first pay off expensive debt (credit card revolving credit, bank overdrafts), then build an emergency fund (about 3 to 6 months of essential spending, somewhere safe and quickly accessible), and only then invest for medium and long-term goals.
- When talking about investing, explain asset classes in general terms (deposits, government and corporate bonds, funds and ETFs, shares), their risk, liquidity and costs, and which ones usually suit the user's profile. Rules, products and taxes differ between EU countries: say so and suggest checking the official sources of the user's country.
- If the person has not answered the investor profile questionnaire, suggest doing it in the Profile tab before talking about risky investments.
- The app has a personal "tax meter": it estimates how much of the person's spending went to consumption taxes (VAT and excise duties, by the country where they bought) and how much of their income goes to income tax and social contributions (by country of residence). Use these numbers to explain everyday taxation. Make clear that most values are estimates (only taxes printed on an invoice are identified), and never encourage tax evasion or buying without an invoice.

Limits (important, because of EU rules - MiFID II and ESMA guidance):
- Your role is educational. Do not recommend specific financial instruments (tickers, ISINs, named funds or products from a specific firm) and never tell the person to buy or sell something. If asked, explain the features of the type of asset and suggest talking to an authorised firm or adviser, which in the EU must assess whether a product is suitable for them.
- Do not promise returns. Make clear that risky investments can lose value and that past performance does not guarantee future results.
- For questions outside personal finance, answer briefly and come back to the topic.

Format:
- Always reply in the language named in "Reply language" below, with simple, warm wording.
- Be brief: the answer appears on a phone screen. Prefer short paragraphs and simple lists with hyphens.
- Do not use Markdown (no **, #, tables): the app shows plain text.`;

const NOME_DO_IDIOMA: Record<Idioma, string> = {
  'pt-PT': 'European Portuguese (Portugal)',
  en: 'English',
  es: 'Spanish (Spain)',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  nl: 'Dutch',
  pl: 'Polish',
};

type MensagemApp = { role: 'user' | 'assistant'; content: string };

function validarMensagens(valor: unknown): MensagemApp[] | null {
  if (!Array.isArray(valor) || valor.length === 0) return null;
  const mensagens = valor.slice(-MAX_MENSAGENS);
  for (const m of mensagens) {
    if (
      typeof m !== 'object' ||
      m === null ||
      (m.role !== 'user' && m.role !== 'assistant') ||
      typeof m.content !== 'string' ||
      m.content.length > MAX_CARACTERES
    ) {
      return null;
    }
  }
  // A conversa enviada ao Claude precisa começar com uma mensagem do usuário.
  while (mensagens.length > 0 && mensagens[0].role !== 'user') mensagens.shift();
  return mensagens.length > 0 ? (mensagens as MensagemApp[]) : null;
}

export async function POST(request: Request) {
  let corpo: { mensagens?: unknown; contexto?: unknown; idioma?: unknown };
  try {
    corpo = await request.json();
  } catch {
    return Response.json({ erro: traduzir(IDIOMA_PADRAO, 'api.invalida') }, { status: 400 });
  }

  // Idioma escolhido no app: a resposta e as mensagens de erro vêm nele.
  const idioma: Idioma = typeof corpo.idioma === 'string' && ehIdioma(corpo.idioma) ? corpo.idioma : IDIOMA_PADRAO;
  const tr = (chave: Chave) => traduzir(idioma, chave);

  const mensagens = validarMensagens(corpo.mensagens);
  const contexto = typeof corpo.contexto === 'string' ? corpo.contexto.slice(0, MAX_CONTEXTO) : '';
  if (!mensagens) {
    return Response.json({ erro: tr('api.mensagensInvalidas') }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    // Para quem desenvolve: pôr ANTHROPIC_API_KEY em .env.local (dev) ou num segredo do EAS (produção).
    console.error('ANTHROPIC_API_KEY não configurada.');
    return Response.json({ erro: tr('api.semChave') }, { status: 500 });
  }

  try {
    const client = new Anthropic();
    const resposta = await client.beta.messages.create({
      model: 'claude-opus-5-5',
      max_tokens: 16000,
      output_config: { effort: 'medium' },
      // Se o modelo recusar por segurança, a API tenta automaticamente outro modelo.
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: [
        { type: 'text', text: INSTRUCOES },
        { type: 'text', text: `Reply language: ${NOME_DO_IDIOMA[idioma]}\n\nUser data:\n${contexto || 'No data available.'}` },
      ],
      messages: mensagens,
    });

    if (resposta.stop_reason === 'refusal') {
      return Response.json({ resposta: tr('api.recusa') });
    }

    const texto = resposta.content
      .filter((bloco) => bloco.type === 'text')
      .map((bloco) => bloco.text)
      .join('\n')
      .trim();

    return Response.json({ resposta: texto || tr('api.semTexto') });
  } catch (erro) {
    if (erro instanceof Anthropic.AuthenticationError) {
      console.error('ANTHROPIC_API_KEY inválida.');
      return Response.json({ erro: tr('api.chaveInvalida') }, { status: 500 });
    }
    if (erro instanceof Anthropic.RateLimitError) {
      return Response.json({ erro: tr('api.limite') }, { status: 429 });
    }
    if (erro instanceof Anthropic.APIError) {
      console.error('Erro da API do Claude:', erro.status, erro.message);
      return Response.json({ erro: tr('api.indisponivel') }, { status: 502 });
    }
    console.error('Erro inesperado no /api/chat:', erro);
    return Response.json({ erro: tr('api.inesperado') }, { status: 500 });
  }
}
