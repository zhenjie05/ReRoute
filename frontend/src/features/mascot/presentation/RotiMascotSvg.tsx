import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

const rotiPng = require('../../../../assets/Roti.png');
const rotiSvgAsset = require('../../../../assets/Roti.svg');

interface RotiMascotSvgProps {
  width?: number;
  height?: number;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export const RotiMascotSvg: React.FC<RotiMascotSvgProps> = ({
  width = 160,
  height = 200,
  style,
  accessibilityLabel = 'Roti the Corgi Mascot',
}) => {
  const [svgXml, setSvgXml] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadSvg() {
      try {
        const asset = Asset.fromModule(rotiSvgAsset);
        await asset.downloadAsync();
        
        let xmlContent: string | null = null;
        if (asset.localUri) {
          xmlContent = await FileSystem.readAsStringAsync(asset.localUri);
        } else if (asset.uri) {
          const res = await fetch(asset.uri);
          xmlContent = await res.text();
        }

        if (isMounted) {
          if (xmlContent && xmlContent.includes('<svg')) {
            setSvgXml(xmlContent);
          } else {
            setHasError(true);
          }
        }
      } catch {
        if (isMounted) {
          setHasError(true);
        }
      }
    }

    loadSvg();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View
      style={[styles.container, { width, height }, style]}
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
    >
      {svgXml && !hasError ? (
        <SvgXml
          xml={svgXml}
          width={width}
          height={height}
          onError={() => setHasError(true)}
        />
      ) : (
        <Image
          source={rotiPng}
          style={{ width, height }}
          resizeMode="contain"
          accessibilityLabel={accessibilityLabel}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
