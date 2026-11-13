import type { Catalogo } from '@/i18n/tipos';

export const fr: Catalogo = {
  'comum.erroGuardar': "Impossible d'enregistrer",
  'comum.tenteNovamente': 'Veuillez réessayer.',
  'comum.dias': { one: '{n} jour', other: '{n} jours' },

  'abas.inicio': 'Accueil',
  'abas.transacoes': 'Transactions',
  'abas.adicionar': 'Ajouter',
  'abas.metas': 'Objectifs',
  'abas.perfil': 'Profil',

  'pref.aparencia': 'Apparence',
  'pref.tema.sistema': 'Système',
  'pref.tema.claro': 'Clair',
  'pref.tema.escuro': 'Sombre',
  'pref.idioma': 'Langue',
  'pref.idioma.aparelho': "Langue de l'appareil",
  'pref.idioma.descricao': 'La langue ne modifie ni votre résidence fiscale ni votre devise.',
  'pref.vidro': 'Effet verre (Liquid Glass)',
  'pref.vidro.nativo': "Cartes en verre d'iOS. Désactivez pour des cartes opaques.",
  'pref.vidro.simulado':
    "Verre simulé (l'effet natif nécessite iOS 26 ou version ultérieure). Désactivez pour des cartes opaques.",
  'pref.vidro.desligado': 'Cartes opaques, style papier. Activez pour voir les cartes en verre.',
  'pref.diaPagamento': 'Jour de paie',
  'pref.diaPagamento.descricao': 'Jour du mois où vous recevez votre salaire',
  'pref.diaPagamento.rotulo': 'Jour de paie, de 1 à 31',
  'pref.lembreteDiario': 'Rappel quotidien',
  'pref.lembreteDiario.descricao': 'Pour noter les dépenses du jour',
  'pref.lembreteDiario.horario': 'Heure du rappel',
  'pref.hora': '{h} h',
  'pref.lembretePagamento': 'Rappel le jour de paie',
  'pref.lembretePagamento.descricao': "Pour mettre d'abord de côté pour vos objectifs",
  'pref.lembretePagamento.semDia': 'Indiquez votre jour de paie ci-dessus',
  'pref.biometria': 'Se connecter avec la biométrie',
  'pref.notificacoesDesligadas.titulo': 'Notifications désactivées',
  'pref.notificacoesDesligadas.texto':
    "Pour recevoir des rappels, autorisez les notifications d'EcoTrust dans les réglages du téléphone.",
  'pref.biometriaFalhou.titulo': 'Biométrie non activée',
  'pref.biometriaFalhou.texto': "Impossible de confirmer votre empreinte digitale ou Face ID.",
  'pref.erro.tema': 'Thème non valide.',
  'pref.erro.vidro': "Option d'effet verre non valide.",
  'pref.erro.idioma': 'Langue non valide.',
  'pref.erro.dia': 'Le jour de paie doit être compris entre 1 et 31.',
  'pref.erro.hora': 'Heure du rappel non valide.',
  'pref.erro.lembreteSemDia': 'Indiquez votre jour de paie pour recevoir ce rappel.',

  'notif.canal': 'Rappels',
  'notif.diario.texto': "Avez-vous noté vos dépenses du jour ? Cela prend moins d'une minute.",
  'notif.pagamento.titulo': 'Jour de paie',
  'notif.pagamento.texto': "Et si vous mettiez d'abord de côté pour vos objectifs ? Payez-vous en premier !",

  // Perfil fiscal
  'fiscal.erro.pais': 'Pays de résidence non valide.',
  'fiscal.erro.regiao': 'Région non valide pour ce pays.',
  'fiscal.erro.situacao': 'Situation professionnelle non valide.',
  'fiscal.erro.rendimento': 'Revenu annuel non valide. Vérifiez le montant.',
  'fiscal.erro.dependentes': 'Nombre de personnes à charge non valide.',
  'fiscal.erro.combustivel': 'Type de carburant non valide.',

  // Datas
  'datas.agora': "à l'instant",
  'datas.haMinutos': { one: 'il y a {n} min', other: 'il y a {n} min' },
  'datas.haHoras': { one: 'il y a {n} h', other: 'il y a {n} h' },
  'datas.ontem': 'hier',
  'datas.haDias': { one: 'il y a {n} jour', other: 'il y a {n} jours' },
};
