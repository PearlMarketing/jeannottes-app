import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { observer, inject } from 'mobx-react';

import { SIZES, COLORS, FONTS } from '../../constants';

const Quantity = inject('shop')(
  observer(({ shop, product, option, item }) => {
    return (
      <View
        style={{
          width: SIZES.width,
          marginVertical: 8,
          paddingHorizontal: SIZES.padding * 2,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: SIZES.padding * 2,
            paddingVertical: SIZES.padding * 2,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.secondary,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              onPress={() => {
                shop.selectionStore.selections
                  ?.get(product.id)
                  .options.filter((e) => e.name === option.name)[0]
                  ?.value.filter((e) => e.name === item.name).length &&
                  shop.selectionStore.decreaseQty(product, option, item);
              }}
            >
              <Text
                style={{
                  marginRight: 10,
                  color: COLORS.primary,
                }}
              >
                <Ionicons name='remove-circle-outline' size={28} />
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                marginRight: 10,
                ...FONTS.h3,
              color: COLORS.primary,
              }}
            >
              {shop.selectionStore.selections
                ?.get(product.id)
                .options.filter((e) => e.name === option.name)[0]
                ?.value.filter((e) => e.name === item.name).length
                ? shop.selectionStore.selections
                    ?.get(product.id)
                    .options.filter((e) => e.name === option.name)[0]
                    ?.value.filter((e) => e.name === item.name)[0].qty
                : '0'}
            </Text>
            <TouchableOpacity
              onPress={() => {
                shop.selectionStore.selections
                  ?.get(product.id)
                  .options.filter((e) => e.name === option.name)[0]
                  ?.value.filter((e) => e.name === item.name).length
                  ? shop.selectionStore.increaseQty(product, option, item)
                  : shop.selectionStore.addOptionItem(product, option, item);
              }}
            >
              <Text
                style={{
                  marginRight: 10,
                  color: COLORS.primary,
                }}
              >
                <Ionicons name='add-circle-outline' size={28} />
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text
              style={{
                ...FONTS.h3,
                color: COLORS.primary,
              }}
            >
              {item.name}
            </Text>
          </View>
          <View>
            <Text
              style={{
                ...FONTS.h3,
                color: COLORS.primary,
              }}
            >
              ${item.price.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    );
  })
);

export default Quantity;

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
