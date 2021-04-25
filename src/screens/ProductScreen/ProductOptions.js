import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { SIZES, COLORS, FONTS } from '../../constants';

const ProductOptions = ({
  product,
  productVariations,
  optionLabel,
  optionName,
  showOptions,
  selectedVariation,
}) => {
  return (
    <View
      style={{
        width: SIZES.width,
        marginTop: 15,
        paddingHorizontal: SIZES.padding * 2,
      }}
    >
      <TouchableOpacity
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: COLORS.white,
          paddingVertical: 10,
          paddingHorizontal: 20,
          ...styles.shadow,
          borderRadius: SIZES.radius,
        }}
        onPress={() => showOptions(optionName)}
      >
        {/* Size on left */}
        <View>
          <Text
            style={{
              ...FONTS.body4,
            }}
          >
            {optionLabel}
          </Text>
          <Text
            style={{
              ...FONTS.h3,
              color: COLORS.primary,
            }}
          >
            {selectedVariation?.name}
          </Text>
        </View>
        {/* Price on right */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              ...FONTS.body3,
              marginRight: 10,
            }}
          >
            ${selectedVariation?.price.toFixed(2)}
          </Text>
          {/* Add down arrow icon here */}
          <Ionicons name='chevron-down' size={20} color={COLORS.secondary} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ProductOptions;

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
