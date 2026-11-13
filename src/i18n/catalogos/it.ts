import type { Catalogo } from '@/i18n/tipos';

export const it: Catalogo = {
  'comum.erroGuardar': 'Impossibile salvare',
  'comum.tenteNovamente': 'Riprova.',
  'comum.dias': { one: '{n} giorno', other: '{n} giorni' },

  'abas.inicio': 'Home',
  'abas.transacoes': 'Movimenti',
  'abas.adicionar': 'Aggiungi',
  'abas.metas': 'Obiettivi',
  'abas.perfil': 'Profilo',

  'pref.aparencia': 'Aspetto',
  'pref.tema.sistema': 'Sistema',
  'pref.tema.claro': 'Chiaro',
  'pref.tema.escuro': 'Scuro',
  'pref.idioma': 'Lingua',
  'pref.idioma.aparelho': 'Lingua del dispositivo',
  'pref.idioma.descricao': 'La lingua non cambia la tua residenza fiscale né la tua valuta.',
  'pref.vidro': 'Effetto vetro (Liquid Glass)',
  'pref.vidro.nativo': 'Schede in vetro di iOS. Disattiva per schede opache.',
  'pref.vidro.simulado':
    "Vetro simulato (l'effetto nativo richiede iOS 26 o versioni successive). Disattiva per schede opache.",
  'pref.vidro.desligado': 'Schede opache, stile carta. Attiva per vedere le schede in vetro.',
  'pref.diaPagamento': 'Giorno di paga',
  'pref.diaPagamento.descricao': 'Giorno del mese in cui ricevi lo stipendio',
  'pref.diaPagamento.rotulo': 'Giorno di paga, da 1 a 31',
  'pref.lembreteDiario': 'Promemoria giornaliero',
  'pref.lembreteDiario.descricao': 'Per registrare le spese della giornata',
  'pref.lembreteDiario.horario': 'Ora del promemoria',
  'pref.hora': '{h}:00',
  'pref.lembretePagamento': 'Promemoria nel giorno di paga',
  'pref.lembretePagamento.descricao': 'Per mettere da parte prima i soldi per i tuoi obiettivi',
  'pref.lembretePagamento.semDia': 'Indica sopra il giorno di paga',
  'pref.biometria': 'Accedi con la biometria',
  'pref.notificacoesDesligadas.titulo': 'Notifiche disattivate',
  'pref.notificacoesDesligadas.texto':
    'Per ricevere i promemoria, consenti le notifiche di EcoTrust nelle impostazioni del telefono.',
  'pref.biometriaFalhou.titulo': 'Biometria non attivata',
  'pref.biometriaFalhou.texto': "Impossibile confermare l'impronta digitale o il Face ID.",
  'pref.erro.tema': 'Tema non valido.',
  'pref.erro.vidro': 'Opzione vetro non valida.',
  'pref.erro.idioma': 'Lingua non valida.',
  'pref.erro.dia': 'Il giorno di paga deve essere compreso tra 1 e 31.',
  'pref.erro.hora': 'Ora del promemoria non valida.',
  'pref.erro.lembreteSemDia': 'Indica il giorno di paga per ricevere questo promemoria.',

  'notif.canal': 'Promemoria',
  'notif.diario.texto': 'Hai già registrato le spese di oggi? Ci vuole meno di un minuto.',
  'notif.pagamento.titulo': 'Giorno di paga',
  'notif.pagamento.texto': 'Che ne dici di mettere da parte prima i soldi per i tuoi obiettivi? Paga prima te stesso!',

  // Perfil fiscal
  'fiscal.erro.pais': 'Paese di residenza non valido.',
  'fiscal.erro.regiao': 'Regione non valida per questo paese.',
  'fiscal.erro.situacao': 'Situazione lavorativa non valida.',
  'fiscal.erro.rendimento': "Reddito annuo non valido. Controlla l'importo.",
  'fiscal.erro.dependentes': 'Numero di familiari a carico non valido.',
  'fiscal.erro.combustivel': 'Tipo di carburante non valido.',

  // Datas
  'datas.agora': 'adesso',
  'datas.haMinutos': { one: '{n} min fa', other: '{n} min fa' },
  'datas.haHoras': { one: '{n} h fa', other: '{n} h fa' },
  'datas.ontem': 'ieri',
  'datas.haDias': { one: '{n} giorno fa', other: '{n} giorni fa' },
};
