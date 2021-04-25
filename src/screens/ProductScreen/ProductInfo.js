import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { SIZES, COLORS, FONTS } from '../../constants';

const ProductInfo = ({ product, showOptions, productVariation }) => {
  return (
    <View>
      {/* Product Image */}
      <View style={{ height: SIZES.height * 0.35 }}>
        <Image
          source={{ uri: product?.images[0].src }}
          resizeMode='cover'
          style={{
            width: SIZES.width,
            height: '100%',
          }}
        />
      </View>

      {/* Product Title and Description */}
      <View
        style={{
          width: SIZES.width,
          marginTop: 15,
          paddingHorizontal: SIZES.padding * 2,
        }}
      >
        <Text
          style={{
            marginVertical: 10,
            ...FONTS.h1,
            color: COLORS.primary,
          }}
        >
          {product?.name}
        </Text>
        <Text
          style={{
            ...FONTS.body3,
          }}
        >
          {product?.short_description}
        </Text>
      </View>
    </View>
  );
};

export default ProductInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray2,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  select: {},
});
