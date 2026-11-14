import type { TextosAcademy } from '@/data/academy/estrutura';

/** Trust Academy in italiano. */
export const academyIt: TextosAcademy = {
  categorias: {
    basico: { nome: 'Primi passi', descricao: 'Le basi per organizzare il denaro.' },
    orcamento: { nome: 'Budget', descricao: 'Pianificare il mese e controllare le spese.' },
    dividas: { nome: 'Debiti', descricao: 'Uscire dal rosso e non tornarci.' },
    investimentos: { nome: 'Investimenti', descricao: 'Far lavorare il denaro.' },
  },
  cursos: {
    'financas-do-zero': { titulo: 'Finanze da zero', resumo: 'Capisci le tue spese, crea il fondo di emergenza e obiettivi che funzionano.' },
    'orcamento-sem-sofrimento': { titulo: 'Budget senza fatica', resumo: 'Dividi il reddito, controlla le spese fisse e spendi senza sensi di colpa.' },
    'saindo-do-vermelho': { titulo: 'Uscire dal rosso', resumo: 'Usa la carta senza trappole, organizza e negozia i tuoi debiti.' },
    'comecando-a-investir': { titulo: 'Iniziare a investire', resumo: 'Inflazione, interesse composto e i primi passi per investire.' },
  },
  aulas: {
    'reserva-emergencia': {
      titulo: 'Come creare un fondo di emergenza',
      resumo: 'Il primo passo per stare tranquilli con il denaro.',
      paragrafos: [
        'Il fondo di emergenza è denaro messo da parte solo per gli imprevisti: perdere il lavoro, un problema di salute, l\'auto in panne. Evita che uno spavento diventi un debito sulla carta o uno scoperto di conto.',
        'Un riferimento comune è accantonare da 3 a 6 mesi di spese essenziali. Chi ha un reddito variabile (per esempio i lavoratori autonomi) di solito ha bisogno di più, vicino a 12 mesi.',
        'Questo denaro deve stare in un posto sicuro che permetta di prelevarlo in fretta, possibilmente in giornata. Rendere molto non è l\'obiettivo: l\'importante è che sia disponibile quando serve.',
        'Inizia in piccolo. Fissare una cifra mensile, anche bassa, e metterla da parte appena arriva lo stipendio funziona meglio che aspettare che avanzi qualcosa a fine mese.',
      ],
      pontosChave: [
        'Obiettivo: coprire gli imprevisti senza indebitarsi.',
        'Riferimento comune: da 3 a 6 mesi di spese essenziali.',
        'Sicurezza e accesso rapido contano più del rendimento.',
        'Risparmia a inizio mese, non con quello che avanza.',
      ],
      quiz: {
        pergunta: 'Qual è la caratteristica più importante del posto dove tieni il fondo di emergenza?',
        opcoes: ['Rendere il più possibile', 'Essere sicuro e permettere prelievi rapidi', 'Restare vincolato per alcuni anni'],
        explicacao: 'Il fondo serve per gli imprevisti: deve essere disponibile quando serve, anche se rende meno.',
      },
    },
    'regra-50-30-20': {
      titulo: '50/30/20: come funziona?',
      resumo: 'Un modo semplice per dividere il denaro ogni mese.',
      paragrafos: [
        'La regola 50/30/20 divide il reddito netto (quello che arriva sul conto) in tre parti: 50% per i bisogni, 30% per i desideri e 20% per gli obiettivi finanziari.',
        'I bisogni sono spese che non puoi evitare: casa, bollette di base, spesa alimentare, trasporti, salute. I desideri rendono la vita più piacevole ma si possono ridurre: svago, acquisti, ristoranti, abbonamenti.',
        'Il 20% va al futuro: fondo di emergenza, estinzione dei debiti e investimenti per i tuoi obiettivi.',
        'I numeri sono un punto di partenza, non una regola rigida. Se i bisogni superano il 50%, prova a ridurre prima i desideri. In EcoTrust puoi usare il budget per categoria per mettere in pratica questo piano.',
      ],
      pontosChave: ['50% bisogni, 30% desideri, 20% futuro.', 'Usa il reddito netto come base.', 'Adatta le percentuali alla tua situazione.'],
      quiz: {
        pergunta: 'Nella regola 50/30/20, a cosa serve il 20%?',
        opcoes: ['Svago e acquisti', 'Bollette di casa', 'Fondo di emergenza, debiti e investimenti'],
        explicacao: 'Il 20% è il denaro del futuro: fondo di emergenza, estinzione dei debiti e investimenti.',
      },
    },
    'gastos-recorrentes': {
      titulo: 'Come controllare le spese ricorrenti',
      resumo: 'Abbonamenti e spese fisse pesano più di quanto sembri.',
      paragrafos: [
        'Le spese ricorrenti si ripetono ogni mese: affitto o rata del mutuo, condominio, internet, telefono, palestra e abbonamenti. Essendo automatiche, è facile dimenticare quanto sommano.',
        'Un buon riferimento è tenere le spese fisse tra il 30% e il 50% del reddito. Oltre, qualsiasi imprevisto mette in difficoltà il budget.',
        'Fai una revisione ogni pochi mesi: elenca tutto ciò che viene addebitato in automatico e chiediti se usi ancora ogni servizio. Disdire un abbonamento dimenticato è un risparmio che si ripete ogni mese.',
        'Conviene anche rinegoziare o confrontare le offerte: internet, telefono, energia e assicurazioni hanno spesso condizioni migliori per chi le chiede. In EcoTrust, segna le spese che si ripetono come "ricorrenti" per vederne il totale.',
      ],
      pontosChave: ['Somma tutto ciò che viene addebitato ogni mese.', 'Rivedi periodicamente gli abbonamenti.', 'Rinegoziare le spese fisse è un risparmio permanente.'],
      quiz: {
        pergunta: 'Quale azione riduce in modo permanente le spese ricorrenti?',
        opcoes: ['Rivedere e disdire gli abbonamenti che non usi', 'Pagare le bollette in ritardo', 'Cambiare carta ogni mese'],
        explicacao: 'Ogni abbonamento disdetto è un risparmio che si ripete ogni mese.',
      },
    },
    'gastos-superfluos': {
      titulo: 'Spese non essenziali: tagliare senza soffrire',
      resumo: 'Non si tratta di smettere di vivere, ma di scegliere meglio.',
      paragrafos: [
        'Svago, acquisti, consegne a domicilio e viaggi fanno parte di una bella vita. Il problema nasce quando crescono senza che te ne accorga e occupano lo spazio del fondo di emergenza e degli obiettivi.',
        'Invece di tagliare tutto, fissa un limite mensile per queste categorie. Sapere quanto puoi ancora spendere dà libertà ed evita i sensi di colpa.',
        'Alcune strategie aiutano: aspettare 48 ore prima di un acquisto d\'impulso, preferire ciò a cui tieni davvero e tagliare ciò che fai per abitudine.',
        'Le piccole riduzioni si sommano. Ridurre del 10% le spese non essenziali e destinare quella cifra a un obiettivo fa già la differenza in pochi mesi.',
      ],
      pontosChave: ['Fissa limiti, non divieti.', 'Aspetta prima degli acquisti d\'impulso.', 'Destina ciò che risparmi a un obiettivo.'],
      quiz: {
        pergunta: 'Qual è il modo più sostenibile di gestire le spese non essenziali?',
        opcoes: ['Tagliarle tutte insieme', 'Fissare per loro un limite mensile', 'Ignorarle e guardare a fine mese'],
        explicacao: 'Un limite ti lascia godere senza sensi di colpa e protegge i tuoi obiettivi.',
      },
    },
    'sair-das-dividas': {
      titulo: 'Come uscire dai debiti: da dove iniziare',
      resumo: 'Una guida passo passo per organizzare e saldare ciò che devi.',
      paragrafos: [
        'Il primo passo è sapere esattamente cosa devi: a chi, quanto, il tasso di interesse (guarda il TAEG) e l\'importo delle rate. Mettere tutto in un elenco toglie il peso dell\'ignoto.',
        'Dai priorità ai debiti con gli interessi più alti, come la carta pagata con il minimo e gli scoperti di conto. Crescono molto in fretta e devono essere i primi a sparire.',
        'Prova a rinegoziare. I creditori spesso accettano tempi o rate diversi, soprattutto se li contatti prima di saltare un pagamento. Riunire più debiti in un prestito più economico può aiutare, purché non usi di nuovo il vecchio fido.',
        'Mentre paghi, evita nuovi debiti e segui da vicino le spese. Una volta uscito, il fondo di emergenza è ciò che ti impedisce di tornare in rosso.',
      ],
      pontosChave: [
        'Elenca tutti i debiti con interessi (TAEG) e rate.',
        'Inizia da quelli con gli interessi più alti.',
        'Rinegozia prima di saltare un pagamento.',
        'Poi crea il fondo di emergenza per non ricaderci.',
      ],
      quiz: {
        pergunta: 'Quando si organizzano i debiti, quali si saldano di solito per primi?',
        opcoes: ['Quelli più piccoli', 'Quelli con gli interessi più alti', 'Quelli più vecchi'],
        explicacao: 'Debiti come il credito revolving della carta e lo scoperto crescono più in fretta, quindi vanno saldati per primi.',
      },
    },
    'primeiros-investimentos': {
      titulo: 'Primi passi per investire',
      resumo: 'Cosa capire prima di far fruttare il denaro.',
      paragrafos: [
        'Prima di investire conviene aver saldato i debiti costosi e creato il fondo di emergenza. Così non dovrai disinvestire nel momento peggiore.',
        'Ogni investimento combina tre caratteristiche: rendimento (quanto frutta), rischio (quanto può oscillare o perdere) e liquidità (quanto in fretta torna denaro sul conto). Nessuna opzione eccelle in tutte e tre insieme.',
        'Nel reddito fisso le regole sono note fin dall\'inizio, come nei depositi vincolati e nelle obbligazioni, compresi i titoli di Stato. Nel reddito variabile, come le azioni e molti fondi, il valore oscilla con il mercato e può scendere.',
        'Il tuo profilo di investitore (prudente, moderato o dinamico) e l\'orizzonte di ogni obiettivo aiutano a scegliere. Diversificare, cioè non mettere tutto nello stesso posto, riduce il rischio. Nell\'UE gli intermediari autorizzati devono valutare se un prodotto è adatto a te (regole MiFID II). Questo contenuto è educativo e non è una raccomandazione di investimento.',
      ],
      pontosChave: [
        'Prima: debiti costosi saldati e fondo di emergenza pronto.',
        'Rendimento, rischio e liquidità vanno insieme.',
        'Scegli in base al tuo profilo e all\'orizzonte dell\'obiettivo.',
        'Diversifica.',
      ],
      quiz: {
        pergunta: 'Cosa conviene avere prima di iniziare a investire?',
        opcoes: ['Debiti costosi saldati e fondo di emergenza creato', 'Un\'auto nuova', 'Un prestito per investire di più'],
        explicacao: 'Così non dovrai vendere nel momento sbagliato né pagherai più interessi di quanti ne guadagni.',
      },
    },
    'metas-financeiras': {
      titulo: 'Come creare obiettivi che funzionano',
      resumo: 'Trasforma i desideri in piani con importo e scadenza.',
      paragrafos: [
        '"Voglio risparmiare" è un desiderio. "Voglio mettere da parte 6000 per un viaggio in 12 mesi" è un obiettivo: ha un importo, una scadenza e un motivo.',
        'Con importo e scadenza è facile sapere quanto risparmiare al mese. Nell\'esempio sono 500 al mese. Se non rientra nel budget, modifica la scadenza o l\'obiettivo.',
        'Seguire i progressi mantiene la motivazione. Registra ogni somma messa da parte e festeggia le tappe, come il 25% e il 50%.',
        'Inizia con uno o due obiettivi. Troppi obiettivi insieme dividono il denaro e richiedono più tempo.',
      ],
      pontosChave: ['Obiettivo = importo + scadenza + motivo.', 'Dividi l\'importo per i mesi per sapere la quota mensile.', 'Segui e festeggia i progressi.'],
      quiz: {
        pergunta: 'Cosa trasforma un desiderio in un obiettivo?',
        opcoes: ['Raccontarlo agli amici', 'Avere importo, scadenza e motivo', 'Mettere da parte ciò che avanza'],
        explicacao: 'Con importo e scadenza sai quanto risparmiare al mese, e il motivo mantiene la motivazione.',
      },
    },
    'para-onde-vai-o-dinheiro': {
      titulo: 'Dove vanno i tuoi soldi',
      resumo: 'Registrare le spese è il primo passo per decidere meglio.',
      paragrafos: [
        'Molte persone sanno quanto guadagnano, ma non quanto spendono. Senza questa informazione ogni piano è un\'ipotesi: i soldi spariscono e resta la sensazione che non avanzi mai nulla.',
        'Registrare entrate e uscite per qualche settimana rivela già delle abitudini. Le piccole spese quotidiane, come caffè, app e commissioni, di solito sommano più di quanto sembri.',
        'Dividi le spese in categorie, come casa, alimentari, trasporti e svago. Così è facile vedere dove sta il peso maggiore e dove intervenire.',
        'Lo scopo non è sentirsi in colpa, ma vedere chiaro. Con i numeri in mano decidi cosa è prioritario. In EcoTrust lo storico e il riepilogo del mese fanno il conto per te.',
      ],
      pontosChave: ['Senza registrazioni non si può pianificare.', 'Le piccole spese pesano molto in un mese.', 'Le categorie mostrano dove sta il peso maggiore.'],
      quiz: {
        pergunta: 'Perché registrare le spese quotidiane?',
        opcoes: ['Per vedere dove vanno i soldi e decidere meglio', 'Perché lo impone la legge', 'Per spendere di più a fine mese'],
        explicacao: 'I numeri mostrano abitudini che sfuggono, come piccole spese che sommano molto.',
      },
    },
    'juros-do-cartao': {
      titulo: 'Carta di credito senza trappole',
      resumo: 'Come usare la carta a tuo favore ed evitare gli interessi più cari.',
      paragrafos: [
        'La carta di credito è comoda e può persino aiutare a organizzare gli acquisti del mese. Il problema inizia quando l\'estratto conto non viene saldato per intero.',
        'Se paghi solo una parte (il minimo o una rata), il resto diventa credito revolving, una delle forme di credito con gli interessi più alti. Confronta sempre il TAEG, che mostra il costo totale annuo.',
        'Per usarla bene: considera il plafond come denaro che hai già, non come reddito in più. Annota gli acquisti a rate, perché occupano gli estratti dei mesi successivi.',
        'Se l\'estratto non rientra più nel budget, parla con la banca prima della scadenza per conoscere opzioni con interessi più bassi.',
      ],
      pontosChave: ['Salda sempre l\'estratto per intero.', 'Il credito revolving della carta ha interessi altissimi.', 'Le rate di oggi occupano il reddito di domani.'],
      quiz: {
        pergunta: 'Cosa succede se paghi solo il minimo della carta?',
        opcoes: ['Niente, il resto viene condonato', 'Il resto diventa credito con interessi molto alti', 'Il plafond della carta aumenta'],
        explicacao: 'L\'importo non pagato diventa credito revolving, uno dei crediti più cari sul mercato.',
      },
    },
    'negociar-dividas': {
      titulo: 'Come negoziare un debito',
      resumo: 'Preparati per ottenere condizioni sostenibili per il tuo budget.',
      paragrafos: [
        'Prima di negoziare, sappi quanto puoi pagare al mese senza far mancare l\'essenziale. Accettare una rata che non puoi sostenere rimanda solo il problema.',
        'Chiedi l\'importo totale della proposta, il TAEG e il numero di rate. Una rata piccola per molti mesi può costare molto di più alla fine.',
        'I creditori spesso offrono condizioni migliori a chi li contatta presto. In molti Paesi dell\'UE esistono servizi pubblici o gratuiti di aiuto per chi è sovraindebitato: cerca quello del tuo Paese.',
        'Conserva tutte le ricevute e l\'accordo per iscritto. Negozia solo tramite i canali ufficiali del creditore e diffida di chi chiede un pagamento anticipato per "cancellare" la tua segnalazione creditizia.',
      ],
      pontosChave: ['Sappi cosa rientra nel tuo mese prima di negoziare.', 'Confronta l\'importo totale, non solo la rata.', 'Usa solo canali ufficiali e conserva l\'accordo.'],
      quiz: {
        pergunta: 'Nel valutare una proposta di rinegoziazione, cosa è più importante confrontare?',
        opcoes: ['Solo l\'importo della rata', 'L\'importo totale, gli interessi e se la rata rientra nel mese', 'Il colore della lettera della banca'],
        explicacao: 'Una rata bassa per molti mesi può costare molto di più. Guarda il totale e se rientra nel budget.',
      },
    },
    inflacao: {
      titulo: 'Inflazione: perché il denaro fermo perde valore',
      resumo: 'Capisci cosa erode il tuo potere d\'acquisto.',
      paragrafos: [
        'L\'inflazione è l\'aumento generale dei prezzi nel tempo. Con essa, la stessa somma di denaro compra meno cose ogni anno.',
        'Per questo il denaro tenuto fermo senza rendere nulla perde valore poco a poco. Se i prezzi salgono del 5% in un anno, 100 fermi comprano l\'equivalente di circa 95.',
        'Per proteggere il potere d\'acquisto, il rendimento dei risparmi deve essere superiore all\'inflazione. Questo guadagno oltre l\'inflazione si chiama rendimento reale.',
        'Nell\'UE l\'inflazione si misura con l\'Indice dei prezzi al consumo armonizzato (IPCA). Nell\'area dell\'euro, la Banca centrale europea punta a mantenerla al 2% nel medio termine; i Paesi con moneta propria hanno la loro banca centrale.',
      ],
      pontosChave: ['Inflazione = prezzi che salgono e denaro che compra meno.', 'Il denaro fermo perde potere d\'acquisto.', 'Cerca rendimenti superiori all\'inflazione.'],
      quiz: {
        pergunta: 'Se l\'inflazione dell\'anno è stata del 5% e il tuo denaro ha reso il 3%, cosa è successo?',
        opcoes: ['Hai guadagnato potere d\'acquisto', 'Hai perso potere d\'acquisto', 'Non è cambiato nulla'],
        explicacao: 'Il rendimento è rimasto sotto l\'inflazione, quindi il tuo denaro ora compra meno.',
      },
    },
    'juros-compostos': {
      titulo: 'Interesse composto: il tempo dalla tua parte',
      resumo: 'Perché iniziare presto fa tanta differenza.',
      paragrafos: [
        'Con l\'interesse composto, il rendimento di ogni mese comincia a sua volta a rendere nei mesi successivi. Sono i famosi "interessi sugli interessi".',
        'All\'inizio la differenza sembra piccola, ma col tempo accelera. Più lungo è l\'orizzonte, maggiore è la parte del totale che deriva dai rendimenti stessi.',
        'Per questo iniziare presto, anche con poco, di solito vale più che iniziare tardi con cifre maggiori. Conta anche la costanza: versamenti mensili alimentano l\'effetto.',
        'Lo stesso meccanismo lavora contro di te con i debiti. L\'interesse composto fa crescere molto in fretta un debito sulla carta, un motivo in più per saldarlo per primo.',
      ],
      pontosChave: ['Anche i rendimenti iniziano a rendere.', 'Tempo e costanza amplificano l\'effetto.', 'Con i debiti, l\'effetto gioca contro di te.'],
      quiz: {
        pergunta: 'Quale fattore aumenta di più l\'effetto dell\'interesse composto?',
        opcoes: ['Il tempo', 'Prelevare i rendimenti ogni mese', 'Cambiare investimento ogni settimana'],
        explicacao: 'Più a lungo il denaro resta investito, più i rendimenti generano nuovi rendimenti.',
      },
    },
  },
  dicas: [
    'Risparmia il giorno in cui arriva lo stipendio, non con quello che avanza a fine mese.',
    'Prima di un acquisto d\'impulso, aspetta 48 ore. Spesso la voglia passa.',
    'Rivedi i tuoi abbonamenti ogni tre mesi e disdici quello che non usi.',
    'Pagare solo il minimo della carta trasforma il resto in credito con interessi molto alti.',
    'Registrare le spese ogni giorno richiede meno di un minuto e mostra dove vanno i soldi.',
    'Confrontare i prezzi dei servizi fissi (internet, telefono, energia, assicurazioni) può far risparmiare ogni mese.',
    'Un obiettivo con scadenza è più facile da raggiungere che "mettere da parte quello che posso".',
    'Prima di investire, crea il tuo fondo di emergenza.',
  ],
  conceitos: [
    { termo: 'Fondo di emergenza', definicao: 'Denaro messo da parte per gli imprevisti, in un posto sicuro e accessibile in fretta. Riferimento comune: da 3 a 6 mesi di spese essenziali.' },
    { termo: 'Liquidità', definicao: 'La facilità e la rapidità con cui un investimento torna denaro disponibile, senza perdere valore.' },
    {
      termo: 'Interesse composto',
      definicao: 'Interessi calcolati sull\'importo iniziale più gli interessi già maturati. Fanno crescere di più gli investimenti nel tempo, e fanno crescere in fretta anche i debiti.',
    },
    {
      termo: 'Tassi della BCE',
      definicao: 'I tassi di riferimento fissati dalla Banca centrale europea per l\'area dell\'euro. Influenzano gli interessi su depositi e prestiti. I Paesi dell\'UE con moneta propria hanno la loro banca centrale.',
    },
    { termo: 'Euribor', definicao: 'Tasso di riferimento a cui le banche dell\'area dell\'euro si prestano denaro. È usato in molti prestiti a tasso variabile, come i mutui.' },
    {
      termo: 'Inflazione (IPCA)',
      definicao: 'L\'aumento generale dei prezzi. Nell\'UE si misura con l\'Indice dei prezzi al consumo armonizzato. Se un investimento rende meno dell\'inflazione, perdi potere d\'acquisto.',
    },
    {
      termo: 'TAEG',
      definicao: 'Tasso annuo effettivo globale: il costo totale di un credito all\'anno, compresi interessi e spese. Nell\'UE deve essere sempre indicato e serve a confrontare i finanziamenti.',
    },
    { termo: 'Reddito fisso', definicao: 'Investimenti le cui regole di rendimento sono note fin dall\'inizio, come depositi vincolati e obbligazioni.' },
    { termo: 'Reddito variabile', definicao: 'Investimenti il cui valore cambia con il mercato, come azioni e molti fondi. Possono rendere di più, ma anche scendere.' },
    {
      termo: 'Garanzia dei depositi',
      definicao: 'Nell\'UE i depositi bancari sono protetti fino a 100 000 € (o l\'equivalente in valuta nazionale) per depositante e per banca, in caso di fallimento della banca. Gli investimenti, come azioni e fondi, non sono coperti.',
    },
    {
      termo: 'Credito revolving della carta',
      definicao: 'Il credito che si usa quando paghi meno dell\'intero estratto della carta. Ha interessi molto alti: pagare solo il minimo fa crescere il debito.',
    },
  ],
};
