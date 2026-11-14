import type { TextosAcademy } from '@/data/academy/estrutura';

/** Trust Academy em português de Portugal (texto de referência da edição europeia). */
export const academyPtPT: TextosAcademy = {
  categorias: {
    basico: { nome: 'Primeiros passos', descricao: 'A base para organizar o dinheiro.' },
    orcamento: { nome: 'Orçamento', descricao: 'Planear o mês e controlar os gastos.' },
    dividas: { nome: 'Dívidas', descricao: 'Sair do vermelho e não voltar.' },
    investimentos: { nome: 'Investimentos', descricao: 'Pôr o dinheiro a trabalhar.' },
  },
  cursos: {
    'financas-do-zero': {
      titulo: 'Finanças do zero',
      resumo: 'Perceba os seus gastos, crie o fundo de emergência e metas que funcionam.',
    },
    'orcamento-sem-sofrimento': {
      titulo: 'Orçamento sem sofrimento',
      resumo: 'Divida o rendimento, controle as despesas fixas e gaste sem culpa.',
    },
    'saindo-do-vermelho': {
      titulo: 'Sair do vermelho',
      resumo: 'Use o cartão sem armadilhas, organize e negoceie as suas dívidas.',
    },
    'comecando-a-investir': {
      titulo: 'Começar a investir',
      resumo: 'Inflação, juros compostos e os primeiros passos para investir.',
    },
  },
  aulas: {
    'reserva-emergencia': {
      titulo: 'Como criar um fundo de emergência',
      resumo: 'O primeiro passo para ter tranquilidade com o dinheiro.',
      paragrafos: [
        'O fundo de emergência é dinheiro guardado só para imprevistos: perder o emprego, um problema de saúde, o carro que avariou. Evita que um susto se transforme em dívida no cartão ou num descoberto bancário.',
        'Uma referência comum é guardar de 3 a 6 meses dos seus gastos essenciais. Quem tem rendimento variável (trabalhadores independentes, por exemplo) costuma precisar de mais, perto de 12 meses.',
        'Este dinheiro deve estar num sítio seguro e que permita levantá-lo depressa, de preferência no próprio dia. Render muito não é o objetivo: o importante é estar disponível quando precisar.',
        'Comece pequeno. Definir um valor fixo por mês, mesmo baixo, e pô-lo de parte assim que recebe o salário funciona melhor do que esperar que sobre no fim do mês.',
      ],
      pontosChave: [
        'Objetivo: cobrir imprevistos sem se endividar.',
        'Meta comum: 3 a 6 meses de gastos essenciais.',
        'Segurança e acesso rápido importam mais do que o rendimento.',
        'Poupe no início do mês, não com o que sobra.',
      ],
      quiz: {
        pergunta: 'Qual é a característica mais importante do sítio onde fica o fundo de emergência?',
        opcoes: ['Render o máximo possível', 'Ser seguro e permitir levantar depressa', 'Ficar bloqueado durante alguns anos'],
        explicacao: 'O fundo existe para imprevistos: tem de estar disponível quando precisar, mesmo rendendo menos.',
      },
    },
    'regra-50-30-20': {
      titulo: '50/30/20: como funciona?',
      resumo: 'Uma forma simples de dividir o seu dinheiro todos os meses.',
      paragrafos: [
        'A regra 50/30/20 divide o rendimento líquido (o que entra na conta) em três partes: 50% para necessidades, 30% para desejos e 20% para objetivos financeiros.',
        'Necessidades são gastos que não consegue evitar: habitação, contas básicas, supermercado, transportes, saúde. Desejos são o que torna a vida melhor, mas pode ser ajustado: lazer, compras, restaurantes, subscrições.',
        'Os 20% vão para o futuro: fundo de emergência, pagar dívidas e investir para os seus objetivos.',
        'Os números são um ponto de partida, não uma regra rígida. Se as necessidades passam dos 50%, tente reduzir primeiro os desejos. No EcoTrust, pode usar o orçamento por categoria para pôr este plano em prática.',
      ],
      pontosChave: ['50% necessidades, 30% desejos, 20% futuro.', 'Use o rendimento líquido como base.', 'Ajuste as percentagens à sua realidade.'],
      quiz: {
        pergunta: 'Na regra 50/30/20, para onde vão os 20%?',
        opcoes: ['Lazer e compras', 'Contas da casa', 'Fundo de emergência, dívidas e investimentos'],
        explicacao: 'Os 20% são o dinheiro do futuro: fundo de emergência, pagar dívidas e investir.',
      },
    },
    'gastos-recorrentes': {
      titulo: 'Como controlar gastos recorrentes',
      resumo: 'Subscrições e despesas fixas pesam mais do que parece.',
      paragrafos: [
        'Gastos recorrentes são os que se repetem todos os meses: renda ou prestação da casa, condomínio, internet, telemóvel, ginásio e subscrições. Como são automáticos, é fácil esquecer quanto somam.',
        'Uma boa referência é manter as despesas fixas entre 30% e 50% do rendimento. Quando passam disso, qualquer imprevisto aperta o orçamento.',
        'Faça uma revisão de poucos em poucos meses: liste tudo o que é cobrado automaticamente e pergunte-se se ainda usa cada serviço. Cancelar uma subscrição esquecida é uma poupança que se repete todos os meses.',
        'Também vale a pena renegociar ou comparar ofertas: internet, telemóvel, energia e seguros costumam ter condições melhores para quem pede. No EcoTrust, marque as despesas que se repetem como "recorrentes" para ver o total.',
      ],
      pontosChave: ['Some tudo o que é cobrado todos os meses.', 'Reveja as subscrições periodicamente.', 'Renegociar despesas fixas é poupança permanente.'],
      quiz: {
        pergunta: 'Que atitude reduz os gastos recorrentes de forma permanente?',
        opcoes: ['Rever e cancelar subscrições que não usa', 'Pagar as contas com atraso', 'Mudar de cartão todos os meses'],
        explicacao: 'Cada subscrição cancelada é uma poupança que se repete todos os meses.',
      },
    },
    'gastos-superfluos': {
      titulo: 'Gastos não essenciais: cortar sem sofrer',
      resumo: 'Não se trata de deixar de viver, mas de escolher melhor.',
      paragrafos: [
        'Lazer, compras, entregas ao domicílio e viagens fazem parte de uma vida boa. O problema surge quando crescem sem dar por isso e começam a ocupar o espaço do fundo de emergência e das metas.',
        'Em vez de cortar tudo, defina um limite mensal para estas categorias. Saber quanto ainda pode gastar dá liberdade e evita a culpa.',
        'Algumas estratégias ajudam: esperar 48 horas antes de compras por impulso, preferir o que realmente valoriza e cortar o que faz por hábito.',
        'Pequenas reduções somam. Diminuir 10% dos gastos não essenciais e encaminhar esse valor para uma meta já faz diferença em poucos meses.',
      ],
      pontosChave: ['Defina limites, não proibições.', 'Espere antes de compras por impulso.', 'Encaminhe o que poupar para uma meta.'],
      quiz: {
        pergunta: 'Qual é a forma mais sustentável de lidar com gastos não essenciais?',
        opcoes: ['Cortá-los todos de uma vez', 'Definir um limite mensal para eles', 'Ignorar e ver no fim do mês'],
        explicacao: 'Um limite dá liberdade para aproveitar sem culpa e protege as suas metas.',
      },
    },
    'sair-das-dividas': {
      titulo: 'Como sair das dívidas: por onde começar',
      resumo: 'Um passo a passo para organizar e pagar o que deve.',
      paragrafos: [
        'O primeiro passo é saber exatamente o que deve: a quem, quanto, a taxa de juro (veja a TAEG) e o valor das prestações. Pôr tudo numa lista tira o peso do desconhecido.',
        'Dê prioridade às dívidas com juros mais altos, como o crédito do cartão pago em prestações mínimas e os descobertos bancários. Crescem muito depressa e devem ser as primeiras a sair.',
        'Procure renegociar. Os credores costumam aceitar prazos ou prestações diferentes, sobretudo se falar com eles antes de falhar pagamentos. Juntar várias dívidas num crédito mais barato também pode ajudar, desde que não volte a usar o limite antigo.',
        'Enquanto paga, evite novas dívidas e acompanhe os gastos de perto. Depois de sair, o fundo de emergência é o que impede voltar ao vermelho.',
      ],
      pontosChave: [
        'Liste todas as dívidas com juros (TAEG) e prestações.',
        'Comece pelas de juros mais altos.',
        'Renegoceie antes de falhar pagamentos.',
        'Depois, crie o fundo de emergência para não voltar.',
      ],
      quiz: {
        pergunta: 'Ao organizar as dívidas, quais costumam ser pagas primeiro?',
        opcoes: ['As de menor valor', 'As de juros mais altos', 'As mais antigas'],
        explicacao: 'Dívidas como o crédito renovável do cartão e o descoberto bancário crescem mais depressa, por isso saem primeiro.',
      },
    },
    'primeiros-investimentos': {
      titulo: 'Primeiros passos para investir',
      resumo: 'O que perceber antes de pôr o dinheiro a render.',
      paragrafos: [
        'Antes de investir, convém ter as dívidas caras pagas e o fundo de emergência criado. Assim não precisa de levantar um investimento na pior altura.',
        'Todo o investimento combina três características: rentabilidade (quanto rende), risco (quanto pode oscilar ou perder) e liquidez (com que rapidez se transforma em dinheiro na conta). Nenhuma opção é ótima nas três ao mesmo tempo.',
        'No rendimento fixo, as regras são conhecidas à partida, como nos depósitos a prazo e nas obrigações, incluindo as do Estado. No rendimento variável, como ações e muitos fundos, o valor oscila com o mercado e pode descer.',
        'O seu perfil de investidor (conservador, moderado ou arrojado) e o prazo de cada objetivo ajudam a escolher. Diversificar, ou seja, não pôr tudo no mesmo sítio, reduz o risco. Na UE, as entidades autorizadas têm de avaliar se um produto é adequado para si (regras MiFID II). Este conteúdo é educativo e não é uma recomendação de investimento.',
      ],
      pontosChave: [
        'Primeiro: dívidas caras pagas e fundo de emergência pronto.',
        'Rentabilidade, risco e liquidez andam juntos.',
        'Escolha de acordo com o seu perfil e o prazo do objetivo.',
        'Diversifique.',
      ],
      quiz: {
        pergunta: 'O que convém ter antes de começar a investir?',
        opcoes: ['Dívidas caras pagas e fundo de emergência criado', 'Um carro novo', 'Um empréstimo para investir mais'],
        explicacao: 'Assim não precisa de levantar um investimento na hora errada nem paga juros mais altos do que ganha.',
      },
    },
    'metas-financeiras': {
      titulo: 'Como criar metas que funcionam',
      resumo: 'Transforme vontades em planos com valor e prazo.',
      paragrafos: [
        '"Quero poupar dinheiro" é um desejo. "Quero juntar 6000 para uma viagem em 12 meses" é uma meta: tem valor, prazo e motivo.',
        'Com valor e prazo, é fácil saber quanto poupar por mês. No exemplo, são 500 por mês. Se o valor não cabe no orçamento, ajuste o prazo ou a meta.',
        'Acompanhar o progresso mantém a motivação. Registe cada valor guardado e celebre as etapas, como os 25% e os 50%.',
        'Comece com uma ou duas metas. Muitas metas ao mesmo tempo dividem o dinheiro e demoram a ser concluídas.',
      ],
      pontosChave: ['Meta = valor + prazo + motivo.', 'Divida o valor pelo prazo para saber o mensal.', 'Acompanhe e celebre o progresso.'],
      quiz: {
        pergunta: 'O que transforma um desejo numa meta?',
        opcoes: ['Contar aos amigos', 'Ter valor, prazo e motivo', 'Guardar o que sobrar'],
        explicacao: 'Com valor e prazo descobre quanto poupar por mês, e o motivo mantém a motivação.',
      },
    },
    'para-onde-vai-o-dinheiro': {
      titulo: 'Para onde vai o seu dinheiro',
      resumo: 'Registar os gastos é o primeiro passo para decidir melhor.',
      paragrafos: [
        'Muita gente sabe quanto ganha, mas não sabe quanto gasta. Sem essa informação, qualquer plano é um palpite: o dinheiro desaparece e fica a sensação de que nunca sobra.',
        'Registar receitas e despesas durante algumas semanas já revela padrões. Pequenos gastos do dia a dia, como cafés, aplicações e comissões, costumam somar mais do que parece.',
        'Separe os gastos em categorias, como habitação, alimentação, transportes e lazer. Assim é fácil ver onde está o maior peso e onde dá para ajustar.',
        'O objetivo não é culpar-se, mas sim ver com clareza. Com os números na mão, decide o que é prioridade. No EcoTrust, o histórico e o resumo do mês fazem essa conta por si.',
      ],
      pontosChave: ['Sem registo, não há como planear.', 'Pequenos gastos somam muito no mês.', 'As categorias mostram onde está o maior peso.'],
      quiz: {
        pergunta: 'Porquê registar os gastos do dia a dia?',
        opcoes: ['Para ver para onde vai o dinheiro e decidir melhor', 'Porque é obrigatório por lei', 'Para gastar mais no fim do mês'],
        explicacao: 'Os números mostram padrões que passam despercebidos, como pequenos gastos que somam muito.',
      },
    },
    'juros-do-cartao': {
      titulo: 'Cartão de crédito sem armadilhas',
      resumo: 'Como usar o cartão a seu favor e fugir dos juros mais caros.',
      paragrafos: [
        'O cartão de crédito é prático e pode até organizar as compras do mês. O problema começa quando o extrato não é pago na totalidade.',
        'Ao pagar só uma parte (o pagamento mínimo ou fracionado), o resto transforma-se em crédito renovável, um dos créditos com juros mais altos. Compare sempre a TAEG, que mostra o custo total por ano.',
        'Para usar bem: trate o limite como dinheiro que já tem, e não como rendimento extra. Anote as compras a prestações, porque ocupam os extratos dos meses seguintes.',
        'Se o extrato já não cabe no orçamento, fale com o banco antes da data de pagamento para conhecer opções com juros mais baixos.',
      ],
      pontosChave: ['Pague sempre o extrato na totalidade.', 'O crédito renovável do cartão tem juros muito altos.', 'Prestações de hoje ocupam o rendimento de amanhã.'],
      quiz: {
        pergunta: 'O que acontece quando paga só o mínimo do cartão?',
        opcoes: ['Nada, o resto é perdoado', 'O resto passa a crédito com juros muito altos', 'O limite do cartão aumenta'],
        explicacao: 'O valor em falta passa a crédito renovável, um dos créditos mais caros do mercado.',
      },
    },
    'negociar-dividas': {
      titulo: 'Como negociar uma dívida',
      resumo: 'Prepare-se para conseguir condições que caibam no seu orçamento.',
      paragrafos: [
        'Antes de negociar, saiba quanto consegue pagar por mês sem deixar faltar o essencial. Aceitar uma prestação que não cabe só adia o problema.',
        'Pergunte pelo valor total da proposta, pela TAEG e pelo número de prestações. Uma prestação pequena durante muitos meses pode sair bem mais cara no final.',
        'Os credores costumam aceitar condições melhores para quem os contacta cedo. Em muitos países da UE há serviços públicos ou gratuitos de apoio a quem está sobre-endividado: procure o do seu país.',
        'Guarde todos os comprovativos e o acordo por escrito. Negoceie só pelos canais oficiais do credor e desconfie de quem pede pagamento adiantado para "apagar" o seu registo de crédito.',
      ],
      pontosChave: ['Saiba quanto cabe no seu mês antes de negociar.', 'Compare o valor total, não só a prestação.', 'Use só canais oficiais e guarde o acordo.'],
      quiz: {
        pergunta: 'Ao avaliar uma proposta de renegociação, o que é mais importante comparar?',
        opcoes: ['Só o valor da prestação', 'O valor total, os juros e se a prestação cabe no mês', 'A cor da carta do banco'],
        explicacao: 'Uma prestação baixa durante muitos meses pode custar bem mais. Veja o total e se cabe no orçamento.',
      },
    },
    inflacao: {
      titulo: 'Inflação: porque é que o dinheiro parado perde valor',
      resumo: 'Perceba o que corrói o seu poder de compra.',
      paragrafos: [
        'Inflação é o aumento geral dos preços ao longo do tempo. Com ela, a mesma quantia de dinheiro compra menos coisas a cada ano.',
        'Por isso, dinheiro guardado sem render nada perde valor aos poucos. Se os preços sobem 5% num ano, 100 parados compram o equivalente a cerca de 95.',
        'Para proteger o poder de compra, o rendimento do dinheiro guardado tem de ser maior do que a inflação. Esse ganho acima da inflação chama-se rendimento real.',
        'Na UE, a inflação é medida pelo Índice Harmonizado de Preços no Consumidor (IHPC). Na área do euro, o Banco Central Europeu procura mantê-la em 2% a médio prazo; os países com moeda própria têm o seu banco central.',
      ],
      pontosChave: ['Inflação = preços a subir e dinheiro a comprar menos.', 'Dinheiro parado perde poder de compra.', 'Procure rendimento acima da inflação.'],
      quiz: {
        pergunta: 'Se a inflação do ano foi de 5% e o seu dinheiro rendeu 3%, o que aconteceu?',
        opcoes: ['Ganhou poder de compra', 'Perdeu poder de compra', 'Nada mudou'],
        explicacao: 'O rendimento ficou abaixo da inflação, por isso o dinheiro passou a comprar menos.',
      },
    },
    'juros-compostos': {
      titulo: 'Juros compostos: o tempo a seu favor',
      resumo: 'Porque é que começar cedo faz tanta diferença.',
      paragrafos: [
        'Nos juros compostos, o rendimento de cada mês passa também a render nos meses seguintes. São os famosos "juros sobre juros".',
        'No início a diferença parece pequena, mas com o tempo acelera. Quanto mais longo o prazo, maior a parte do total que vem dos próprios rendimentos.',
        'Por isso, começar cedo, mesmo com pouco, costuma valer mais do que começar tarde com valores maiores. A regularidade também conta: entregas todos os meses alimentam o efeito.',
        'O mesmo mecanismo funciona contra si nas dívidas. Os juros compostos fazem uma dívida no cartão crescer muito depressa, mais um motivo para as pagar primeiro.',
      ],
      pontosChave: ['Os rendimentos também passam a render.', 'Tempo e regularidade potenciam o efeito.', 'Nas dívidas, o efeito joga contra si.'],
      quiz: {
        pergunta: 'Que fator mais aumenta o efeito dos juros compostos?',
        opcoes: ['O tempo', 'Levantar os rendimentos todos os meses', 'Mudar de investimento todas as semanas'],
        explicacao: 'Quanto mais tempo o dinheiro fica a render, mais os rendimentos geram novos rendimentos.',
      },
    },
  },
  dicas: [
    'Poupe no dia em que recebe o salário, não com o que sobra no fim do mês.',
    'Antes de uma compra por impulso, espere 48 horas. Muitas vezes a vontade passa.',
    'Reveja as suas subscrições de três em três meses e cancele o que não usa.',
    'Pagar só o mínimo do cartão transforma o resto em crédito com juros muito altos.',
    'Registar os gastos todos os dias leva menos de um minuto e mostra para onde vai o dinheiro.',
    'Comparar preços de serviços fixos (internet, telemóvel, energia, seguros) pode gerar poupança todos os meses.',
    'Uma meta com prazo é mais fácil de cumprir do que "guardar o que der".',
    'Antes de investir, crie o seu fundo de emergência.',
  ],
  conceitos: [
    {
      termo: 'Fundo de emergência',
      definicao: 'Dinheiro guardado para imprevistos, num sítio seguro e de acesso rápido. Referência comum: 3 a 6 meses de gastos essenciais.',
    },
    { termo: 'Liquidez', definicao: 'A facilidade e a rapidez com que um investimento se transforma em dinheiro disponível, sem perder valor.' },
    {
      termo: 'Juros compostos',
      definicao: 'Juros calculados sobre o valor inicial mais os juros já acumulados. Fazem os investimentos crescer mais com o tempo, e também fazem as dívidas crescer depressa.',
    },
    {
      termo: 'Taxas de juro do BCE',
      definicao: 'As taxas de referência definidas pelo Banco Central Europeu para a área do euro. Influenciam os juros dos depósitos e dos créditos. Os países da UE com moeda própria têm o seu banco central.',
    },
    {
      termo: 'Euribor',
      definicao: 'Taxa de referência a que os bancos da área do euro emprestam dinheiro entre si. É usada em muitos créditos com taxa variável, como o crédito à habitação.',
    },
    {
      termo: 'Inflação (IHPC)',
      definicao: 'O aumento geral dos preços. Na UE é medida pelo Índice Harmonizado de Preços no Consumidor. Se um investimento rende menos do que a inflação, perde poder de compra.',
    },
    {
      termo: 'TAEG',
      definicao: 'Taxa anual de encargos efetiva global: o custo total de um crédito por ano, incluindo juros e comissões. Na UE tem de ser sempre indicada, e serve para comparar créditos.',
    },
    { termo: 'Rendimento fixo', definicao: 'Investimentos cujas regras de rendimento são conhecidas à partida, como depósitos a prazo e obrigações.' },
    {
      termo: 'Rendimento variável',
      definicao: 'Investimentos cujo valor muda com o mercado, como ações e muitos fundos. Podem render mais, mas também podem descer.',
    },
    {
      termo: 'Garantia de depósitos',
      definicao: 'Na UE, os depósitos bancários estão protegidos até 100 000 € (ou o equivalente na moeda nacional) por depositante e por banco, se o banco falir. Os investimentos, como ações e fundos, não estão cobertos.',
    },
    {
      termo: 'Crédito renovável do cartão',
      definicao: 'O crédito usado quando paga menos do que o total do extrato do cartão. Tem juros muito altos: pagar só o mínimo mantém a dívida a crescer.',
    },
  ],
};
