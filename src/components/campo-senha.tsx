import { useState } from 'react';
import { useIdioma } from '@/hooks/use-idioma';
import { t } from '@/i18n';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = Omit<TextInputProps, 'secureTextEntry' | 'style'> & { rotulo: string };

/** Campo de senha com botão "Mostrar/Ocultar". */
export function CampoSenha({ rotulo, ...rest }: Props) {
  useIdioma();
  const theme = useTheme();
  const [visivel, setVisivel] = useState(false);
  return (
    <View style={[styles.campo, { backgroundColor: theme.backgroundElement }]}>
      <TextInput
        style={[styles.input, { color: theme.text }]}
        placeholderTextColor={theme.textSecondary}
        secureTextEntry={!visivel}
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel={rotulo}
        {...rest}
      />
      <Pressable
        onPress={() => setVisivel(!visivel)}
        accessibilityRole="button"
        accessibilityLabel={visivel ? t('senha.ocultarRotulo') : t('senha.mostrarRotulo')}
        hitSlop={8}>
        <ThemedText type="smallBold" themeColor="textSecondary">
          {visivel ? t('senha.ocultar') : t('senha.mostrar')}
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: Spacing.three,
  },
});
