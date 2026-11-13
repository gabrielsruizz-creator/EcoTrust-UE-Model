import { FormularioPerfilFiscal } from '@/components/formulario-perfil-fiscal';

/** Primeiro acesso: depois do cadastro, a residência fiscal (o app troca de tela sozinho ao guardar). */
export default function ConfigurarFiscalScreen() {
  return <FormularioPerfilFiscal inicial={null} primeiraVez aoGuardar={() => {}} />;
}
