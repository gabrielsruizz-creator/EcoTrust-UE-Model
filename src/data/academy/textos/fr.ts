import type { TextosAcademy } from '@/data/academy/estrutura';

/** Trust Academy en français. */
export const academyFr: TextosAcademy = {
  categorias: {
    basico: { nome: 'Premiers pas', descricao: 'Les bases pour organiser son argent.' },
    orcamento: { nome: 'Budget', descricao: 'Planifier le mois et maîtriser les dépenses.' },
    dividas: { nome: 'Dettes', descricao: 'Sortir du rouge et ne pas y retourner.' },
    investimentos: { nome: 'Placements', descricao: 'Faire travailler son argent.' },
  },
  cursos: {
    'financas-do-zero': { titulo: 'Les finances de zéro', resumo: 'Comprenez vos dépenses, constituez votre épargne de précaution et des objectifs qui fonctionnent.' },
    'orcamento-sem-sofrimento': { titulo: 'Un budget sans souffrance', resumo: 'Répartissez vos revenus, maîtrisez les charges fixes et dépensez sans culpabilité.' },
    'saindo-do-vermelho': { titulo: 'Sortir du rouge', resumo: 'Utilisez votre carte sans pièges, organisez et négociez vos dettes.' },
    'comecando-a-investir': { titulo: 'Commencer à investir', resumo: 'Inflation, intérêts composés et premiers pas pour investir.' },
  },
  aulas: {
    'reserva-emergencia': {
      titulo: 'Comment constituer une épargne de précaution',
      resumo: 'La première étape pour être serein avec l\'argent.',
      paragrafos: [
        'L\'épargne de précaution est de l\'argent mis de côté uniquement pour les imprévus : perte d\'emploi, problème de santé, panne de voiture. Elle évite qu\'un coup dur se transforme en dette sur la carte ou en découvert bancaire.',
        'Une référence courante consiste à mettre de côté 3 à 6 mois de dépenses essentielles. Les personnes aux revenus variables (les indépendants, par exemple) ont souvent besoin de plus, près de 12 mois.',
        'Cet argent doit être placé en lieu sûr et pouvoir être retiré rapidement, idéalement le jour même. Un rendement élevé n\'est pas l\'objectif : l\'important est qu\'il soit disponible quand vous en avez besoin.',
        'Commencez petit. Fixer un montant mensuel, même faible, et le mettre de côté dès que vous êtes payé fonctionne mieux que d\'attendre ce qui reste en fin de mois.',
      ],
      pontosChave: [
        'Objectif : faire face aux imprévus sans s\'endetter.',
        'Repère courant : 3 à 6 mois de dépenses essentielles.',
        'La sécurité et l\'accès rapide comptent plus que le rendement.',
        'Épargnez en début de mois, pas avec ce qui reste.',
      ],
      quiz: {
        pergunta: 'Quelle est la caractéristique la plus importante de l\'endroit où se trouve l\'épargne de précaution ?',
        opcoes: ['Rapporter le plus possible', 'Être sûr et permettre un retrait rapide', 'Être bloqué pendant quelques années'],
        explicacao: 'Cette épargne sert aux imprévus : elle doit être disponible quand vous en avez besoin, même si elle rapporte moins.',
      },
    },
    'regra-50-30-20': {
      titulo: '50/30/20 : comment ça marche ?',
      resumo: 'Une façon simple de répartir votre argent chaque mois.',
      paragrafos: [
        'La règle 50/30/20 répartit le revenu net (ce qui arrive sur le compte) en trois parts : 50 % pour les besoins, 30 % pour les envies et 20 % pour les objectifs financiers.',
        'Les besoins sont les dépenses incontournables : logement, factures de base, courses, transports, santé. Les envies rendent la vie plus agréable mais peuvent être ajustées : loisirs, achats, restaurants, abonnements.',
        'Les 20 % vont à l\'avenir : épargne de précaution, remboursement des dettes et placements pour vos objectifs.',
        'Ces chiffres sont un point de départ, pas une règle stricte. Si les besoins dépassent 50 %, essayez d\'abord de réduire les envies. Dans EcoTrust, le budget par catégorie permet de mettre ce plan en pratique.',
      ],
      pontosChave: ['50 % besoins, 30 % envies, 20 % avenir.', 'Prenez le revenu net comme base.', 'Adaptez les pourcentages à votre situation.'],
      quiz: {
        pergunta: 'Dans la règle 50/30/20, à quoi servent les 20 % ?',
        opcoes: ['Loisirs et achats', 'Factures du foyer', 'Épargne de précaution, dettes et placements'],
        explicacao: 'Les 20 % sont l\'argent de l\'avenir : épargne de précaution, remboursement des dettes et placements.',
      },
    },
    'gastos-recorrentes': {
      titulo: 'Comment maîtriser les dépenses récurrentes',
      resumo: 'Abonnements et charges fixes pèsent plus qu\'il n\'y paraît.',
      paragrafos: [
        'Les dépenses récurrentes reviennent chaque mois : loyer ou crédit immobilier, charges, internet, téléphone, salle de sport et abonnements. Comme elles sont automatiques, on oublie facilement leur total.',
        'Un bon repère est de garder les charges fixes entre 30 % et 50 % du revenu. Au-delà, le moindre imprévu met le budget sous tension.',
        'Faites le point tous les quelques mois : listez tout ce qui est prélevé automatiquement et demandez-vous si vous utilisez encore chaque service. Résilier un abonnement oublié, c\'est une économie qui se répète chaque mois.',
        'Il vaut aussi la peine de renégocier ou de comparer les offres : internet, téléphone, énergie et assurances proposent souvent de meilleures conditions à ceux qui les demandent. Dans EcoTrust, marquez les dépenses qui reviennent comme « récurrentes » pour voir le total.',
      ],
      pontosChave: ['Additionnez tout ce qui est prélevé chaque mois.', 'Revoyez régulièrement vos abonnements.', 'Renégocier les charges fixes, c\'est une économie durable.'],
      quiz: {
        pergunta: 'Quelle action réduit durablement les dépenses récurrentes ?',
        opcoes: ['Revoir et résilier les abonnements inutilisés', 'Payer les factures en retard', 'Changer de carte tous les mois'],
        explicacao: 'Chaque abonnement résilié est une économie qui se répète tous les mois.',
      },
    },
    'gastos-superfluos': {
      titulo: 'Dépenses non essentielles : réduire sans souffrir',
      resumo: 'Il ne s\'agit pas d\'arrêter de vivre, mais de mieux choisir.',
      paragrafos: [
        'Loisirs, achats, livraisons de repas et voyages font partie d\'une belle vie. Le problème apparaît quand ils augmentent sans qu\'on s\'en rende compte et prennent la place de l\'épargne de précaution et des objectifs.',
        'Plutôt que de tout couper, fixez une limite mensuelle pour ces catégories. Savoir ce qu\'on peut encore dépenser donne de la liberté et évite la culpabilité.',
        'Quelques stratégies aident : attendre 48 heures avant un achat impulsif, privilégier ce qui compte vraiment pour vous et couper ce que vous faites par habitude.',
        'Les petites réductions s\'additionnent. Baisser de 10 % les dépenses non essentielles et verser ce montant vers un objectif fait déjà la différence en quelques mois.',
      ],
      pontosChave: ['Fixez des limites, pas des interdictions.', 'Attendez avant un achat impulsif.', 'Versez vos économies vers un objectif.'],
      quiz: {
        pergunta: 'Quelle est la façon la plus durable de gérer les dépenses non essentielles ?',
        opcoes: ['Tout couper d\'un coup', 'Leur fixer une limite mensuelle', 'Les ignorer et regarder en fin de mois'],
        explicacao: 'Une limite permet de profiter sans culpabilité et protège vos objectifs.',
      },
    },
    'sair-das-dividas': {
      titulo: 'Sortir des dettes : par où commencer',
      resumo: 'Une méthode pas à pas pour organiser et rembourser ce que vous devez.',
      paragrafos: [
        'La première étape est de savoir exactement ce que vous devez : à qui, combien, le taux d\'intérêt (regardez le TAEG) et le montant des mensualités. Tout mettre sur une liste enlève le poids de l\'inconnu.',
        'Donnez la priorité aux dettes aux intérêts les plus élevés, comme la carte remboursée au minimum et les découverts bancaires. Elles grossissent très vite et doivent partir en premier.',
        'Essayez de renégocier. Les créanciers acceptent souvent d\'autres durées ou mensualités, surtout si vous les contactez avant un impayé. Regrouper plusieurs dettes dans un crédit moins cher peut aussi aider, à condition de ne pas réutiliser l\'ancienne réserve.',
        'Pendant le remboursement, évitez de nouvelles dettes et suivez vos dépenses de près. Une fois sorti, l\'épargne de précaution est ce qui empêche de retomber dans le rouge.',
      ],
      pontosChave: [
        'Listez toutes les dettes avec leur taux (TAEG) et leurs mensualités.',
        'Commencez par les intérêts les plus élevés.',
        'Renégociez avant un impayé.',
        'Ensuite, constituez une épargne de précaution pour ne pas rechuter.',
      ],
      quiz: {
        pergunta: 'Quand on organise ses dettes, lesquelles rembourse-t-on généralement en premier ?',
        opcoes: ['Les plus petites', 'Celles aux intérêts les plus élevés', 'Les plus anciennes'],
        explicacao: 'Les dettes comme le crédit renouvelable de la carte et le découvert grossissent le plus vite, elles partent donc en premier.',
      },
    },
    'primeiros-investimentos': {
      titulo: 'Premiers pas pour investir',
      resumo: 'Ce qu\'il faut comprendre avant de faire fructifier son argent.',
      paragrafos: [
        'Avant d\'investir, mieux vaut avoir remboursé les dettes chères et constitué l\'épargne de précaution. Ainsi, vous n\'aurez pas à vendre un placement au pire moment.',
        'Tout placement combine trois caractéristiques : le rendement (ce qu\'il rapporte), le risque (combien il peut varier ou perdre) et la liquidité (la vitesse à laquelle il redevient de l\'argent sur le compte). Aucune option n\'excelle dans les trois à la fois.',
        'En revenu fixe, les règles sont connues dès le départ, comme pour les dépôts à terme et les obligations, y compris celles de l\'État. En revenu variable, comme les actions et de nombreux fonds, la valeur évolue avec le marché et peut baisser.',
        'Votre profil d\'investisseur (prudent, équilibré ou dynamique) et l\'horizon de chaque objectif aident à choisir. Diversifier, c\'est-à-dire ne pas tout mettre au même endroit, réduit le risque. Dans l\'UE, les établissements agréés doivent évaluer si un produit vous convient (règles MiFID II). Ce contenu est éducatif et ne constitue pas un conseil en investissement.',
      ],
      pontosChave: [
        'D\'abord : dettes chères remboursées et épargne de précaution prête.',
        'Rendement, risque et liquidité vont ensemble.',
        'Choisissez selon votre profil et l\'horizon de l\'objectif.',
        'Diversifiez.',
      ],
      quiz: {
        pergunta: 'Que vaut-il mieux avoir avant de commencer à investir ?',
        opcoes: ['Des dettes chères remboursées et une épargne de précaution', 'Une voiture neuve', 'Un crédit pour investir davantage'],
        explicacao: 'Ainsi, vous n\'aurez pas à vendre au mauvais moment ni à payer plus d\'intérêts que vous ne gagnez.',
      },
    },
    'metas-financeiras': {
      titulo: 'Comment fixer des objectifs qui fonctionnent',
      resumo: 'Transformez vos envies en plans avec un montant et une échéance.',
      paragrafos: [
        '« Je veux épargner » est un souhait. « Je veux mettre de côté 6000 pour un voyage dans 12 mois » est un objectif : il a un montant, une échéance et une raison.',
        'Avec un montant et une échéance, il est facile de savoir combien épargner par mois. Dans l\'exemple, c\'est 500 par mois. Si cela ne rentre pas dans le budget, ajustez l\'échéance ou l\'objectif.',
        'Suivre ses progrès entretient la motivation. Enregistrez chaque montant mis de côté et fêtez les étapes, comme 25 % et 50 %.',
        'Commencez par un ou deux objectifs. Trop d\'objectifs à la fois dispersent l\'argent et prennent plus de temps.',
      ],
      pontosChave: ['Objectif = montant + échéance + raison.', 'Divisez le montant par la durée pour connaître le mensuel.', 'Suivez et fêtez vos progrès.'],
      quiz: {
        pergunta: 'Qu\'est-ce qui transforme un souhait en objectif ?',
        opcoes: ['En parler à ses amis', 'Avoir un montant, une échéance et une raison', 'Mettre de côté ce qui reste'],
        explicacao: 'Avec un montant et une échéance, vous savez combien épargner par mois, et la raison entretient la motivation.',
      },
    },
    'para-onde-vai-o-dinheiro': {
      titulo: 'Où va votre argent',
      resumo: 'Noter ses dépenses est la première étape pour mieux décider.',
      paragrafos: [
        'Beaucoup de gens savent combien ils gagnent, mais pas combien ils dépensent. Sans cette information, tout plan est un pari : l\'argent disparaît et on a l\'impression qu\'il ne reste jamais rien.',
        'Noter revenus et dépenses pendant quelques semaines révèle déjà des tendances. Les petites dépenses du quotidien, comme les cafés, les applis et les frais, pèsent souvent plus qu\'on ne le pense.',
        'Classez les dépenses par catégories, comme logement, alimentation, transports et loisirs. On voit ainsi facilement où se trouve le plus gros poids et où ajuster.',
        'Le but n\'est pas de culpabiliser, mais d\'y voir clair. Avec les chiffres en main, vous décidez de vos priorités. Dans EcoTrust, l\'historique et le résumé du mois font le calcul pour vous.',
      ],
      pontosChave: ['Sans suivi, impossible de planifier.', 'Les petites dépenses pèsent lourd sur un mois.', 'Les catégories montrent où est le plus gros poids.'],
      quiz: {
        pergunta: 'Pourquoi noter ses dépenses du quotidien ?',
        opcoes: ['Pour voir où va l\'argent et mieux décider', 'Parce que la loi l\'impose', 'Pour dépenser plus en fin de mois'],
        explicacao: 'Les chiffres révèlent des tendances qui passent inaperçues, comme de petites dépenses qui finissent par peser lourd.',
      },
    },
    'juros-do-cartao': {
      titulo: 'Carte de crédit sans pièges',
      resumo: 'Comment utiliser votre carte à votre avantage et éviter les intérêts les plus chers.',
      paragrafos: [
        'La carte de crédit est pratique et peut même aider à organiser les achats du mois. Le problème commence quand le relevé n\'est pas payé en totalité.',
        'Si vous ne payez qu\'une partie (le minimum ou un paiement fractionné), le reste devient du crédit renouvelable, l\'un des crédits les plus chers. Comparez toujours le TAEG, qui indique le coût total annuel.',
        'Pour bien l\'utiliser : considérez le plafond comme de l\'argent que vous avez déjà, pas comme un revenu en plus. Notez les achats en plusieurs fois, car ils occupent les relevés des mois suivants.',
        'Si le relevé ne rentre plus dans le budget, contactez votre banque avant l\'échéance pour connaître des options à intérêts plus faibles.',
      ],
      pontosChave: ['Payez toujours le relevé en totalité.', 'Le crédit renouvelable de la carte a des intérêts très élevés.', 'Les mensualités d\'aujourd\'hui mangent les revenus de demain.'],
      quiz: {
        pergunta: 'Que se passe-t-il quand vous ne payez que le minimum de la carte ?',
        opcoes: ['Rien, le reste est annulé', 'Le reste devient un crédit à intérêts très élevés', 'Le plafond de la carte augmente'],
        explicacao: 'Le montant restant devient du crédit renouvelable, l\'un des crédits les plus chers du marché.',
      },
    },
    'negociar-dividas': {
      titulo: 'Comment négocier une dette',
      resumo: 'Préparez-vous pour obtenir des conditions adaptées à votre budget.',
      paragrafos: [
        'Avant de négocier, sachez combien vous pouvez payer par mois sans manquer de l\'essentiel. Accepter une mensualité trop lourde ne fait que repousser le problème.',
        'Demandez le montant total de la proposition, le TAEG et le nombre de mensualités. Une petite mensualité sur de nombreux mois peut coûter bien plus cher au final.',
        'Les créanciers proposent souvent de meilleures conditions à ceux qui les contactent tôt. Dans de nombreux pays de l\'UE, il existe des services publics ou gratuits d\'aide aux personnes surendettées : cherchez celui de votre pays.',
        'Conservez tous les justificatifs et l\'accord par écrit. Négociez uniquement par les canaux officiels du créancier et méfiez-vous de quiconque demande un paiement d\'avance pour « effacer » votre fichage.',
      ],
      pontosChave: ['Sachez ce qui rentre dans votre mois avant de négocier.', 'Comparez le montant total, pas seulement la mensualité.', 'Passez par les canaux officiels et gardez l\'accord.'],
      quiz: {
        pergunta: 'Pour évaluer une proposition de renégociation, que faut-il surtout comparer ?',
        opcoes: ['Seulement le montant de la mensualité', 'Le montant total, les intérêts et si la mensualité rentre dans le mois', 'La couleur du courrier de la banque'],
        explicacao: 'Une petite mensualité sur de nombreux mois peut coûter bien plus. Regardez le total et si cela rentre dans le budget.',
      },
    },
    inflacao: {
      titulo: 'Inflation : pourquoi l\'argent qui dort perd de la valeur',
      resumo: 'Comprenez ce qui grignote votre pouvoir d\'achat.',
      paragrafos: [
        'L\'inflation est la hausse générale des prix au fil du temps. Avec elle, la même somme d\'argent achète moins de choses chaque année.',
        'C\'est pourquoi l\'argent qui ne rapporte rien perd peu à peu de sa valeur. Si les prix augmentent de 5 % en un an, 100 qui dorment n\'achètent plus que l\'équivalent d\'environ 95.',
        'Pour protéger votre pouvoir d\'achat, le rendement de votre épargne doit être supérieur à l\'inflation. Ce gain au-dessus de l\'inflation s\'appelle le rendement réel.',
        'Dans l\'UE, l\'inflation est mesurée par l\'indice des prix à la consommation harmonisé (IPCH). Dans la zone euro, la Banque centrale européenne vise une inflation de 2 % à moyen terme ; les pays ayant leur propre monnaie ont leur propre banque centrale.',
      ],
      pontosChave: ['Inflation = prix en hausse et argent qui achète moins.', 'L\'argent qui dort perd du pouvoir d\'achat.', 'Cherchez un rendement supérieur à l\'inflation.'],
      quiz: {
        pergunta: 'Si l\'inflation de l\'année a été de 5 % et que votre argent a rapporté 3 %, que s\'est-il passé ?',
        opcoes: ['Vous avez gagné du pouvoir d\'achat', 'Vous avez perdu du pouvoir d\'achat', 'Rien n\'a changé'],
        explicacao: 'Le rendement est resté sous l\'inflation : votre argent achète donc moins.',
      },
    },
    'juros-compostos': {
      titulo: 'Intérêts composés : le temps joue pour vous',
      resumo: 'Pourquoi commencer tôt fait autant de différence.',
      paragrafos: [
        'Avec les intérêts composés, le gain de chaque mois rapporte à son tour les mois suivants. Ce sont les fameux « intérêts sur les intérêts ».',
        'Au début, la différence semble faible, mais elle s\'accélère avec le temps. Plus l\'horizon est long, plus la part du total qui vient des gains eux-mêmes est grande.',
        'C\'est pourquoi commencer tôt, même avec peu, vaut souvent plus que commencer tard avec des montants plus élevés. La régularité compte aussi : des versements mensuels nourrissent l\'effet.',
        'Le même mécanisme joue contre vous avec les dettes. Les intérêts composés font grossir très vite une dette de carte, une raison de plus de la rembourser en premier.',
      ],
      pontosChave: ['Les gains rapportent à leur tour.', 'Le temps et la régularité amplifient l\'effet.', 'Avec les dettes, l\'effet joue contre vous.'],
      quiz: {
        pergunta: 'Quel facteur amplifie le plus l\'effet des intérêts composés ?',
        opcoes: ['Le temps', 'Retirer les gains chaque mois', 'Changer de placement chaque semaine'],
        explicacao: 'Plus l\'argent reste placé longtemps, plus les gains génèrent de nouveaux gains.',
      },
    },
  },
  dicas: [
    'Épargnez le jour de la paie, pas avec ce qui reste en fin de mois.',
    'Avant un achat impulsif, attendez 48 heures. Souvent, l\'envie passe.',
    'Revoyez vos abonnements tous les trois mois et résiliez ce que vous n\'utilisez pas.',
    'Ne payer que le minimum de la carte transforme le reste en crédit à intérêts très élevés.',
    'Noter ses dépenses chaque jour prend moins d\'une minute et montre où va l\'argent.',
    'Comparer les prix des services fixes (internet, téléphone, énergie, assurances) peut faire économiser chaque mois.',
    'Un objectif avec une échéance est plus facile à atteindre que « mettre de côté ce que je peux ».',
    'Avant d\'investir, constituez votre épargne de précaution.',
  ],
  conceitos: [
    { termo: 'Épargne de précaution', definicao: 'Argent mis de côté pour les imprévus, en lieu sûr et accessible rapidement. Repère courant : 3 à 6 mois de dépenses essentielles.' },
    { termo: 'Liquidité', definicao: 'La facilité et la rapidité avec lesquelles un placement redevient de l\'argent disponible, sans perte de valeur.' },
    {
      termo: 'Intérêts composés',
      definicao: 'Intérêts calculés sur le montant initial plus les intérêts déjà acquis. Ils font croître les placements avec le temps, et font aussi grossir vite les dettes.',
    },
    {
      termo: 'Taux directeurs de la BCE',
      definicao: 'Les taux de référence fixés par la Banque centrale européenne pour la zone euro. Ils influencent les intérêts des dépôts et des crédits. Les pays de l\'UE ayant leur propre monnaie ont leur banque centrale.',
    },
    { termo: 'Euribor', definicao: 'Taux de référence auquel les banques de la zone euro se prêtent entre elles. Il sert à de nombreux crédits à taux variable, comme les prêts immobiliers.' },
    {
      termo: 'Inflation (IPCH)',
      definicao: 'La hausse générale des prix. Dans l\'UE, elle est mesurée par l\'indice des prix à la consommation harmonisé. Si un placement rapporte moins que l\'inflation, vous perdez du pouvoir d\'achat.',
    },
    {
      termo: 'TAEG',
      definicao: 'Taux annuel effectif global : le coût total d\'un crédit par an, intérêts et frais compris. Dans l\'UE, il doit toujours être indiqué et permet de comparer les crédits.',
    },
    { termo: 'Revenu fixe', definicao: 'Placements dont les règles de rendement sont connues dès le départ, comme les dépôts à terme et les obligations.' },
    { termo: 'Revenu variable', definicao: 'Placements dont la valeur évolue avec le marché, comme les actions et de nombreux fonds. Ils peuvent rapporter plus, mais aussi baisser.' },
    {
      termo: 'Garantie des dépôts',
      definicao: 'Dans l\'UE, les dépôts bancaires sont protégés jusqu\'à 100 000 € (ou l\'équivalent en monnaie nationale) par déposant et par banque en cas de faillite. Les placements, comme les actions et les fonds, ne sont pas couverts.',
    },
    {
      termo: 'Crédit renouvelable de la carte',
      definicao: 'Le crédit utilisé quand vous payez moins que le total du relevé de carte. Ses intérêts sont très élevés : ne payer que le minimum fait grossir la dette.',
    },
  ],
};
