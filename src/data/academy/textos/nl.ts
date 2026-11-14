import type { TextosAcademy } from '@/data/academy/estrutura';

/** Trust Academy in het Nederlands. */
export const academyNl: TextosAcademy = {
  categorias: {
    basico: { nome: 'Eerste stappen', descricao: 'De basis om je geld te ordenen.' },
    orcamento: { nome: 'Budget', descricao: 'De maand plannen en uitgaven beheersen.' },
    dividas: { nome: 'Schulden', descricao: 'Uit het rood komen en eruit blijven.' },
    investimentos: { nome: 'Beleggen', descricao: 'Je geld voor je laten werken.' },
  },
  cursos: {
    'financas-do-zero': { titulo: 'Financiën vanaf nul', resumo: 'Begrijp je uitgaven, bouw een noodfonds op en stel doelen die werken.' },
    'orcamento-sem-sofrimento': { titulo: 'Budgetteren zonder stress', resumo: 'Verdeel je inkomen, beheers vaste lasten en geef uit zonder schuldgevoel.' },
    'saindo-do-vermelho': { titulo: 'Uit het rood', resumo: 'Gebruik je kaart zonder valkuilen, orden en onderhandel over je schulden.' },
    'comecando-a-investir': { titulo: 'Beginnen met beleggen', resumo: 'Inflatie, rente op rente en de eerste stappen om te beleggen.' },
  },
  aulas: {
    'reserva-emergencia': {
      titulo: 'Zo bouw je een noodfonds op',
      resumo: 'De eerste stap naar rust met geld.',
      paragrafos: [
        'Een noodfonds is geld dat je alleen opzijzet voor het onverwachte: je baan verliezen, een gezondheidsprobleem, een kapotte auto. Het voorkomt dat een tegenvaller verandert in een kaartschuld of een roodstand.',
        'Een gangbare richtlijn is 3 tot 6 maanden van je noodzakelijke uitgaven. Wie een wisselend inkomen heeft (bijvoorbeeld zelfstandigen), heeft meestal meer nodig, rond de 12 maanden.',
        'Dit geld moet veilig staan en snel opneembaar zijn, liefst dezelfde dag. Een hoog rendement is niet het doel: het belangrijkste is dat het er is als je het nodig hebt.',
        'Begin klein. Een vast maandbedrag, ook een laag bedrag, apart zetten zodra je salaris binnenkomt, werkt beter dan wachten op wat er aan het eind van de maand over is.',
      ],
      pontosChave: [
        'Doel: tegenvallers opvangen zonder schulden.',
        'Gangbare richtlijn: 3 tot 6 maanden noodzakelijke uitgaven.',
        'Veiligheid en snelle toegang zijn belangrijker dan rendement.',
        'Spaar aan het begin van de maand, niet met wat overblijft.',
      ],
      quiz: {
        pergunta: 'Wat is de belangrijkste eigenschap van de plek waar je noodfonds staat?',
        opcoes: ['Zoveel mogelijk opleveren', 'Veilig en snel opneembaar zijn', 'Een paar jaar vastzitten'],
        explicacao: 'Het noodfonds is er voor noodgevallen: het moet beschikbaar zijn als je het nodig hebt, ook als het minder oplevert.',
      },
    },
    'regra-50-30-20': {
      titulo: '50/30/20: hoe werkt het?',
      resumo: 'Een eenvoudige manier om je geld elke maand te verdelen.',
      paragrafos: [
        'De 50/30/20-regel verdeelt je netto-inkomen (wat op je rekening komt) in drie delen: 50% voor noodzaken, 30% voor wensen en 20% voor financiële doelen.',
        'Noodzaken zijn kosten die je niet kunt vermijden: wonen, basisrekeningen, boodschappen, vervoer, zorg. Wensen maken het leven leuker maar zijn aan te passen: vrije tijd, winkelen, restaurants, abonnementen.',
        'De 20% gaat naar de toekomst: noodfonds, schulden aflossen en beleggen voor je doelen.',
        'De getallen zijn een startpunt, geen strikte regel. Gaan de noodzaken boven de 50%, snijd dan eerst in de wensen. In EcoTrust kun je met budgetten per categorie dit plan uitvoeren.',
      ],
      pontosChave: ['50% noodzaken, 30% wensen, 20% toekomst.', 'Gebruik je netto-inkomen als basis.', 'Pas de percentages aan je situatie aan.'],
      quiz: {
        pergunta: 'Waar gaat de 20% naartoe in de 50/30/20-regel?',
        opcoes: ['Vrije tijd en winkelen', 'Huishoudelijke rekeningen', 'Noodfonds, schulden en beleggingen'],
        explicacao: 'De 20% is geld voor de toekomst: noodfonds, schulden aflossen en beleggen.',
      },
    },
    'gastos-recorrentes': {
      titulo: 'Zo beheers je terugkerende kosten',
      resumo: 'Abonnementen en vaste lasten wegen zwaarder dan je denkt.',
      paragrafos: [
        'Terugkerende kosten komen elke maand terug: huur of hypotheek, servicekosten, internet, telefoon, sportschool en abonnementen. Omdat ze automatisch gaan, vergeet je snel hoeveel ze samen zijn.',
        'Een goede richtlijn is je vaste lasten tussen 30% en 50% van je inkomen te houden. Daarboven brengt elke tegenvaller je budget in de knel.',
        'Loop ze om de paar maanden na: zet alles op een rij wat automatisch wordt afgeschreven en vraag je af of je elke dienst nog gebruikt. Een vergeten abonnement opzeggen is een besparing die elke maand terugkomt.',
        'Heronderhandelen of aanbiedingen vergelijken loont ook: internet, telefoon, energie en verzekeringen hebben vaak betere voorwaarden voor wie erom vraagt. Markeer in EcoTrust terugkerende uitgaven als "terugkerend" om het totaal te zien.',
      ],
      pontosChave: ['Tel alles op wat elke maand wordt afgeschreven.', 'Loop abonnementen regelmatig na.', 'Vaste lasten heronderhandelen is een blijvende besparing.'],
      quiz: {
        pergunta: 'Welke actie verlaagt terugkerende kosten blijvend?',
        opcoes: ['Abonnementen nalopen en opzeggen die je niet gebruikt', 'Rekeningen te laat betalen', 'Elke maand van kaart wisselen'],
        explicacao: 'Elk opgezegd abonnement is een besparing die elke maand terugkomt.',
      },
    },
    'gastos-superfluos': {
      titulo: 'Niet-essentiële uitgaven: minderen zonder pijn',
      resumo: 'Het gaat niet om stoppen met leven, maar om beter kiezen.',
      paragrafos: [
        'Vrije tijd, winkelen, maaltijdbezorging en reizen horen bij een fijn leven. Het probleem ontstaat als ze ongemerkt groeien en de ruimte van je noodfonds en doelen innemen.',
        'In plaats van alles te schrappen, stel je een maandlimiet in voor deze categorieën. Weten hoeveel je nog kunt uitgeven geeft vrijheid en voorkomt schuldgevoel.',
        'Een paar strategieën helpen: 48 uur wachten voor een impulsaankoop, kiezen voor wat je echt belangrijk vindt en schrappen wat je uit gewoonte doet.',
        'Kleine besparingen tellen op. Je niet-essentiële uitgaven met 10% verlagen en dat bedrag naar een doel sturen, maakt binnen een paar maanden al verschil.',
      ],
      pontosChave: ['Stel limieten, geen verboden.', 'Wacht voor een impulsaankoop.', 'Stuur wat je bespaart naar een doel.'],
      quiz: {
        pergunta: 'Wat is de duurzaamste manier om met niet-essentiële uitgaven om te gaan?',
        opcoes: ['Alles in één keer schrappen', 'Er een maandlimiet voor instellen', 'Negeren en aan het eind van de maand kijken'],
        explicacao: 'Een limiet laat je genieten zonder schuldgevoel en beschermt je doelen.',
      },
    },
    'sair-das-dividas': {
      titulo: 'Uit de schulden: waar begin je?',
      resumo: 'Een stappenplan om je schulden te ordenen en af te lossen.',
      paragrafos: [
        'De eerste stap is precies weten wat je schuldig bent: aan wie, hoeveel, tegen welke rente (kijk naar het jaarlijkse kostenpercentage) en met welke termijnen. Alles op een lijst zetten haalt de last van het onbekende weg.',
        'Los eerst de schulden met de hoogste rente af, zoals een creditcard waarop je alleen het minimum betaalt en rood staan. Die groeien heel snel en moeten als eerste weg.',
        'Probeer te heronderhandelen. Schuldeisers accepteren vaak andere looptijden of termijnen, vooral als je contact opneemt voordat je een betaling mist. Meerdere schulden samenvoegen in een goedkopere lening kan ook helpen, zolang je de oude limiet niet opnieuw gebruikt.',
        'Vermijd tijdens het aflossen nieuwe schulden en houd je uitgaven goed bij. Daarna voorkomt je noodfonds dat je weer in het rood belandt.',
      ],
      pontosChave: [
        'Zet alle schulden op een rij met rente (JKP) en termijnen.',
        'Begin met de hoogste rente.',
        'Heronderhandel voordat je een betaling mist.',
        'Bouw daarna een noodfonds op om niet terug te vallen.',
      ],
      quiz: {
        pergunta: 'Welke schulden worden bij het ordenen meestal eerst afgelost?',
        opcoes: ['De kleinste', 'Die met de hoogste rente', 'De oudste'],
        explicacao: 'Schulden zoals doorlopend kaartkrediet en rood staan groeien het snelst, dus die gaan eerst.',
      },
    },
    'primeiros-investimentos': {
      titulo: 'Eerste stappen in beleggen',
      resumo: 'Wat je moet begrijpen voordat je je geld laat renderen.',
      paragrafos: [
        'Voordat je gaat beleggen, is het verstandig dure schulden af te lossen en een noodfonds te hebben. Zo hoef je een belegging niet op het slechtste moment te verkopen.',
        'Elke belegging combineert drie eigenschappen: rendement (wat het oplevert), risico (hoeveel het kan schommelen of verliezen) en liquiditeit (hoe snel het weer geld op je rekening wordt). Geen enkele optie scoort op alle drie tegelijk het best.',
        'Bij vastrentende beleggingen liggen de regels vooraf vast, zoals bij termijndeposito\'s en obligaties, ook staatsobligaties. Bij variabele beleggingen, zoals aandelen en veel fondsen, beweegt de waarde mee met de markt en kan die dalen.',
        'Je beleggersprofiel (voorzichtig, gematigd of offensief) en de termijn van elk doel helpen bij het kiezen. Spreiden, dus niet alles op één plek zetten, verlaagt het risico. In de EU moeten erkende partijen beoordelen of een product bij je past (MiFID II-regels). Deze inhoud is educatief en geen beleggingsadvies.',
      ],
      pontosChave: [
        'Eerst: dure schulden afgelost en noodfonds klaar.',
        'Rendement, risico en liquiditeit horen bij elkaar.',
        'Kies op basis van je profiel en de termijn van je doel.',
        'Spreid.',
      ],
      quiz: {
        pergunta: 'Wat kun je het best hebben voordat je begint met beleggen?',
        opcoes: ['Dure schulden afgelost en een noodfonds', 'Een nieuwe auto', 'Een lening om meer te beleggen'],
        explicacao: 'Zo hoef je niet op het verkeerde moment te verkopen en betaal je niet meer rente dan je verdient.',
      },
    },
    'metas-financeiras': {
      titulo: 'Zo stel je doelen die werken',
      resumo: 'Maak van wensen plannen met een bedrag en een termijn.',
      paragrafos: [
        '"Ik wil sparen" is een wens. "Ik wil binnen 12 maanden 6000 sparen voor een reis" is een doel: het heeft een bedrag, een termijn en een reden.',
        'Met een bedrag en een termijn weet je makkelijk hoeveel je per maand moet sparen. In het voorbeeld is dat 500 per maand. Past het niet in je budget, pas dan de termijn of het doel aan.',
        'Je voortgang volgen houdt je gemotiveerd. Leg elk gespaard bedrag vast en vier de mijlpalen, zoals 25% en 50%.',
        'Begin met één of twee doelen. Te veel doelen tegelijk verdelen je geld en duren langer.',
      ],
      pontosChave: ['Doel = bedrag + termijn + reden.', 'Deel het bedrag door de termijn voor het maandbedrag.', 'Volg en vier je voortgang.'],
      quiz: {
        pergunta: 'Wat maakt van een wens een doel?',
        opcoes: ['Het aan vrienden vertellen', 'Een bedrag, een termijn en een reden hebben', 'Sparen wat overblijft'],
        explicacao: 'Met een bedrag en een termijn weet je hoeveel je per maand moet sparen, en de reden houdt je gemotiveerd.',
      },
    },
    'para-onde-vai-o-dinheiro': {
      titulo: 'Waar je geld naartoe gaat',
      resumo: 'Je uitgaven bijhouden is de eerste stap naar betere keuzes.',
      paragrafos: [
        'Veel mensen weten hoeveel ze verdienen, maar niet hoeveel ze uitgeven. Zonder die informatie is elk plan een gok: het geld verdwijnt en je hebt het gevoel dat er nooit iets overblijft.',
        'Een paar weken inkomsten en uitgaven bijhouden laat al patronen zien. Kleine dagelijkse uitgaven, zoals koffie, apps en kosten, tellen vaak meer op dan je denkt.',
        'Verdeel je uitgaven in categorieën, zoals wonen, eten, vervoer en vrije tijd. Zo zie je makkelijk waar het meeste naartoe gaat en waar je kunt bijsturen.',
        'Het doel is niet je schuldig voelen, maar helder zien. Met de cijfers in de hand bepaal je wat voorrang heeft. In EcoTrust doen de geschiedenis en het maandoverzicht die som voor je.',
      ],
      pontosChave: ['Zonder bijhouden kun je niet plannen.', 'Kleine uitgaven tellen in een maand flink op.', 'Categorieën laten zien waar het meeste naartoe gaat.'],
      quiz: {
        pergunta: 'Waarom zou je je dagelijkse uitgaven bijhouden?',
        opcoes: ['Om te zien waar je geld heen gaat en beter te kiezen', 'Omdat de wet het verplicht', 'Om aan het eind van de maand meer uit te geven'],
        explicacao: 'De cijfers laten patronen zien die je anders mist, zoals kleine uitgaven die flink optellen.',
      },
    },
    'juros-do-cartao': {
      titulo: 'Creditcard zonder valkuilen',
      resumo: 'Zo zet je je kaart in je voordeel en vermijd je de duurste rente.',
      paragrafos: [
        'Een creditcard is handig en kan zelfs de aankopen van de maand overzichtelijk maken. Het probleem begint als het overzicht niet volledig wordt betaald.',
        'Betaal je maar een deel (het minimum of in termijnen), dan wordt de rest doorlopend krediet, een van de duurste vormen van lenen. Vergelijk altijd het jaarlijkse kostenpercentage (JKP), dat de totale kosten per jaar laat zien.',
        'Om er goed mee om te gaan: zie de limiet als geld dat je al hebt, niet als extra inkomen. Houd aankopen in termijnen bij, want die drukken op de overzichten van de komende maanden.',
        'Past het overzicht niet meer in je budget, neem dan vóór de vervaldatum contact op met je bank voor opties met een lagere rente.',
      ],
      pontosChave: ['Betaal het overzicht altijd volledig.', 'Doorlopend kaartkrediet heeft een zeer hoge rente.', 'Termijnen van vandaag drukken op het inkomen van morgen.'],
      quiz: {
        pergunta: 'Wat gebeurt er als je alleen het minimum op je creditcard betaalt?',
        opcoes: ['Niets, de rest wordt kwijtgescholden', 'De rest wordt krediet met een zeer hoge rente', 'Je kaartlimiet gaat omhoog'],
        explicacao: 'Het openstaande bedrag wordt doorlopend krediet, een van de duurste kredieten op de markt.',
      },
    },
    'negociar-dividas': {
      titulo: 'Zo onderhandel je over een schuld',
      resumo: 'Bereid je voor op voorwaarden die in je budget passen.',
      paragrafos: [
        'Weet vóór je onderhandelt hoeveel je per maand kunt betalen zonder dat het noodzakelijke in gevaar komt. Een termijn accepteren die niet past, stelt het probleem alleen uit.',
        'Vraag naar het totaalbedrag van het voorstel, het JKP en het aantal termijnen. Een klein bedrag over veel maanden kan uiteindelijk veel duurder uitvallen.',
        'Schuldeisers bieden vaak betere voorwaarden aan wie vroeg contact opneemt. In veel EU-landen bestaan publieke of gratis schuldhulpdiensten voor mensen met te veel schulden: zoek die in jouw land.',
        'Bewaar alle bewijzen en de afspraak op papier. Onderhandel alleen via de officiële kanalen van de schuldeiser en wantrouw iedereen die vooruitbetaling vraagt om je kredietregistratie te "wissen".',
      ],
      pontosChave: ['Weet wat in je maand past voordat je onderhandelt.', 'Vergelijk het totaalbedrag, niet alleen de termijn.', 'Gebruik alleen officiële kanalen en bewaar de afspraak.'],
      quiz: {
        pergunta: 'Wat is het belangrijkst om te vergelijken bij een voorstel voor een nieuwe regeling?',
        opcoes: ['Alleen het termijnbedrag', 'Het totaalbedrag, de rente en of de termijn in je maand past', 'De kleur van de brief van de bank'],
        explicacao: 'Een laag bedrag over veel maanden kan veel meer kosten. Kijk naar het totaal en of het in je budget past.',
      },
    },
    inflacao: {
      titulo: 'Inflatie: waarom stilstaand geld waarde verliest',
      resumo: 'Begrijp wat je koopkracht aantast.',
      paragrafos: [
        'Inflatie is de algemene stijging van prijzen in de loop van de tijd. Daardoor koop je met hetzelfde bedrag elk jaar minder.',
        'Daarom verliest geld dat niets oplevert langzaam waarde. Stijgen de prijzen in een jaar met 5%, dan koop je met 100 stilstaand geld nog maar zoveel als met ongeveer 95.',
        'Om je koopkracht te beschermen, moet het rendement op je spaargeld hoger zijn dan de inflatie. Die winst boven de inflatie heet het reële rendement.',
        'In de EU wordt inflatie gemeten met het geharmoniseerde indexcijfer van de consumptieprijzen (HICP). In het eurogebied streeft de Europese Centrale Bank naar 2% op middellange termijn; landen met een eigen munt hebben hun eigen centrale bank.',
      ],
      pontosChave: ['Inflatie = stijgende prijzen en geld dat minder koopt.', 'Stilstaand geld verliest koopkracht.', 'Zoek rendement boven de inflatie.'],
      quiz: {
        pergunta: 'Als de inflatie dit jaar 5% was en je geld 3% opleverde, wat is er dan gebeurd?',
        opcoes: ['Je hebt koopkracht gewonnen', 'Je hebt koopkracht verloren', 'Er is niets veranderd'],
        explicacao: 'Het rendement bleef onder de inflatie, dus je geld koopt nu minder.',
      },
    },
    'juros-compostos': {
      titulo: 'Rente op rente: de tijd werkt voor je',
      resumo: 'Waarom vroeg beginnen zoveel uitmaakt.',
      paragrafos: [
        'Bij rente op rente gaat het rendement van elke maand in de volgende maanden zelf ook renderen. Dat is het bekende "rente op rente"-effect.',
        'In het begin lijkt het verschil klein, maar na verloop van tijd versnelt het. Hoe langer de termijn, hoe groter het deel van het totaal dat uit het rendement zelf komt.',
        'Daarom is vroeg beginnen, ook met weinig, meestal meer waard dan laat beginnen met grotere bedragen. Regelmaat telt ook: maandelijkse inleg versterkt het effect.',
        'Hetzelfde mechanisme werkt tegen je bij schulden. Rente op rente laat een kaartschuld heel snel groeien, nog een reden om die eerst af te lossen.',
      ],
      pontosChave: ['Rendement gaat zelf ook renderen.', 'Tijd en regelmaat versterken het effect.', 'Bij schulden werkt het effect tegen je.'],
      quiz: {
        pergunta: 'Welke factor versterkt het effect van rente op rente het meest?',
        opcoes: ['De tijd', 'Elke maand het rendement opnemen', 'Elke week van belegging wisselen'],
        explicacao: 'Hoe langer het geld blijft renderen, hoe meer het rendement nieuw rendement oplevert.',
      },
    },
  },
  dicas: [
    'Spaar op de dag dat je salaris binnenkomt, niet met wat er aan het eind van de maand over is.',
    'Wacht 48 uur voor een impulsaankoop. Vaak gaat de zin over.',
    'Loop je abonnementen elke drie maanden na en zeg op wat je niet gebruikt.',
    'Alleen het minimum op je creditcard betalen maakt van de rest krediet met een zeer hoge rente.',
    'Je uitgaven elke dag bijhouden kost minder dan een minuut en laat zien waar je geld heen gaat.',
    'Prijzen van vaste diensten (internet, telefoon, energie, verzekeringen) vergelijken kan elke maand besparen.',
    'Een doel met een termijn is makkelijker te halen dan "sparen wat lukt".',
    'Bouw eerst een noodfonds op voordat je gaat beleggen.',
  ],
  conceitos: [
    { termo: 'Noodfonds', definicao: 'Geld voor het onverwachte, veilig en snel opneembaar. Gangbare richtlijn: 3 tot 6 maanden noodzakelijke uitgaven.' },
    { termo: 'Liquiditeit', definicao: 'Hoe makkelijk en snel een belegging zonder waardeverlies weer beschikbaar geld wordt.' },
    {
      termo: 'Rente op rente',
      definicao: 'Rente berekend over het beginbedrag plus de al opgebouwde rente. Daardoor groeien beleggingen in de tijd sterker, en groeien schulden ook snel.',
    },
    {
      termo: 'ECB-rentetarieven',
      definicao: 'De beleidsrentes die de Europese Centrale Bank vaststelt voor het eurogebied. Ze beïnvloeden de rente op spaargeld en leningen. EU-landen met een eigen munt hebben hun eigen centrale bank.',
    },
    { termo: 'Euribor', definicao: 'De referentierente waartegen banken in het eurogebied elkaar geld lenen. Wordt gebruikt bij veel leningen met variabele rente, zoals hypotheken.' },
    {
      termo: 'Inflatie (HICP)',
      definicao: 'De algemene prijsstijging. In de EU gemeten met het geharmoniseerde indexcijfer van de consumptieprijzen. Levert een belegging minder op dan de inflatie, dan verlies je koopkracht.',
    },
    {
      termo: 'JKP',
      definicao: 'Jaarlijks kostenpercentage: de totale kosten van een krediet per jaar, inclusief rente en kosten. In de EU moet het altijd worden vermeld en het helpt leningen te vergelijken.',
    },
    { termo: 'Vastrentende beleggingen', definicao: 'Beleggingen waarvan de rendementsregels vooraf vastliggen, zoals termijndeposito\'s en obligaties.' },
    { termo: 'Variabele beleggingen', definicao: 'Beleggingen waarvan de waarde meebeweegt met de markt, zoals aandelen en veel fondsen. Ze kunnen meer opleveren, maar ook dalen.' },
    {
      termo: 'Depositogarantie',
      definicao: 'In de EU zijn banktegoeden beschermd tot 100 000 € (of de tegenwaarde in de nationale munt) per rekeninghouder per bank als de bank failliet gaat. Beleggingen zoals aandelen en fondsen vallen er niet onder.',
    },
    {
      termo: 'Doorlopend kaartkrediet',
      definicao: 'Het krediet dat ontstaat als je minder betaalt dan het volledige creditcardoverzicht. Het heeft een zeer hoge rente: alleen het minimum betalen laat de schuld groeien.',
    },
  ],
};
