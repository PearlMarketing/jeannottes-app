import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { SIZES, COLORS, FONTS } from '../../constants';
import { observer, inject } from 'mobx-react';

const ProductOptions = inject('shop')(
  observer(
    ({
      shop,
      item,
      product,
      selectedOptions,
      setSelectedOptions,
      showOptions,
      navigation,
    }) => {
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
            onPress={() => {
              if (item.type === 'radio' || item.type === 'size') {
                showOptions(item.options, item.name);
              } else if (item.type === 'checkbox') {
                // if checkbox option doesn't yet exist, add it
                if (
                  !shop.selectionStore.selections
                    ?.get(product.id)
                    .options.filter((e) => e.name === item.name).length
                ) {
                  shop.selectionStore.addOption(product, {
                    name: item.name,
                    value: [],
                  });
                }
                navigation.navigate('SelectOptions', {
                  item,
                  product,
                  selectedOptions,
                  setSelectedOptions,
                });
              }
            }}
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
                {item.type === 'radio' || item.type === 'size'
                  ? shop.selectionStore.selections
                      ?.get(product.id)
                      .options.filter((e) => e.name === item.name)[0]?.value ||
                    ''
                  : item.type === 'checkbox'
                  ? (shop.selectionStore.selections
                      ?.get(product.id)
                      .options.filter((e) => e.name === item.name)[0]?.value
                      .length || 0) + ' Selected'
                  : ''}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  )
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
