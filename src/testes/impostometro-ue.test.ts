import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { banco, despesa, limparBanco } from './banco-falso';
import { calcularImpostometroUE, obterImpostometroUE } from '@/services/impostometro-ue-service';
import { definirOndeFoiACompra, salvarPerfilFiscal } from '@/services/perfil-fiscal-service';
import { ErroValidacao } from '@/services/erros';
import type { PerfilFiscal } from '@/types/financas';

jest.mock('@/repositories/categorias-repository', () => jest.requireActual<typeof import('./banco-falso')>('./banco-falso').categoriasRepository);
jest.mock('@/repositories/transacoes-repository', () => jest.requireActual<typeof import('./banco-falso')>('./banco-falso').transacoesRepository);
jest.mock('@/repositories/notas-repository', () => jest.requireActual<typeof import('./banco-falso')>('./banco-falso').notasRepository);
jest.mock('@/repositories/impostos-fixos-repository', () => jest.requireActual<typeof import('./banco-falso')>('./banco-falso').impostosFixosRepository);
jest.mock('@/repositories/classificacao-repository', () => jest.requireActual<typeof import('./banco-falso')>('./banco-falso').classificacaoRepository);
jest.mock('@/repositories/perfil-fiscal-repository', () => jest.requireActual<typeof import('./banco-falso')>('./banco-falso').perfilFiscalRepository);
jest.mock('@/services/perfil-financeiro-service', () => jest.requireActual<typeof import('./banco-falso')>('./banco-falso').perfilFinanceiroService);

const RESTAURANTE = 1;
const COMBUSTIVEL = 2;
const SUPERMERCADO = 3;
const BEBIDAS = 4;

const residentePT: PerfilFiscal = {
  paisResidencia: 'PT',
  regiaoResidencia: null,
  situacao: 'dependente',
  brutoAnualCentavos: 3_000_000,
  dependentes: 0,
  dependentesAte3Anos: 0,
  declaracaoConjunta: false,
  contribuicaoProporcional: false,
  combustivel: 'gasolina',
};

const perfis = new Map([
  [RESTAURANTE, 'restaurante' as const],
  [COMBUSTIVEL, 'combustivel' as const],
  [SUPERMERCADO, 'supermercado' as const],
  [BEBIDAS, 'bebidas' as const],
]);

beforeEach(() => {
  limparBanco();
  banco.categorias = [
    { id: RESTAURANTE, nome: 'Restauração', tipo: 'despesa', padrao: true, perfilTributario: 'restaurante' },
    { id: COMBUSTIVEL, nome: 'Combustível', tipo: 'despesa', padrao: true, perfilTributario: 'combustivel' },
    { id: SUPERMERCADO, nome: 'Supermercado', tipo: 'despesa', padrao: true, perfilTributario: 'supermercado' },
    { id: BEBIDAS, nome: 'Bebidas', tipo: 'despesa', padrao: true, perfilTributario: 'bebidas' },
  ];
});

describe('residente em Portugal que viaja', () => {
  it('cada compra paga o IVA do país onde aconteceu; residência continua Portugal', () => {
    const r = calcularImpostometroUE({
      mes: '2026-11',
      perfis,
      fiscal: residentePT,
      transacoes: [
        despesa({ valorCentavos: 5_000, categoriaId: RESTAURANTE, data: '2026-11-02' }), // Lisboa 13%
        despesa({ valorCentavos: 5_000, categoriaId: RESTAURANTE, data: '2026-11-05', paisConsumo: 'IT' }), // Roma 10%
        despesa({ valorCentavos: 5_000, categoriaId: RESTAURANTE, data: '2026-11-06', paisConsumo: 'MT' }), // Malta 18%
      ],
    });
    expect(r.residencia).toBe('PT');
    expect(r.porPais.map((p) => [p.pais, p.impostosCentavos])).toEqual([
      ['MT', 763],
      ['PT', 575],
      ['IT', 455],
    ]);
    expect(r.despesasNoEstrangeiro).toBe(2);
    expect(r.estimadosCentavos).toBe(763 + 575 + 455 - 1); // somado sem arredondar cada compra
  });

  it('país ainda sem regras (Alemanha, França) não é estimado — nada inventado', () => {
    const r = calcularImpostometroUE({
      mes: '2026-11',
      perfis,
      fiscal: residentePT,
      transacoes: [
        despesa({ valorCentavos: 5_000, categoriaId: RESTAURANTE, data: '2026-11-02', paisConsumo: 'DE' }),
        despesa({ valorCentavos: 3_000, categoriaId: RESTAURANTE, data: '2026-11-03', paisConsumo: 'FR' }),
        despesa({ valorCentavos: 5_000, categoriaId: RESTAURANTE, data: '2026-11-04' }),
      ],
    });
    expect(r.semRegras).toEqual({ despesas: 2, gastoCentavos: 8_000 });
    expect(r.estimadosCentavos).toBe(575);
    // a % de imposto só considera as compras que o app sabe estimar
    expect(r.percentualDosGastos).toBe(11.5);
  });

  it('região: compra na Madeira usa as taxas da Madeira; residente na Madeira também', () => {
    const naMadeira = calcularImpostometroUE({
      mes: '2026-11',
      perfis,
      fiscal: residentePT,
      transacoes: [despesa({ valorCentavos: 5_600, categoriaId: RESTAURANTE, data: '2026-11-02', paisConsumo: 'PT', regiaoConsumo: 'PT-30' })],
    });
    expect(naMadeira.estimadosCentavos).toBe(600); // 12%
    const residenteMadeira = calcularImpostometroUE({
      mes: '2026-11',
      perfis,
      fiscal: { ...residentePT, regiaoResidencia: 'PT-30' },
      transacoes: [despesa({ valorCentavos: 5_600, categoriaId: RESTAURANTE, data: '2026-11-02' })],
    });
    expect(residenteMadeira.estimadosCentavos).toBe(600);
  });

  it('mudança de taxa: a mesma compra na Madeira antes e depois de 1/10/2024', () => {
    const fiscal = { ...residentePT, regiaoResidencia: 'PT-30' };
    const antes = calcularImpostometroUE({ mes: '2024-09', perfis, fiscal, transacoes: [despesa({ valorCentavos: 10_500, categoriaId: SUPERMERCADO, data: '2024-09-30' })] });
    const depois = calcularImpostometroUE({ mes: '2024-10', perfis, fiscal, transacoes: [despesa({ valorCentavos: 10_400, categoriaId: SUPERMERCADO, data: '2024-10-01' })] });
    expect(antes.estimadosCentavos).toBe(500); // 5%
    expect(depois.estimadosCentavos).toBe(400); // 4%
  });
});

describe('identificado × estimado', () => {
  it('IVA do recibo conta como identificado e fica separado do estimado', () => {
    const r = calcularImpostometroUE({
      mes: '2026-11',
      perfis,
      fiscal: residentePT,
      transacoes: [
        despesa({ valorCentavos: 12_300, categoriaId: SUPERMERCADO, data: '2026-11-02', tributosCentavos: 1_100 }),
        despesa({ valorCentavos: 10_600, categoriaId: SUPERMERCADO, data: '2026-11-03' }),
        despesa({ valorCentavos: 10_600, categoriaId: SUPERMERCADO, data: '2026-11-04', tributosCentavos: 0 }),
      ],
    });
    expect(r.identificadosCentavos).toBe(1_100);
    expect(r.estimadosCentavos).toBe(1_200); // 2 × 6% (o recibo com € 0,00 é estimado)
    expect(r.despesasIdentificadas).toBe(1);
  });

  it('combustível soma IVA e imposto especial; álcool avisa que o especial não entra', () => {
    const r = calcularImpostometroUE({
      mes: '2026-11',
      perfis,
      fiscal: residentePT,
      transacoes: [
        despesa({ valorCentavos: 5_000, categoriaId: COMBUSTIVEL, data: '2026-11-10' }),
        despesa({ valorCentavos: 2_000, categoriaId: BEBIDAS, data: '2026-11-10' }),
      ],
    });
    expect(r.especiaisCentavos).toBe(1_591);
    expect(r.avisos).toContain('especial-alcool-tabaco-nao-incluido');
  });
});

describe('rendimento e carga total', () => {
  it('soma IRS e Segurança Social do mês (1/12 do anual) à carga do consumo', () => {
    const r = calcularImpostometroUE({
      mes: '2026-11',
      perfis,
      fiscal: residentePT,
      transacoes: [despesa({ valorCentavos: 5_000, categoriaId: RESTAURANTE, data: '2026-11-02' })],
    });
    expect(r.renda?.impostoCentavos).toBe(Math.round(445_027 / 12));
    expect(r.renda?.contribuicoesCentavos).toBe(27_500);
    expect(r.cargaTotalCentavos).toBe(Math.round(575.2 + 445_027 / 12 + 27_500));
    expect(r.percentualDaRenda).toBeGreaterThan(0);
  });

  it('o imposto sobre o rendimento segue a residência, não o país das compras', () => {
    const emMalta = calcularImpostometroUE({ mes: '2026-11', perfis, fiscal: { ...residentePT, paisResidencia: 'MT' }, transacoes: [] });
    expect(emMalta.renda?.impostoCentavos).toBe(Math.round(410_000 / 12));
  });

  it('sem perfil fiscal, sem rendimento, ou país sem regras: explica o motivo', () => {
    expect(calcularImpostometroUE({ mes: '2026-11', perfis, fiscal: null, transacoes: [] }).motivoSemRenda).toBe('sem-perfil');
    expect(calcularImpostometroUE({ mes: '2026-11', perfis, fiscal: { ...residentePT, brutoAnualCentavos: null }, transacoes: [] }).motivoSemRenda).toBe('sem-rendimento');
    expect(calcularImpostometroUE({ mes: '2026-11', perfis, fiscal: { ...residentePT, paisResidencia: 'DE' }, transacoes: [] }).motivoSemRenda).toBe('pais');
    expect(calcularImpostometroUE({ mes: '2025-11', perfis, fiscal: residentePT, transacoes: [] }).motivoSemRenda).toBe('ano');
  });
});

describe('perfil fiscal e país da compra', () => {
  it('valida residência e região', () => {
    expect(() => salvarPerfilFiscal({ ...residentePT, paisResidencia: 'BR' })).toThrow(ErroValidacao);
    expect(() => salvarPerfilFiscal({ ...residentePT, paisResidencia: 'IT', regiaoResidencia: 'PT-30' })).toThrow(ErroValidacao);
    expect(() => salvarPerfilFiscal({ ...residentePT, dependentes: 1, dependentesAte3Anos: 2 })).toThrow(ErroValidacao);
    salvarPerfilFiscal({ ...residentePT, regiaoResidencia: 'PT-20' });
    expect(banco.perfilFiscal?.regiaoResidencia).toBe('PT-20');
  });

  it('marcar onde foi a compra muda o país usado no Impostômetro', () => {
    banco.perfilFiscal = residentePT;
    const jantar = despesa({ valorCentavos: 5_000, categoriaId: RESTAURANTE, data: '2026-11-02' });
    banco.transacoes = [jantar];
    definirOndeFoiACompra(jantar.id, 'IT');
    expect(obterImpostometroUE('2026-11').porPais.map((p) => p.pais)).toEqual(['IT']);
    expect(() => definirOndeFoiACompra(jantar.id, 'US')).toThrow(ErroValidacao);
    definirOndeFoiACompra(jantar.id, null);
    expect(obterImpostometroUE('2026-11').porPais.map((p) => p.pais)).toEqual(['PT']);
  });
});
