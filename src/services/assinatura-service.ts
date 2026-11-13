/**
 * Planos do EcoTrust: Gratuito e EcoTrust Plus.
 *
 * IMPORTANTE (MVP): não existe cobrança real. "Assinar" ativa o Plus localmente, como simulação,
 * para validar o interesse pela assinatura. A integração com App Store / Google Play (e a checagem
 * do plano no servidor, para proteger a rota do chat) fica para uma etapa futura.
 */

import { t } from '@/i18n';
import { lerConfiguracao, salvarConfiguracao } from '@/repositories/configuracoes-repository';

export type Plano = 'gratuito' | 'plus';

export type RecursoPremium = 'analise' | 'saude' | 'chat' | 'academy';

export const NOME_PLANO_PLUS = 'EcoTrust Plus';

/** O que a assinatura inclui (usado no paywall e nos bloqueios). Textos no idioma atual. */
export const RECURSOS_PREMIUM: Record<RecursoPremium, { readonly nome: string; readonly descricao: string }> = {
  analise: {
    get nome() { return t('plus.analise.nome'); },
    get descricao() { return t('plus.analise.desc'); },
  },
  saude: {
    get nome() { return t('plus.saude.nome'); },
    get descricao() { return t('plus.saude.desc'); },
  },
  chat: {
    get nome() { return t('plus.chat.nome'); },
    get descricao() { return t('plus.chat.desc'); },
  },
  academy: {
    get nome() { return t('plus.academy.nome'); },
    get descricao() { return t('plus.academy.desc'); },
  },
};

/** O que continua grátis (mostrado no paywall para deixar claro). */
export function recursosGratuitos() {
  return [t('plus.gratis.1'), t('plus.gratis.2'), t('plus.gratis.3'), t('plus.gratis.4')];
}

const CHAVE_PLANO = 'plano';
const CHAVE_ATIVADO_EM = 'plano_ativado_em';

export type Assinatura = { plano: Plano; ativadoEm: string | null; simulada: boolean };

export function obterAssinatura(): Assinatura {
  const plano = lerConfiguracao(CHAVE_PLANO) === 'plus' ? 'plus' : 'gratuito';
  return {
    plano,
    ativadoEm: plano === 'plus' ? lerConfiguracao(CHAVE_ATIVADO_EM) : null,
    // Enquanto não houver loja integrada, toda assinatura é simulada.
    simulada: true,
  };
}

export function temAcesso(_recurso: RecursoPremium, assinatura = obterAssinatura()) {
  // Hoje todos os recursos premium fazem parte do mesmo plano.
  return assinatura.plano === 'plus';
}

/** Ativa o Plus sem cobrança (simulação do MVP). */
export function ativarPlusSimulado() {
  salvarConfiguracao(CHAVE_ATIVADO_EM, new Date().toISOString());
  salvarConfiguracao(CHAVE_PLANO, 'plus');
}

export function cancelarPlus() {
  salvarConfiguracao(CHAVE_PLANO, 'gratuito');
}
