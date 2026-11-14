import type { TextosAcademy } from '@/data/academy/estrutura';

/** Trust Academy auf Deutsch. */
export const academyDe: TextosAcademy = {
  categorias: {
    basico: { nome: 'Erste Schritte', descricao: 'Die Grundlagen, um Geld zu ordnen.' },
    orcamento: { nome: 'Budget', descricao: 'Den Monat planen und Ausgaben im Griff behalten.' },
    dividas: { nome: 'Schulden', descricao: 'Raus aus den roten Zahlen – und draußen bleiben.' },
    investimentos: { nome: 'Geldanlage', descricao: 'Das Geld für sich arbeiten lassen.' },
  },
  cursos: {
    'financas-do-zero': { titulo: 'Finanzen von Grund auf', resumo: 'Ausgaben verstehen, einen Notgroschen aufbauen und Ziele setzen, die funktionieren.' },
    'orcamento-sem-sofrimento': { titulo: 'Budget ohne Stress', resumo: 'Einkommen aufteilen, Fixkosten kontrollieren und ohne schlechtes Gewissen ausgeben.' },
    'saindo-do-vermelho': { titulo: 'Raus aus den roten Zahlen', resumo: 'Die Karte ohne Fallen nutzen, Schulden ordnen und verhandeln.' },
    'comecando-a-investir': { titulo: 'Mit dem Anlegen beginnen', resumo: 'Inflation, Zinseszins und die ersten Schritte beim Anlegen.' },
  },
  aulas: {
    'reserva-emergencia': {
      titulo: 'So bauen Sie einen Notgroschen auf',
      resumo: 'Der erste Schritt zu mehr Gelassenheit beim Geld.',
      paragrafos: [
        'Der Notgroschen ist Geld, das nur für Unvorhergesehenes zurückgelegt wird: Jobverlust, ein gesundheitliches Problem, das kaputte Auto. Er verhindert, dass aus einem Schreck Kartenschulden oder ein Dispo werden.',
        'Eine gängige Richtgröße sind 3 bis 6 Monate Ihrer notwendigen Ausgaben. Wer ein schwankendes Einkommen hat (etwa Selbstständige), braucht meist mehr, eher 12 Monate.',
        'Dieses Geld sollte sicher liegen und schnell verfügbar sein, am besten noch am selben Tag. Eine hohe Rendite ist nicht das Ziel: Wichtig ist, dass es da ist, wenn Sie es brauchen.',
        'Fangen Sie klein an. Einen festen Monatsbetrag, auch einen niedrigen, gleich nach dem Gehaltseingang zurückzulegen, funktioniert besser, als auf einen Rest am Monatsende zu warten.',
      ],
      pontosChave: [
        'Ziel: Unvorhergesehenes ohne Schulden auffangen.',
        'Übliche Richtgröße: 3 bis 6 Monate notwendiger Ausgaben.',
        'Sicherheit und schneller Zugriff zählen mehr als Rendite.',
        'Sparen Sie am Monatsanfang, nicht mit dem Rest.',
      ],
      quiz: {
        pergunta: 'Was ist die wichtigste Eigenschaft des Ortes, an dem der Notgroschen liegt?',
        opcoes: ['Möglichst viel Rendite', 'Sicher und schnell verfügbar', 'Für einige Jahre gebunden'],
        explicacao: 'Der Notgroschen ist für Notfälle da: Er muss verfügbar sein, wenn Sie ihn brauchen, auch wenn er weniger bringt.',
      },
    },
    'regra-50-30-20': {
      titulo: '50/30/20: Wie funktioniert das?',
      resumo: 'Eine einfache Art, Ihr Geld jeden Monat aufzuteilen.',
      paragrafos: [
        'Die 50/30/20-Regel teilt das Nettoeinkommen (was auf dem Konto ankommt) in drei Teile: 50 % für Notwendiges, 30 % für Wünsche und 20 % für finanzielle Ziele.',
        'Notwendiges sind Ausgaben, die sich nicht vermeiden lassen: Wohnen, Grundkosten, Lebensmittel, Mobilität, Gesundheit. Wünsche machen das Leben schöner, lassen sich aber anpassen: Freizeit, Einkäufe, Restaurants, Abos.',
        'Die 20 % gehen in die Zukunft: Notgroschen, Schulden tilgen und für Ihre Ziele anlegen.',
        'Die Zahlen sind ein Ausgangspunkt, keine starre Regel. Liegt das Notwendige über 50 %, kürzen Sie zuerst bei den Wünschen. In EcoTrust können Sie mit Kategoriebudgets diesen Plan umsetzen.',
      ],
      pontosChave: ['50 % Notwendiges, 30 % Wünsche, 20 % Zukunft.', 'Nehmen Sie das Nettoeinkommen als Basis.', 'Passen Sie die Prozentsätze an Ihre Lage an.'],
      quiz: {
        pergunta: 'Wofür sind die 20 % in der 50/30/20-Regel?',
        opcoes: ['Freizeit und Einkäufe', 'Haushaltsrechnungen', 'Notgroschen, Schulden und Geldanlage'],
        explicacao: 'Die 20 % sind Geld für die Zukunft: Notgroschen, Schuldentilgung und Geldanlage.',
      },
    },
    'gastos-recorrentes': {
      titulo: 'Wiederkehrende Kosten im Griff',
      resumo: 'Abos und Fixkosten wiegen schwerer, als es scheint.',
      paragrafos: [
        'Wiederkehrende Kosten fallen jeden Monat an: Miete oder Kreditrate, Nebenkosten, Internet, Handy, Fitnessstudio und Abos. Weil sie automatisch abgebucht werden, vergisst man leicht, wie viel sie zusammen ausmachen.',
        'Eine gute Richtgröße ist, die Fixkosten zwischen 30 % und 50 % des Einkommens zu halten. Darüber wird das Budget bei jeder Überraschung knapp.',
        'Prüfen Sie alle paar Monate: Listen Sie alles auf, was automatisch abgebucht wird, und fragen Sie sich, ob Sie jeden Dienst noch nutzen. Ein vergessenes Abo zu kündigen ist eine Ersparnis, die sich jeden Monat wiederholt.',
        'Nachverhandeln oder Angebote vergleichen lohnt sich ebenfalls: Internet, Handy, Energie und Versicherungen haben oft bessere Konditionen für alle, die nachfragen. Markieren Sie in EcoTrust wiederkehrende Ausgaben als „wiederkehrend", um die Summe zu sehen.',
      ],
      pontosChave: ['Rechnen Sie alles zusammen, was monatlich abgebucht wird.', 'Prüfen Sie Abos regelmäßig.', 'Fixkosten nachzuverhandeln spart dauerhaft.'],
      quiz: {
        pergunta: 'Welche Maßnahme senkt wiederkehrende Kosten dauerhaft?',
        opcoes: ['Ungenutzte Abos prüfen und kündigen', 'Rechnungen zu spät zahlen', 'Jeden Monat die Karte wechseln'],
        explicacao: 'Jedes gekündigte Abo ist eine Ersparnis, die sich jeden Monat wiederholt.',
      },
    },
    'gastos-superfluos': {
      titulo: 'Nicht notwendige Ausgaben: kürzen ohne Verzicht',
      resumo: 'Es geht nicht darum, aufs Leben zu verzichten, sondern besser zu wählen.',
      paragrafos: [
        'Freizeit, Einkäufe, Lieferdienste und Reisen gehören zu einem guten Leben. Problematisch wird es, wenn sie unbemerkt wachsen und den Platz von Notgroschen und Zielen einnehmen.',
        'Statt alles zu streichen, legen Sie ein Monatslimit für diese Kategorien fest. Zu wissen, wie viel man noch ausgeben darf, gibt Freiheit und vermeidet ein schlechtes Gewissen.',
        'Einige Strategien helfen: vor Spontankäufen 48 Stunden warten, das bevorzugen, was Ihnen wirklich wichtig ist, und streichen, was Sie nur aus Gewohnheit tun.',
        'Kleine Kürzungen summieren sich. Die nicht notwendigen Ausgaben um 10 % zu senken und den Betrag einem Ziel zuzuführen, macht schon nach wenigen Monaten einen Unterschied.',
      ],
      pontosChave: ['Setzen Sie Limits, keine Verbote.', 'Warten Sie vor Spontankäufen.', 'Lenken Sie Erspartes in ein Ziel.'],
      quiz: {
        pergunta: 'Wie geht man am nachhaltigsten mit nicht notwendigen Ausgaben um?',
        opcoes: ['Alle auf einmal streichen', 'Ein Monatslimit dafür festlegen', 'Ignorieren und am Monatsende nachsehen'],
        explicacao: 'Ein Limit erlaubt Genuss ohne schlechtes Gewissen und schützt Ihre Ziele.',
      },
    },
    'sair-das-dividas': {
      titulo: 'Raus aus den Schulden: Wo anfangen?',
      resumo: 'Eine Schritt-für-Schritt-Anleitung, um Schulden zu ordnen und zu tilgen.',
      paragrafos: [
        'Der erste Schritt ist, genau zu wissen, was Sie schulden: wem, wie viel, zu welchem Zinssatz (achten Sie auf den effektiven Jahreszins) und mit welchen Raten. Alles in einer Liste nimmt dem Unbekannten das Gewicht.',
        'Tilgen Sie zuerst die Schulden mit den höchsten Zinsen, etwa Kartensalden mit Mindestzahlung und den Dispo. Sie wachsen sehr schnell und sollten als Erstes weg.',
        'Versuchen Sie nachzuverhandeln. Gläubiger akzeptieren oft andere Laufzeiten oder Raten, vor allem wenn Sie sich melden, bevor Zahlungen ausbleiben. Mehrere Schulden in einem günstigeren Kredit zusammenzufassen kann ebenfalls helfen, solange Sie den alten Rahmen nicht wieder nutzen.',
        'Vermeiden Sie während der Tilgung neue Schulden und behalten Sie Ihre Ausgaben genau im Blick. Danach verhindert der Notgroschen, dass Sie wieder ins Minus rutschen.',
      ],
      pontosChave: [
        'Listen Sie alle Schulden mit Zins (effektiver Jahreszins) und Raten auf.',
        'Beginnen Sie mit den höchsten Zinsen.',
        'Verhandeln Sie, bevor Zahlungen ausbleiben.',
        'Bauen Sie danach einen Notgroschen auf, um nicht zurückzufallen.',
      ],
      quiz: {
        pergunta: 'Welche Schulden werden beim Ordnen meist zuerst getilgt?',
        opcoes: ['Die kleinsten', 'Die mit den höchsten Zinsen', 'Die ältesten'],
        explicacao: 'Schulden wie revolvierender Kartenkredit und Dispo wachsen am schnellsten, deshalb kommen sie zuerst.',
      },
    },
    'primeiros-investimentos': {
      titulo: 'Erste Schritte beim Anlegen',
      resumo: 'Was Sie verstehen sollten, bevor Sie Ihr Geld anlegen.',
      paragrafos: [
        'Vor dem Anlegen sollten teure Schulden getilgt und ein Notgroschen vorhanden sein. So müssen Sie eine Anlage nicht im ungünstigsten Moment auflösen.',
        'Jede Anlage verbindet drei Eigenschaften: Rendite (was sie bringt), Risiko (wie stark sie schwanken oder verlieren kann) und Liquidität (wie schnell sie wieder zu Geld auf dem Konto wird). Keine Option ist in allen dreien zugleich top.',
        'Bei festverzinslichen Anlagen stehen die Regeln von Anfang an fest, etwa bei Festgeld und Anleihen, auch Staatsanleihen. Bei schwankenden Anlagen wie Aktien und vielen Fonds ändert sich der Wert mit dem Markt und kann fallen.',
        'Ihr Anlegerprofil (konservativ, ausgewogen oder risikofreudig) und der Zeitraum jedes Ziels helfen bei der Wahl. Streuen, also nicht alles an einem Ort anlegen, senkt das Risiko. In der EU müssen zugelassene Anbieter prüfen, ob ein Produkt zu Ihnen passt (MiFID-II-Regeln). Dieser Inhalt dient der Bildung und ist keine Anlageberatung.',
      ],
      pontosChave: [
        'Zuerst: teure Schulden getilgt und Notgroschen bereit.',
        'Rendite, Risiko und Liquidität hängen zusammen.',
        'Wählen Sie nach Ihrem Profil und dem Zeitraum des Ziels.',
        'Streuen Sie.',
      ],
      quiz: {
        pergunta: 'Was sollten Sie haben, bevor Sie mit dem Anlegen beginnen?',
        opcoes: ['Getilgte teure Schulden und einen Notgroschen', 'Ein neues Auto', 'Einen Kredit, um mehr anzulegen'],
        explicacao: 'So müssen Sie nicht zur falschen Zeit verkaufen und zahlen keine höheren Zinsen, als Sie verdienen.',
      },
    },
    'metas-financeiras': {
      titulo: 'So setzen Sie Ziele, die funktionieren',
      resumo: 'Machen Sie aus Wünschen Pläne mit Betrag und Frist.',
      paragrafos: [
        '„Ich will Geld sparen" ist ein Wunsch. „Ich will in 12 Monaten 6000 für eine Reise zurücklegen" ist ein Ziel: Es hat einen Betrag, eine Frist und einen Grund.',
        'Mit Betrag und Frist wissen Sie leicht, wie viel Sie monatlich sparen müssen. Im Beispiel sind es 500 pro Monat. Passt das nicht ins Budget, passen Sie Frist oder Ziel an.',
        'Den Fortschritt zu verfolgen hält die Motivation hoch. Erfassen Sie jeden zurückgelegten Betrag und feiern Sie Etappen wie 25 % und 50 %.',
        'Beginnen Sie mit ein oder zwei Zielen. Zu viele Ziele gleichzeitig verteilen das Geld und dauern länger.',
      ],
      pontosChave: ['Ziel = Betrag + Frist + Grund.', 'Betrag durch Frist teilen ergibt die Monatsrate.', 'Fortschritt verfolgen und feiern.'],
      quiz: {
        pergunta: 'Was macht aus einem Wunsch ein Ziel?',
        opcoes: ['Es Freunden erzählen', 'Betrag, Frist und Grund', 'Zurücklegen, was übrig bleibt'],
        explicacao: 'Mit Betrag und Frist wissen Sie, wie viel Sie monatlich sparen müssen, und der Grund hält Sie motiviert.',
      },
    },
    'para-onde-vai-o-dinheiro': {
      titulo: 'Wohin Ihr Geld fließt',
      resumo: 'Ausgaben erfassen ist der erste Schritt zu besseren Entscheidungen.',
      paragrafos: [
        'Viele wissen, wie viel sie verdienen, aber nicht, wie viel sie ausgeben. Ohne diese Information ist jeder Plan geraten: Das Geld verschwindet, und es bleibt das Gefühl, dass nie etwas übrig ist.',
        'Schon einige Wochen Einnahmen und Ausgaben zu erfassen zeigt Muster. Kleine Alltagsausgaben wie Kaffee, Apps und Gebühren ergeben meist mehr als gedacht.',
        'Teilen Sie die Ausgaben in Kategorien ein, etwa Wohnen, Essen, Mobilität und Freizeit. So sehen Sie leicht, wo das größte Gewicht liegt und wo Sie ansetzen können.',
        'Es geht nicht um ein schlechtes Gewissen, sondern um Klarheit. Mit den Zahlen in der Hand entscheiden Sie, was Vorrang hat. In EcoTrust übernehmen Verlauf und Monatsübersicht die Rechnung für Sie.',
      ],
      pontosChave: ['Ohne Aufzeichnung keine Planung.', 'Kleine Ausgaben summieren sich im Monat stark.', 'Kategorien zeigen, wo das größte Gewicht liegt.'],
      quiz: {
        pergunta: 'Warum sollte man Alltagsausgaben erfassen?',
        opcoes: ['Um zu sehen, wohin das Geld fließt, und besser zu entscheiden', 'Weil das Gesetz es verlangt', 'Um am Monatsende mehr auszugeben'],
        explicacao: 'Die Zahlen zeigen Muster, die sonst untergehen, etwa kleine Ausgaben, die sich stark summieren.',
      },
    },
    'juros-do-cartao': {
      titulo: 'Kreditkarte ohne Fallen',
      resumo: 'So nutzen Sie die Karte zu Ihrem Vorteil und meiden die teuersten Zinsen.',
      paragrafos: [
        'Die Kreditkarte ist praktisch und kann sogar die Einkäufe des Monats ordnen. Das Problem beginnt, wenn die Abrechnung nicht vollständig bezahlt wird.',
        'Zahlen Sie nur einen Teil (die Mindestzahlung oder eine Teilzahlung), wird der Rest zu revolvierendem Kredit, einer der teuersten Kreditformen. Vergleichen Sie immer den effektiven Jahreszins, der die Gesamtkosten pro Jahr zeigt.',
        'Für eine gute Nutzung: Betrachten Sie den Kreditrahmen als Geld, das Sie schon haben, nicht als zusätzliches Einkommen. Notieren Sie Ratenkäufe, denn sie belasten die Abrechnungen der kommenden Monate.',
        'Passt die Abrechnung nicht mehr ins Budget, sprechen Sie vor dem Fälligkeitstermin mit Ihrer Bank, um günstigere Optionen kennenzulernen.',
      ],
      pontosChave: ['Bezahlen Sie die Abrechnung immer vollständig.', 'Revolvierender Kartenkredit hat sehr hohe Zinsen.', 'Raten von heute belasten das Einkommen von morgen.'],
      quiz: {
        pergunta: 'Was passiert, wenn Sie bei der Karte nur die Mindestzahlung leisten?',
        opcoes: ['Nichts, der Rest wird erlassen', 'Der Rest wird zu einem Kredit mit sehr hohen Zinsen', 'Der Kartenrahmen steigt'],
        explicacao: 'Der offene Betrag wird zu revolvierendem Kredit, einer der teuersten Kreditformen am Markt.',
      },
    },
    'negociar-dividas': {
      titulo: 'So verhandeln Sie über Schulden',
      resumo: 'Bereiten Sie sich vor, um Konditionen zu erhalten, die in Ihr Budget passen.',
      paragrafos: [
        'Wissen Sie vor der Verhandlung, wie viel Sie monatlich zahlen können, ohne dass das Notwendige fehlt. Eine Rate zu akzeptieren, die nicht passt, verschiebt das Problem nur.',
        'Fragen Sie nach dem Gesamtbetrag des Angebots, dem effektiven Jahreszins und der Zahl der Raten. Eine kleine Rate über viele Monate kann am Ende deutlich teurer sein.',
        'Gläubiger bieten oft bessere Konditionen, wenn man sich früh meldet. In vielen EU-Ländern gibt es öffentliche oder kostenlose Schuldnerberatungen: Suchen Sie die in Ihrem Land.',
        'Bewahren Sie alle Belege und die Vereinbarung schriftlich auf. Verhandeln Sie nur über die offiziellen Kanäle des Gläubigers und misstrauen Sie allen, die Vorkasse verlangen, um Ihren Eintrag bei einer Auskunftei zu „löschen".',
      ],
      pontosChave: ['Wissen Sie vor der Verhandlung, was in Ihren Monat passt.', 'Vergleichen Sie den Gesamtbetrag, nicht nur die Rate.', 'Nur offizielle Kanäle nutzen und die Vereinbarung aufbewahren.'],
      quiz: {
        pergunta: 'Was ist beim Bewerten eines Umschuldungsangebots am wichtigsten zu vergleichen?',
        opcoes: ['Nur die Ratenhöhe', 'Gesamtbetrag, Zinsen und ob die Rate in den Monat passt', 'Die Farbe des Bankbriefs'],
        explicacao: 'Eine niedrige Rate über viele Monate kann viel mehr kosten. Achten Sie auf die Summe und ob es ins Budget passt.',
      },
    },
    inflacao: {
      titulo: 'Inflation: Warum ruhendes Geld an Wert verliert',
      resumo: 'Verstehen Sie, was Ihre Kaufkraft schmälert.',
      paragrafos: [
        'Inflation ist der allgemeine Anstieg der Preise im Lauf der Zeit. Mit ihr kauft man mit demselben Geldbetrag jedes Jahr weniger.',
        'Deshalb verliert Geld, das nichts einbringt, nach und nach an Wert. Steigen die Preise in einem Jahr um 5 %, kaufen 100 ruhende Einheiten nur noch etwa so viel wie 95.',
        'Um die Kaufkraft zu schützen, muss die Rendite des Ersparten über der Inflation liegen. Dieser Gewinn über der Inflation heißt Realrendite.',
        'In der EU wird die Inflation mit dem Harmonisierten Verbraucherpreisindex (HVPI) gemessen. Im Euroraum strebt die Europäische Zentralbank mittelfristig 2 % an; Länder mit eigener Währung haben ihre eigene Zentralbank.',
      ],
      pontosChave: ['Inflation = steigende Preise und Geld, das weniger kauft.', 'Ruhendes Geld verliert Kaufkraft.', 'Suchen Sie Renditen über der Inflation.'],
      quiz: {
        pergunta: 'Die Inflation lag im Jahr bei 5 %, Ihr Geld brachte 3 %. Was ist passiert?',
        opcoes: ['Sie haben Kaufkraft gewonnen', 'Sie haben Kaufkraft verloren', 'Nichts hat sich geändert'],
        explicacao: 'Die Rendite lag unter der Inflation, daher kauft Ihr Geld jetzt weniger.',
      },
    },
    'juros-compostos': {
      titulo: 'Zinseszins: Die Zeit arbeitet für Sie',
      resumo: 'Warum ein früher Start so viel ausmacht.',
      paragrafos: [
        'Beim Zinseszins bringt der Ertrag jedes Monats in den folgenden Monaten selbst wieder Ertrag. Das sind die berühmten „Zinsen auf Zinsen".',
        'Anfangs wirkt der Unterschied klein, doch mit der Zeit beschleunigt er sich. Je länger der Zeitraum, desto größer der Anteil der Summe, der aus den Erträgen selbst stammt.',
        'Deshalb lohnt es sich meist mehr, früh mit wenig zu beginnen als spät mit größeren Beträgen. Auch Regelmäßigkeit zählt: monatliche Einzahlungen verstärken den Effekt.',
        'Derselbe Mechanismus wirkt bei Schulden gegen Sie. Der Zinseszins lässt Kartenschulden sehr schnell wachsen, ein weiterer Grund, sie zuerst zu tilgen.',
      ],
      pontosChave: ['Erträge bringen selbst wieder Ertrag.', 'Zeit und Regelmäßigkeit verstärken den Effekt.', 'Bei Schulden wirkt der Effekt gegen Sie.'],
      quiz: {
        pergunta: 'Welcher Faktor verstärkt den Zinseszinseffekt am meisten?',
        opcoes: ['Die Zeit', 'Jeden Monat die Erträge abheben', 'Jede Woche die Anlage wechseln'],
        explicacao: 'Je länger das Geld angelegt bleibt, desto mehr erzeugen die Erträge neue Erträge.',
      },
    },
  },
  dicas: [
    'Sparen Sie am Zahltag, nicht mit dem Rest am Monatsende.',
    'Warten Sie vor einem Spontankauf 48 Stunden. Oft vergeht die Lust.',
    'Prüfen Sie Ihre Abos alle drei Monate und kündigen Sie, was Sie nicht nutzen.',
    'Nur die Mindestzahlung der Karte zu leisten macht den Rest zu einem Kredit mit sehr hohen Zinsen.',
    'Ausgaben täglich zu erfassen dauert keine Minute und zeigt, wohin das Geld fließt.',
    'Preise für feste Dienste (Internet, Handy, Energie, Versicherungen) zu vergleichen kann jeden Monat sparen.',
    'Ein Ziel mit Frist ist leichter zu erreichen als „sparen, was geht".',
    'Bauen Sie vor dem Anlegen Ihren Notgroschen auf.',
  ],
  conceitos: [
    { termo: 'Notgroschen', definicao: 'Geld für Unvorhergesehenes, sicher und schnell verfügbar angelegt. Übliche Richtgröße: 3 bis 6 Monate notwendiger Ausgaben.' },
    { termo: 'Liquidität', definicao: 'Wie leicht und schnell sich eine Anlage ohne Wertverlust in verfügbares Geld umwandeln lässt.' },
    {
      termo: 'Zinseszins',
      definicao: 'Zinsen auf den Anfangsbetrag plus die bereits angefallenen Zinsen. Sie lassen Anlagen mit der Zeit stärker wachsen und Schulden schnell steigen.',
    },
    {
      termo: 'EZB-Leitzinsen',
      definicao: 'Die Leitzinsen, die die Europäische Zentralbank für den Euroraum festlegt. Sie beeinflussen die Zinsen für Einlagen und Kredite. EU-Länder mit eigener Währung haben ihre eigene Zentralbank.',
    },
    { termo: 'Euribor', definicao: 'Referenzzins, zu dem sich Banken im Euroraum gegenseitig Geld leihen. Er wird für viele Kredite mit variablem Zins genutzt, etwa Baufinanzierungen.' },
    {
      termo: 'Inflation (HVPI)',
      definicao: 'Der allgemeine Preisanstieg. In der EU wird er mit dem Harmonisierten Verbraucherpreisindex gemessen. Bringt eine Anlage weniger als die Inflation, verlieren Sie Kaufkraft.',
    },
    {
      termo: 'Effektiver Jahreszins',
      definicao: 'Die gesamten Kosten eines Kredits pro Jahr, inklusive Zinsen und Gebühren. In der EU muss er immer angegeben werden und dient zum Vergleich von Krediten.',
    },
    { termo: 'Festverzinsliche Anlagen', definicao: 'Anlagen, deren Ertragsregeln von Anfang an feststehen, etwa Festgeld und Anleihen.' },
    { termo: 'Schwankende Anlagen', definicao: 'Anlagen, deren Wert sich mit dem Markt ändert, etwa Aktien und viele Fonds. Sie können mehr bringen, aber auch fallen.' },
    {
      termo: 'Einlagensicherung',
      definicao: 'In der EU sind Bankeinlagen bis 100 000 € (oder dem Gegenwert in Landeswährung) pro Einleger und Bank geschützt, falls die Bank ausfällt. Anlagen wie Aktien und Fonds sind nicht abgedeckt.',
    },
    {
      termo: 'Revolvierender Kartenkredit',
      definicao: 'Der Kredit, der entsteht, wenn Sie weniger als die volle Kartenabrechnung zahlen. Er hat sehr hohe Zinsen: Nur die Mindestzahlung lässt die Schuld weiter wachsen.',
    },
  ],
};
