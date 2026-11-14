import type { TextosAcademy } from '@/data/academy/estrutura';

/** Trust Academy en español. */
export const academyEs: TextosAcademy = {
  categorias: {
    basico: { nome: 'Primeros pasos', descricao: 'La base para organizar el dinero.' },
    orcamento: { nome: 'Presupuesto', descricao: 'Planificar el mes y controlar los gastos.' },
    dividas: { nome: 'Deudas', descricao: 'Salir de los números rojos y no volver.' },
    investimentos: { nome: 'Inversiones', descricao: 'Poner el dinero a trabajar.' },
  },
  cursos: {
    'financas-do-zero': { titulo: 'Finanzas desde cero', resumo: 'Entiende tus gastos, crea el fondo de emergencia y metas que funcionen.' },
    'orcamento-sem-sofrimento': { titulo: 'Presupuesto sin sufrir', resumo: 'Reparte tus ingresos, controla los gastos fijos y gasta sin culpa.' },
    'saindo-do-vermelho': { titulo: 'Salir de los números rojos', resumo: 'Usa la tarjeta sin trampas, organiza y negocia tus deudas.' },
    'comecando-a-investir': { titulo: 'Empezar a invertir', resumo: 'Inflación, interés compuesto y los primeros pasos para invertir.' },
  },
  aulas: {
    'reserva-emergencia': {
      titulo: 'Cómo crear un fondo de emergencia',
      resumo: 'El primer paso para tener tranquilidad con el dinero.',
      paragrafos: [
        'El fondo de emergencia es dinero guardado solo para imprevistos: perder el empleo, un problema de salud, una avería del coche. Evita que un susto se convierta en deuda con la tarjeta o en un descubierto bancario.',
        'Una referencia habitual es guardar de 3 a 6 meses de tus gastos esenciales. Quien tiene ingresos variables (autónomos, por ejemplo) suele necesitar más, cerca de 12 meses.',
        'Este dinero debe estar en un lugar seguro y que permita retirarlo rápido, a ser posible el mismo día. La rentabilidad alta no es el objetivo: lo importante es que esté disponible cuando lo necesites.',
        'Empieza poco a poco. Fijar una cantidad mensual, aunque sea baja, y apartarla en cuanto cobras funciona mejor que esperar a que sobre a fin de mes.',
      ],
      pontosChave: [
        'Objetivo: cubrir imprevistos sin endeudarte.',
        'Meta habitual: de 3 a 6 meses de gastos esenciales.',
        'Seguridad y acceso rápido importan más que la rentabilidad.',
        'Ahorra a principio de mes, no con lo que sobra.',
      ],
      quiz: {
        pergunta: '¿Cuál es la característica más importante del lugar donde guardas el fondo de emergencia?',
        opcoes: ['Rentar lo máximo posible', 'Ser seguro y permitir retirarlo rápido', 'Quedar bloqueado durante unos años'],
        explicacao: 'El fondo existe para imprevistos: tiene que estar disponible cuando lo necesites, aunque rente menos.',
      },
    },
    'regra-50-30-20': {
      titulo: '50/30/20: ¿cómo funciona?',
      resumo: 'Una forma sencilla de repartir tu dinero cada mes.',
      paragrafos: [
        'La regla 50/30/20 divide los ingresos netos (lo que entra en la cuenta) en tres partes: 50% para necesidades, 30% para deseos y 20% para objetivos financieros.',
        'Las necesidades son gastos que no puedes evitar: vivienda, suministros básicos, supermercado, transporte, salud. Los deseos hacen la vida mejor, pero se pueden ajustar: ocio, compras, restaurantes, suscripciones.',
        'El 20% va al futuro: fondo de emergencia, saldar deudas e invertir para tus objetivos.',
        'Los números son un punto de partida, no una regla rígida. Si las necesidades superan el 50%, intenta reducir primero los deseos. En EcoTrust puedes usar el presupuesto por categoría para poner este plan en práctica.',
      ],
      pontosChave: ['50% necesidades, 30% deseos, 20% futuro.', 'Usa los ingresos netos como base.', 'Ajusta los porcentajes a tu realidad.'],
      quiz: {
        pergunta: 'En la regla 50/30/20, ¿adónde va el 20%?',
        opcoes: ['Ocio y compras', 'Gastos de casa', 'Fondo de emergencia, deudas e inversiones'],
        explicacao: 'El 20% es el dinero del futuro: fondo de emergencia, saldar deudas e invertir.',
      },
    },
    'gastos-recorrentes': {
      titulo: 'Cómo controlar los gastos recurrentes',
      resumo: 'Suscripciones y gastos fijos pesan más de lo que parece.',
      paragrafos: [
        'Los gastos recurrentes se repiten cada mes: alquiler o hipoteca, comunidad, internet, móvil, gimnasio y suscripciones. Como son automáticos, es fácil olvidar cuánto suman.',
        'Una buena referencia es mantener los gastos fijos entre el 30% y el 50% de los ingresos. Por encima de eso, cualquier imprevisto aprieta el presupuesto.',
        'Haz una revisión cada pocos meses: apunta todo lo que se cobra automáticamente y pregúntate si sigues usando cada servicio. Cancelar una suscripción olvidada es un ahorro que se repite cada mes.',
        'También compensa renegociar o comparar ofertas: internet, móvil, energía y seguros suelen tener mejores condiciones para quien las pide. En EcoTrust, marca los gastos que se repiten como "recurrentes" para ver el total.',
      ],
      pontosChave: ['Suma todo lo que se cobra cada mes.', 'Revisa las suscripciones periódicamente.', 'Renegociar los gastos fijos es un ahorro permanente.'],
      quiz: {
        pergunta: '¿Qué acción reduce los gastos recurrentes de forma permanente?',
        opcoes: ['Revisar y cancelar suscripciones que no usas', 'Pagar las facturas con retraso', 'Cambiar de tarjeta cada mes'],
        explicacao: 'Cada suscripción cancelada es un ahorro que se repite todos los meses.',
      },
    },
    'gastos-superfluos': {
      titulo: 'Gastos no esenciales: recortar sin sufrir',
      resumo: 'No se trata de dejar de vivir, sino de elegir mejor.',
      paragrafos: [
        'El ocio, las compras, la comida a domicilio y los viajes forman parte de una buena vida. El problema aparece cuando crecen sin que te des cuenta y ocupan el espacio del fondo de emergencia y de las metas.',
        'En lugar de recortarlo todo, fija un límite mensual para estas categorías. Saber cuánto puedes gastar todavía da libertad y evita la culpa.',
        'Algunas estrategias ayudan: esperar 48 horas antes de una compra por impulso, priorizar lo que de verdad valoras y recortar lo que haces por costumbre.',
        'Las pequeñas reducciones suman. Bajar un 10% los gastos no esenciales y destinar esa cantidad a una meta ya se nota en pocos meses.',
      ],
      pontosChave: ['Fija límites, no prohibiciones.', 'Espera antes de las compras por impulso.', 'Destina lo que ahorres a una meta.'],
      quiz: {
        pergunta: '¿Cuál es la forma más sostenible de gestionar los gastos no esenciales?',
        opcoes: ['Recortarlos todos de golpe', 'Fijarles un límite mensual', 'Ignorarlos y mirar a fin de mes'],
        explicacao: 'Un límite te da libertad para disfrutar sin culpa y protege tus metas.',
      },
    },
    'sair-das-dividas': {
      titulo: 'Cómo salir de las deudas: por dónde empezar',
      resumo: 'Un paso a paso para organizar y pagar lo que debes.',
      paragrafos: [
        'El primer paso es saber exactamente qué debes: a quién, cuánto, el tipo de interés (mira la TAE) y el importe de las cuotas. Ponerlo todo en una lista quita el peso de lo desconocido.',
        'Prioriza las deudas con intereses más altos, como la tarjeta pagada al mínimo y los descubiertos bancarios. Crecen muy rápido y deben ser las primeras en saldarse.',
        'Intenta renegociar. Los acreedores suelen aceptar otros plazos o cuotas, sobre todo si hablas con ellos antes de dejar de pagar. Agrupar varias deudas en un préstamo más barato también puede ayudar, siempre que no vuelvas a usar el límite antiguo.',
        'Mientras pagas, evita nuevas deudas y sigue tus gastos de cerca. Cuando salgas, el fondo de emergencia es lo que impide volver a los números rojos.',
      ],
      pontosChave: [
        'Apunta todas las deudas con su interés (TAE) y cuotas.',
        'Empieza por las de interés más alto.',
        'Renegocia antes de dejar de pagar.',
        'Después, crea el fondo de emergencia para no volver.',
      ],
      quiz: {
        pergunta: 'Al organizar las deudas, ¿cuáles suelen pagarse primero?',
        opcoes: ['Las de menor importe', 'Las de interés más alto', 'Las más antiguas'],
        explicacao: 'Deudas como el crédito revolving de la tarjeta y el descubierto crecen más rápido, así que salen primero.',
      },
    },
    'primeiros-investimentos': {
      titulo: 'Primeros pasos para invertir',
      resumo: 'Qué entender antes de poner el dinero a rendir.',
      paragrafos: [
        'Antes de invertir, conviene tener saldadas las deudas caras y creado el fondo de emergencia. Así no tendrás que vender una inversión en el peor momento.',
        'Toda inversión combina tres características: rentabilidad (cuánto rinde), riesgo (cuánto puede oscilar o perder) y liquidez (lo rápido que se convierte en dinero en la cuenta). Ninguna opción es excelente en las tres a la vez.',
        'En la renta fija, las reglas se conocen de antemano, como en los depósitos a plazo y los bonos, incluidos los del Estado. En la renta variable, como las acciones y muchos fondos, el valor oscila con el mercado y puede bajar.',
        'Tu perfil de inversor (conservador, moderado o arriesgado) y el plazo de cada objetivo ayudan a elegir. Diversificar, es decir, no ponerlo todo en el mismo sitio, reduce el riesgo. En la UE, las entidades autorizadas deben evaluar si un producto es adecuado para ti (normas MiFID II). Este contenido es educativo y no es una recomendación de inversión.',
      ],
      pontosChave: [
        'Primero: deudas caras saldadas y fondo de emergencia listo.',
        'Rentabilidad, riesgo y liquidez van juntos.',
        'Elige según tu perfil y el plazo del objetivo.',
        'Diversifica.',
      ],
      quiz: {
        pergunta: '¿Qué conviene tener antes de empezar a invertir?',
        opcoes: ['Las deudas caras saldadas y el fondo de emergencia creado', 'Un coche nuevo', 'Un préstamo para invertir más'],
        explicacao: 'Así no tendrás que vender en mal momento ni pagarás más intereses de los que ganas.',
      },
    },
    'metas-financeiras': {
      titulo: 'Cómo crear metas que funcionen',
      resumo: 'Convierte deseos en planes con importe y plazo.',
      paragrafos: [
        '"Quiero ahorrar dinero" es un deseo. "Quiero juntar 6000 para un viaje en 12 meses" es una meta: tiene importe, plazo y motivo.',
        'Con importe y plazo es fácil saber cuánto ahorrar al mes. En el ejemplo, son 500 al mes. Si no cabe en el presupuesto, ajusta el plazo o la meta.',
        'Seguir el progreso mantiene la motivación. Apunta cada cantidad que guardas y celebra las etapas, como el 25% y el 50%.',
        'Empieza con una o dos metas. Muchas a la vez reparten el dinero y tardan más en cumplirse.',
      ],
      pontosChave: ['Meta = importe + plazo + motivo.', 'Divide el importe entre el plazo para saber lo mensual.', 'Sigue y celebra el progreso.'],
      quiz: {
        pergunta: '¿Qué convierte un deseo en una meta?',
        opcoes: ['Contárselo a los amigos', 'Tener importe, plazo y motivo', 'Guardar lo que sobre'],
        explicacao: 'Con importe y plazo sabes cuánto ahorrar al mes, y el motivo mantiene la motivación.',
      },
    },
    'para-onde-vai-o-dinheiro': {
      titulo: 'Adónde va tu dinero',
      resumo: 'Anotar los gastos es el primer paso para decidir mejor.',
      paragrafos: [
        'Mucha gente sabe cuánto gana, pero no cuánto gasta. Sin esa información, cualquier plan es una apuesta: el dinero desaparece y queda la sensación de que nunca sobra.',
        'Anotar ingresos y gastos durante unas semanas ya revela patrones. Los pequeños gastos del día a día, como cafés, aplicaciones y comisiones, suelen sumar más de lo que parece.',
        'Separa los gastos en categorías, como vivienda, alimentación, transporte y ocio. Así es fácil ver dónde está el mayor peso y dónde se puede ajustar.',
        'El objetivo no es culparte, sino verlo claro. Con los números en la mano, decides qué es prioritario. En EcoTrust, el historial y el resumen del mes hacen la cuenta por ti.',
      ],
      pontosChave: ['Sin registro, no hay forma de planificar.', 'Los pequeños gastos suman mucho en el mes.', 'Las categorías muestran dónde está el mayor peso.'],
      quiz: {
        pergunta: '¿Por qué anotar los gastos del día a día?',
        opcoes: ['Para ver adónde va el dinero y decidir mejor', 'Porque lo exige la ley', 'Para gastar más a fin de mes'],
        explicacao: 'Los números muestran patrones que pasan desapercibidos, como pequeños gastos que suman mucho.',
      },
    },
    'juros-do-cartao': {
      titulo: 'Tarjeta de crédito sin trampas',
      resumo: 'Cómo usar la tarjeta a tu favor y evitar los intereses más caros.',
      paragrafos: [
        'La tarjeta de crédito es práctica e incluso puede ordenar las compras del mes. El problema empieza cuando el extracto no se paga entero.',
        'Si pagas solo una parte (el mínimo o una cuota), el resto se convierte en crédito revolving, uno de los créditos con intereses más altos. Compara siempre la TAE, que muestra el coste total anual.',
        'Para usarla bien: trata el límite como dinero que ya tienes, no como ingresos extra. Apunta las compras a plazos, porque ocupan los extractos de los meses siguientes.',
        'Si el extracto ya no cabe en el presupuesto, habla con el banco antes de la fecha de pago para conocer opciones con intereses más bajos.',
      ],
      pontosChave: ['Paga siempre el extracto completo.', 'El crédito revolving de la tarjeta tiene intereses muy altos.', 'Las cuotas de hoy ocupan los ingresos de mañana.'],
      quiz: {
        pergunta: '¿Qué pasa cuando pagas solo el mínimo de la tarjeta?',
        opcoes: ['Nada, el resto se perdona', 'El resto pasa a ser crédito con intereses muy altos', 'Aumenta el límite de la tarjeta'],
        explicacao: 'Lo que queda pendiente pasa a crédito revolving, uno de los créditos más caros del mercado.',
      },
    },
    'negociar-dividas': {
      titulo: 'Cómo negociar una deuda',
      resumo: 'Prepárate para conseguir condiciones que quepan en tu bolsillo.',
      paragrafos: [
        'Antes de negociar, ten claro cuánto puedes pagar al mes sin que falte lo esencial. Aceptar una cuota que no cabe solo aplaza el problema.',
        'Pregunta por el importe total de la propuesta, la TAE y el número de cuotas. Una cuota pequeña durante muchos meses puede salir mucho más cara al final.',
        'Los acreedores suelen ofrecer mejores condiciones a quien les contacta pronto. En muchos países de la UE hay servicios públicos o gratuitos de ayuda a personas sobreendeudadas: busca el de tu país.',
        'Guarda todos los justificantes y el acuerdo por escrito. Negocia solo por los canales oficiales del acreedor y desconfía de quien pide un pago por adelantado para "limpiar" tu historial de crédito.',
      ],
      pontosChave: ['Ten claro qué cabe en tu mes antes de negociar.', 'Compara el importe total, no solo la cuota.', 'Usa solo canales oficiales y guarda el acuerdo.'],
      quiz: {
        pergunta: 'Al valorar una propuesta de renegociación, ¿qué es más importante comparar?',
        opcoes: ['Solo el importe de la cuota', 'El importe total, los intereses y si la cuota cabe en el mes', 'El color de la carta del banco'],
        explicacao: 'Una cuota baja durante muchos meses puede costar mucho más. Mira el total y si cabe en el presupuesto.',
      },
    },
    inflacao: {
      titulo: 'Inflación: por qué el dinero parado pierde valor',
      resumo: 'Entiende qué erosiona tu poder adquisitivo.',
      paragrafos: [
        'La inflación es la subida general de los precios a lo largo del tiempo. Con ella, la misma cantidad de dinero compra menos cosas cada año.',
        'Por eso, el dinero guardado sin rendir nada pierde valor poco a poco. Si los precios suben un 5% en un año, 100 parados compran el equivalente a unos 95.',
        'Para proteger el poder adquisitivo, el rendimiento del dinero ahorrado tiene que ser mayor que la inflación. Esa ganancia por encima de la inflación se llama rentabilidad real.',
        'En la UE, la inflación se mide con el Índice de Precios de Consumo Armonizado (IPCA). En la zona del euro, el Banco Central Europeo busca mantenerla en el 2% a medio plazo; los países con moneda propia tienen su propio banco central.',
      ],
      pontosChave: ['Inflación = precios que suben y dinero que compra menos.', 'El dinero parado pierde poder adquisitivo.', 'Busca rendimientos por encima de la inflación.'],
      quiz: {
        pergunta: 'Si la inflación del año fue del 5% y tu dinero rindió un 3%, ¿qué pasó?',
        opcoes: ['Ganaste poder adquisitivo', 'Perdiste poder adquisitivo', 'No cambió nada'],
        explicacao: 'El rendimiento quedó por debajo de la inflación, así que tu dinero compra menos.',
      },
    },
    'juros-compostos': {
      titulo: 'Interés compuesto: el tiempo a tu favor',
      resumo: 'Por qué empezar pronto marca tanta diferencia.',
      paragrafos: [
        'Con el interés compuesto, el rendimiento de cada mes también empieza a rendir en los meses siguientes. Es el famoso "interés sobre interés".',
        'Al principio la diferencia parece pequeña, pero con el tiempo se acelera. Cuanto más largo es el plazo, mayor es la parte del total que viene de los propios rendimientos.',
        'Por eso empezar pronto, aunque sea con poco, suele valer más que empezar tarde con cantidades mayores. La constancia también cuenta: las aportaciones mensuales alimentan el efecto.',
        'El mismo mecanismo juega en tu contra con las deudas. El interés compuesto hace que una deuda de tarjeta crezca muy rápido, otro motivo para saldarla primero.',
      ],
      pontosChave: ['Los rendimientos también pasan a rendir.', 'El tiempo y la constancia potencian el efecto.', 'Con las deudas, el efecto juega en tu contra.'],
      quiz: {
        pergunta: '¿Qué factor aumenta más el efecto del interés compuesto?',
        opcoes: ['El tiempo', 'Retirar los rendimientos cada mes', 'Cambiar de inversión cada semana'],
        explicacao: 'Cuanto más tiempo sigue rindiendo el dinero, más rendimientos generan los propios rendimientos.',
      },
    },
  },
  dicas: [
    'Ahorra el día que cobras, no con lo que sobra a fin de mes.',
    'Antes de una compra por impulso, espera 48 horas. Muchas veces se pasan las ganas.',
    'Revisa tus suscripciones cada tres meses y cancela lo que no uses.',
    'Pagar solo el mínimo de la tarjeta convierte el resto en crédito con intereses muy altos.',
    'Anotar los gastos cada día lleva menos de un minuto y muestra adónde va el dinero.',
    'Comparar precios de servicios fijos (internet, móvil, energía, seguros) puede ahorrarte dinero cada mes.',
    'Una meta con plazo es más fácil de cumplir que "ahorrar lo que se pueda".',
    'Antes de invertir, crea tu fondo de emergencia.',
  ],
  conceitos: [
    { termo: 'Fondo de emergencia', definicao: 'Dinero guardado para imprevistos, en un lugar seguro y de acceso rápido. Referencia habitual: de 3 a 6 meses de gastos esenciales.' },
    { termo: 'Liquidez', definicao: 'La facilidad y rapidez con que una inversión se convierte en dinero disponible sin perder valor.' },
    {
      termo: 'Interés compuesto',
      definicao: 'Interés calculado sobre el importe inicial más los intereses ya acumulados. Hace que las inversiones crezcan más con el tiempo, y también que las deudas crezcan rápido.',
    },
    {
      termo: 'Tipos de interés del BCE',
      definicao: 'Los tipos de referencia que fija el Banco Central Europeo para la zona del euro. Influyen en los intereses de depósitos y préstamos. Los países de la UE con moneda propia tienen su banco central.',
    },
    { termo: 'Euríbor', definicao: 'Tipo de referencia al que los bancos de la zona del euro se prestan dinero entre sí. Se usa en muchos préstamos a tipo variable, como las hipotecas.' },
    {
      termo: 'Inflación (IPCA)',
      definicao: 'La subida general de los precios. En la UE se mide con el Índice de Precios de Consumo Armonizado. Si una inversión rinde menos que la inflación, pierdes poder adquisitivo.',
    },
    {
      termo: 'TAE',
      definicao: 'Tasa anual equivalente: el coste total de un crédito al año, incluidos intereses y comisiones. En la UE siempre debe indicarse y sirve para comparar créditos.',
    },
    { termo: 'Renta fija', definicao: 'Inversiones cuyas reglas de rendimiento se conocen de antemano, como los depósitos a plazo y los bonos.' },
    { termo: 'Renta variable', definicao: 'Inversiones cuyo valor cambia con el mercado, como las acciones y muchos fondos. Pueden rendir más, pero también bajar.' },
    {
      termo: 'Garantía de depósitos',
      definicao: 'En la UE, los depósitos bancarios están protegidos hasta 100 000 € (o el equivalente en moneda nacional) por depositante y por banco si el banco quiebra. Las inversiones, como acciones y fondos, no están cubiertas.',
    },
    {
      termo: 'Crédito revolving de la tarjeta',
      definicao: 'El crédito que se usa cuando pagas menos del total del extracto de la tarjeta. Tiene intereses muy altos: pagar solo el mínimo hace que la deuda siga creciendo.',
    },
  ],
};
