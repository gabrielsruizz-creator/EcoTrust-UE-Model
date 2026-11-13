import { getBanco, notificarMudanca } from '@/data/database';
import type { PerfilFiscal, SituacaoProfissional, TipoCombustivel } from '@/types/financas';

type Linha = {
  pais_residencia: string;
  regiao_residencia: string | null;
  situacao: SituacaoProfissional;
  bruto_anual_centavos: number | null;
  dependentes: number;
  dependentes_ate_3_anos: number;
  declaracao_conjunta: number;
  contribuicao_proporcional: number;
  combustivel: TipoCombustivel;
};

export function buscarPerfilFiscal(): PerfilFiscal | null {
  const l = getBanco().getFirstSync<Linha>(
    `SELECT pais_residencia, regiao_residencia, situacao, bruto_anual_centavos, dependentes, dependentes_ate_3_anos,
            declaracao_conjunta, contribuicao_proporcional, combustivel
     FROM perfil_fiscal WHERE id = 1`,
  );
  if (!l) return null;
  return {
    paisResidencia: l.pais_residencia,
    regiaoResidencia: l.regiao_residencia,
    situacao: l.situacao,
    brutoAnualCentavos: l.bruto_anual_centavos,
    dependentes: l.dependentes,
    dependentesAte3Anos: l.dependentes_ate_3_anos,
    declaracaoConjunta: l.declaracao_conjunta === 1,
    contribuicaoProporcional: l.contribuicao_proporcional === 1,
    combustivel: l.combustivel,
  };
}

export function gravarPerfilFiscal(p: PerfilFiscal) {
  getBanco().runSync(
    `INSERT INTO perfil_fiscal (id, pais_residencia, regiao_residencia, situacao, bruto_anual_centavos, dependentes,
                                dependentes_ate_3_anos, declaracao_conjunta, contribuicao_proporcional, combustivel, atualizado_em)
     VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT (id) DO UPDATE SET
       pais_residencia = excluded.pais_residencia, regiao_residencia = excluded.regiao_residencia,
       situacao = excluded.situacao, bruto_anual_centavos = excluded.bruto_anual_centavos,
       dependentes = excluded.dependentes, dependentes_ate_3_anos = excluded.dependentes_ate_3_anos,
       declaracao_conjunta = excluded.declaracao_conjunta, contribuicao_proporcional = excluded.contribuicao_proporcional,
       combustivel = excluded.combustivel, atualizado_em = excluded.atualizado_em`,
    p.paisResidencia,
    p.regiaoResidencia,
    p.situacao,
    p.brutoAnualCentavos,
    p.dependentes,
    p.dependentesAte3Anos,
    p.declaracaoConjunta ? 1 : 0,
    p.contribuicaoProporcional ? 1 : 0,
    p.combustivel,
    new Date().toISOString(),
  );
  notificarMudanca();
}
