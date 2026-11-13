import { router } from 'expo-router';

import { FormularioPerfilFiscal } from '@/components/formulario-perfil-fiscal';
import { usePerfilFiscal } from '@/hooks/use-dados';

export default function EditarPerfilFiscalScreen() {
  const perfil = usePerfilFiscal();
  return <FormularioPerfilFiscal inicial={perfil} aoGuardar={() => router.back()} />;
}
