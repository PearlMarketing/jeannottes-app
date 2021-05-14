import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { SIZES, COLORS, FONTS } from '../../constants';

const ProductOptions = ({ item, selectedOptions, showOptions }) => {
  return (
    <View
      style={{
        width: SIZES.width,
        marginVertical: 8,
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
        onPress={() => showOptions(item.options, item.name)}
      >
        <View>
          <Text
            style={{
              ...FONTS.body4,
            }}
          >
            {item.name}
          </Text>
          <Text
            style={{
              ...FONTS.h3,
              color: COLORS.primary,
            }}
          >
            {selectedOptions?.filter((e) => e.option === item.name)[0].value}
          </Text>
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