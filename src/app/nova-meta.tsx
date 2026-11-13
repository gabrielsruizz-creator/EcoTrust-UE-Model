import { FormularioMeta } from '@/components/formulario-meta';
import { useT } from '@/hooks/use-idioma';
import { adicionarMeta } from '@/services/metas-service';

export default function NovaMetaScreen() {
  const t = useT();
  return <FormularioMeta titulo={t('metas.nova')} aoSalvar={adicionarMeta} />;
}
