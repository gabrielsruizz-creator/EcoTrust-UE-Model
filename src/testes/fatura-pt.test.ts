import { beforeAll, describe, expect, it } from '@jest/globals';

import { definirIdioma } from '@/i18n';
import {
  chaveFaturaValida,
  despesaDaFatura,
  ivaDaFatura,
  lerQrFaturaPT,
  validarFaturaParaDespesa,
} from '@/services/fatura-pt-service';

// Exemplos da especificação técnica da AT (Portaria 195/2020, v1.1), secção 5.
const EXEMPLO_1 =
  'A:123456789*B:999999990*C:PT*D:FT*E:N*F:20191231*G:FT AB2019/0035*H:CSDF7T5H-0035*I1:PT*I2:12000.00*I3:15000.00*I4:900.00*I5:50000.00*I6:6500.00*I7:80000.00*I8:18400.00*J1:PT-AC*J2:10000.00*J3:25000.56*J4:1000.02*J5:75000.00*J6:6750.00*J7:100000.00*J8:18000.00*K1:PT-MA*K2:5000.00*K3:12500.00*K4:625.00*K5:25000.00*K6:3000.00*K7:40000.00*K8:8800.00*L:100.00*M:25.00*N:64000.02*O:513600.58*P:100.00*Q:kLp0*R:9999*S:TB;PT00000000000000000000000;513500.58';
const EXEMPLO_2 =
  'A:123456789*B:999999990*C:PT*D:FS*E:N*F:20190812*G:FS CDVF/12345*H:CDF7T5HD-12345*I1:PT*I7:0.65*I8:0.15*N:0.15*O:0.80*Q:YhGV*R:9999*S:NU;0.80';
const EXEMPLO_3_PROFORMA =
  'A:500000000*B:123456789*C:PT*D:PF*E:N*F:20190123*G:PF G2019CB/145789*H:HB6FT7RV-145789*I1:PT*I2:12345.34*I3:12532.65*I4:751.96*I5:52789.00*I6:6862.57*I7:32425.69*I8:7457.91*N:15072.44*O:125165.12*Q:r/fY*R:9999';
const EXEMPLO_4_GUIA =
  'A: 500000000*B: 123456789*C: PT*D: GT*E: N*F: 20190720*G: GT G234CB/50987*H: GTVX4Y8B-50987*I1: 0*N: 0.00*O: 0.00*Q: 5uIg*R: 9999';
const EXEMPLO_5_FRANCA =
  'A:123456789*B:4443332215*C:FR*D:FT*E:N*F:20190526*G:ABC BNH/4561*H:DK5ZJ2HN-4561*I1:FR*I7:100.00*I8:20.00*N:20.00*O:120.00*Q:YJRE*R:9999';
const EXEMPLO_7_MARGEM =
  'A:500000000*B:123456789*C:PT*D:FT*E:N*F:20191124*G:NF 19A/789145*H:JL9DS4TT-789145*I1:PT-AC*I7:50.00*I8:9.00*L:1000.00*N:9.00*O:1059.00*Q:d8/K*R:9999';

describe('código QR das faturas portuguesas', () => {
  beforeAll(() => definirIdioma('pt-PT'));

  it('lê a fatura simplificada do exemplo 2', () => {
    const f = lerQrFaturaPT(EXEMPLO_2)!;
    expect(f).not.toBeNull();
    expect(f.tipo).toBe('FS');
    expect(f.data).toBe('2019-08-12');
    expect(f.totalCentavos).toBe(80);
    expect(f.impostosCentavos).toBe(15);
    expect(f.chave).toBe('PT:123456789:CDF7T5HD-12345');
    expect(chaveFaturaValida(f.chave)).toBe(true);
    expect(despesaDaFatura(f)).toEqual({
      valorCentavos: 80,
      tributosCentavos: 15,
      data: '2019-08-12',
      chaveNota: 'PT:123456789:CDF7T5HD-12345',
      paisConsumo: 'PT',
      regiaoConsumo: null,
    });
  });

  it('lê os três espaços fiscais do exemplo 1 e soma o IVA', () => {
    const f = lerQrFaturaPT(EXEMPLO_1)!;
    expect(f.espacos.map((e) => e.codigo)).toEqual(['PT', 'PT-AC', 'PT-MA']);
    expect(f.espacos[1].baseReduzida).toBe(2500056);
    // IVA: 900 + 6500 + 18400 + 1000.02 + 6750 + 18000 + 625 + 3000 + 8800 = 63975.02; N inclui o selo (25.00)
    expect(ivaDaFatura(f)).toBe(6397502);
    expect(f.impostosCentavos).toBe(6400002);
    // A compra fica no espaço de maior valor (PT-AC)
    expect(despesaDaFatura(f).regiaoConsumo).toBe('PT-20');
  });

  it('aceita espaços à volta de «:» (exemplo 4) mas recusa a guia de transporte como despesa', () => {
    const f = lerQrFaturaPT(EXEMPLO_4_GUIA)!;
    expect(f.semIndicacaoIva).toBe(true);
    expect(() => validarFaturaParaDespesa(f)).toThrow('não é uma fatura');
    expect(() => validarFaturaParaDespesa(lerQrFaturaPT(EXEMPLO_3_PROFORMA)!)).toThrow('não é uma fatura');
  });

  it('IVA de outro país da UE fica nesse país (exemplo 5)', () => {
    const d = despesaDaFatura(lerQrFaturaPT(EXEMPLO_5_FRANCA)!);
    expect(d.paisConsumo).toBe('FR');
    expect(d.tributosCentavos).toBe(2000);
  });

  it('regime da margem nos Açores (exemplo 7): só o IVA impresso conta', () => {
    const d = despesaDaFatura(lerQrFaturaPT(EXEMPLO_7_MARGEM)!);
    expect(d).toMatchObject({ valorCentavos: 105900, tributosCentavos: 900, paisConsumo: 'PT', regiaoConsumo: 'PT-20' });
  });

  it('recusa faturas anuladas e notas de crédito', () => {
    expect(() => validarFaturaParaDespesa(lerQrFaturaPT(EXEMPLO_2.replace('E:N', 'E:A'))!)).toThrow('anulad');
    expect(() => validarFaturaParaDespesa(lerQrFaturaPT(EXEMPLO_2.replace('D:FS', 'D:NC'))!)).toThrow('nota de crédito');
  });

  it('ignora QR que não são da AT ou têm campos mal formados', () => {
    expect(lerQrFaturaPT('https://exemplo.pt')).toBeNull();
    expect(lerQrFaturaPT('35191212345678000190650010000000011000000019')).toBeNull();
    expect(lerQrFaturaPT(EXEMPLO_2.replace('O:0.80', 'O:0,80'))).toBeNull();
    expect(lerQrFaturaPT(EXEMPLO_2.replace('F:20190812', 'F:20191312'))).toBeNull();
    expect(lerQrFaturaPT(EXEMPLO_2.replace('*H:CDF7T5HD-12345', ''))).toBeNull();
  });

  it('impostos de 0,00 contam como não informados', () => {
    const f = lerQrFaturaPT(EXEMPLO_2.replace('*I7:0.65*I8:0.15*N:0.15', '*N:0.00'))!;
    expect(despesaDaFatura(f).tributosCentavos).toBeNull();
  });
});
