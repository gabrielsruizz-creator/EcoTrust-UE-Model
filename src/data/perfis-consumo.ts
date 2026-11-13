/**
 * Tipos de consumo das categorias de despesa. Definem que taxa de IVA (e imposto especial) estimar
 * em cada país — as taxas ficam em src/data/paises. Os identificadores são os mesmos gravados no banco
 * (categorias.perfil_tributario, migração v12), por isso não podem mudar de nome.
 * Nomes e exemplos para a tela: catálogos de tradução ("perfil.<id>" e "perfil.<id>.exemplos").
 */

export type PerfilTributarioId =
  | 'supermercado'
  | 'alimentacao'
  | 'restaurante'
  | 'bebidas'
  | 'combustivel'
  | 'transporte'
  | 'moradia'
  | 'contas'
  | 'telecom'
  | 'saude'
  | 'educacao'
  | 'lazer'
  | 'servicos'
  | 'compras'
  | 'assinaturas'
  | 'viagens'
  | 'geral'
  | 'isento';

/** Na ordem em que aparecem nas telas. */
export const PERFIS_CONSUMO: PerfilTributarioId[] = [
  'supermercado',
  'alimentacao',
  'restaurante',
  'bebidas',
  'combustivel',
  'transporte',
  'moradia',
  'contas',
  'telecom',
  'saude',
  'educacao',
  'lazer',
  'servicos',
  'compras',
  'assinaturas',
  'viagens',
  'geral',
  'isento',
];

export function perfilTributarioValido(id: string | null | undefined): id is PerfilTributarioId {
  return PERFIS_CONSUMO.includes(id as PerfilTributarioId);
}

/** Tipo de consumo das categorias padrão (nomes gravados pelas migrações v1/v12). */
export const PERFIL_DAS_CATEGORIAS_PADRAO: Record<string, PerfilTributarioId> = {
  Supermercado: 'supermercado',
  Alimentação: 'alimentacao',
  Transporte: 'transporte',
  Combustível: 'combustivel',
  Moradia: 'moradia',
  'Contas da casa': 'contas',
  'Telefone e internet': 'telecom',
  Saúde: 'saude',
  Educação: 'educacao',
  Lazer: 'lazer',
  Compras: 'compras',
  Assinaturas: 'assinaturas',
  Viagens: 'viagens',
  Outros: 'geral',
};

/**
 * Palavras (sem acentos, minúsculas) no nome de uma categoria criada pelo utilizador → tipo mais provável.
 * Inclui os 8 idiomas do app e marcas comuns na UE. A primeira que combinar vence.
 */
const PALAVRAS: [RegExp, PerfilTributarioId][] = [
  [/supermerc|supermarch|supermarkt|mercado|grocer|lebensmittel|epicerie|alimentari|spozyw|lidl|aldi|pingo doce|carrefour|esselunga|biedronka|albert heijn|padaria|boulang|backer|bakery|panader/, 'supermercado'],
  [/restaur|ristor|trattoria|\bcafe\b|cafeteria|\bbar\b|pizza|lanche|almoco|jantar|lunch|dinner|takeaway|delivery|glovo|uber eats|bolt food|gastro|kneipe/, 'restaurante'],
  [/cerveja|\bbeer\b|\bbier\b|birra|piwo|bebida|vinho|\bwine\b|\bwein\b|\bvino\b|\bwino\b|cigar|tabac|tabak|alcool|alcohol|alkohol/, 'bebidas'],
  [/combust|gasol|diesel|benzin|carbur|essence|\bfuel\b|petrol|tankstelle|paliwo|posto|\bgalp\b|repsol|\bshell\b|\besso\b|orlen|\beni\b/, 'combustivel'],
  [/transp|uber|\bbolt\b|taxi|metro|autocarro|\bbus\b|comboio|\btrain\b|\btren\b|treno|\bbahn\b|\bzug\b|pociag|estacion|parking|parcheggio|portagem|peaje|pedaggio|\bmaut\b|carro|\bauto\b|moto/, 'transporte'],
  [/renda de casa|aluguel|alquiler|loyer|miete|affitto|\bhuur\b|czynsz|condominio|moradia|housing|\brent\b/, 'moradia'],
  [/\bluz\b|eletric|electric|energ|strom|prad|\bagua\b|water|wasser|\bwoda\b|\bgas\b|\bgaz\b|contas da casa|bolletta|rechnung|factura|facture/, 'contas'],
  [/telemovel|telefon|phone|internet|\bmovil\b|mobile|portable|handy|cellulare|komork|\btv\b/, 'telecom'],
  [/farmac|pharm|apothek|apteka|saude|salud|sante|health|gesund|salute|zdrow|medic|dentist|zahnarzt|clinic|hospital|ospedale|szpital/, 'saude'],
  [/escola|school|schule|scuola|szkol|universi|faculd|curso|course|\bkurs\b|educa|livro|\bbook|\bbuch\b|libro|ksiazk/, 'educacao'],
  [/ginasio|academia|\bgym\b|fitness|silownia|cabele|salao|beleza|beauty|friseur|parrucch|fryzjer|lavand|laundry|waschsalon|\bpet\b|veterin/, 'servicos'],
  [/roupa|\bropa\b|clothes|vetement|kleidung|abbigliam|odziez|sapato|zapato|schuhe|scarpe|eletron|electron|elektron|presente|regalo|\bgift|geschenk|prezent|compras|shopping|amazon|ikea/, 'compras'],
  [/netflix|spotify|disney|\bhbo\b|prime video|stream|assinatura|suscrip|abonnement|\babo\b|abbonam|subscri|subskryp/, 'assinaturas'],
  [/viage|viaje|voyage|reise|viagg|podroz|travel|hotel|hostel|alojamento|airbnb|booking|\bvoo\b|vuelo|\bflug\b|\bvolo\b|ryanair|easyjet/, 'viagens'],
  [/cinema|\bkino\b|concert|konzert|lazer|\bocio\b|loisir|freizeit|tempo libero|museu|museo|museum|muzeum|\bjogo\b|\bgame|festa|party|impreza/, 'lazer'],
  [/doacao|donativo|donation|spende|donazion|darowizn|mesada|familia|family/, 'isento'],
];

function normalizar(texto: string) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ł/g, 'l')
    .toLowerCase()
    .trim();
}

/** Palpite do tipo de consumo pelo nome da categoria (para categorias do utilizador sem tipo escolhido). */
export function perfilPorNome(nome: string): PerfilTributarioId {
  const padrao = PERFIL_DAS_CATEGORIAS_PADRAO[nome];
  if (padrao) return padrao;
  const n = normalizar(nome);
  return PALAVRAS.find(([padrao]) => padrao.test(n))?.[1] ?? 'geral';
}
