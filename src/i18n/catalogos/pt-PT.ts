/**
 * Catálogo de referência (português de Portugal). Toda chave nova entra aqui primeiro;
 * o TypeScript obriga os outros idiomas a terem as mesmas chaves.
 * Atenção: é português EUROPEU (telemóvel, registar, utilizador, definições...), não do Brasil.
 */

export const ptPT = {
  // Comum
  'comum.erroGuardar': 'Não foi possível guardar',
  'comum.tenteNovamente': 'Tente novamente.',
  'comum.dias': { one: '{n} dia', other: '{n} dias' },

  // Abas
  'abas.inicio': 'Início',
  'abas.transacoes': 'Transações',
  'abas.adicionar': 'Adicionar',
  'abas.metas': 'Metas',
  'abas.perfil': 'Perfil',

  // Preferências
  'pref.aparencia': 'Aparência',
  'pref.tema.sistema': 'Do sistema',
  'pref.tema.claro': 'Claro',
  'pref.tema.escuro': 'Escuro',
  'pref.idioma': 'Idioma',
  'pref.idioma.aparelho': 'Do dispositivo',
  'pref.idioma.descricao': 'O idioma não altera o país de residência fiscal nem a moeda.',
  'pref.vidro': 'Efeito vidro (Liquid Glass)',
  'pref.vidro.nativo': 'Cartões de vidro do iOS. Desative para cartões sólidos.',
  'pref.vidro.simulado': 'Vidro simulado (o efeito nativo existe a partir do iOS 26). Desative para cartões sólidos.',
  'pref.vidro.desligado': 'Cartões sólidos, estilo papel. Ative para ver os cartões de vidro.',
  'pref.diaPagamento': 'Dia do pagamento',
  'pref.diaPagamento.descricao': 'Dia do mês em que recebe o salário',
  'pref.diaPagamento.rotulo': 'Dia do pagamento, de 1 a 31',
  'pref.lembreteDiario': 'Lembrete diário',
  'pref.lembreteDiario.descricao': 'Para registar as despesas do dia',
  'pref.lembreteDiario.horario': 'Hora do lembrete',
  'pref.hora': '{h}h',
  'pref.lembretePagamento': 'Lembrete no dia do pagamento',
  'pref.lembretePagamento.descricao': 'Para pôr primeiro de parte o dinheiro das metas',
  'pref.lembretePagamento.semDia': 'Indique o dia do pagamento acima',
  'pref.biometria': 'Entrar com biometria',
  'pref.notificacoesDesligadas.titulo': 'Notificações desativadas',
  'pref.notificacoesDesligadas.texto':
    'Para receber lembretes, permita as notificações do EcoTrust nas definições do telemóvel.',
  'pref.biometriaFalhou.titulo': 'Biometria não ativada',
  'pref.biometriaFalhou.texto': 'Não foi possível confirmar a impressão digital ou o Face ID.',
  'pref.erro.tema': 'Tema inválido.',
  'pref.erro.vidro': 'Opção de vidro inválida.',
  'pref.erro.idioma': 'Idioma inválido.',
  'pref.erro.dia': 'O dia do pagamento deve ser de 1 a 31.',
  'pref.erro.hora': 'Hora do lembrete inválida.',
  'pref.erro.lembreteSemDia': 'Indique o dia do pagamento para receber esse lembrete.',

  // Notificações
  'notif.canal': 'Lembretes',
  'notif.diario.texto': 'Já registou as despesas de hoje? Demora menos de um minuto.',
  'notif.pagamento.titulo': 'Dia de pagamento',
  'notif.pagamento.texto': 'Que tal pôr primeiro de parte o valor das suas metas? Pague-se a si primeiro!',

  // Perfil fiscal
  'fiscal.erro.pais': 'País de residência inválido.',
  'fiscal.erro.regiao': 'Região inválida para este país.',
  'fiscal.erro.situacao': 'Situação profissional inválida.',
  'fiscal.erro.rendimento': 'Rendimento anual inválido. Verifique o valor.',
  'fiscal.erro.dependentes': 'Número de dependentes inválido.',
  'fiscal.erro.combustivel': 'Tipo de combustível inválido.',
} as const;
