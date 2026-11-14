import type { TextosAcademy } from '@/data/academy/estrutura';

/** Trust Academy in English. */
export const academyEn: TextosAcademy = {
  categorias: {
    basico: { nome: 'First steps', descricao: 'The basics of organising your money.' },
    orcamento: { nome: 'Budgeting', descricao: 'Plan the month and control spending.' },
    dividas: { nome: 'Debt', descricao: 'Get out of the red and stay out.' },
    investimentos: { nome: 'Investing', descricao: 'Put your money to work.' },
  },
  cursos: {
    'financas-do-zero': { titulo: 'Finance from scratch', resumo: 'Understand your spending, build an emergency fund and set goals that work.' },
    'orcamento-sem-sofrimento': { titulo: 'Painless budgeting', resumo: 'Split your income, control fixed bills and spend without guilt.' },
    'saindo-do-vermelho': { titulo: 'Getting out of the red', resumo: 'Use your card without traps, organise and negotiate your debts.' },
    'comecando-a-investir': { titulo: 'Starting to invest', resumo: 'Inflation, compound interest and the first steps to investing.' },
  },
  aulas: {
    'reserva-emergencia': {
      titulo: 'How to build an emergency fund',
      resumo: 'The first step to peace of mind with money.',
      paragrafos: [
        'An emergency fund is money kept only for the unexpected: losing your job, a health problem, the car breaking down. It stops a shock from turning into card debt or a bank overdraft.',
        'A common guideline is to save 3 to 6 months of your essential spending. People with variable income (the self-employed, for example) usually need more, close to 12 months.',
        'This money should be somewhere safe that lets you withdraw it quickly, ideally the same day. High returns are not the goal: what matters is that it is there when you need it.',
        'Start small. Setting a fixed monthly amount, even a low one, and putting it aside as soon as you get paid works better than waiting for something to be left at the end of the month.',
      ],
      pontosChave: [
        'Goal: cover the unexpected without borrowing.',
        'Common target: 3 to 6 months of essential spending.',
        'Safety and quick access matter more than returns.',
        'Save at the start of the month, not with what is left.',
      ],
      quiz: {
        pergunta: 'What is the most important feature of where you keep your emergency fund?',
        opcoes: ['Earning as much as possible', 'Being safe and quick to withdraw', 'Being locked away for a few years'],
        explicacao: 'The fund exists for emergencies: it must be available when you need it, even if it earns less.',
      },
    },
    'regra-50-30-20': {
      titulo: '50/30/20: how does it work?',
      resumo: 'A simple way to split your money every month.',
      paragrafos: [
        'The 50/30/20 rule splits your net income (what lands in your account) into three parts: 50% for needs, 30% for wants and 20% for financial goals.',
        'Needs are costs you cannot avoid: housing, basic bills, groceries, transport, health. Wants make life better but can be adjusted: leisure, shopping, restaurants, subscriptions.',
        'The 20% goes to the future: emergency fund, paying off debt and investing for your goals.',
        'The numbers are a starting point, not a strict rule. If needs go above 50%, try cutting wants first. In EcoTrust, you can use category budgets to put this plan into practice.',
      ],
      pontosChave: ['50% needs, 30% wants, 20% future.', 'Use your net income as the base.', 'Adjust the percentages to your situation.'],
      quiz: {
        pergunta: 'In the 50/30/20 rule, where does the 20% go?',
        opcoes: ['Leisure and shopping', 'Household bills', 'Emergency fund, debts and investments'],
        explicacao: 'The 20% is money for the future: emergency fund, paying off debt and investing.',
      },
    },
    'gastos-recorrentes': {
      titulo: 'How to control recurring costs',
      resumo: 'Subscriptions and fixed bills weigh more than they seem.',
      paragrafos: [
        'Recurring costs repeat every month: rent or mortgage, service charges, internet, phone, gym and subscriptions. Because they are automatic, it is easy to forget how much they add up to.',
        'A good guideline is to keep fixed bills between 30% and 50% of your income. Above that, any surprise squeezes the budget.',
        'Review them every few months: list everything charged automatically and ask yourself whether you still use each service. Cancelling a forgotten subscription is a saving that repeats every month.',
        'It also pays to renegotiate or compare offers: internet, phone, energy and insurance often have better deals for those who ask. In EcoTrust, mark repeating expenses as "recurring" to see the total.',
      ],
      pontosChave: ['Add up everything charged every month.', 'Review subscriptions regularly.', 'Renegotiating fixed bills is a permanent saving.'],
      quiz: {
        pergunta: 'Which action cuts recurring costs permanently?',
        opcoes: ['Reviewing and cancelling subscriptions you do not use', 'Paying bills late', 'Changing cards every month'],
        explicacao: 'Every cancelled subscription is a saving that repeats every month.',
      },
    },
    'gastos-superfluos': {
      titulo: 'Non-essential spending: cutting back painlessly',
      resumo: 'It is not about giving up on life, it is about choosing better.',
      paragrafos: [
        'Leisure, shopping, food delivery and travel are part of a good life. The problem starts when they grow without you noticing and take up the space of your emergency fund and goals.',
        'Instead of cutting everything, set a monthly limit for these categories. Knowing how much you can still spend gives freedom and avoids guilt.',
        'Some strategies help: wait 48 hours before impulse buys, favour what you really value and cut what you do out of habit.',
        'Small cuts add up. Reducing non-essential spending by 10% and moving that amount to a goal makes a difference within a few months.',
      ],
      pontosChave: ['Set limits, not bans.', 'Wait before impulse buys.', 'Move what you save to a goal.'],
      quiz: {
        pergunta: 'What is the most sustainable way to handle non-essential spending?',
        opcoes: ['Cutting it all at once', 'Setting a monthly limit for it', 'Ignoring it and checking at the end of the month'],
        explicacao: 'A limit lets you enjoy without guilt and protects your goals.',
      },
    },
    'sair-das-dividas': {
      titulo: 'Getting out of debt: where to start',
      resumo: 'A step-by-step guide to organising and paying off what you owe.',
      paragrafos: [
        'The first step is to know exactly what you owe: to whom, how much, the interest rate (check the APR) and the instalments. Putting it all in a list takes away the weight of the unknown.',
        'Prioritise the debts with the highest interest, such as card balances paid at the minimum and bank overdrafts. They grow very fast and should go first.',
        'Try to renegotiate. Lenders often accept different terms or instalments, especially if you talk to them before missing payments. Combining several debts into a cheaper loan can also help, as long as you do not use the old limit again.',
        'While you pay, avoid new debt and keep a close eye on spending. Once you are out, the emergency fund is what stops you going back into the red.',
      ],
      pontosChave: [
        'List all debts with their interest (APR) and instalments.',
        'Start with the highest interest.',
        'Renegotiate before missing payments.',
        'Then build an emergency fund so you do not slip back.',
      ],
      quiz: {
        pergunta: 'When organising debts, which ones are usually paid off first?',
        opcoes: ['The smallest ones', 'The ones with the highest interest', 'The oldest ones'],
        explicacao: 'Debts such as revolving card credit and overdrafts grow fastest, so they go first.',
      },
    },
    'primeiros-investimentos': {
      titulo: 'First steps in investing',
      resumo: 'What to understand before putting your money to work.',
      paragrafos: [
        'Before investing, it is wise to have expensive debts paid off and an emergency fund in place. That way you will not need to cash in an investment at the worst moment.',
        'Every investment combines three features: return (how much it earns), risk (how much it can swing or lose) and liquidity (how quickly it becomes cash in your account). No option is great at all three at once.',
        'With fixed income, the rules are known from the start, as with term deposits and bonds, including government bonds. With variable income, such as shares and many funds, the value moves with the market and can fall.',
        'Your investor profile (conservative, moderate or aggressive) and the time frame of each goal help you choose. Diversifying, meaning not putting everything in one place, reduces risk. In the EU, authorised firms must assess whether a product is suitable for you (MiFID II rules). This content is educational and is not investment advice.',
      ],
      pontosChave: [
        'First: expensive debts paid and emergency fund ready.',
        'Return, risk and liquidity go together.',
        'Choose according to your profile and the goal\'s time frame.',
        'Diversify.',
      ],
      quiz: {
        pergunta: 'What should you have before you start investing?',
        opcoes: ['Expensive debts paid off and an emergency fund', 'A new car', 'A loan to invest more'],
        explicacao: 'That way you will not need to cash in at the wrong time or pay more interest than you earn.',
      },
    },
    'metas-financeiras': {
      titulo: 'How to set goals that work',
      resumo: 'Turn wishes into plans with an amount and a deadline.',
      paragrafos: [
        '"I want to save money" is a wish. "I want to save 6000 for a trip in 12 months" is a goal: it has an amount, a deadline and a reason.',
        'With an amount and a deadline, it is easy to know how much to save each month. In the example, that is 500 a month. If it does not fit your budget, adjust the deadline or the goal.',
        'Tracking progress keeps you motivated. Record every amount you put aside and celebrate milestones, like 25% and 50%.',
        'Start with one or two goals. Too many at once split your money and take longer to complete.',
      ],
      pontosChave: ['Goal = amount + deadline + reason.', 'Divide the amount by the deadline to get the monthly figure.', 'Track and celebrate your progress.'],
      quiz: {
        pergunta: 'What turns a wish into a goal?',
        opcoes: ['Telling your friends', 'Having an amount, a deadline and a reason', 'Saving whatever is left'],
        explicacao: 'With an amount and a deadline you know how much to save per month, and the reason keeps you motivated.',
      },
    },
    'para-onde-vai-o-dinheiro': {
      titulo: 'Where your money goes',
      resumo: 'Recording your spending is the first step to better decisions.',
      paragrafos: [
        'Many people know how much they earn but not how much they spend. Without that, any plan is a guess: the money disappears and it feels like there is never anything left.',
        'Recording income and expenses for a few weeks already reveals patterns. Small daily costs, like coffees, apps and fees, usually add up to more than you think.',
        'Group spending into categories, such as housing, food, transport and leisure. That makes it easy to see where the biggest weight is and where you can adjust.',
        'The aim is not to feel guilty but to see clearly. With the numbers in hand, you decide what matters. In EcoTrust, the history and monthly summary do the maths for you.',
      ],
      pontosChave: ['Without records, you cannot plan.', 'Small costs add up a lot in a month.', 'Categories show where the biggest weight is.'],
      quiz: {
        pergunta: 'Why record your everyday spending?',
        opcoes: ['To see where the money goes and decide better', 'Because the law requires it', 'To spend more at the end of the month'],
        explicacao: 'The numbers show patterns you would otherwise miss, like small costs that add up to a lot.',
      },
    },
    'juros-do-cartao': {
      titulo: 'Credit cards without the traps',
      resumo: 'How to make your card work for you and avoid the most expensive interest.',
      paragrafos: [
        'A credit card is handy and can even help organise the month\'s purchases. The trouble starts when the statement is not paid in full.',
        'If you pay only part (the minimum or an instalment option), the rest becomes revolving credit, one of the most expensive forms of borrowing. Always compare the APR, which shows the total yearly cost.',
        'To use it well: treat the limit as money you already have, not as extra income. Keep track of purchases in instalments, because they take up the next months\' statements.',
        'If the statement no longer fits your budget, talk to your bank before the due date to learn about options with lower interest.',
      ],
      pontosChave: ['Always pay the statement in full.', 'Revolving card credit has very high interest.', 'Today\'s instalments use up tomorrow\'s income.'],
      quiz: {
        pergunta: 'What happens when you pay only the minimum on your card?',
        opcoes: ['Nothing, the rest is forgiven', 'The rest becomes credit with very high interest', 'Your card limit goes up'],
        explicacao: 'The unpaid amount becomes revolving credit, one of the most expensive types of credit on the market.',
      },
    },
    'negociar-dividas': {
      titulo: 'How to negotiate a debt',
      resumo: 'Prepare to get terms that fit your budget.',
      paragrafos: [
        'Before negotiating, know how much you can pay each month without going short on essentials. Accepting an instalment that does not fit only postpones the problem.',
        'Ask for the total amount of the offer, the APR and the number of instalments. A small instalment over many months can end up costing much more.',
        'Lenders often offer better terms to people who contact them early. Many EU countries have public or free debt advice services for people who are over-indebted: look for the one in your country.',
        'Keep every receipt and get the agreement in writing. Negotiate only through the lender\'s official channels and be wary of anyone asking for payment up front to "clean" your credit record.',
      ],
      pontosChave: ['Know what fits your month before negotiating.', 'Compare the total amount, not just the instalment.', 'Use only official channels and keep the agreement.'],
      quiz: {
        pergunta: 'When assessing a renegotiation offer, what matters most to compare?',
        opcoes: ['Only the instalment amount', 'The total amount, the interest and whether the instalment fits your month', 'The colour of the bank\'s letter'],
        explicacao: 'A low instalment over many months can cost much more. Look at the total and whether it fits your budget.',
      },
    },
    inflacao: {
      titulo: 'Inflation: why idle money loses value',
      resumo: 'Understand what eats away at your purchasing power.',
      paragrafos: [
        'Inflation is the general rise in prices over time. With it, the same amount of money buys fewer things each year.',
        'That is why money kept without earning anything slowly loses value. If prices rise 5% in a year, 100 left idle buys the equivalent of about 95.',
        'To protect your purchasing power, the return on your savings needs to be higher than inflation. That gain above inflation is called the real return.',
        'In the EU, inflation is measured by the Harmonised Index of Consumer Prices (HICP). In the euro area, the European Central Bank aims to keep it at 2% over the medium term; countries with their own currency have their own central bank.',
      ],
      pontosChave: ['Inflation = rising prices and money buying less.', 'Idle money loses purchasing power.', 'Look for returns above inflation.'],
      quiz: {
        pergunta: 'If inflation this year was 5% and your money earned 3%, what happened?',
        opcoes: ['You gained purchasing power', 'You lost purchasing power', 'Nothing changed'],
        explicacao: 'The return was below inflation, so your money now buys less.',
      },
    },
    'juros-compostos': {
      titulo: 'Compound interest: time on your side',
      resumo: 'Why starting early makes such a difference.',
      paragrafos: [
        'With compound interest, each month\'s return also starts earning in the following months. It is the famous "interest on interest".',
        'At first the difference looks small, but over time it speeds up. The longer the time frame, the bigger the share of the total that comes from the returns themselves.',
        'That is why starting early, even with a little, is usually worth more than starting late with larger amounts. Regularity also counts: monthly contributions feed the effect.',
        'The same mechanism works against you with debt. Compound interest makes card debt grow very fast, one more reason to pay it off first.',
      ],
      pontosChave: ['Returns start earning too.', 'Time and regularity boost the effect.', 'With debt, the effect works against you.'],
      quiz: {
        pergunta: 'Which factor boosts compound interest the most?',
        opcoes: ['Time', 'Withdrawing the returns every month', 'Switching investments every week'],
        explicacao: 'The longer the money keeps earning, the more the returns generate new returns.',
      },
    },
  },
  dicas: [
    'Save on payday, not with what is left at the end of the month.',
    'Before an impulse buy, wait 48 hours. Often the urge passes.',
    'Review your subscriptions every three months and cancel what you do not use.',
    'Paying only the minimum on your card turns the rest into credit with very high interest.',
    'Recording your spending every day takes less than a minute and shows where your money goes.',
    'Comparing prices for fixed services (internet, phone, energy, insurance) can save money every month.',
    'A goal with a deadline is easier to reach than "saving whatever I can".',
    'Before investing, build your emergency fund.',
  ],
  conceitos: [
    { termo: 'Emergency fund', definicao: 'Money kept for the unexpected, somewhere safe and quick to access. Common guideline: 3 to 6 months of essential spending.' },
    { termo: 'Liquidity', definicao: 'How easily and quickly an investment can be turned into available cash without losing value.' },
    {
      termo: 'Compound interest',
      definicao: 'Interest calculated on the initial amount plus the interest already earned. It makes investments grow more over time, and also makes debts grow fast.',
    },
    {
      termo: 'ECB interest rates',
      definicao: 'The key rates set by the European Central Bank for the euro area. They influence interest on deposits and loans. EU countries with their own currency have their own central bank.',
    },
    { termo: 'Euribor', definicao: 'The reference rate at which euro-area banks lend to each other. It is used in many variable-rate loans, such as mortgages.' },
    {
      termo: 'Inflation (HICP)',
      definicao: 'The general rise in prices. In the EU it is measured by the Harmonised Index of Consumer Prices. If an investment earns less than inflation, you lose purchasing power.',
    },
    {
      termo: 'APR',
      definicao: 'Annual percentage rate of charge: the total yearly cost of credit, including interest and fees. In the EU it must always be shown, and it lets you compare loans.',
    },
    { termo: 'Fixed income', definicao: 'Investments whose return rules are known from the start, such as term deposits and bonds.' },
    { termo: 'Variable income', definicao: 'Investments whose value changes with the market, such as shares and many funds. They may earn more, but can also fall.' },
    {
      termo: 'Deposit guarantee',
      definicao: 'In the EU, bank deposits are protected up to €100,000 (or the equivalent in national currency) per depositor and per bank if the bank fails. Investments such as shares and funds are not covered.',
    },
    {
      termo: 'Revolving card credit',
      definicao: 'The credit used when you pay less than the full card statement. It has very high interest: paying only the minimum keeps the debt growing.',
    },
  ],
};
