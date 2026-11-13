import type { TextStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useIdioma } from '@/hooks/use-idioma';
import { useTheme } from '@/hooks/use-theme';
import { formatarCentavos, separadorDecimal } from '@/utils/moeda';

/** Valor com os cêntimos apagados: "412" forte + ",30 €" claro (ou "€412" + ".30" em inglês). */
export function Valor({
  centavos,
  sinal,
  style,
}: {
  centavos: number;
  /** "+" ou "−" antes do valor */
  sinal?: string;
  style?: TextStyle | TextStyle[];
}) {
  const theme = useTheme();
  useIdioma();
  const texto = formatarCentavos(Math.abs(centavos));
  const virgula = texto.lastIndexOf(separadorDecimal());
  return (
    <ThemedText style={style} numberOfLines={1}>
      {sinal ? `${sinal} ` : ''}
      {texto.slice(0, virgula)}
      <ThemedText style={[style, { color: theme.textMuted }]}>{texto.slice(virgula)}</ThemedText>
    </ThemedText>
  );
}
