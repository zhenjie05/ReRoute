import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle, ImageStyle, StyleProp } from 'react-native';
import { useTheme } from '@/core/theme';

interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: number;
  style?: StyleProp<ImageStyle & ViewStyle>;
}

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  name = 'User',
  size = 40,
  style,
}) => {
  const { colors, typography } = useTheme();

  const getInitials = (str: string) => {
    return str
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colors.surfaceContainer,
          },
          style as ImageStyle,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.fallback,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.primaryContainer,
        },
        style,
      ]}
    >
      <Text
        style={[
          typography.labelSm,
          {
            color: colors.onPrimaryContainer,
            fontSize: size * 0.4,
            fontWeight: '700',
          },
        ]}
      >
        {getInitials(name)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
