import React from 'react';
import { Image, ImageStyle, StyleSheet } from 'react-native';

interface ProductImageProps {
  uri: string;
  style?: ImageStyle;
}

const ProductImage = React.memo(({ uri, style }: ProductImageProps) => {
  return (
    <Image
      source={{ uri }}
      style={[styles.productImage, style]}
      resizeMode="contain"
    />
  );
});

// Add display name
ProductImage.displayName = 'ProductImage';

const styles = StyleSheet.create({
  productImage: {
    width: '100%',
    height: '100%',
  },
});

export default ProductImage;