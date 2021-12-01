import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

import { SIZES, COLORS, FONTS } from '../../constants';
import { observer, inject } from 'mobx-react';

const ProductOptions = inject('shop')(
  observer(({ shop, product, title, onPress }) => {
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
          onPress={onPress}
        >
          <View>
            <Text
              style={{
                ...FONTS.body4,
              }}
            >
              {title}
            </Text>
            <Text
              style={{
                ...FONTS.h3,
                color: COLORS.primary,
              }}
            >
              {shop.selectionStore.selections
                    ?.get(product.id)
                    .options.filter((e) => e.name === "Pickup Time")[0]?.value || ''}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  })
);

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
